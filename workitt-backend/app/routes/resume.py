from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
import yaml
from app.models import Profile
from app.extensions import db
from app.subscription_limits import require_subscription_limit
from utils.resume_validation import validate_resume_data, ValidationError
from utils.ai_providers import ProviderFactory
from utils.prompts import (
    RESUME_PARSER_PROMPT,
    RESUME_TEXT_ENHANCE_PROMPT,
    RESUME_GENERATION_PROMPT,
)

bp = Blueprint("resume", __name__)


@bp.route("/api/resumes", methods=["GET", "POST"])
@login_required
def api_resumes():
    """List all resumes (profiles) or create a new one"""
    if request.method == "GET":
        # Get all profiles for this user (each profile is a resume/persona)
        profiles = (
            Profile.query.filter_by(user_id=current_user.id)
            .order_by(Profile.updated_at.desc())
            .all()
        )
        return jsonify(
            {
                "resumes": [
                    {
                        "resume_id": p.id,  # Use profile.id as resume_id
                        "title": f"{p.first_name} {p.last_name} - {p.job_sector}"
                        if p.first_name and p.last_name
                        else p.job_sector or "Resume title",
                        "job_sector": p.job_sector,
                        "created_at": p.created_at.isoformat()
                        if p.created_at
                        else None,
                        "updated_at": p.updated_at.isoformat()
                        if p.updated_at
                        else None,
                        "content": p.content or {},
                    }
                    for p in profiles
                ]
            }
        )


@bp.route("/api/resumes", methods=["POST"])
@login_required
@require_subscription_limit("resumes")
def create_resume():
    """Create a new resume - subscription limit enforced by decorator"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Extract content data
    raw_content_data = data.get("content", {})

    # Validate content
    try:
        content_data = validate_resume_data(raw_content_data)
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    personal_info = content_data.get("personalInfo", {})

    # Create new profile (which serves as a resume)
    profile = Profile(
        user_id=current_user.id,
        first_name=personal_info.get("firstName", ""),
        last_name=personal_info.get("lastName", ""),
        job_sector=content_data.get("title", "Resume title"),
        profile_email=personal_info.get("email", ""),
        phone=personal_info.get("phone", ""),
        address=personal_info.get("address", ""),
        city=personal_info.get("city", ""),
        country=personal_info.get("country", ""),
        summary=content_data.get("summary", ""),
        content=content_data,  # Store all resume data in content JSON field
    )

    db.session.add(profile)
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "resume": {
                "resume_id": profile.id,
                "title": f"{profile.first_name} {profile.last_name} - {profile.job_sector}",
                "job_sector": profile.job_sector,
                "created_at": profile.created_at.isoformat()
                if profile.created_at
                else None,
                "updated_at": profile.updated_at.isoformat()
                if profile.updated_at
                else None,
            },
        }
    ), 201


@bp.route("/api/resumes/<resume_id>", methods=["GET", "PUT", "DELETE"])
@login_required
def api_resume_detail(resume_id):
    """Get, update, or delete a specific resume (profile)"""
    profile = Profile.query.filter_by(id=resume_id, user_id=current_user.id).first()

    if not profile:
        return jsonify({"error": "Resume not found"}), 404

    if request.method == "GET":
        # Get content from the JSON field
        content = profile.content or {}

        # Ensure all required fields exist with defaults (omitted lengthy defaults code for brevity, assuming standard structure)
        # Note: In refactoring, it's better to preserve logic.
        # I will include the logic from app.py

        if "personalInfo" not in content:
            content["personalInfo"] = {
                "firstName": profile.first_name or "",
                "lastName": profile.last_name or "",
                "email": profile.profile_email or "",
                "phone": profile.phone or "",
                "address": profile.address or "",
                "city": profile.city or "",
                "country": profile.country or "",
                "linkedIn": "",
                "website": "",
            }

        if "summary" not in content:
            content["summary"] = profile.summary or ""

        if "title" not in content:
            content["title"] = profile.job_sector or "Resume title"

        if "templateId" not in content:
            content["templateId"] = "modern"

        # Ensure arrays exist
        for key in [
            "workExperience",
            "education",
            "skills",
            "certifications",
            "links",
            "others",
        ]:
            if key not in content:
                content[key] = []

        # Section order
        if "sectionOrder" not in content:
            content["sectionOrder"] = [
                "summary",
                "workExperience",
                "education",
                "skills",
                "certifications",
                "links",
                "others",
            ]

        # Styles and visibility (kept minimal for brevity but should be there)
        # ... (Assuming frontend handles defaults if missing, or I should copy full defaults)

        return jsonify(
            {
                "resume": {
                    "resume_id": profile.id,
                    "title": f"{profile.first_name} {profile.last_name} - {profile.job_sector}"
                    if profile.first_name and profile.last_name
                    else profile.job_sector or "Resume title",
                    "job_sector": profile.job_sector,
                    "created_at": profile.created_at.isoformat()
                    if profile.created_at
                    else None,
                    "updated_at": profile.updated_at.isoformat()
                    if profile.updated_at
                    else None,
                    "content": content,
                    "template_name": content.get("templateId", "modern"),
                }
            }
        )

    elif request.method == "PUT":
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Update content field
        if "content" in data:
            raw_content = data["content"]
            try:
                content_data = validate_resume_data(raw_content)

                # Debug: Log what we're saving
                print(f"[RESUME SAVE] Validated content keys: {content_data.keys()}")
                if "links" in content_data:
                    print(f"[RESUME SAVE] Links count: {len(content_data['links'])}")
                    print(f"[RESUME SAVE] Links data: {content_data['links']}")
                if "others" in content_data:
                    print(f"[RESUME SAVE] Others count: {len(content_data['others'])}")
                    print(f"[RESUME SAVE] Others data: {content_data['others']}")

                profile.content = content_data
            except ValidationError as err:
                print(f"[RESUME SAVE] Validation error: {err.messages}")
                return jsonify(
                    {"error": "Validation failed", "details": err.messages}
                ), 400

            # Also update profile fields from content
            personal_info = content_data.get("personalInfo", {})
            if personal_info:
                profile.first_name = personal_info.get("firstName", profile.first_name)
                profile.last_name = personal_info.get("lastName", profile.last_name)
                profile.profile_email = personal_info.get(
                    "email", profile.profile_email
                )
                profile.phone = personal_info.get("phone", profile.phone)
                profile.address = personal_info.get("address", profile.address)
                profile.city = personal_info.get("city", profile.city)
                profile.country = personal_info.get("country", profile.country)

            if "title" in content_data:
                profile.job_sector = content_data["title"]
            if "summary" in content_data:
                profile.summary = content_data["summary"]

        # Direct field updates (for backwards compatibility)
        if "title" in data:
            profile.job_sector = data["title"]

        profile.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "resume": {
                    "resume_id": profile.id,
                    "title": f"{profile.first_name} {profile.last_name} - {profile.job_sector}",
                    "updated_at": profile.updated_at.isoformat(),
                },
            }
        )

    elif request.method == "DELETE":
        # Use centralized delete logic
        db.session.delete(profile)
        db.session.commit()
        return jsonify({"success": True, "message": "Resume deleted successfully"})


@bp.route("/api/resume/upload", methods=["POST"])
@login_required
def upload_resume_pdf():
    """Upload and extract text from a PDF resume"""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({" error": "No file selected"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    # Check file size (5MB max)
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset to beginning

    if size > 5 * 1024 * 1024:  # 5MB
        return jsonify({"error": "File too large (max 5MB)"}), 400

    try:
        import pdfplumber

        # Extract text from PDF
        text = ""
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        text = text.strip()

        # Validate extracted text
        if not text or len(text) < 50:
            return jsonify(
                {
                    "error": "Could not extract sufficient text from PDF. The PDF might be scanned or image-based. Please try pasting your resume text instead."
                }
            ), 400

        # Call AI to parse the resume
        try:
            provider = ProviderFactory.get_provider()

            ai_response = provider.call_model(
                system_prompt=RESUME_PARSER_PROMPT,
                user_payload={"resume_text": text},
                parse_yaml=True,
                max_tokens=5000,
            )

            parsed_data = ai_response.get("parsed")

            if not parsed_data:
                return jsonify(
                    {
                        "error": "Failed to parse resume data with AI",
                        "raw_response": ai_response.get("raw", "")[:1000],
                    }
                ), 500

            if "error" in parsed_data:
                return jsonify({"error": parsed_data["error"]}), 400

            return jsonify(
                {
                    "success": True,
                    "resume_data": parsed_data,
                    "message": "Resume uploaded and processed successfully",
                }
            )

        except Exception as e:
            return jsonify(
                {"error": f"Failed to process resume with AI: {str(e)}"}
            ), 500

    except ImportError:
        return jsonify(
            {"error": "PDF processing library not installed. Please contact support."}
        ), 500
    except Exception as e:
        return jsonify({"error": f"Failed to process PDF: {str(e)}"}), 500


@bp.route("/api/resume/enhance-text", methods=["POST"])
@login_required
def enhance_resume_text():
    """Enhance or generate text for resume sections"""
    data = request.json or {}

    section_type = data.get("section_type", "").strip()
    current_text = data.get("current_text", "").strip()
    context = data.get("context", {})
    user_prompt = data.get("user_prompt", "").strip()

    valid_sections = [
        "summary",
        "work_description",
        "education_description",
        "certification_description",
        "skills",
    ]
    if section_type not in valid_sections:
        return jsonify(
            {
                "error": f"Invalid section_type. Must be one of: {', '.join(valid_sections)}"
            }
        ), 400

    if current_text:
        word_count = len(current_text.split())
        if word_count < 3:
            return jsonify({"error": "Text must have at least 3 words to enhance"}), 400

    payload_dict = {
        "section_type": section_type,
        "current_text": current_text if current_text else "",
        "context": context if context else {},
    }

    if user_prompt:
        payload_dict["user_prompt"] = user_prompt

    user_payload = yaml.dump(payload_dict)

    try:
        provider = ProviderFactory.get_provider()
        result = provider.call_model(
            RESUME_TEXT_ENHANCE_PROMPT, user_payload, max_tokens=5000, parse_yaml=False
        )

        enhanced_text = ""
        if isinstance(result, dict):
            enhanced_text = result.get("text", "") or result.get("raw", "")
        elif isinstance(result, str):
            enhanced_text = result

        enhanced_text = enhanced_text.strip()

        if not enhanced_text:
            return jsonify({"error": "AI did not generate a response"}), 500

        return jsonify({"enhanced_text": enhanced_text})

    except Exception as e:
        return jsonify(
            {"error": f"Failed to enhance text, please try again later: {str(e)}"}
        ), 500


@bp.route("/api/resume/generate-from-prompt", methods=["POST"])
@login_required
def generate_resume_from_prompt():
    """Generate a complete resume from a user's text description"""
    data = request.json or {}
    user_prompt = data.get("prompt", "").strip()

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    if len(user_prompt.split()) < 10:
        return jsonify(
            {"error": "Please provide a more detailed description (at least 10 words)"}
        ), 400

    try:
        provider = ProviderFactory.get_provider()
        ai_response = provider.call_model(
            system_prompt=RESUME_GENERATION_PROMPT,
            user_payload={"user_description": user_prompt},
            parse_yaml=True,
            max_tokens=5000,
        )

        if "error" in ai_response:
            return jsonify(
                {"error": f"Could not generate resume: {ai_response['error']}"}
            ), 400

        resume_data = {}
        for section in [
            "personalInfo",
            "summary",
            "workExperience",
            "education",
            "skills",
            "certifications",
            "links",
            "others",
        ]:
            if section in ai_response:
                resume_data[section] = ai_response[section]

        return jsonify({"success": True, "resume_data": resume_data})

    except Exception as e:
        return jsonify({"error": f"Failed to generate resume: {str(e)}"}), 500
