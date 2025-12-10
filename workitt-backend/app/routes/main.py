from flask import Blueprint, jsonify, request, redirect
from app.models import User
from app.extensions import db
from datetime import datetime
from app.config import Config

bp = Blueprint('main', __name__)

# @bp.route("/")
# def index():
#     """API root endpoint"""
#     return jsonify({
#         "name": "Workitt API",
#         "version": "1.0.0",
#         "status": "running",
#         "endpoints": {
#             "auth": "/api/auth/*",
#             "dashboard": "/api/dashboard",
#             "profiles": "/api/profiles",
#             "resumes": "/api/resumes",
#             "cover_letters": "/api/cover-letters"
#         }
#     })

@bp.route("/verify/<token>")
def verify_account(token):
    # Determine frontend URL dynamically
    base_url = Config.FRONTEND_URL
    if not base_url:
        # Fallback to the request host IP + default Vite port
        base_url = f"http://{request.host.split(':')[0]}:5173"

    user = User.query.filter_by(verify_token=token).first()
    if not user:
        return redirect(f"{base_url}/login?verified=error&message=invalid_token")
    if user.expires_at and datetime.utcnow() > user.expires_at:
        db.session.delete(user)
        db.session.commit()
        return redirect(f"{base_url}/signup?verified=error&message=expired_token")
    user.verified = True
    user.verify_token = None
    user.expires_at = None
    db.session.commit()
    return redirect(f"{base_url}/login?verified=success")
