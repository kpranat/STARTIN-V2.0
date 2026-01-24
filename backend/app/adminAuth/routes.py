from . import adminAuth_bp
from flask import request,jsonify,current_app
from werkzeug.security import check_password_hash
from app.models import adminAuth
from datetime import datetime, timezone, timedelta
import jwt

#login route=========================================================
@adminAuth_bp.route("/auth/AdminLogin",methods = ['POST'])
def AdminSignin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    #getting user email
    user = adminAuth.query.filter_by(mailId = email).first() 
    #check if user exist
    if not user:
        return jsonify({"success": False, "message": "Email Not Registered"}),400
    #check if user exists
    if not check_password_hash(user.password, password):
        return jsonify({"success": False, "message": "Incorrect Password"}),401
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
    #token
    return jsonify({
        "success": True,
        "message": "Login Successful",
        "token": token,
        "admin_id": user.id
    }), 200