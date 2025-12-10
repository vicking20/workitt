#utils/db_utils.py
import sys
sys.path.insert(0, "libs")
from pathlib import Path
import sqlite3
from datetime import datetime
import uuid
import bcrypt
from utils.models import db, User, CoverLetter, Application, Subscription
from utils.app_context import create_app

app = create_app()

DATA_DIR = Path("data")
DB_FILE = DATA_DIR / "workitt.db"

def create_user(username, email, password, is_admin=False, verified=False):
    with app.app_context():
        if User.query.filter((User.email == email) | (User.username == username)).first():
            return False, "Username or email already exists."

        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            password=hashed_pw,
            is_admin=is_admin,
            verified=verified,
            created_at=datetime.utcnow(),
        )
        db.session.add(user)
        db.session.flush()  # Get user.id before creating subscription
        
        # Auto-create free subscription for new user
        subscription = Subscription(
            user_id=user.id,
            plan_type="free",
            status="active",
            current_period_start=datetime.utcnow(),
            active=True,
            plan="free"
        )
        db.session.add(subscription)
        db.session.commit()
        return True, f"User {username} created successfully with free subscription."


def list_users():
    with app.app_context():
        users = User.query.all()
        if not users:
            print("No users found.")
            return
        for u in users:
            print(
                f"[{u.id}] {u.username} | {u.email} | Admin: {u.is_admin} | Verified: {u.verified}"
            )

def update_user(user_id, **kwargs):
    with app.app_context():
        user = User.query.get(user_id)
        if not user:
            return False, "User not found."

        if "password" in kwargs:
            kwargs["password"] = bcrypt.hashpw(kwargs["password"].encode("utf-8"), bcrypt.gensalt())

        for k, v in kwargs.items():
            setattr(user, k, v)
        db.session.commit()
        return True, f"User {user.username} updated."

def delete_user(user_id):
    with app.app_context():
        user = User.query.get(user_id)
        if not user:
            return False, "User not found."

        db.session.delete(user)
        db.session.commit()
        return True, f"User {user.username} deleted."

def update_db():
    import os
    # Delete the database file completely to ensure old tables are removed
    if DB_FILE.exists():
        os.remove(DB_FILE)
        print("🗑️  Deleted old database file")
    
    with app.app_context():
        db.create_all()
        print("✅ Database reset and updated")

def create_sample_user():
    sample_email = "admin@example.com"
    existing_user = User.query.filter_by(email=sample_email).first()
    if existing_user:
        print(f"⚠️ Sample user already exists: {existing_user.email}")
        return existing_user
    password = "Password123*"
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = User(
        username="admin",
        email=sample_email,
        password=hashed_pw,
        is_admin=True,
        verified=True
    )
    db.session.add(user)
    db.session.flush()
    
    # Create free subscription
    subscription = Subscription(
        user_id=user.id,
        plan_type="free",
        status="active",
        current_period_start=datetime.utcnow(),
        active=True,
        plan="free"
    )
    db.session.add(subscription)
    db.session.commit()
    print(f"✅ Sample admin user created: {user.email} (password: Password123*)")
    return user

def create_test_user():
    test_email = "user@example.com"
    existing_user = User.query.filter_by(email=test_email).first()
    if existing_user:
        print(f"⚠️ Test user already exists: {existing_user.email}")
        return existing_user
    password = "Password123*"
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user2 = User(
        username="user",
        email=test_email,
        password=hashed_pw,
        is_admin=False,
        verified=True
    )
    db.session.add(user2)
    db.session.flush()
    
    # Create free subscription
    subscription = Subscription(
        user_id=user2.id,
        plan_type="free",
        status="active",
        current_period_start=datetime.utcnow(),
        active=True,
        plan="free"
    )
    db.session.add(subscription)
    db.session.commit()
    print(f"✅ Test user created: {user2.email} (password: Password123*)")
    return user2



# === Subscription Management Functions ===
def list_subscriptions():
    """List all subscriptions with user details"""
    with app.app_context():
        subscriptions = Subscription.query.all()
        if not subscriptions:
            print("No subscriptions found.")
            return
        
        print("\n" + "="*100)
        print(f"{'User Email':<30} {'Plan Type':<15} {'Status':<15} {'Period Start':<20} {'Period End':<20}")
        print("="*100)
        
        for sub in subscriptions:
            user = User.query.get(sub.user_id)
            email = user.email if user else "Unknown"
            period_start = sub.current_period_start.strftime("%Y-%m-%d %H:%M") if sub.current_period_start else "N/A"
            period_end = sub.current_period_end.strftime("%Y-%m-%d %H:%M") if sub.current_period_end else "N/A"
            
            print(f"{email:<30} {sub.plan_type:<15} {sub.status:<15} {period_start:<20} {period_end:<20}")
        print("="*100 + "\n")

def create_premium_subscription(email, days=30):
    """Create or upgrade a user to premium subscription for specified days"""
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if not user:
            return False, f"User with email {email} not found."
        
        # Check if user already has a subscription
        subscription = Subscription.query.filter_by(user_id=user.id).first()
        
        from datetime import timedelta
        period_start = datetime.utcnow()
        period_end = period_start + timedelta(days=days)
        
        if subscription:
            # Update existing subscription
            subscription.plan_type = "premium"
            subscription.status = "active"
            subscription.current_period_start = period_start
            subscription.current_period_end = period_end
            subscription.active = True
            subscription.plan = "premium"
            action = "upgraded"
        else:
            # Create new premium subscription
            subscription = Subscription(
                user_id=user.id,
                plan_type="premium",
                status="active",
                current_period_start=period_start,
                current_period_end=period_end,
                active=True,
                plan="premium"
            )
            db.session.add(subscription)
            action = "created"
        
        db.session.commit()
        return True, f"User {email} {action} with premium subscription (expires: {period_end.strftime('%Y-%m-%d %H:%M')})"

def view_user_subscription(email):
    """View detailed subscription info for a user"""
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if not user:
            print(f"❌ User with email {email} not found.")
            return
        
        subscription = Subscription.query.filter_by(user_id=user.id).first()
        if not subscription:
            print(f"❌ No subscription found for {email}")
            return
        
        print("\n" + "="*60)
        print(f"Subscription Details for: {email}")
        print("="*60)
        print(f"Plan Type:          {subscription.plan_type}")
        print(f"Status:             {subscription.status}")
        print(f"Active:             {subscription.active}")
        print(f"Period Start:       {subscription.current_period_start.strftime('%Y-%m-%d %H:%M') if subscription.current_period_start else 'N/A'}")
        print(f"Period End:         {subscription.current_period_end.strftime('%Y-%m-%d %H:%M') if subscription.current_period_end else 'N/A'}")
        print(f"Trial Start:        {subscription.trial_start.strftime('%Y-%m-%d %H:%M') if subscription.trial_start else 'N/A'}")
        print(f"Trial End:          {subscription.trial_end.strftime('%Y-%m-%d %H:%M') if subscription.trial_end else 'N/A'}")
        print(f"Cancel at Period:   {subscription.cancel_at_period_end}")
        print(f"Cancelled At:       {subscription.cancelled_at.strftime('%Y-%m-%d %H:%M') if subscription.cancelled_at else 'N/A'}")
        print(f"Stripe Customer:    {subscription.stripe_customer_id or 'N/A'}")
        print(f"Stripe Sub ID:      {subscription.stripe_subscription_id or 'N/A'}")
        print("="*60 + "\n")

# === Soft Delete Functions ===
def soft_delete_user(email):
    """Soft delete a user (mark as deleted, preserve data)"""
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if not user:
            return False, f"User with email {email} not found."
        
        if user.is_deleted:
            return False, f"User {email} is already deleted."
        
        user.soft_delete()
        db.session.commit()
        return True, f"User {email} has been soft deleted. Data preserved, user cannot log in."

def restore_user(email):
    """Restore a soft-deleted user"""
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if not user:
            return False, f"User with email {email} not found."
        
        if not user.is_deleted:
            return False, f"User {email} is not deleted."
        
        user.restore()
        db.session.commit()
        return True, f"User {email} has been restored."

def list_deleted_users():
    """List all soft-deleted users"""
    with app.app_context():
        deleted_users = User.query.filter(User.deleted_at.isnot(None)).all()
        if not deleted_users:
            print("No deleted users found.")
            return
        
        print("\n" + "="*80)
        print(f"{'Email':<30} {'Username':<20} {'Deleted At':<30}")
        print("="*80)
        for u in deleted_users:
            deleted_at = u.deleted_at.strftime("%Y-%m-%d %H:%M:%S") if u.deleted_at else "N/A"
            print(f"{u.email:<30} {u.username:<20} {deleted_at:<30}")
        print("="*80 + "\n")


# === CLI Menu ===
def menu():
    while True:
        print("\n" + "="*60)
        print("🗄️  DATABASE MANAGEMENT MENU")
        print("="*60)
        print("\n📋 USER MANAGEMENT")
        print("  1. View all users")
        print("  2. Create user")
        print("  3. Update user")
        print("  4. Delete user (HARD DELETE)")
        print("\n💳 SUBSCRIPTION MANAGEMENT")
        print("  5. View all subscriptions")
        print("  6. Create/Upgrade to Premium subscription")
        print("  7. View user subscription details")
        print("\n🗑️  SOFT DELETE MANAGEMENT")
        print("  8. Soft delete user")
        print("  9. Restore deleted user")
        print("  10. View deleted users")
        print("\n🔧 DATABASE OPERATIONS")
        print("  11. Delete and recreate database")
        print("  12. Create admin test user")
        print("  13. Create regular test user")
        print("\n  0. Exit")
        print("="*60)

        choice = input("\n👉 Select an option: ").strip()

        if choice == "1":
            list_users()

        elif choice == "2":
            username = input("Username: ").strip()
            email = input("Email: ").strip()
            password = input("Password: ").strip()
            is_admin = input("Admin? (y/n): ").strip().lower() == "y"
            verified = input("Verified? (y/n): ").strip().lower() == "y"
            success, msg = create_user(username, email, password, is_admin, verified)
            print("✅" if success else "❌", msg)

        elif choice == "3":
            user_id = input("User ID to update: ").strip()
            field = input("Field (username/email/password/is_admin/verified): ").strip()
            value = input("New value: ").strip()

            if field in ["is_admin", "verified"]:
                value = value.lower() in ["1", "true", "yes", "y"]

            success, msg = update_user(user_id, **{field: value})
            print("✅" if success else "❌", msg)

        elif choice == "4":
            user_id = input("User ID to delete: ").strip()
            confirm = input("⚠️  HARD DELETE - Are you sure? Data will be lost! (y/n): ").strip().lower()
            if confirm == "y":
                success, msg = delete_user(user_id)
                print("✅" if success else "❌", msg)

        elif choice == "5":
            list_subscriptions()

        elif choice == "6":
            email = input("User email: ").strip()
            days = input("Duration in days (default 30): ").strip()
            days = int(days) if days.isdigit() else 30
            success, msg = create_premium_subscription(email, days)
            print("✅" if success else "❌", msg)

        elif choice == "7":
            email = input("User email: ").strip()
            view_user_subscription(email)

        elif choice == "8":
            email = input("User email to soft delete: ").strip()
            confirm = input(f"Soft delete {email}? (data preserved, user can't login) (y/n): ").strip().lower()
            if confirm == "y":
                success, msg = soft_delete_user(email)
                print("✅" if success else "❌", msg)

        elif choice == "9":
            email = input("User email to restore: ").strip()
            success, msg = restore_user(email)
            print("✅" if success else "❌", msg)

        elif choice == "10":
            list_deleted_users()

        elif choice == "11":
            confirm = input("⚠️  DELETE DATABASE? All data will be lost! (y/n): ").strip().lower()
            if confirm == "y":
                update_db()

        elif choice == "12":
            create_sample_user()

        elif choice == "13":
            create_test_user()

        elif choice == "0":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice, try again.")


if __name__ == "__main__":
    with app.app_context():
        menu()