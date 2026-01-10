import os
from dotenv import load_dotenv

load_dotenv()  # load .env → environment variables

class Config:
    #setup mail
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT"))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_USERNAME")
    
    #setup jwt token
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", 10))