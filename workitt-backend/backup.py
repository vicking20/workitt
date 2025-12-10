#!/usr/bin/env python3
"""
Workitt Backup Utility
Creates timestamped backups of the data directory including database, config, and encryption key.
"""
import sys
sys.path.insert(0, "libs")
import shutil
from pathlib import Path
from datetime import datetime
import json

# Directories
DATA_DIR = Path("data").resolve()
BACKUP_BASE_DIR = Path.home() / ".workitt_backups"

def create_backup():
    """Create a timestamped backup of the data directory"""
    if not DATA_DIR.exists():
        print(f"❌ Error: Data directory not found at {DATA_DIR}")
        return False
    
    # Create backup directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = BACKUP_BASE_DIR / f"backup_{timestamp}"
    
    try:
        # Create backup base directory if it doesn't exist
        BACKUP_BASE_DIR.mkdir(parents=True, exist_ok=True)
        
        # Copy entire data directory
        print(f"📦 Creating backup...")
        shutil.copytree(DATA_DIR, backup_dir)
        
        # Create backup manifest
        manifest = {
            "timestamp": timestamp,
            "backup_date": datetime.now().isoformat(),
            "source": str(DATA_DIR),
            "destination": str(backup_dir),
            "files_backed_up": []
        }
        
        # List all backed up files
        for file in backup_dir.rglob("*"):
            if file.is_file():
                manifest["files_backed_up"].append(str(file.relative_to(backup_dir)))
        
        # Save manifest
        manifest_file = backup_dir / "backup_manifest.json"
        manifest_file.write_text(json.dumps(manifest, indent=2))
        
        print(f"✅ Backup created successfully!")
        print(f"📁 Location: {backup_dir}")
        print(f"📊 Files backed up: {len(manifest['files_backed_up'])}")
        
        # Show what was backed up
        print(f"\n📋 Backed up:")
        for item in ["workitt.db", "config.json", "key/.wm.key"]:
            item_path = backup_dir / item
            if item_path.exists():
                if item_path.is_file():
                    size = item_path.stat().st_size
                    print(f"   ✓ {item} ({size:,} bytes)")
                else:
                    print(f"   ✓ {item}/")
        
        return True
        
    except Exception as e:
        print(f"❌ Backup failed: {e}")
        return False

def list_backups():
    """List all available backups"""
    if not BACKUP_BASE_DIR.exists():
        print("📭 No backups found")
        return
    
    backups = sorted([d for d in BACKUP_BASE_DIR.iterdir() if d.is_dir()], reverse=True)
    
    if not backups:
        print("📭 No backups found")
        return
    
    print(f"\n📚 Available backups ({len(backups)}):")
    print("=" * 60)
    
    for backup in backups:
        manifest_file = backup / "backup_manifest.json"
        if manifest_file.exists():
            manifest = json.loads(manifest_file.read_text())
            print(f"\n📦 {backup.name}")
            print(f"   Date: {manifest.get('backup_date', 'Unknown')}")
            print(f"   Files: {len(manifest.get('files_backed_up', []))}")
            print(f"   Location: {backup}")
        else:
            print(f"\n📦 {backup.name}")
            print(f"   Location: {backup}")

def restore_backup(backup_name):
    """Restore from a specific backup"""
    backup_dir = BACKUP_BASE_DIR / backup_name
    
    if not backup_dir.exists():
        print(f"❌ Backup not found: {backup_name}")
        return False
    
    print(f"⚠️  WARNING: This will replace your current data!")
    print(f"📁 Backup: {backup_dir}")
    response = input("Continue? (yes/no): ").strip().lower()
    
    if response != "yes":
        print("❌ Restore cancelled")
        return False
    
    try:
        # Backup current data first
        if DATA_DIR.exists():
            temp_backup = DATA_DIR.parent / f"data_before_restore_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            print(f"📦 Backing up current data to: {temp_backup}")
            shutil.copytree(DATA_DIR, temp_backup)
        
        # Remove current data
        if DATA_DIR.exists():
            shutil.rmtree(DATA_DIR)
        
        # Restore from backup (exclude manifest)
        shutil.copytree(backup_dir, DATA_DIR, ignore=shutil.ignore_patterns('backup_manifest.json'))
        
        print(f"✅ Restore completed successfully!")
        print(f"📁 Data restored to: {DATA_DIR}")
        return True
        
    except Exception as e:
        print(f"❌ Restore failed: {e}")
        return False

def cleanup_old_backups(keep_count=10):
    """Keep only the N most recent backups"""
    if not BACKUP_BASE_DIR.exists():
        print("📭 No backups to clean up")
        return
    
    backups = sorted([d for d in BACKUP_BASE_DIR.iterdir() if d.is_dir()], reverse=True)
    
    if len(backups) <= keep_count:
        print(f"✅ Only {len(backups)} backups exist (keeping {keep_count})")
        return
    
    to_delete = backups[keep_count:]
    print(f"🗑️  Removing {len(to_delete)} old backups...")
    
    for backup in to_delete:
        shutil.rmtree(backup)
        print(f"   Deleted: {backup.name}")
    
    print(f"✅ Cleanup complete. Kept {keep_count} most recent backups.")

if __name__ == "__main__":
    import argparse
    import time
    
    # interactive menu if no arguments provided
    if len(sys.argv) == 1:
        while True:
            print("\n" + "="*40)
            print("    Workitt Backup Manager")
            print("="*40)
            print("1. Create New Backup")
            print("2. List Available Backups")
            print("3. Restore From Backup")
            print("4. Cleanup Old Backups")
            print("0. Exit")
            print("="*40)
            
            try:
                choice = input("\nEnter choice [0-4]: ").strip()
                
                if choice == "1":
                    create_backup()
                    input("\nPress Enter to continue...")
                elif choice == "2":
                    list_backups()
                    input("\nPress Enter to continue...")
                elif choice == "3":
                    list_backups()
                    backup_name = input("\nEnter backup directory name to restore (or Press Enter to cancel): ").strip()
                    if backup_name:
                        restore_backup(backup_name)
                    input("\nPress Enter to continue...")
                elif choice == "4":
                    try:
                        keep = int(input("How many recent backups to keep? [default: 10]: ").strip() or "10")
                        cleanup_old_backups(keep)
                    except ValueError:
                        print("Invalid number.")
                    input("\nPress Enter to continue...")
                elif choice == "0":
                    print("\nGoodbye!")
                    sys.exit(0)
                else:
                    print("\nInvalid choice. Please try again.")
            except KeyboardInterrupt:
                print("\n\nExiting...")
                sys.exit(0)
    
    # Command line arguments logic (preserved)
    parser = argparse.ArgumentParser(description="Workitt Backup Utility")
    parser.add_argument("action", choices=["create", "list", "restore", "cleanup"], nargs="?",
                       help="Action to perform")
    parser.add_argument("--backup", help="Backup name for restore action")
    parser.add_argument("--keep", type=int, default=10, 
                       help="Number of backups to keep (for cleanup)")
    
    args = parser.parse_args()
    
    if args.action == "create":
        create_backup()
    elif args.action == "list":
        list_backups()
    elif args.action == "restore":
        if not args.backup:
            print("❌ Error: --backup required for restore action")
            list_backups()
        else:
            restore_backup(args.backup)
    elif args.action == "cleanup":
        cleanup_old_backups(args.keep)
