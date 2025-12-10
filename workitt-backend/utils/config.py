#utils/config.py
import sys
sys.path.insert(0, "libs")
import os
import json
from pathlib import Path
from utils.config_defaults import DEFAULT_CONFIG

DATA_DIR = Path("data")
CONFIG_FILE = DATA_DIR / "config.json"

def load_config():
    #Load existing config or create default one
    if CONFIG_FILE.exists():
        try:
            return json.loads(CONFIG_FILE.read_text())
        except json.JSONDecodeError:
            print("Warning: Config file corrupted... Creating new...")
    #create default config
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    save_config(DEFAULT_CONFIG.copy())
    return DEFAULT_CONFIG.copy()

def save_config(config):
    #save config to file
    CONFIG_FILE.write_text(json.dumps(config, indent=4))