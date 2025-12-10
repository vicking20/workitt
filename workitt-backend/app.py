from app import create_app
from app.extensions import db
from app.models import * # Ensure models are loaded

app = create_app()

if __name__ == "__main__":
    # with app.app_context():
    #     # Create tables if they don't exist
    #     db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
