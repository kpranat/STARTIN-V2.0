from flask import Flask,blueprints
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .extensions import db,mail
from .config import Config


def create_app():
    app = Flask(__name__)

    #load config file 
    app.config.from_object(Config)

    # Enable CORS for all routes
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    #sqlite config
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "your_secret_key"

    #initializing the extensions file 
    db.init_app(app)
    mail.init_app(app)

    #blueprints
    from app.StudentSignup import StudentSignup_bp
    app.register_blueprint(StudentSignup_bp)

    from app.StudentSignin import StudentSignin_bp
    app.register_blueprint(StudentSignin_bp)

    from app.CompanySignup import CompanySignup_bp
    app.register_blueprint(CompanySignup_bp)

    from app.CompanySignin import CompanySignin_bp
    app.register_blueprint(CompanySignin_bp)

    # Import models before creating tables
    from . import models
    
    with app.app_context():
        db.create_all()


    return app