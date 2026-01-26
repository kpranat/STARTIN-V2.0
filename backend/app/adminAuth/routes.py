from . import adminAuth_bp
from flask import request,jsonify,current_app
from werkzeug.security import check_password_hash
from app.models import adminAuth, studentAuth, StudentProfile, universitytable, JobDetails, CompanyProfile
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

#get all students route=========================================================
@adminAuth_bp.route("/students",methods = ['GET'])
def getStudents():
    try:
        # Join studentAuth with StudentProfile and universitytable to get all student details
        students = studentAuth.query.join(
            universitytable, studentAuth.universityid == universitytable.id
        ).outerjoin(
            StudentProfile, studentAuth.id == StudentProfile.id
        ).with_entities(
            studentAuth.id,
            studentAuth.mailId,
            StudentProfile.fullName,
            universitytable.universityName,
            studentAuth.universityid
        ).all()
        
        # Format the results
        students_list = []
        for student in students:
            students_list.append({
                "id": student.id,
                "email": student.mailId,
                "name": student.fullName if student.fullName else "Profile Not Created",
                "universityName": student.universityName,
                "universityId": student.universityid
            })
        
        return jsonify({
            "success": True,
            "students": students_list
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching students: {str(e)}"
        }), 500

#get all job postings route=========================================================
@adminAuth_bp.route("/api/admin/jobs",methods = ['GET'])
def getJobs():
    try:
        # Join JobDetails with CompanyProfile and universitytable to get all job details
        jobs = JobDetails.query.join(
            CompanyProfile, JobDetails.companyid == CompanyProfile.id
        ).join(
            universitytable, JobDetails.universityid == universitytable.id
        ).with_entities(
            JobDetails.id,
            JobDetails.title,
            JobDetails.type,
            JobDetails.salary,
            JobDetails.description,
            JobDetails.requirements,
            JobDetails.enddate,
            CompanyProfile.name.label('companyName'),
            CompanyProfile.id.label('companyId'),
            universitytable.universityName,
            universitytable.id.label('universityId')
        ).all()
        
        # Format the results
        jobs_list = []
        current_date = datetime.now(timezone.utc)
        
        for job in jobs:
            # Determine if job is active or inactive based on end date
            status = "active" if job.enddate > current_date else "inactive"
            
            jobs_list.append({
                "id": job.id,
                "title": job.title,
                "type": job.type,
                "salary": job.salary,
                "description": job.description,
                "requirements": job.requirements,
                "enddate": job.enddate.isoformat(),
                "companyName": job.companyName,
                "companyId": job.companyId,
                "universityName": job.universityName,
                "universityId": job.universityId,
                "status": status
            })
        
        return jsonify({
            "success": True,
            "jobs": jobs_list
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching jobs: {str(e)}"
        }), 500