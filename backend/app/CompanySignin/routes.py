from . import CompanySignin_bp
from flask import request,jsonify,current_app
from werkzeug.security import check_password_hash
from app.models import companyAuth
from datetime import datetime, timezone, timedelta
import jwt

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
    



