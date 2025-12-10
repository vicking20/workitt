#conf_setup.py
import os
import sys
sys.path.insert(0, 'libs')
import json
import secrets
import uuid
import sqlite3
from pathlib import Path
import bcrypt
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from utils.key import encrypt_with_master_key, generate_master_key
from utils.config import load_config, save_config
from utils.mailer import test_smtp_connection
from utils.models import User, init_db
from utils.extensions import db
from flask import Flask
from utils.models import init_db, User
from utils.app_context import create_app

DATA_DIR = Path("data")
CONFIG_FILE = DATA_DIR / "config.json"
DEFAULT_CONFIG = {
    "security": {
        "master_key_path": "",
        "key_generated_at": ""
    },
    "artificial_intelligence": {
        "platform": "",
        "api_key": ""
    },
    "smtp": {
        "host": "",
        "port": 587,
        "username": "",
        "password": "",
        "use_tls": True
    }
}

def create_admin_user():
    app = create_app()
    with app.app_context():
        init_db()
        print("\n [+] Creating admin user...")
        email = input("Enter your email address: ").strip()
        username = input("Enter your username: ").strip()
        password = secrets.token_urlsafe(12)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            password=hashed_password,
            is_admin=True,
            verified=True
        )
        db.session.add(user)
        db.session.commit()
        print("\n[+] Admin account created. Save credentials securely!")
        print(f"    User ID: {user.id}")
        print(f"    email: {email}")
        print(f"    Password: {password}")

def configure_ai():
    # Configure AI platform and API key
    print("\n[+] Configure AI Platform")
    print("="*30)
    config = load_config()

    # Show current config if it exists
    ai_conf = config.setdefault("artificial_intelligence", {})
    current_platform = ai_conf.get("platform")
    if current_platform:
        print(f"Current Platform: {current_platform}")
        if ai_conf.get("api_key"):
            print("API key: [CONFIGURED]")
        else:
            print("API key: [NOT CONFIGURED]")
        print()

    # Platform selection
    print("Select platform:")
    print("1. DeepSeek")
    print("2. OpenAI/ChatGPT")
    print("3. ClaudeAI")
    print("4. Google Gemini")
    print("5. Azure OpenAI")
    print("0. Cancel")

    choice = input("Choice: ").strip()
    platforms = {
        "1": "deepseek",
        "2": "openai",
        "3": "claudeai",
        "4": "gemini",
        "5": "azure"
    }
    if choice == "0":
        print("Cancelled.")
        return
    if choice not in platforms:
        print("Error: Invalid choice...")
        return

    platform = platforms[choice]
    ai_conf["platform"] = platform

    # API Key
    api_key = input(f"Enter API key for {platform} (Enter to skip/keep existing): ").strip()
    if api_key:
        ai_conf["api_key"] = encrypt_with_master_key(api_key)

    # Platform-specific optional fields
    if platform == "azure":
        endpoint = input(f"Azure endpoint (Enter to skip, current: {ai_conf.get('endpoint','')}): ").strip()
        if endpoint:
            ai_conf["endpoint"] = endpoint
        deployment = input(f"Azure deployment (Enter to skip, current: {ai_conf.get('deployment','')}): ").strip()
        if deployment:
            ai_conf["deployment"] = deployment

    elif platform == "openai":
        model = input(f"OpenAI model (Enter to skip, current: {ai_conf.get('model','gpt-4o-mini')}): ").strip()
        if model:
            ai_conf["model"] = model

    # Save final config
    save_config(config)
    print(f"\n[+] AI configuration saved successfully!")
    print(f"Platform: {platform}")
    print("API key: [ENCRYPTED AND STORED]")
    print(f"Full AI config: {json.dumps(ai_conf, indent=2)}")


def configure_smtp():
    """Configure SMTP settings"""
    print("\n[+] Configure SMTP Settings")
    print("="*30)
    config = load_config()
    #show current smtp config
    smtp_config = config["smtp"]
    if smtp_config["host"]:
        print(f"Current Host: {smtp_config['host']}")
        print(f"Current Port: {smtp_config['port']}")
        print(f"Username: {'[CONFIGURED]' if smtp_config['username'] else '[NOT CONFIGURED]'}")
        print(f"Password: {'[CONFIGURED]' if smtp_config['password'] else '[NOT CONFIGURED]'}")
        print(f"Use TLS: {smtp_config['use_tls']}")
        print()
    #get smtp settings
    host = input("Input SMTP host here (e.g., smtp.gmail.com): ").strip()
    if not host:
        print("Error! Host cannot be empty")
        return
    try:
        port = int(input("SMTP Port (default 587): ").strip() or "587")
    except ValueError:
        print("Error: Invalid port number.")
        return
    username = input("SMTP Username/Email: ").strip()
    if not username:
        print("Error, username cannot be empty")
        return
    password = input("SMTP Password (Setup app password if using google mail): ").strip()
    if not password:
        print("Error: Password cannot be empty.")
        return
    use_tls_input = input("Use TLS? (y/n, default y): ").strip().lower()
    use_tls = use_tls_input not in ['n', 'no', 'false']
    #encrypt data
    encrypted_username = encrypt_with_master_key(username)
    encrypted_password = encrypt_with_master_key(password)
    #update config
    config["smtp"]["host"] = host
    config["smtp"]["port"] = port
    config["smtp"]["username"] = encrypted_username
    config["smtp"]["password"] = encrypted_password
    config["smtp"]["use_tls"] = use_tls
    save_config(config)

def view_config():
    #view current configuration... encrypted values are masked
    print("\n[+] Current Configuration")
    print("="*30)
    config = load_config()
    #ai config
    print("Artificial Intelligence:")
    ai_config = config["artificial_intelligence"]
    print(f"  Platform: {ai_config['platform'] or '[NOT CONFIGURED]'}")
    print(f"  API Key: {'[CONFIGURED]' if ai_config['api_key'] else '[NOT CONFIGURED]'}")
    print("\nSMTP:")
    smtp_config = config["smtp"]
    print(f"  Host: {smtp_config['host'] or '[NOT CONFIGURED]'}")
    print(f"  Port: {smtp_config['port']}")
    print(f"  Username: {'[CONFIGURED]' if smtp_config['username'] else '[NOT CONFIGURED]'}")
    print(f"  Password: {'[CONFIGURED]' if smtp_config['password'] else '[NOT CONFIGURED]'}")
    print(f"  Use TLS: {smtp_config['use_tls']}")

import subprocess
import signal
import shutil
import time

PID_FILE = DATA_DIR / "workitt_pids.json"

def start_workitt():
    print("\n[+] Starting Workitt...")
    
    # Check if already running
    if PID_FILE.exists():
        print("[!] Workitt appears to be running (PID file exists).")
        print("    If you are sure it's not running, delete 'data/workitt_pids.json'.")
        return

    # Paths
    backend_dir = Path.cwd()
    frontend_dir = backend_dir.parent / "workitt-frontend"
    
    if not frontend_dir.exists():
        print(f"[!] Error: Frontend directory not found at {frontend_dir}")
        return

    pids = {}
    
    try:
        # Start Backend
        print("    Starting Backend (app.py)...")
        backend_proc = subprocess.Popen(
            [sys.executable, "app.py"],
            cwd=str(backend_dir),
            stdout=subprocess.DEVNULL, # Redirect output to avoid cluttering console
            stderr=subprocess.DEVNULL,
            start_new_session=True # Create new process group
        )
        pids["backend"] = backend_proc.pid
        print(f"    Backend started (PID: {backend_proc.pid})")

        # Start Frontend
        print("    Starting Frontend (npm run dev)...")
        # Use shell=True for npm, or better, find path to npm. 
        # Using list is safer if executable matches. "npm" should work in path.
        frontend_proc = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=str(frontend_dir),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True
        )
        pids["frontend"] = frontend_proc.pid
        print(f"    Frontend started (PID: {frontend_proc.pid})")
        
        # Save PIDs
        with open(PID_FILE, 'w') as f:
            json.dump(pids, f)
            
        print("\n[+] Workitt started successfully!")
        print("    Frontend running on: http://localhost:5173")
        print("    Backend running on: http://localhost:5000")
        
    except Exception as e:
        print(f"\n[!] Error starting Workitt: {e}")
        # Try to clean up if partial start
        if "backend" in pids:
            try:
                os.kill(pids["backend"], signal.SIGTERM)
            except: pass
        if "frontend" in pids:
            try:
                os.kill(pids["frontend"], signal.SIGTERM)
            except: pass
        if PID_FILE.exists():
            PID_FILE.unlink()

def shutdown_workitt():
    print("\n[+] Shutting down Workitt...")
    
    if not PID_FILE.exists():
        print("[!] Workitt is not running (PID file not found).")
        return

    try:
        with open(PID_FILE, 'r') as f:
            pids = json.load(f)
        
        # Kill Frontend
        if "frontend" in pids:
            print(f"    Stopping Frontend (PID: {pids['frontend']})...")
            try:
                os.kill(pids["frontend"], signal.SIGTERM)
            except ProcessLookupError:
                print("    Frontend process not found (already stopped?)")
            except Exception as e:
                print(f"    Error stopping frontend: {e}")

        # Kill Backend
        if "backend" in pids:
            print(f"    Stopping Backend (PID: {pids['backend']})...")
            try:
                os.kill(pids["backend"], signal.SIGTERM)
            except ProcessLookupError:
                print("    Backend process not found (already stopped?)")
            except Exception as e:
                print(f"    Error stopping backend: {e}")
        
        # Clean up PID file
        PID_FILE.unlink()
        print("\n[+] Workitt shutdown complete!")
        
    except json.JSONDecodeError:
        print("[!] Error reading PID file. Deleting corrupted file.")
        PID_FILE.unlink()
    except Exception as e:
        print(f"[!] Error during shutdown: {e}")

def uninstall_workitt():
    print("\n[!] DANGER: This will COMPLETELY REMOVE Workitt!")
    print("    - Stops all running processes")
    print("    - DELETES the entire 'workitt' folder and all data")
    print("    - This action cannot be undone.")
    
    confirm = input("Type 'DELETE EVERYTHING' to confirm: ").strip()
    if confirm == 'DELETE EVERYTHING':
        # First, ensure shutdown
        shutdown_workitt()
        
        print("\n[+] Uninstalling Workitt...")
        try:
            # Get the parent directory (root of the repo/project)
            project_root = Path.cwd().parent
            # Assuming we are in workitt/workitt-backend, parent is workitt
            # Check if we are indeed in workitt-backend to be safe
            if Path.cwd().name != "workitt-backend":
                print(f"[!] Warning: Current directory is {Path.cwd().name}, expected workitt-backend.")
                print("    Aborting automatic deletion for safety.")
                return

            print(f"    Removing directory: {project_root}")
            # Delete the entire project root
            # Note: This will delete the running script too, which might cause errors at the very end of execution.
            shutil.rmtree(project_root)
            
            print("Workitt uninstalled successfully!")
            print("Goodbye.")
            sys.exit(0) # Exit immediately
            
        except Exception as e:
            print(f"Error during uninstallation: {e}")
            print("You may need to delete the folder manually.")
    else:
        print("Uninstallation cancelled.")

def create_manual_user():
    app = create_app()
    with app.app_context():
        init_db()
        print("\n [+] Creating manual user...")
        email = input("Enter email address: ").strip()
        username = input("Enter username: ").strip()
        password = input("Enter password: ").strip()
        
        if not email or not username or not password:
            print("Error: All fields are required.")
            return

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = User(
            id=str(uuid.uuid4()),
            username=username,
            email=email,
            password=hashed_password,
            is_admin=False,
            verified=True
        )
        try:
            db.session.add(user)
            db.session.commit()
            print("\n[+] User account created successfully.")
            print(f"    User ID: {user.id}")
            print(f"    Email: {email}")
        except Exception as e:
            print(f"[-] Error creating user: {e}")

def menu():
    """Main menu"""
    while True:
        print("\n" + "="*50)
        print("Welcome to Workitt Setup")
        print("="*50)
        print("\n1. Generate Master Key")
        print("2. Create Admin User")
        print("3. Create Manual User")
        print("4. Configure AI Platform")
        print("5. Configure SMTP Settings")
        print("6. View Configuration")
        print("7. Start Workitt")
        print("8. Shutdown Workitt")
        print("9. Uninstall Workitt")
        print("10. Test SMTP mailing")
        print("0. Exit")
        
        choice = input("\nEnter choice: ").strip()
        try:
            if choice == "1":
                print("\n[!] Warning: Generating a new key will invalidate all existing encrypted data!")
                confirm = input("Continue? (yes/no): ").strip().lower()
                if confirm in ("y", "yes"):
                    generate_master_key()
                    print("\n[+] It's recommended to create an admin user after generating a new key.")
                    create_new = input("Create admin user now? (y/n): ").strip().lower()
                    if create_new in ("y", "yes"):
                        create_admin_user()
            elif choice == "2":
                create_admin_user()
            elif choice == "3":
                create_manual_user()
            elif choice == "4":
                configure_ai()
            elif choice == "5":
                configure_smtp()
                test = input("Do you want to test SMTP config? (y/n): ").strip().lower()
                if test in ("y", "yes"):
                    test_smtp_connection()
                else:
                    print("SMTP test skipped.")
            elif choice == "6":
                view_config()
            elif choice == "7":
                start_workitt()
            elif choice == "8":
                shutdown_workitt()
            elif choice == "9":
                uninstall_workitt()
            elif choice == "10":
                test_smtp_connection()
            elif choice == "0":
                print("\nExiting Workitt Setup. Goodbye!")
                break
            else:
                print("\n[!] Invalid choice. Please select a valid option.")
        except KeyboardInterrupt:
            print("\n\nOperation cancelled by user.")
        except Exception as e:
            print(f"\n[!] An error occurred: {e}")
        # Pause before showing menu again
        if choice != "0":
            input("\nPress Enter to continue...")
if __name__ == "__main__":
    menu()