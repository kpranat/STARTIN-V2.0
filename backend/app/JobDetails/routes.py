from flask import request,jsonify
from app.models import db,JobDetails,CompanyProfile,JobApplication
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









    

        
    


    
