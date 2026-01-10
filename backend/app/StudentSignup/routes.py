from . import StudentSignup_bp
from flask import request,jsonify,current_app
from app.models import studentAuth,otpVerification,db
import random
from app.extensions import mail
from flask_mail import Message
from datetime import datetime, timezone, timedelta
import jwt
from werkzeug.security import generate_password_hash
#HNADLE STUDENT SIGNUP ==========================================================================
@StudentSignup_bp.route("/auth/StudentSignup",methods = ['POST'])
def StudentSignUp():
    data = request.get_json()
    #extract data========================================
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    # Validation==========================================
    if not all([name, email, password]):
        return jsonify({"success": False, "message": "All fields are required"}), 400     
    #check if mail exist or not========================================
    existing_mail = studentAuth.query.filter_by( mailId = email ).first()
    if (existing_mail):
        return jsonify({"success": False, "message": "Email Already registered"}),400        
    #mail sending============================================
    otp = str(random.randint(100000, 999999)) #create otp
    # Remove previous OTPs for this email
    otpVerification.query.filter_by(email=email).delete()
    db.session.commit()
    
    #add otp in the model (don't create student account yet)===================================
    otp_data = otpVerification(email=email, otp=otp)
    db.session.add(otp_data)
    db.session.commit()
    # Send email============================================
    msg = Message("Your OTP Code for STARTIN is", recipients=[email])
    msg.body = f"Your OTP is {otp}. Valid for 10 minutes."
    mail.send(msg)
    return jsonify({"message": "OTP sent successfully"})

#HANDLE OTP VERIFICATION ===========================================================================    
@StudentSignup_bp.route("/auth/VerifyOTP",methods = ['POST'])
def VerifyOTP():
    try:
        data = request.get_json()
        #extract data================================================
        email = data.get("email")
        otp = data.get("otp")
        password = data.get("password")
        
        if not all([email, otp, password]):
            return jsonify({"error": "Email, OTP and password are required"}), 400
        
        #get the OTP record===============================================
        record = otpVerification.query.filter_by(email=email).first()
        #check if record exists========================================
        if not record:
            return jsonify({"error": "OTP not found or expired"}), 404
        #check expiry of otp========================================
        # Make expires_at timezone-aware if it's naive
        expires_at = record.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if datetime.now(timezone.utc) > expires_at:
            otpVerification.query.filter_by(email=email).delete()
            db.session.commit()
            return jsonify({"error": "OTP expired"}), 400
        #check if otp is valid====================================
        if record.otp != otp:
            return jsonify({"error": "Invalid OTP"}), 400    
        
        # OTP is valid → now create the student account============================
        studentAuth_data = studentAuth(mailId=email, password=generate_password_hash(password))
        db.session.add(studentAuth_data)
        
        # Delete OTP after successful verification============================
        otpVerification.query.filter_by(email=email).delete()
        db.session.commit()
        
        #setup jwt token
        token = jwt.encode(
            {
                "email": email,
                "exp": datetime.now(timezone.utc) + timedelta(
                    minutes=current_app.config["JWT_EXP_MINUTES"]
                )
            },
            current_app.config["JWT_SECRET"],
            algorithm="HS256"
        )

        return jsonify({"message": "OTP verified successfully", "token": token}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in VerifyOTP: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
    
    

