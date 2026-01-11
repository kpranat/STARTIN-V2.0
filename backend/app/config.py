import os
from dotenv import load_dotenv

load_dotenv()  # load .env → environment variables

class Config:
    #setup mail
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "your_email@gmail.com")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "your_password")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_USERNAME", "your_email@gmail.com")
    
    #setup jwt token
    JWT_SECRET = os.getenv("JWT_SECRET", "your_jwt_secret")
    JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", 10))