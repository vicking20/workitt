# gunicorn_config.py
import sys
sys.path.insert(0, "libs")
import os
import multiprocessing
import datetime

# PORT
bind = "0.0.0.0:5202"

# PID file
pidfile = "gunicorn.pid"

# Workers
workers = int(os.environ.get("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2 + 1))
#workers = 1
worker_class = "sync"
worker_connections = 1000
timeout = 120
keepalive = 5

# Log directory
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

# Date-based log filenames
date = datetime.datetime.now().strftime("%Y-%m-%d")

accesslog = f"{LOG_DIR}/access_{date}.log"
errorlog  = f"{LOG_DIR}/error_{date}.log"
loglevel = "info"

# Process name
proc_name = "workitt-backend"
