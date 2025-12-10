from flask import Blueprint, jsonify, request, url_for
from flask_login import login_required, current_user, login_user, logout_user
import bcrypt
import secrets
from datetime import datetime, timedelta, timezone
from app.models import User, Subscription
from app.extensions import db
from app.config import Config
from utils.pw_verify import validate_password
from utils.mailer import send_email

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Helper function
def create_default_subscription(user_id):
    """Create a free tier subscription for a new user"""
    subscription = Subscription(
        user_id=user_id,
        plan_type="free",
        status="active",
        current_period_start=datetime.utcnow(),
        # Free plan doesn't expire, but we can set a far future date if needed
        current_period_end=None,
        active=True,
        plan="free"  # Legacy field for backwards compatibility
    )
    db.session.add(subscription)
    return subscription

@bp.route("/check", methods=["GET"])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({
            "isAuthenticated": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "first_name": current_user.first_name,
                "last_name": current_user.last_name,
                "phone": current_user.phone
            }
        })
    return jsonify({"isAuthenticated": False}), 200

@bp.route("/login", methods=["POST"])
def api_login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
        
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists and is not soft-deleted
    if not user or user.is_deleted:
        return jsonify({"error": "Invalid email or password"}), 401
    
    if not bcrypt.checkpw(password.encode("utf-8"), user.password):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.verified:
        return jsonify({"error": "Please verify your email first"}), 403
        
    login_user(user)
    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone
        }
    })

@bp.route("/signup", methods=["POST"])
def api_signup():
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No input data provided"}), 400
        
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")
#     confirm_password = data.get("confirmPassword")  # Note: Frontend sends confirmPassword
    
#     if not username or not email or not password:
#         return jsonify({"error": "All fields are required"}), 400
        
#     if password != confirm_password:
#         return jsonify({"error": "Passwords do not match"}), 400
        
#     is_valid, error = validate_password(password)
#     if not is_valid:
#         return jsonify({"error": error}), 400
    
#     # Check for existing users (including soft-deleted ones)
#     existing_user_by_username = User.query.filter_by(username=username).first()
#     existing_user_by_email = User.query.filter_by(email=email).first()
    
#     # Handle soft-deleted user with same email - restore and update
#     if existing_user_by_email and existing_user_by_email.is_deleted:
#         # Restore the soft-deleted account with new credentials
#         user = existing_user_by_email
#         user.username = username
#         user.password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
#         user.verify_token = secrets.token_urlsafe(32)
#         user.expires_at = datetime.now(timezone.utc) + timedelta(days=2)
#         user.verified = False
#         user.restore()  # Clear deleted_at timestamp
#         db.session.commit()
#     elif existing_user_by_username and not existing_user_by_username.is_deleted:
#         return jsonify({"error": "Username already taken"}), 409
#     elif existing_user_by_email and not existing_user_by_email.is_deleted:
#         return jsonify({"error": "Email already registered"}), 409
#     else:
#         # Create new user
#         hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
#         user = User(
#             username=username,
#             email=email,
#             password=hashed_password,
#             verify_token=secrets.token_urlsafe(32),
#             expires_at=datetime.now(timezone.utc) + timedelta(days=2),
#         )
#         db.session.add(user)
#         db.session.flush()  # Flush to get user.id before creating subscription
        
#         # Create default free subscription for new user
#         create_default_subscription(user.id)
        
#         db.session.commit()
    
#     verify_link = url_for("main.verify_account", token=user.verify_token, _external=True)
    
#     # Beautiful email template
#     body_text = f"""
# Welcome to Workitt!

# Thank you for creating an account. Please verify your email address to get started.

# Verify your account by clicking the link below:
# {verify_link}

# If the button doesn't work, copy and paste this link into your browser:
# {verify_link}

# This link will expire in 48 hours.

# Best regards,
# The Workitt Team
# """
    
#     body_html = f"""
# <!DOCTYPE html>
# <html>
# <head>
#     <meta charset="UTF-8">
#     <meta name="viewport" content="width=device-width, initial-scale=1.0">
#     <title>Verify Your Workitt Account</title>
# </head>
# <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f7ff;">
#     <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f7ff; padding: 40px 20px;">
#         <tr>
#             <td align="center">
#                 <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 3px solid #0f172a; box-shadow: 8px 8px 0px 0px rgba(15, 23, 42, 1);">
#                     <!-- Header -->
#                     <tr>
#                         <td style="background-color: #0f172a; padding: 40px 40px 30px 40px; text-align: center;">
#                             <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">
#                                 Workitt
#                             </h1>
#                             <p style="margin: 10px 0 0 0; color: #e86f3e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
#                                 AI-Powered Career Tools
#                             </p>
#                         </td>
#                     </tr>
                    
#                     <!-- Content -->
#                     <tr>
#                         <td style="padding: 50px 40px;">
#                             <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 28px; font-weight: 900; text-transform: uppercase;">
#                                 Welcome to Workitt!
#                             </h2>
#                             <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
#                                 Thank you for creating an account, <strong>{username}</strong>! We're excited to help you advance your career with AI-powered resumes and cover letters.
#                             </p>
#                             <p style="margin: 0 0 30px 0; color: #475569; font-size: 16px; line-height: 1.6;">
#                                 To get started, please verify your email address by clicking the button below:
#                             </p>
                            
#                             <!-- Button -->
#                             <table width="100%" cellpadding="0" cellspacing="0">
#                                 <tr>
#                                     <td align="center" style="padding: 20px 0;">
#                                         <a href="{verify_link}" style="display: inline-block; background-color: #e86f3e; color: #ffffff; text-decoration: none; padding: 18px 40px; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; border: 3px solid #0f172a; box-shadow: 4px 4px 0px 0px rgba(15, 23, 42, 1); transition: all 0.3s;">
#                                             Verify My Account
#                                         </a>
#                                     </td>
#                                 </tr>
#                             </table>
                            
#                             <!-- Alternative Link -->
#                             <p style="margin: 30px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6; padding: 20px; background-color: #f1f5f9; border-left: 4px solid #e86f3e;">
#                                 <strong>Button not working?</strong><br>
#                                 Copy and paste this link into your browser:<br>
#                                 <a href="{verify_link}" style="color: #e86f3e; word-break: break-all;">{verify_link}</a>
#                             </p>
                            
#                             <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
#                                 This verification link will expire in <strong>48 hours</strong>. If you didn't create this account, you can safely ignore this email.
#                             </p>
#                         </td>
#                     </tr>
                    
#                     <!-- Footer -->
#                     <tr>
#                         <td style="background-color: #f8f7ff; padding: 30px 40px; border-top: 2px solid #e2e8f0;">
#                             <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; text-align: center;">
#                                 Best regards,<br>
#                                 <strong>The Workitt Team</strong>
#                             </p>
#                             <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
#                                 © 2025 Workitt Inc. All rights reserved.
#                             </p>
#                         </td>
#                     </tr>
#                 </table>
#             </td>
#         </tr>
#     </table>
# </body>
# </html>
# """
    
#     try:
#         send_email(email, "Verify your Workitt account", body_text, body_html)
#     except Exception as e:
#         print(f"Failed to send email: {e}")
#         # Don't fail the request, just log it
        
#     #return jsonify({"success": True, "message": "Account created. Please verify your email."}), 201
    return jsonify({"success": True, "message": "Route blocked for now."}), 201 #blocked to not allow new signups for now

@bp.route("/logout", methods=["POST"])
def api_logout():
    logout_user()
    return jsonify({"success": True})

@bp.route("/forgot-password", methods=["POST"])
def api_forgot_password():
    data = request.get_json()
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        user.reset_token = secrets.token_urlsafe(32)
        user.reset_expires_at = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        
        base_url = Config.FRONTEND_URL
        if not base_url:
            base_url = f"http://{request.host.split(':')[0]}:5173"
            
        reset_link = f"{base_url}/reset-password?token={user.reset_token}"
        
        body_text = f"Reset link: {reset_link}" # Simplified for brevity, original is better but this tool call is getting long. No, I should use original.
        # Wait, I can't put full HTML in arguments if it's too huge, but it's fine.
        # I'll use the original HTML.
        
        body_text = f"""
Password Reset Request

Hello {user.username},

We received a request to reset your password for your Workitt account.

Click the link below to reset your password:
{reset_link}

If the button doesn't work, copy and paste this link into your browser:
{reset_link}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The Workitt Team
"""
        
        body_html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Workitt Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f7ff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f7ff; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 3px solid #0f172a; box-shadow: 8px 8px 0px 0px rgba(15, 23, 42, 1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 40px 40px 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px;">
                                Workitt
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e86f3e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                                Password Reset Request
                            </p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 28px; font-weight: 900; text-transform: uppercase;">
                                Reset Your Password
                            </h2>
                            <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                Hello <strong>{user.username}</strong>,
                            </p>
                            <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your Workitt account. Click the button below to create a new password:
                            </p>
                            <!-- Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{reset_link}" style="display: inline-block; background-color: #e86f3e; color: #ffffff; text-decoration: none; padding: 18px 40px; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; border: 3px solid #0f172a; box-shadow: 4px 4px 0px 0px rgba(15, 23, 42, 1);">
                                            Reset My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <!-- Alternative Link -->
                            <p style="margin: 30px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6; padding: 20px; background-color: #f1f5f9; border-left: 4px solid #e86f3e;">
                                <strong>Button not working?</strong><br>
                                Copy and paste this link into your browser:<br>
                                <a href="{reset_link}" style="color: #e86f3e; word-break: break-all;">{reset_link}</a>
                            </p>
                            <!-- Security Notice -->
                            <div style="margin: 30px 0 0 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b;">
                                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 700;">
                                    ⚠️ Security Notice
                                </p>
                                <p style="margin: 0; color: #78350f; font-size: 13px; line-height: 1.6;">
                                    This link will expire in <strong>1 hour</strong> for security reasons. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f7ff; padding: 30px 40px; border-top: 2px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; text-align: center;">
                                Best regards,<br>
                                <strong>The Workitt Team</strong>
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                                © 2025 Workitt Inc. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
        try:
            send_email(email, "Reset your Workitt password", body_text, body_html)
        except Exception as e:
            print(f"Failed to send password reset email: {e}")
    
    return jsonify({
        "success": True, 
        "message": "If an account exists with that email, a password reset link has been sent."
    })

@bp.route("/reset-password", methods=["POST"])
def api_reset_password():
    data = request.get_json()
    token = data.get("token")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")
    
    if not token or not password:
        return jsonify({"error": "Missing token or password"}), 400
        
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
        
    user = User.query.filter_by(reset_token=token).first()
    if not user or datetime.utcnow() > user.reset_expires_at:
        return jsonify({"error": "Invalid or expired token"}), 400
        
    is_valid, error = validate_password(password)
    if not is_valid:
        return jsonify({"error": error}), 400
        
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user.password = hashed_password
    user.reset_token = None
    user.reset_expires_at = None
    db.session.commit()
    
    return jsonify({"success": True, "message": "Password updated successfully"})

@bp.route("/change-password", methods=["POST"])
@login_required
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")
    
    if not current_password or not new_password:
        return jsonify({"error": "Current password and new password are required"}), 400
    
    # Verify current password
    if not bcrypt.checkpw(current_password.encode("utf-8"), current_user.password):
        return jsonify({"error": "Current password is incorrect"}), 401
    
    # Validate new password
    if len(new_password) < 8:
        return jsonify({"error": "New password must be at least 8 characters"}), 400
    
    # Update password
    current_user.password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
    db.session.commit()
    
    return jsonify({"success": True, "message": "Password changed successfully"})

@bp.route("/delete-account", methods=["DELETE"])
@login_required
def delete_account_api():
    # Soft delete the user account (mark as deleted, don't remove from DB)
    user = current_user
    user.soft_delete()  # Set deleted_at timestamp
    db.session.commit()
    logout_user()
    
    return jsonify({"success": True, "message": "Account deleted successfully"})
