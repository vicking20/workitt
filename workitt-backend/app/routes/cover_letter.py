from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import yaml
from app.models import CoverLetter
from app.extensions import db
from app.subscription_limits import require_subscription_limit
from utils.cover_letter_validation import validate_cover_letter_data, ValidationError
from utils.ai_providers import ProviderFactory
from utils.prompts import COVER_LETTER_PROMPT, REWRITE_PROMPT, SHORTEN_PROMPT

bp = Blueprint('cover_letter', __name__)

@bp.route("/api/cover-letters", methods=["GET"])
@login_required
def list_cover_letters():
    """List all cover letters"""
    cover_letters = CoverLetter.query.filter_by(user_id=current_user.id).order_by(CoverLetter.updated_at.desc()).all()
    return jsonify({
        "cover_letters": [{
            "cover_id": cl.cover_id,
            "title": cl.title,
            "created_at": cl.created_at.isoformat() if cl.created_at else None,
            "updated_at": cl.updated_at.isoformat() if cl.updated_at else None,
            "content": cl.content
        } for cl in cover_letters]
    })

@bp.route("/api/cover-letters", methods=["POST"])
@login_required
@require_subscription_limit("cover_letters")
def create_cover_letter():
    """Create a new cover letter - subscription limit enforced by decorator"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        # Validate data
        validated_data = validate_cover_letter_data(data)
        
        cover_letter = CoverLetter(
            title=validated_data["title"],
            content=validated_data,  # Save the full validated structure
            user_id=current_user.id,
            c_template_name=validated_data.get("templateId", "default")
        )
        db.session.add(cover_letter)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "cover_letter": {
                "cover_id": cover_letter.cover_id,
                "title": cover_letter.title,
                "created_at": cover_letter.created_at.isoformat() if cover_letter.created_at else None,
                "updated_at": cover_letter.updated_at.isoformat() if cover_letter.updated_at else None,
                "content": cover_letter.content
            }
        }), 201
        
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route("/api/cover-letters/<cover_id>", methods=["GET", "PUT", "DELETE"])
@login_required
def api_cover_letter_detail(cover_id):
    """Get, update, or delete a specific cover letter"""
    cover_letter = CoverLetter.query.filter_by(
        cover_id=cover_id, user_id=current_user.id
    ).first()
    
    if not cover_letter:
        return jsonify({"error": "Cover letter not found"}), 404
    
    if request.method == "GET":
        return jsonify({
            "cover_letter": {
                "cover_id": cover_letter.cover_id,
                "title": cover_letter.title,
                "created_at": cover_letter.created_at.isoformat() if cover_letter.created_at else None,
                "updated_at": cover_letter.updated_at.isoformat() if cover_letter.updated_at else None,
                "content": cover_letter.content,
                "template_name": cover_letter.c_template_name
            }
        })
    
    elif request.method == "PUT":
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        try:
            # Validate data
            validated_data = validate_cover_letter_data(data)
            
            cover_letter.title = validated_data["title"]
            cover_letter.content = validated_data
            cover_letter.c_template_name = validated_data.get("templateId", cover_letter.c_template_name)
            
            db.session.commit()
            
            return jsonify({
                "success": True,
                "cover_letter": {
                    "cover_id": cover_letter.cover_id,
                    "title": cover_letter.title,
                    "updated_at": cover_letter.updated_at.isoformat()
                }
            })
            
        except ValidationError as err:
            return jsonify({"error": "Validation error", "details": err.messages}), 400
    
    elif request.method == "DELETE":
        db.session.delete(cover_letter)
        db.session.commit()
        return jsonify({"success": True, "message": "Cover letter deleted"})

@bp.route("/api/cover_letter", methods=["POST"])
@login_required
def summarize_and_generate():
    data = request.json or {}

    # Extract common fields (default empty string)
    job_description = data.get("job_description", "").strip()
    company = data.get("company", "").strip()
    job_title = data.get("job_title", "").strip()
    body = data.get("body", "").strip()
    summary = data.get("summary", "").strip()
    
    # NEW: Extract resume_text and ai_prompt for the new flow
    resume_text = data.get("resume_text", "").strip()
    ai_prompt = data.get("ai_prompt", "").strip()

    # Extract persona-specific fields (default empty string)
    profile_id = data.get("profile_id", "").strip()
    first_name = data.get("first_name", "").strip()
    last_name = data.get("last_name", "").strip()
    profile_email = data.get("profile_email", "").strip()
    phone = data.get("phone", "").strip()
    address = data.get("address", "").strip()
    work_experience = data.get("work_experience", [])
    skills = data.get("skills", [])
    certifications = data.get("certifications", [])
    custom_content = data.get("custom_content", [])

    # Safety check: at least one input must be present
    if not any(
        [
            job_description,
            company,
            job_title,
            body,
            summary,
            profile_id,
            first_name,
            last_name,
            resume_text,
        ]
    ):
        return jsonify({"error": "Missing input"}), 400

    # Build payload for AI (only non-empty fields)
    payload_dict = {}

    # Common fields
    if job_description:
        payload_dict["job_description"] = job_description
    if company:
        payload_dict["company"] = company
    if job_title:
        payload_dict["job_title"] = job_title
    if body:
        payload_dict["body"] = body
    if summary:
        payload_dict["summary"] = summary
    
    # NEW: Add resume_text if provided (for "Paste Resume" option)
    if resume_text:
        payload_dict["resume_text"] = resume_text
    
    # NEW: Add ai_prompt if provided (user's custom instructions)
    if ai_prompt:
        payload_dict["ai_prompt"] = ai_prompt

    # Persona-specific fields (only include if we have persona data)
    if profile_id or first_name or last_name:
        persona_dict = {}

        if first_name:
            persona_dict["first_name"] = first_name
        if last_name:
            persona_dict["last_name"] = last_name
        if profile_email:
            persona_dict["email"] = profile_email
        if phone:
            persona_dict["phone"] = phone
        if address:
            persona_dict["address"] = address

        # Work experience - only include if there are entries with actual data
        if work_experience:
            formatted_we = []
            for we in work_experience:
                if we.get("title") or we.get("company") or we.get("description"):
                    we_entry = {}
                    if we.get("title"):
                        we_entry["title"] = we["title"]
                    if we.get("company"):
                        we_entry["company"] = we["company"]
                    if we.get("location"):
                        we_entry["location"] = we["location"]
                    if we.get("start_date"):
                        we_entry["start_date"] = we["start_date"]
                    if we.get("end_date"):
                        we_entry["end_date"] = we["end_date"]
                    if we.get("description"):
                        we_entry["description"] = we["description"]
                    formatted_we.append(we_entry)

            if formatted_we:
                persona_dict["work_experience"] = formatted_we

        # Skills - only include if there are entries with names
        if skills:
            formatted_skills = []
            for skill in skills:
                if skill.get("name"):
                    skill_entry = {"name": skill["name"]}
                    if skill.get("level"):
                        skill_entry["level"] = skill["level"]
                    formatted_skills.append(skill_entry)

            if formatted_skills:
                persona_dict["skills"] = formatted_skills

        # Certifications - only include if there are entries with names
        if certifications:
            formatted_certs = []
            for cert in certifications:
                if cert.get("name"):
                    cert_entry = {"name": cert["name"]}
                    if cert.get("authority"):
                        cert_entry["authority"] = cert["authority"]
                    formatted_certs.append(cert_entry)

            if formatted_certs:
                persona_dict["certifications"] = formatted_certs

        # Custom content - only include if there are entries with both title and details
        if custom_content:
            formatted_content = []
            for content in custom_content:
                if content.get("title") and content.get("details"):
                    formatted_content.append(
                        {"title": content["title"], "details": content["details"]}
                    )

            if formatted_content:
                persona_dict["custom_content"] = formatted_content

        # Only add persona section if we have any persona data
        if persona_dict:
            payload_dict["persona"] = persona_dict

    user_payload = yaml.dump(payload_dict)

    # Detect operation type and select appropriate prompt
    instruction = data.get("instruction", "").strip()
    
    if "rewrite" in instruction.lower():
        # Rewrite operation
        selected_prompt = REWRITE_PROMPT
    elif "shorten" in instruction.lower():
        # Shorten operation
        selected_prompt = SHORTEN_PROMPT
    else:
        # Default: generate new cover letter
        selected_prompt = COVER_LETTER_PROMPT

    # Call AI provider
    provider = ProviderFactory.get_provider()
    result = provider.call_model(
        selected_prompt, user_payload, max_tokens=6400, parse_yaml=False
    )

    # Fix: Check for both 'text' and 'raw' keys
    cover_letter_text = ""
    if isinstance(result, dict):
        cover_letter_text = result.get("text", "") or result.get("raw", "")
    elif isinstance(result, str):
        cover_letter_text = result

    cover_letter_text = cover_letter_text.strip()

    if not cover_letter_text:
        return jsonify({"error": "AI did not generate a response"}), 500

    return jsonify({"body": cover_letter_text})
