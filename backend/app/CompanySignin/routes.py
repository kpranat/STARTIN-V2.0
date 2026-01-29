from . import CompanySignin_bp
from flask import request,jsonify,current_app
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import companyAuth, passwordResetToken
from datetime import datetime, timezone, timedelta
import jwt
from app.extensions import db

#login route=========================================================
@CompanySignin_bp.route("/auth/CompanyLogin",methods = ['POST'])
def StudentSignin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    university_id = data.get("universityId")
    
    #check if university ID is provided
    if not university_id:
        return jsonify({"success": False, "message": "University ID required. Please select university again."}),400
    
    #getting user by email AND university ID
    user = companyAuth.query.filter_by(email=email, universityid=university_id).first()
    
    #check if user exist in this university
    if not user:
        return jsonify({"success": False, "message": "Email not registered in this university"}),400
    
    #check if password is correct
    if not check_password_hash(user.password, password):
        return jsonify({"success": False, "message": "Incorrect Password"}),401
    #setup jwt token
    token = jwt.encode(
        {
            "email": email,
            "universityId": user.universityid,
            "exp": datetime.now(timezone.utc) + timedelta(
                minutes=current_app.config["JWT_EXP_MINUTES"]
            )
        },
        current_app.config["JWT_SECRET"],
        algorithm="HS256"
    )
    #token
    return jsonify({
        "success": True,
        "message": "Login Successful",
        "token": token,
        "company_id": user.id,
        "university_id": user.universityid
    }), 200

#forgot password - request reset token=========================================
@CompanySignin_bp.route("/auth/CompanyRequestPasswordReset", methods=['POST'])
def request_password_reset():
    data = request.get_json()
    email = data.get("email")
    university_id = data.get("universityId")
    
    if not email or not university_id:
        return jsonify({"success": False, "message": "Email and university ID are required"}), 400
    
    # Check if user exists
    user = companyAuth.query.filter_by(email=email, universityid=university_id).first()
    if not user:
        # Return success even if user doesn't exist (security best practice)
        return jsonify({
            "success": True, 
            "message": "If an account exists with this email, a password reset token has been sent"
        }), 200
    
    # Delete any existing unused tokens for this user
    passwordResetToken.query.filter_by(
        email=email, 
        user_type='company',
        universityid=university_id,
        used=False
    ).delete()
    db.session.commit()
    
    # Create new reset token
    reset_token = passwordResetToken(email=email, user_type='company', universityid=university_id)
    db.session.add(reset_token)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "Password reset token generated",
        "token": reset_token.token,
        "expiresIn": 3600  # 1 hour in seconds
    }), 200

#verify reset token=========================================
@CompanySignin_bp.route("/auth/CompanyVerifyResetToken", methods=['POST'])
def verify_reset_token():
    data = request.get_json()
    token = data.get("token")
    
    if not token:
        return jsonify({"success": False, "message": "Token is required"}), 400
    
    # Find the token
    reset_token = passwordResetToken.query.filter_by(
        token=token, 
        user_type='company',
        used=False
    ).first()
    
    if not reset_token:
        return jsonify({"success": False, "message": "Invalid or expired token"}), 400
    
    # Check if token has expired - handle both timezone-aware and naive datetimes
    current_time = datetime.now(timezone.utc)
    expires_at = reset_token.expires_at
    # If expires_at is timezone-naive, make it aware
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if current_time > expires_at:
        return jsonify({"success": False, "message": "Token has expired"}), 400
    
    return jsonify({
        "success": True,
        "message": "Token is valid",
        "email": reset_token.email
    }), 200

#reset password=========================================
@CompanySignin_bp.route("/auth/CompanyResetPassword", methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("newPassword")
    
    if not token or not new_password:
        return jsonify({"success": False, "message": "Token and new password are required"}), 400
    
    if len(new_password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters long"}), 400
    
    # Find the token
    reset_token = passwordResetToken.query.filter_by(
        token=token, 
        user_type='company',
        used=False
    ).first()
    
    if not reset_token:
        return jsonify({"success": False, "message": "Invalid or expired token"}), 400
    
    # Check if token has expired - handle both timezone-aware and naive datetimes
    current_time = datetime.now(timezone.utc)
    expires_at = reset_token.expires_at
    # If expires_at is timezone-naive, make it aware
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if current_time > expires_at:
        return jsonify({"success": False, "message": "Token has expired"}), 400
    
    # Find the user
    user = companyAuth.query.filter_by(
        email=reset_token.email, 
        universityid=reset_token.universityid
    ).first()
    
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    # Update password
    user.password = generate_password_hash(new_password)
    
    # Mark token as used
    reset_token.used = True
    
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "Password has been reset successfully"
    }), 200



