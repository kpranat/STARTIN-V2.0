from . import StudentProfile_bp
from flask import request, jsonify
from app.models import StudentProfile, db, studentAuth
from werkzeug.utils import secure_filename
from app.storage_utils import upload_file_to_supabase, delete_file_from_supabase
import os

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@StudentProfile_bp.route("/check/StudentProfile", methods=['POST', 'GET', 'OPTIONS'])
def CheckStudentProfile():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    student_id = data.get("student_id")
    university_id = data.get("universityId")
    
    if not student_id:
        return jsonify({"success": False, "message": "Student ID required"}), 400
    
    if not university_id:
        return jsonify({"success": False, "message": "University ID required"}), 400
        
    profile = StudentProfile.query.filter_by(id=student_id, universityid=university_id).first()
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
    university_id = request.form.get("universityId")
    fullName = request.form.get("fullName")
    about = request.form.get("about")
    skills = request.form.get("skills")
    github = request.form.get("github")
    linkedin = request.form.get("linkedin")
    
    if not student_id:
        return jsonify({"success": False, "message": "Student ID required"}), 400
    
    if not university_id:
        return jsonify({"success": False, "message": "University ID required"}), 400
        
    # Check if profile already exists
    if StudentProfile.query.filter_by(id=student_id, universityid=university_id).first():
        return jsonify({"success": False, "message": "Profile Already Setup"}), 400
    
    if not fullName:
        return jsonify({"success": False, "message": "Full name is required"}), 400
    
    # Handle resume upload
    resume_filename = None
    if 'resume' in request.files:
        file = request.files['resume']
        if file and file.filename and allowed_file(file.filename):
            # Upload to Supabase
            success, result = upload_file_to_supabase(file, 'resumes', student_id)
            if success:
                resume_filename = result  # This is the full path in Supabase
            else:
                return jsonify({"success": False, "message": f"Resume upload failed: {result}"}), 500
    
    StudentProfileData = StudentProfile(
        id=student_id,
        fullName=fullName,
        about=about,
        skills=skills,
        github=github,
        linkedin=linkedin,
        resume=resume_filename,
        universityid=university_id
    )
    db.session.add(StudentProfileData)
    db.session.commit()
    return jsonify({"success": True, "message": "Profile Created Successfully"}), 200


@StudentProfile_bp.route("/update/StudentProfile", methods=['POST', 'OPTIONS'])
def StudentProfileUpdate():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    student_id = request.form.get("student_id")
    university_id = request.form.get("universityId")
    fullName = request.form.get("fullName")
    about = request.form.get("about")
    skills = request.form.get("skills")
    github = request.form.get("github")
    linkedin = request.form.get("linkedin")
    
    if not student_id:
        return jsonify({"success": False, "message": "Student ID required"}), 400
    
    if not university_id:
        return jsonify({"success": False, "message": "University ID required"}), 400
        
    student_data = StudentProfile.query.filter_by(id=student_id, universityid=university_id).first()
    
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
            # Delete old resume from Supabase if exists
            if student_data.resume:
                delete_file_from_supabase(student_data.resume)
            
            # Upload new resume to Supabase
            success, result = upload_file_to_supabase(file, 'resumes', student_id)
            if success:
                student_data.resume = result  # This is the full path in Supabase
            else:
                return jsonify({"success": False, "message": f"Resume upload failed: {result}"}), 500
    
    db.session.commit()
    return jsonify({"success": True, "message": "Profile Updated Successfully"}), 200
