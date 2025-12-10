from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import Profile
from app.extensions import db

bp = Blueprint('profile', __name__)

@bp.route("/api/profile", methods=["GET", "PUT"])
@login_required
def manage_account():
    """Manage user account information (singular profile)"""
    if request.method == "GET":
        # Return user account information
        return jsonify({
            "profile": {  # Frontend expects "profile" key but it's user info
                "id": current_user.id,
                "first_name": current_user.first_name,
                "last_name": current_user.last_name,
                "phone": current_user.phone
            }
        })
    
    elif request.method == "PUT":
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Update User model fields (account information)
        if 'first_name' in data:
            current_user.first_name = data['first_name']
        if 'last_name' in data:
            current_user.last_name = data['last_name']
        if 'phone' in data:
            current_user.phone = data['phone']
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "profile": {
                "id": current_user.id,
                "first_name": current_user.first_name,
                "last_name": current_user.last_name,
                "phone": current_user.phone
            }
        })

@bp.route("/api/profiles", methods=["GET"])
@login_required
def list_profiles():
    """Get all profiles/personas for the current user"""
    profiles = Profile.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        "profiles": [{
            "id": p.id,
            "name": f"{p.first_name} {p.last_name}" if p.first_name and p.last_name else p.job_sector or "Unnamed Profile",
            "job_sector": p.job_sector,
            "first_name": p.first_name,
            "last_name": p.last_name
        } for p in profiles]
    })

@bp.route("/api/profiles", methods=["POST"])
@login_required
def create_profile():
    """Create a new profile/persona"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Create new profile
    profile = Profile(
        user_id=current_user.id,
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name", ""),
        job_sector=data.get("job_sector", "New Persona"),
        profile_email=current_user.email,  # Default to user email
        phone="",
        address="",
        city="",
        country="",
        summary=""
    )
    db.session.add(profile)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "profile": {
            "id": profile.id,
            "name": f"{profile.first_name} {profile.last_name}" if profile.first_name and profile.last_name else profile.job_sector,
            "job_sector": profile.job_sector,
            "first_name": profile.first_name,
            "last_name": profile.last_name
        }
    }), 201

@bp.route("/api/profiles/<profile_id>", methods=["DELETE"])
@login_required
def delete_profile(profile_id):
    """Delete a profile/persona"""
    profile = Profile.query.filter_by(id=profile_id, user_id=current_user.id).first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404
    
    # Prevent deleting if it's the only profile
    profile_count = Profile.query.filter_by(user_id=current_user.id).count()
    if profile_count <= 1:
        return jsonify({"error": "Cannot delete your only profile"}), 400
    
    db.session.delete(profile)
    db.session.commit()
    
    return jsonify({"success": True, "message": "Profile deleted"})

@bp.route("/api/profile/<profile_id>", methods=["GET", "PUT", "DELETE"])
@login_required
def api_profile_detail(profile_id):
    """Centralized endpoint for profile/resume management - GET all data, PUT to update, DELETE to remove"""
    profile = Profile.query.filter_by(id=profile_id, user_id=current_user.id).first()
    
    if not profile:
        return jsonify({"error": "Profile not found"}), 404
    
    if request.method == "GET":
        # Return comprehensive profile data - all resume data is in content JSON field
        content = profile.content or {}
        
        return jsonify({
            "profile": {
                "id": profile.id,
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "job_sector": profile.job_sector,
                "profile_email": profile.profile_email,
                "phone": profile.phone,
                "address": profile.address,
                "city": profile.city,
                "country": profile.country,
                "summary": profile.summary,
                "created_at": profile.created_at.isoformat() if profile.created_at else None,
                "updated_at": profile.updated_at.isoformat() if profile.updated_at else None,
                "content": content
            }
        })
    
    elif request.method == "PUT":
        # Update profile - all data stored in content JSON field
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Update basic profile fields
        if "first_name" in data:
            profile.first_name = data["first_name"]
        if "last_name" in data:
            profile.last_name = data["last_name"]
        if "job_sector" in data:
            profile.job_sector = data["job_sector"]
        if "profile_email" in data:
            profile.profile_email = data["profile_email"]
        if "phone" in data:
            profile.phone = data["phone"]
        if "address" in data:
            profile.address = data["address"]
        if "city" in data:
            profile.city = data["city"]
        if "country" in data:
            profile.country = data["country"]
        if "summary" in data:
            profile.summary = data["summary"]
        if "content" in data:
            profile.content = data["content"]
        
        profile.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Profile updated successfully",
            "profile_id": profile.id
        })
    
    elif request.method == "DELETE":
        # Delete profile
        db.session.delete(profile)
        db.session.commit()
        return jsonify({"success": True, "message": "Profile deleted successfully"})
