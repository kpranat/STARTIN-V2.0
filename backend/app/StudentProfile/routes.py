from . import StudentProfile_bp
from flask import request, jsonify
from app.models import StudentProfile, db, studentAuth
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'uploads/resumes'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@StudentProfile_bp.route("/check/StudentProfile", methods=['POST', 'GET', 'OPTIONS'])
def CheckStudentProfile():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    student_id = data.get("student_id")
    
    if not student_id:
        return jsonify({"success": False, "message": "Student ID required"}), 400
        
    profile = StudentProfile.query.filter_by(id=student_id).first()
    if profile:
        return jsonify({
            "success": True, 
            "hasProfile": True,
            "profile": {
                "fullName": profile.fullName,
                "about": profile.about,
                "skills": profile.skills,
                "github": profile.github,
                "linkedin": profile.linkedin,
                "resume": profile.resume
            }
        }), 200
    else:
        return jsonify({"success": True, "hasProfile": False}), 200


@StudentProfile_bp.route("/setup/StudentProfile", methods=['POST', 'OPTIONS'])
def StudentProfileSetup():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    student_id = request.form.get("student_id")
    fullName = request.form.get("fullName")
    about = request.form.get("about")
    skills = request.form.get("skills")
    github = request.form.get("github")
    linkedin = request.form.get("linkedin")
    
    if not student_id:
        return jsonify({"success": False, "message": "Student ID required"}), 400
        
    # Check if profile already exists
    if StudentProfile.query.filter_by(id=student_id).first():
        return jsonify({"success": False, "message": "Profile Already Setup"}), 400
    
    if not fullName:
        return jsonify({"success": False, "message": "Full name is required"}), 400
    
    # Handle resume upload
    resume_filename = None
    if 'resume' in request.files:
        file = request.files['resume']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add student_id to filename to make it unique
            resume_filename = f"{student_id}_{filename}"
            
            # Create upload directory if it doesn't exist
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file.save(os.path.join(UPLOAD_FOLDER, resume_filename))
    
    StudentProfileData = StudentProfile(
        id=student_id,
        fullName=fullName,
        about=about,
        skills=skills,
        github=github,
        linkedin=linkedin,
        resume=resume_filename
    )
    db.session.add(StudentProfileData)
    db.session.commit()
    return jsonify({"success": True, "message": "Profile Created Successfully"}), 200


@StudentProfile_bp.route("/update/StudentProfile", methods=['POST', 'OPTIONS'])
def StudentProfileUpdate():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    student_id = request.form.get("student_id")
    fullName = request.form.get("fullName")
    about = request.form.get("about")
    skills = request.form.get("skills")
    github = request.form.get("github")
    linkedin = request.form.get("linkedin")
    
    if not student_id:
        return jsonify({"success": False, "message": "Student ID required"}), 400
        
    student_data = StudentProfile.query.filter_by(id=student_id).first()
    
    if not student_data:
        return jsonify({"success": False, "message": "Profile not found"}), 404
        
    if not fullName:
        return jsonify({"success": False, "message": "Full name is required"}), 400
    
    # Update profile fields
    student_data.fullName = fullName
    student_data.about = about
    student_data.skills = skills
    student_data.github = github
    student_data.linkedin = linkedin
    
    # Handle resume upload if new file provided
    if 'resume' in request.files:
        file = request.files['resume']
        if file and file.filename and allowed_file(file.filename):
            # Delete old resume if exists
            if student_data.resume:
                old_file_path = os.path.join(UPLOAD_FOLDER, student_data.resume)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            
            filename = secure_filename(file.filename)
            resume_filename = f"{student_id}_{filename}"
            
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file.save(os.path.join(UPLOAD_FOLDER, resume_filename))
            student_data.resume = resume_filename
    
    db.session.commit()
    return jsonify({"success": True, "message": "Profile Updated Successfully"}), 200
