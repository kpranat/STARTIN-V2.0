from . import StudentSignup_bp
from flask import request
from app.models import db

@StudentSignup_bp.route("/auth/StudentSignup",methods = ['POST','GET'])
def StudentSignUp():
    if request.method == 'POST':
        


    return