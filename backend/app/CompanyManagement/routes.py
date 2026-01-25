from . import CompanyManagement_bp
from flask import request, jsonify
from app.models import companyVerification, companyAuth, CompanyProfile, db
import pandas as pd
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
import secrets

# In-memory store for plain passkeys (only for current session)
plain_passkeys = {}

# Get all companies from verification table
@CompanyManagement_bp.route("/admin/companies/verification", methods=['GET'])
def get_verification_companies():
    try:
        companies = companyVerification.query.all()
        companies_list = [{
            'passkey': plain_passkeys.get(company.passkey, company.passkey),  # Show plain if available
            'hashedPasskey': company.passkey,  # Keep hashed version for operations
            'mailId': company.mailId,
            'name': company.name,
            'registered': False  # Default to not registered
        } for company in companies]
        
        # Check which companies are registered
        for company in companies_list:
            registered = companyAuth.query.filter_by(email=company['mailId']).first()
            if registered:
                company['registered'] = True
                # Get company profile if exists
                profile = CompanyProfile.query.filter_by(id=registered.id).first()
                if profile:
                    company['profileComplete'] = True
                else:
                    company['profileComplete'] = False
        
        return jsonify({
            "success": True,
            "companies": companies_list
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching companies: {str(e)}"
        }), 500

# Get registered companies
@CompanyManagement_bp.route("/admin/companies/registered", methods=['GET'])
def get_registered_companies():
    try:
        # Join companyAuth with CompanyProfile to get full company details
        registered = db.session.query(
            companyAuth.id,
            companyAuth.email,
            companyAuth.universityid,
            CompanyProfile.name,
            CompanyProfile.website,
            CompanyProfile.location,
            CompanyProfile.about
        ).outerjoin(
            CompanyProfile, companyAuth.id == CompanyProfile.id
        ).all()
        
        companies_list = [{
            'id': company.id,
            'email': company.email,
            'universityId': company.universityid,
            'name': company.name if company.name else 'Profile Not Complete',
            'website': company.website if company.website else '',
            'location': company.location if company.location else '',
            'about': company.about if company.about else '',
            'profileComplete': bool(company.name)
        } for company in registered]
        
        return jsonify({
            "success": True,
            "companies": companies_list
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching registered companies: {str(e)}"
        }), 500

# Add company manually
@CompanyManagement_bp.route("/admin/companies/add", methods=['POST'])
def add_company_manual():
    try:
        data = request.get_json()
        passkey = data.get('passkey')
        mailId = data.get('mailId')
        name = data.get('name')
        
        if not all([passkey, mailId, name]):
            return jsonify({
                "success": False,
                "message": "All fields (passkey, mailId, name) are required"
            }), 400
        
        # Check if passkey already exists (check all hashed passkeys)
        all_companies = companyVerification.query.all()
        for company in all_companies:
            if check_password_hash(company.passkey, passkey):
                return jsonify({
                    "success": False,
                    "message": "Company with this passkey already exists"
                }), 400
        
        # Hash the passkey and add new company
        hashed_passkey = generate_password_hash(passkey)
        new_company = companyVerification(
            passkey=hashed_passkey,
            mailId=mailId,
            name=name
        )
        db.session.add(new_company)
        db.session.commit()
        
        # Store plain passkey temporarily for display
        plain_passkeys[hashed_passkey] = passkey
        # Store plain passkey temporarily for display
        plain_passkeys[hashed_passkey] = passkey
        
        return jsonify({
            "success": True,
            "message": "Company added successfully",
            "company": {
                "passkey": passkey,  # Return plain passkey for display
                "hashedPasskey": hashed_passkey,  # Return hashed version for operations
                "mailId": mailId,
                "name": name,
                "registered": False
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error adding company: {str(e)}"
        }), 500

# Upload companies via CSV/Excel
@CompanyManagement_bp.route("/admin/companies/upload", methods=['POST'])
def upload_companies():
    try:
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "message": "No file provided"
            }), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                "success": False,
                "message": "No file selected"
            }), 400
        
        # Read the file based on extension
        filename = secure_filename(file.filename)
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file)
        else:
            return jsonify({
                "success": False,
                "message": "Invalid file format. Only CSV and Excel files are allowed"
            }), 400
        
        # Validate required columns
        required_columns = ['passkey', 'mailId', 'name']
        if not all(col in df.columns for col in required_columns):
            return jsonify({
                "success": False,
                "message": f"File must contain columns: {', '.join(required_columns)}"
            }), 400
        
        added = 0
        updated = 0
        errors = []
        added_companies = []  # Track newly added companies with plain passkeys
        
        for index, row in df.iterrows():
            try:
                passkey = str(row['passkey']).strip()
                mailId = str(row['mailId']).strip()
                name = str(row['name']).strip()
                
                if not passkey or not mailId or not name:
                    errors.append(f"Row {index + 2}: Missing required fields")
                    continue
                
                # Check if company exists (check all hashed passkeys)
                all_companies = companyVerification.query.all()
                existing = None
                for company in all_companies:
                    if check_password_hash(company.passkey, passkey):
                        existing = company
                        break
                
                if existing:
                    # Update existing company
                    existing.mailId = mailId
                    existing.name = name
                    updated += 1
                else:
                    # Hash the passkey and add new company
                    hashed_passkey = generate_password_hash(passkey)
                    new_company = companyVerification(
                        passkey=hashed_passkey,
                        mailId=mailId,
                        name=name
                    )
                    db.session.add(new_company)
                    added += 1
                    # Store plain passkey temporarily
                    plain_passkeys[hashed_passkey] = passkey
                    # Store plain passkey for display in response
                    added_companies.append({
                        "passkey": passkey,
                        "hashedPasskey": hashed_passkey,
                        "mailId": mailId,
                        "name": name
                    })
                    
            except Exception as e:
                errors.append(f"Row {index + 2}: {str(e)}")
        
        db.session.commit()
        
        message = f"Successfully added {added} and updated {updated} companies"
        if errors:
            message += f". {len(errors)} errors occurred"
        
        return jsonify({
            "success": True,
            "message": message,
            "added": added,
            "updated": updated,
            "errors": errors,
            "addedCompanies": added_companies  # Return companies with plain passkeys
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error uploading file: {str(e)}"
        }), 500

# Delete company from verification table and all related records
@CompanyManagement_bp.route("/admin/companies/<hashedPasskey>", methods=['DELETE'])
def delete_company(hashedPasskey):
    try:
        # Find company in verification table by hashed passkey
        company_verification = companyVerification.query.filter_by(passkey=hashedPasskey).first()
        
        if not company_verification:
            return jsonify({
                "success": False,
                "message": "Company not found in verification table"
            }), 404
        
        # Remove from plain passkeys cache if exists
        if hashedPasskey in plain_passkeys:
            del plain_passkeys[hashedPasskey]
        
        # Find the registered company auth record by email
        company_auth = companyAuth.query.filter_by(email=company_verification.mailId).first()
        
        if company_auth:
            # Find company profile
            company_profile = CompanyProfile.query.filter_by(id=company_auth.id).first()
            
            if company_profile:
                # Import JobApplication and JobDetails models
                from app.models import JobApplication, JobDetails
                
                # Delete all job applications for this company's jobs
                JobApplication.query.filter_by(companyid=company_profile.id).delete()
                
                # Delete all job details posted by this company
                JobDetails.query.filter_by(companyid=company_profile.id).delete()
                
                # Delete company profile
                db.session.delete(company_profile)
            
            # Delete company auth record
            db.session.delete(company_auth)
        
        # Delete from verification table
        db.session.delete(company_verification)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Company and all related records deleted successfully"
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error deleting company: {str(e)}"
        }), 500

# Generate passkey
@CompanyManagement_bp.route("/admin/companies/generate-passkey", methods=['GET'])
def generate_passkey():
    try:
        # Generate a unique passkey
        passkey = secrets.token_urlsafe(16)
        return jsonify({
            "success": True,
            "passkey": passkey
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error generating passkey: {str(e)}"
        }), 500
