from . import StudentSignup_bp
from flask import request,jsonify,current_app
from app.models import studentAuth,otpVerification,db
import random
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
    universityId = data.get("universityId")
    # Validation==========================================
    if not all([name, email, password, universityId]):
        return jsonify({"success": False, "message": "All fields are required"}), 400     
    #check if mail exist in this university========================================
    existing_mail = studentAuth.query.filter_by(mailId=email, universityid=universityId).first()
    if (existing_mail):
        return jsonify({"success": False, "message": "Email already registered in this university"}),400        
    #mail sending============================================
    otp = str(random.randint(100000, 999999)) #create otp
    # Remove previous OTPs for this email in this university
    otpVerification.query.filter_by(email=email, universityid=universityId).delete()
    db.session.commit()
    
    #add otp in the model (don't create student account yet)===================================
    otp_data = otpVerification(email=email, otp=otp)
    otp_data.universityid = universityId
    db.session.add(otp_data)
    db.session.commit()
    
    # Return OTP to frontend - frontend will send email via EmailJS
    return jsonify({
        "success": True, 
        "message": "OTP generated successfully",
        "otp": otp,
        "email": email
    }), 200

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
        
        # Get university ID from OTP record
        university_id = record.universityid
        
        # OTP is valid → now create the student account============================
        studentAuth_data = studentAuth(
            mailId=email, 
            password=generate_password_hash(password),
            universityid=university_id
        )
        db.session.add(studentAuth_data)
        
        # Delete OTP after successful verification============================
        otpVerification.query.filter_by(email=email).delete()
        db.session.commit()
        
        #setup jwt token
        token = jwt.encode(
            {
                "email": email,
                "universityId": university_id,
                "exp": datetime.now(timezone.utc) + timedelta(
                    minutes=current_app.config["JWT_EXP_MINUTES"]
                )
            },
            current_app.config["JWT_SECRET"],
            algorithm="HS256"
        )

        return jsonify({
            "message": "OTP verified successfully", 
            "token": token,
            "student_id": studentAuth_data.id,
            "university_id": university_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in VerifyOTP: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

#HANDLE RESEND OTP ===========================================================================    
@StudentSignup_bp.route("/auth/ResendOTP",methods = ['POST'])
def ResendOTP():
    try:
        data = request.get_json()
        email = data.get("email")
        university_id = data.get("universityId")
        
        if not all([email, university_id]):
            return jsonify({"error": "Email and university ID are required"}), 400
        
        # Get the existing OTP record
        record = otpVerification.query.filter_by(email=email, universityid=university_id).first()
        
        if not record:
            return jsonify({"error": "No OTP request found. Please signup again."}), 404
        
        # Check if 10 minutes have passed since the OTP was created
        created_at = record.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        
        time_elapsed = datetime.now(timezone.utc) - created_at
        
        if time_elapsed < timedelta(minutes=10):
            # Calculate remaining time
            remaining_seconds = int((timedelta(minutes=10) - time_elapsed).total_seconds())
            return jsonify({
                "error": "Please wait before requesting a new OTP",
                "remainingSeconds": remaining_seconds
            }), 429
        
        # Generate new OTP
        new_otp = str(random.randint(100000, 999999))
        
        # Update the existing record
        record.otp = new_otp
        current_time = datetime.now(timezone.utc)
        record.created_at = current_time
        record.expires_at = current_time + timedelta(minutes=10)
        db.session.commit()
        
        # Return OTP to frontend - frontend will send email via EmailJS
        return jsonify({
            "success": True, 
            "message": "New OTP generated successfully",
            "otp": new_otp,
            "email": email
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in ResendOTP: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
    

