from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from datetime import datetime

db = SQLAlchemy()
login_manager = LoginManager()

def parse_date(d):
    if not d:
        return None
    try:
        return datetime.strptime(d, "%Y-%m-%d").date()
    except ValueError:
        return None
