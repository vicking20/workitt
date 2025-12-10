from datetime import datetime
import uuid
from pathlib import Path
from flask_login import UserMixin
from sqlalchemy.ext.mutable import MutableDict
from app.extensions import db

DATA_DIR = Path("data").resolve()
DB_FILE = DATA_DIR / "workitt.db"

def generate_uuid():
    return str(uuid.uuid4())

class BaseModel:
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    deleted_at = db.Column(db.DateTime, nullable=True)

class User(db.Model, BaseModel, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    password = db.Column(db.LargeBinary, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    verified = db.Column(db.Boolean, default=False)
    verify_token = db.Column(db.String)
    expires_at = db.Column(db.DateTime)
    reset_token = db.Column(db.String)
    reset_expires_at = db.Column(db.DateTime)

    # relationships with cascading deletes
    cover_letters = db.relationship(
        "CoverLetter", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    applications = db.relationship(
        "Application", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    subscription = db.relationship(
        "Subscription",
        backref="user",
        lazy=True,
        uselist=False,
        cascade="all, delete-orphan",
    )
    profiles = db.relationship(
        "Profile", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    
    # Soft delete helper methods
    def soft_delete(self):
        """Mark user as deleted (soft delete)"""
        self.deleted_at = datetime.utcnow()
        
    def restore(self):
        """Restore a soft-deleted user"""
        self.deleted_at = None
        
    @property
    def is_deleted(self):
        """Check if user is soft-deleted"""
        return self.deleted_at is not None


class Profile(db.Model, BaseModel):
    __tablename__ = "profile"
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    job_sector = db.Column(db.String(100))
    profile_email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    summary = db.Column(db.Text)
    # All resume data (work experience, education, skills, etc.) is stored in content as JSON
    content = db.Column(MutableDict.as_mutable(db.JSON), nullable=False, default=dict)


class CoverLetter(db.Model, BaseModel):
    __tablename__ = "cover_letters"
    cover_id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String, nullable=False)
    content = db.Column(MutableDict.as_mutable(db.JSON), nullable=False, default=dict)
    c_template_name = db.Column(db.String, default="default")

class Application(db.Model, BaseModel):
    __tablename__ = "applications"
    app_id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False)
    job_title = db.Column(db.String, nullable=False)
    company = db.Column(db.String, nullable=False)
    job_link = db.Column(db.String)
    summary = db.Column(db.Text)
    status = db.Column(
        db.String, default="applied"
    )  # applied, interview, rejected, offer
    profile_id = db.Column(db.String, db.ForeignKey("profile.id"), nullable=True)  # Resume used
    cover_letter_id = db.Column(
        db.String, db.ForeignKey("cover_letters.cover_id"), nullable=True
    )  # Cover letter used
    profile = db.relationship("Profile")  # Resume relationship
    cover_letter = db.relationship("CoverLetter")  # Cover letter relationship

class Subscription(db.Model, BaseModel):
    __tablename__ = "subscriptions"
    sub_id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String, db.ForeignKey("users.id"), nullable=False, unique=True)  # One subscription per user
    
    # Plan details
    plan_type = db.Column(db.String, nullable=False, default="free")  # free, basic, premium, enterprise
    status = db.Column(db.String, nullable=False, default="active")  # active, cancelled, past_due, expired, trialing
    
    # Billing cycle tracking
    current_period_start = db.Column(db.DateTime, nullable=True)
    current_period_end = db.Column(db.DateTime, nullable=True)
    
    # Cancellation handling
    cancel_at_period_end = db.Column(db.Boolean, default=False)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    
    # Trial management
    trial_start = db.Column(db.DateTime, nullable=True)
    trial_end = db.Column(db.DateTime, nullable=True)
    
    # Payment processor integration (e.g., Stripe)
    stripe_customer_id = db.Column(db.String, nullable=True)
    stripe_subscription_id = db.Column(db.String, nullable=True)
    
    # Legacy field for backwards compatibility (can be removed later)
    active = db.Column(db.Boolean, default=True)
    
    # Deprecated - use plan_type instead (kept for backwards compatibility)
    plan = db.Column(db.String, nullable=True)
