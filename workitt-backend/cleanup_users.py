#!/usr/bin/env python3
import sys
import os
from pathlib import Path

# Add libs to path
sys.path.insert(0, "libs")

from datetime import datetime
from utils.app_context import create_app
from utils.models import User, db

def cleanup_expired_users():
    """
    Remove unverified users whose verification tokens have expired.
    """
    app = create_app()
    with app.app_context():
        print("🔍 Checking for expired unverified users...")
        
        now = datetime.utcnow()
        
        # logic: verified is False AND expires_at < now
        expired_users = User.query.filter(
            User.verified == False,
            User.expires_at < now
        ).all()
        
        count = len(expired_users)
        
        if count == 0:
            print("✅ No expired users found.")
            return
            
        print(f"found {count} expired users.")
        
        for user in expired_users:
            print(f"  🗑️  Deleting: {user.email} (Expired: {user.expires_at})")
            db.session.delete(user)
            
        try:
            db.session.commit()
            print(f"✅ Successfully deleted {count} expired users.")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error during cleanup: {e}")

if __name__ == "__main__":
    cleanup_expired_users()
