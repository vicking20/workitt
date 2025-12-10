#utils/mailer.py
import sys
sys.path.insert(0, "libs")
import os
import json
import smtplib
import ssl
import threading
from email.message import EmailMessage
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from utils.config import load_config
from utils.key import get_master_key, decrypt_with_master_key, decrypt_config_value

DATA_DIR = Path("data")
CONFIG_FILE = DATA_DIR / "config.json"

def get_smtp_config():
    #get and decrypt smtp data
    config = load_config()
    smtp_config = config.get("smtp", {})
    if not smtp_config.get("host"):
        raise ValueError("SMTP not configured. Please configure SMTP settings first.")
    # Decrypt sensitive values
    decrypted_config = {
        "host": smtp_config["host"],
        "port": smtp_config["port"],
        "username": decrypt_config_value(smtp_config["username"]),
        "password": decrypt_config_value(smtp_config["password"]),
        "use_tls": smtp_config.get("use_tls", True)
    }
    # Validate required fields
    if not all([decrypted_config["host"], decrypted_config["username"], decrypted_config["password"]]):
        raise ValueError("Incomplete SMTP configuration. Please check your settings.")
    return decrypted_config

def _send_email_task(to_email, subject, body_text, body_html=None, from_address=None):
    try:
        smtp_cfg = get_smtp_config()
        msg = EmailMessage()
        msg["From"] = from_address or smtp_cfg["username"]
        msg["To"] = to_email
        msg["Subject"] = subject
        # Set plain text part
        msg.set_content(body_text)
        # Optionally set HTML part
        if body_html:
            msg.add_alternative(body_html, subtype="html")
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_cfg["host"], smtp_cfg["port"]) as server:
            if smtp_cfg["use_tls"]:
                server.starttls(context=context)
            server.login(smtp_cfg["username"], smtp_cfg["password"])
            server.send_message(msg)
        print(f"[+] Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"[ERROR] Email failed: {e}")
        return False

def send_email(to_email, subject, body_text, body_html=None, from_address=None):
    threading.Thread(
        target=_send_email_task,
        args=(to_email, subject, body_text, body_html, from_address)
    ).start()

def test_smtp_connection():
    #smtp test and auth
    try:
        smtp_cfg = get_smtp_config()
        print(smtp_cfg["username"])
        print(smtp_cfg["password"])
        print(f"[+] Testing SMTP connection to {smtp_cfg['host']}:{smtp_cfg['port']}...")
        
        context = ssl.create_default_context()
        
        with smtplib.SMTP(smtp_cfg["host"], smtp_cfg["port"]) as server:
            if smtp_cfg["use_tls"]:
                server.starttls(context=context)
            
            server.login(smtp_cfg["username"], smtp_cfg["password"])
            print("[+] SMTP connection and authentication successful!")
            return True
            
    except Exception as e:
        print(f"[ERROR] SMTP test failed: {e}")
        return False