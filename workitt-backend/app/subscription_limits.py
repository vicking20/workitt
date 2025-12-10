"""
Subscription limit helpers for enforcing plan restrictions
"""
from functools import wraps
from flask import jsonify
from flask_login import current_user
from app.models import Subscription, Profile, CoverLetter, Application

# Plan limits configuration
PLAN_LIMITS = {
    "free": {
        "resumes": 3,
        "cover_letters": 5,
        "applications": 20,
        "ai_generations": 10
    },
    "premium": {
        "resumes": -1,  # unlimited
        "cover_letters": -1,
        "applications": -1,
        "ai_generations": -1
    },
    "enterprise": {
        "resumes": -1,
        "cover_letters": -1,
        "applications": -1,
        "ai_generations": -1
    }
}

# Resource type to model mapping
RESOURCE_MODELS = {
    "resumes": Profile,
    "cover_letters": CoverLetter,
    "applications": Application,
}

# Resource type to friendly name mapping
RESOURCE_NAMES = {
    "resumes": "resume",
    "cover_letters": "cover letter",
    "applications": "application",
    "ai_generations": "AI generation"
}

def get_user_subscription():
    """Get current user's subscription"""
    return Subscription.query.filter_by(user_id=current_user.id).first()

def check_limit(resource_type):
    """
    Generic function to check if user can create more of a resource type
    
    Args:
        resource_type: One of 'resumes', 'cover_letters', 'applications', 'ai_generations'
    
    Returns:
        tuple: (can_create: bool, error_response: tuple or None)
               error_response is (jsonify_response, status_code) if limit reached
    """
    subscription = get_user_subscription()
    if not subscription:
        return False, (jsonify({"error": "No subscription found"}), 404)
    
    # Get plan limits
    plan_limits = PLAN_LIMITS.get(subscription.plan_type, PLAN_LIMITS["free"])
    limit = plan_limits.get(resource_type, 0)
    
    # -1 means unlimited
    if limit == -1:
        return True, None
    
    # Get current count for this resource
    if resource_type in RESOURCE_MODELS:
        model = RESOURCE_MODELS[resource_type]
        current_count = model.query.filter_by(user_id=current_user.id).count()
    else:
        # For resources without models (like ai_generations), we can't check count yet
        # TODO: Implement tracking for these resources
        return True, None
    
    # Check if limit reached
    if current_count >= limit:
        resource_name = RESOURCE_NAMES.get(resource_type, resource_type)
        plural_name = resource_type.replace("_", " ")
        
        return False, (jsonify({
            "error": f"{resource_name.capitalize()} limit reached",
            "message": f"Your {subscription.plan_type} plan allows {limit} {plural_name}. Please upgrade to create more.",
            "current_count": current_count,
            "limit": limit,
            "plan_type": subscription.plan_type,
            "resource_type": resource_type
        }), 403)
    
    return True, None

def require_subscription_limit(resource_type):
    """
    Decorator to enforce subscription limits on routes
    
    Usage:
        @bp.route("/api/resumes", methods=["POST"])
        @login_required
        @require_subscription_limit("resumes")
        def create_resume():
            # Your route logic here
            pass
    
    Args:
        resource_type: One of 'resumes', 'cover_letters', 'applications', 'ai_generations'
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            can_create, error_response = check_limit(resource_type)
            if not can_create:
                return error_response
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Legacy functions for backward compatibility
def check_resume_limit():
    """Check if user can create more resumes (legacy)"""
    return check_limit("resumes")

def check_cover_letter_limit():
    """Check if user can create more cover letters (legacy)"""
    return check_limit("cover_letters")

def check_application_limit():
    """Check if user can create more applications"""
    return check_limit("applications")

def check_ai_generation_limit():
    """Check if user can use AI generation features"""
    return check_limit("ai_generations")
