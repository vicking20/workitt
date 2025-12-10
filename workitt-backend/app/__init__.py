#/app/__init__.py
import sys
sys.path.insert(0, "libs")
from flask import Flask, jsonify
from flask_cors import CORS
from flask_session import Session
from app.extensions import db, login_manager
from app.config import Config
from app.models import User
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    # Trust headers from proxy (Cloudflare/Nginx)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = None

    if config_class.PRODUCTION:
        # Ensure session security in production
        app.config['SESSION_TYPE'] = 'sqlalchemy'
        app.config['SESSION_SQLALCHEMY'] = db
        app.config['SESSION_PERMANENT'] = False
        app.config['SESSION_COOKIE_SECURE'] = True
        app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    else:
        app.config['SESSION_TYPE'] = 'filesystem'
        app.config['SESSION_FILE_DIR'] = 'sessions'
        app.config['SESSION_PERMANENT'] = False
        app.config['SESSION_COOKIE_SECURE'] = False
        app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

    Session(app)

    app.config['PERMANENT_SESSION_LIFETIME'] = 86400

    # CORS configuration
    # Use config-based allowed origins
    allowed_origins = config_class.get_allowed_origins() if hasattr(config_class, 'get_allowed_origins') else config_class.ALLOWED_ORIGINS
    
    CORS(app, 
         origins=allowed_origins,
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # Configure login manager
    @login_manager.user_loader
    def load_user(user_id):
        user = db.session.get(User, user_id)
        if user and user.is_deleted:
            return None
        return user

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Unauthorized", "message": "Please log in to access this resource"}), 401
    
    # Error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        # Pass through HTTP errors
        if isinstance(e, HTTPException):
            return e
        
        # Log the error (in a real app)
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        
        # Return JSON instead of HTML for 500
        response = jsonify({
            "error": "Internal Server Error",
            "message": str(e)
        })
        response.status_code = 500
        return response

    # Register blueprints
    from app.routes.main import bp as main_bp
    from app.routes.auth import bp as auth_bp
    from app.routes.dashboard import bp as dashboard_bp
    from app.routes.resume import bp as resume_bp
    from app.routes.cover_letter import bp as cover_letter_bp
    from app.routes.profile import bp as profile_bp
    from app.routes.subscription import bp as subscription_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(cover_letter_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(subscription_bp)

    return app
