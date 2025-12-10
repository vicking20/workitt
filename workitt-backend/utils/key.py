#utils/key.py
import sys
sys.path.insert(0, "libs")
import os
import uuid
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from pathlib import Path
from utils.config import load_config, save_config
from datetime import datetime
from utils.config_defaults import DEFAULT_CONFIG

DATA_DIR = Path("data")

def generate_master_key():
    print("\n[+] Generating master encryption key...")
    # Clear old data
    if DATA_DIR.exists():
        import shutil
        shutil.rmtree(DATA_DIR)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate encryption key
    key = AESGCM.generate_key(bit_length=256)
    
    # Store key in fixed location: data/key/.wm.key
    key_dir = DATA_DIR / "key"
    key_dir.mkdir(parents=True, exist_ok=True)
    key_file = key_dir / ".wm.key"
    key_file.write_bytes(key)
    os.chmod(key_file, 0o600)
    
    # Save config
    config = DEFAULT_CONFIG.copy()
    config["security"]["master_key_path"] = str(key_file)
    config["security"]["key_generated_at"] = datetime.utcnow().isoformat()
    save_config(config)
    
    print(f"[+] Master key generated and saved to: {key_file}")
    print(f"[!] IMPORTANT: Backup this key file to preserve your encrypted data!")

def encrypt_with_master_key(data: str) -> str:
    #encrypt data with master key
    try:
        key = get_master_key()
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        encrypted = aesgcm.encrypt(nonce, data.encode(), None)
        return (nonce + encrypted).hex()
    except Exception as e:
        raise Exception(f"Encryption failed: {e}")

def decrypt_with_master_key(cipher_hex: str) -> str:
    #decrypt data with master key
    try:
        key = get_master_key()
        aesgcm = AESGCM(key)
        blob = bytes.fromhex(cipher_hex)
        nonce, encrypted = blob[:12], blob[12:]
        return aesgcm.decrypt(nonce, encrypted, None).decode()
    except Exception as e:
        raise Exception(f"Decryption failed: {e}")

def get_master_key():
    #get master key path
    config = load_config()
    key_path_str = config.get("security", {}).get("master_key_path", "")
    if not key_path_str:
        raise ValueError("Master key path not found in config. Please generate a master key first.")
    key_path = Path(key_path_str)
    if not key_path.exists():
        raise FileNotFoundError(f"Master key file not found at: {key_path}")
    return key_path.read_bytes()

def decrypt_config_value(value):
    #decrypt encrypted config value
    return decrypt_with_master_key(value)
