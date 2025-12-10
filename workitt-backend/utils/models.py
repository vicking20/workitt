import sys
sys.path.insert(0, "libs")
from app.models import *
from app.models import db, DATA_DIR, DB_FILE  # Explicitly export these

# Init DB function wrapper for backward compatibility
def init_db():
    from app import create_app
    app = create_app()
    with app.app_context():
        if DB_FILE.exists():
            print(f"[!] Database already exists at {DB_FILE}, skipping create_all().")
            return
        db.create_all()
        print("[+] Database initialized with all tables.")
        return
    db.create_all()
    print("[+] Database initialized with all tables.")

if __name__ == "__main__":
    init_db()
