from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from app.models import Subscription, CoverLetter, Profile
from app.extensions import db

bp = Blueprint('subscription', __name__, url_prefix='/api/subscription')

@bp.route("/", methods=["GET"])
@login_required
def get_subscription():
    """Get current user's subscription details"""
    subscription = Subscription.query.filter_by(user_id=current_user.id).first()
    
    if not subscription:
        return jsonify({"error": "No subscription found"}), 404
    
    return jsonify({
        "subscription": {
            "plan_type": subscription.plan_type,
            "status": subscription.status,
            "active": subscription.active,
            "current_period_start": subscription.current_period_start.isoformat() if subscription.current_period_start else None,
            "current_period_end": subscription.current_period_end.isoformat() if subscription.current_period_end else None,
            "cancel_at_period_end": subscription.cancel_at_period_end,
            "cancelled_at": subscription.cancelled_at.isoformat() if subscription.cancelled_at else None,
            "trial_start": subscription.trial_start.isoformat() if subscription.trial_start else None,
            "trial_end": subscription.trial_end.isoformat() if subscription.trial_end else None,
        }
    })

@bp.route("/upgrade", methods=["POST"])
@login_required
def upgrade_subscription():
    """Upgrade user's subscription plan"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    plan_type = data.get("plan_type")  # free, premium, enterprise
    
    if plan_type not in ["free", "premium", "enterprise"]:
        return jsonify({"error": "Invalid plan type"}), 400
    
    subscription = Subscription.query.filter_by(user_id=current_user.id).first()
    
    if not subscription:
        return jsonify({"error": "No subscription found"}), 404
    
    # Update subscription
    subscription.plan_type = plan_type
    subscription.plan = plan_type  # Legacy field
    subscription.status = "active"
    subscription.active = True
    subscription.current_period_start = datetime.utcnow()
    
    # Set period end based on plan (example: 30 days for paid plans)
    if plan_type != "free":
        subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
    else:
        subscription.current_period_end = None  # Free plan doesn't expire
    
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": f"Subscription upgraded to {plan_type}",
        "subscription": {
            "plan_type": subscription.plan_type,
            "status": subscription.status,
            "current_period_end": subscription.current_period_end.isoformat() if subscription.current_period_end else None
        }
    })

@bp.route("/cancel", methods=["POST"])
@login_required
def cancel_subscription():
    """Cancel user's subscription (graceful - at end of period)"""
    subscription = Subscription.query.filter_by(user_id=current_user.id).first()
    
    if not subscription:
        return jsonify({"error": "No subscription found"}), 404
    
    if subscription.plan_type == "free":
        return jsonify({"error": "Cannot cancel free subscription"}), 400
    
    # Graceful cancellation - cancel at period end
    subscription.cancel_at_period_end = True
    subscription.cancelled_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "Subscription will be cancelled at the end of the current period",
        "subscription": {
            "plan_type": subscription.plan_type,
            "status": subscription.status,
            "cancel_at_period_end": subscription.cancel_at_period_end,
            "current_period_end": subscription.current_period_end.isoformat() if subscription.current_period_end else None
        }
    })

@bp.route("/usage", methods=["GET"])
@login_required
def get_subscription_usage():
    """Get subscription usage and limits"""
    subscription = Subscription.query.filter_by(user_id=current_user.id).first()
    
    if not subscription:
        return jsonify({"error": "No subscription found"}), 404
    
    # Define limits based on plan type
    limits = {
        "free": {
            "resumes": 3,
            "cover_letters": 5,
            "ai_generations": 10
        },
        "premium": {
            "resumes": -1,  # unlimited
            "cover_letters": -1,
            "ai_generations": -1
        },
        "enterprise": {
            "resumes": -1,
            "cover_letters": -1,
            "ai_generations": -1
        }
    }
    
    # Get current usage
    resume_count = Profile.query.filter_by(user_id=current_user.id).count()
    cover_letter_count = CoverLetter.query.filter_by(user_id=current_user.id).count()
    
    plan_limits = limits.get(subscription.plan_type, limits["free"])
    
    return jsonify({
        "plan_type": subscription.plan_type,
        "usage": {
            "resumes": resume_count,
            "cover_letters": cover_letter_count,
            "ai_generations": 0  # TODO: Track this in future
        },
        "limits": plan_limits,
        "is_unlimited": subscription.plan_type in ["premium", "enterprise"]
    })
