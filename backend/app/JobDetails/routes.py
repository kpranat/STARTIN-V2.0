from flask import request,jsonify
from app.models import db,JobDetails,CompanyProfile,JobApplication,StudentProfile
from . import JobDetails_bp
from datetime import datetime

#=================== set job details from the company side ===========================================
@JobDetails_bp.route("/set/JobDetails",methods =['POST'])
def setJobDetails():
    data = request.get_json()
    companyid = data.get("companyid")
    title = data.get("title")
    type = data.get("type")
    salary = data.get("salary")
    description = data.get("description")
    requirements = data.get("requirements")
    enddate_str = data.get("enddate")

    if companyid:
        if title and type and salary and description and requirements and enddate_str:
            try:
                enddate = datetime.fromisoformat(enddate_str.replace('Z', '+00:00'))
            except ValueError:
                return jsonify({"success": False, "message": "Invalid enddate format"}), 400
            
            current_date = datetime.now()
            if enddate > current_date:
                JobData = JobDetails(title=title, type=type, salary=salary, description=description, requirements=requirements, enddate=enddate, companyid=companyid)
                db.session.add(JobData)
                db.session.commit() 
                return jsonify({"success": True, "message": "Added Job"}), 200
            else:
                return jsonify({"success": False, "message": "enddate cannot be a previous date or current date"}), 400 
        else:
            return jsonify({"success": False, "message": "All details are required"}), 400 
    else:
        return jsonify({"success": False, "message": "Authentication Error. Login Again"}), 404

#=============================== show job details on the student side =========================================    
@JobDetails_bp.route("/get/JobDetails",methods = ['POST','GET'])
def getJobDetails():
    jobs = JobDetails.query.all()
    job_list = []
    current_date = datetime.now()
    for jobs_details in jobs:
        companyquery = CompanyProfile.query.filter_by(id=jobs_details.companyid).first()
        if companyquery:
            companyname = companyquery.name
            if jobs_details.enddate > current_date:
                job_data = {
                    "id": jobs_details.id,
                    "title": jobs_details.title,
                    "type": jobs_details.type,
                    "salary": jobs_details.salary,
                    "description": jobs_details.description,
                    "requirements": jobs_details.requirements,
                    "enddate": jobs_details.enddate.isoformat(),
                    "companyname": companyname,
                    "companyid":jobs_details.companyid
                }
                job_list.append(job_data)
    
    if job_list:
        return jsonify({"success": True, "message": "Retrieved Data", "data": job_list}), 200
    else:
        return jsonify({"success": True, "message": "No New Job Openings. Keep Checking!!", "data": []}), 200
    
#===================================== show previuos job of the company =============================
@JobDetails_bp.route("/get/CompanyJobs", methods=['POST'])
def getCompanyJobs():
    data = request.get_json()
    company_id = data.get("company_id")
    
    if not company_id:
        return jsonify({"success": False, "message": "Company ID is required"}), 400
    
    jobs = JobDetails.query.filter_by(companyid=company_id).all()
    
    jobs_data = []
    current_date = datetime.now()
    for job in jobs:
        status = "Active" if job.enddate > current_date else "Closed"
        job_info = {
            "id": job.id,
            "title": job.title,
            "type": job.type,
            "salary": job.salary,
            "description": job.description,
            "requirements": job.requirements,
            "enddate": job.enddate.isoformat(),
            "status": status
        }
        jobs_data.append(job_info)
    
    return jsonify({"success": True, "message": "Jobs retrieved", "data": jobs_data}), 200

#==================================== handle applicants ============================================
@JobDetails_bp.route("/get/applicants",methods = ['POST'])
def showApplicants():
    data = request.get_json()
    studentid = data.get("studentid")
    if not studentid:
        return jsonify({"success": False, "message": "Authentication Error. Login Again"}), 404
    companyid = data.get("companyid")
    jobid = data.get("jobid")
    if not companyid or not jobid:
        return jsonify({"success": False, "message": "Cant Access Details. Try Again Later"}), 400
    
    # Check if student has already applied to this job
    existing_application = JobApplication.query.filter_by(studentid=studentid, jobid=jobid).first()
    if existing_application:
        return jsonify({"success": False, "message": "You have already applied to this job"}), 400
    
    JobApplicationData = JobApplication(jobid = jobid,studentid = studentid,companyid=companyid)
    db.session.add(JobApplicationData)
    db.session.commit()
    return jsonify({"success": True, "message": "Your application was successful"}),200

#========================= get student's applied jobs =========================================
@JobDetails_bp.route("/get/student/appliedJobs", methods=['POST'])
def getStudentAppliedJobs():
    data = request.get_json()
    studentid = data.get("studentid")
    
    if not studentid:
        return jsonify({"success": False, "message": "Student ID is required"}), 400
    
    # Get all job IDs that the student has applied to
    applications = JobApplication.query.filter_by(studentid=studentid).all()
    applied_job_ids = [app.jobid for app in applications]
    
    return jsonify({"success": True, "message": "Retrieved applied jobs", "data": applied_job_ids}), 200

#========================= retrieve job application company ===================================
@JobDetails_bp.route("/set/jobApplicantData/companyportal",methods =['POST','GET'])
def setJobApplicantStatus():
    data = request.get_json()
    companyid = data.get("compnayid")
    
    if not companyid:
        return jsonify({"success": False, "message": "Company ID is required"}), 400
    
    # Get all applications for this company
    applicant_applications = JobApplication.query.filter_by(companyid=companyid).all()
    
    if not applicant_applications:
        return jsonify({"success": True, "message": "No applicants found", "data": []}), 200
    
    applicants_list = []
    
    for application in applicant_applications:
        studentid = application.studentid
        
        # Get student profile
        student_profile = StudentProfile.query.filter_by(id=studentid).first()
        
        if student_profile:
            # Get job details
            job = JobDetails.query.filter_by(id=application.jobid).first()
            
            student_data = {
                "studentid": studentid,
                "name": student_profile.fullName,
                "about": student_profile.about,
                "skills": student_profile.skills,
                "github": student_profile.github,
                "linkedin": student_profile.linkedin,
                "resumename": "resume",
                "resumepath": student_profile.resume,
                "status": application.status,
                "jobid": application.jobid,
                "jobtitle": job.title if job else "N/A",
                "applicationid": application.id
            }
            applicants_list.append(student_data)
    
    return jsonify({"success": True, "message": "Data Retrieved Successfully", "data": applicants_list}), 200

#========================= update application status ===================================
@JobDetails_bp.route("/update/applicationStatus", methods=['POST'])
def updateApplicationStatus():
    data = request.get_json()
    application_id = data.get("application_id")
    new_status = data.get("status")
    
    if not application_id:
        return jsonify({"success": False, "message": "Application ID is required"}), 400
    
    if not new_status:
        return jsonify({"success": False, "message": "Status is required"}), 400
    
    # Validate status
    valid_statuses = ["pending", "rejected", "interview scheduled"]
    if new_status not in valid_statuses:
        return jsonify({"success": False, "message": "Invalid status. Must be one of: pending, rejected, interview scheduled"}), 400
    
    # Find and update the application
    application = JobApplication.query.filter_by(id=application_id).first()
    
    if not application:
        return jsonify({"success": False, "message": "Application not found"}), 404
    
    application.status = new_status
    db.session.commit()
    
    return jsonify({"success": True, "message": f"Application status updated to {new_status}"}), 200
        









    

        
    


    
