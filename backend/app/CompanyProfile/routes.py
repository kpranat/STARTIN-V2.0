from . import CompanyProfileSetup_bp
from flask import request,jsonify
from app.models import CompanyProfile,db,companyAuth
import jwt


@CompanyProfileSetup_bp.route("/check/CompanyProfile",methods = ['POST','GET','OPTIONS'])
def CheckCompanyProfile():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    company_id = data.get("company_id")
    
    if not company_id:
        return jsonify({"success": False, "message": "Company ID required"}),400
        
    profile = CompanyProfile.query.filter_by(id = company_id).first()
    if profile:
        return jsonify({
            "success": True, 
            "hasProfile": True,
            "profile": {
                "name": profile.name,
                "website": profile.website,
                "location": profile.location,
                "about": profile.about
            }
        }),200
    else:
        return jsonify({"success": True, "hasProfile": False}),200


@CompanyProfileSetup_bp.route("/setup/CompanyProfile",methods = ['POST','OPTIONS'])
def CompanyProfileSetup():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    company_id = data.get("company_id")
    name= data.get("name")
    website= data.get("website")
    location= data.get("location")
    about= data.get("about")
    
    if not company_id:
        return jsonify({"success": False, "message": "Company ID required"}),400
        
    # Check if profile already exists
    if CompanyProfile.query.filter_by(id = company_id).first():
        return jsonify({"success": False, "message": "Profile Already Setup"}),400
    
    if not name or not website or not location or not about:
        return jsonify({"success": False, "message": "All details are required"}),400
        
    CompanyProfileData = CompanyProfile(id=company_id, name=name, website=website, location=location, about=about)
    db.session.add(CompanyProfileData)
    db.session.commit()
    return jsonify({"success": True, "message": "Profile Created Successfully"}),200

@CompanyProfileSetup_bp.route("/update/CompanyProfile",methods = ['POST','OPTIONS'])
def CompanyProfileUpdate():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    company_id = data.get("company_id")
    name= data.get("name")
    website= data.get("website")
    location= data.get("location")
    about= data.get("about")
    
    if not company_id:
        return jsonify({"success": False, "message": "Company ID required"}),400
        
    company_data = CompanyProfile.query.filter_by(id = company_id).first()
    
    if not company_data:
        return jsonify({"success": False, "message": "Profile not found"}),404
        
    if not name or not website or not location or not about:
        return jsonify({"success": False, "message": "All details are required"}),400
    
    company_data.name = name
    company_data.website = website
    company_data.location = location
    company_data.about = about
    db.session.commit()
    return jsonify({"success": True, "message": "Profile Updated Successfully"}),200




