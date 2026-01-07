from .extensions import db
from datetime import datetime, timedelta, timezone

#================================= Student Auth Table ========================================
class studentAuth(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    mailId = db.Column(db.String(100),nullable = False)
    password = db.Column(db.String(500),nullable=False)
#=============================== OTP Verification Table (for both) ===========================    
class otpVerification(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    otp = db.Column(db.String(6), nullable=False)
    email = db.Column(db.String(255),nullable = False)
    expires_at = db.Column(db.DateTime, nullable=False)
    #validate OTP for 10min then invalidate it
    def __init__(self, email, otp):
        self.email = email
        self.otp = otp
        self.expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
#============================= Company Auth Table ======================================
class companyAuth(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    email =db.Column(db.String(255),nullable = False)
    password = db.Column(db.String(255),nullable = False)
