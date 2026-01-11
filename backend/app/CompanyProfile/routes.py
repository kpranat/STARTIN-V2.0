from . import CompanyProfileSetup_bp
from flask import request,jsonify
from app.models import CompanyProfile,db,companyAuth
import jwt


@CompanyProfileSetup_bp.route("/setup/CompanyProfile",methods = ['POST','GET'])
def CompanyProfileSetup():
    data = request.get_json()
    name= data.get("name")
    website= data.get("website")
    location= data.get("location")
    about= data.get("about")

    if CompanyProfile.query.filter_by(name = name).first():
        return jsonify({"success": True, "message": "Profile Already Setup"}),200
    else:
        if not name or not website or not location or not about:
            return jsonify({"success": False, "message": "All details are required"}),401
        else:
            CompanyProfileData = CompanyProfile(name = name, website=website,location=location,about=about)
            db.session.add(CompanyProfileData)
            db.session.commit()
            return jsonify({"success": True, "message": "Profile Updated"}),200

@CompanyProfileSetup_bp.route("/update/CompanyProfile",METHODS = ['POST','GET'])
def CompanyProfileUpdate():
    data = request.get_json()
    company_id = data.get("COMPANY_ID")
    name= data.get("name")
    website= data.get("website")
    location= data.get("location")
    about= data.get("about")
    company_data = CompanyProfile.query.filter_by(id = company_id)
    company_data.name = name
    company_data.website = website
    company_data.location = location
    company_data.about = about
    db.session.commit()
    return jsonify({"success": True, "message": "Profile Updated"}),200




