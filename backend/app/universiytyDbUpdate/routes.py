from flask import request, jsonify
from . import universityDbUpdate_bp
from app.models import universitytable
from app.extensions import db
import pandas as pd
import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads/universities'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@universityDbUpdate_bp.route("/api/admin/universities", methods=['GET'])
def get_universities():
    """Get all universities from the database"""
    try:
        universities = universitytable.query.all()
        universities_list = [{
            'id': uni.id,
            'universityName': uni.universityName,
            'passkey': '********'  # Hide hashed passkey for security
        } for uni in universities]
        
        return jsonify({
            'success': True,
            'universities': universities_list,
            'count': len(universities_list)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching universities: {str(e)}'
        }), 500

@universityDbUpdate_bp.route("/api/admin/universities/upload", methods=['POST'])
def upload_universities():
    """Upload CSV or Excel file to update university database"""
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'No file selected'
            }), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'message': 'Invalid file type. Please upload CSV or Excel file'
            }), 400
        
        # Read the file based on extension
        filename = secure_filename(file.filename)
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        try:
            if file_ext == 'csv':
                df = pd.read_csv(file)
            else:  # xlsx or xls
                df = pd.read_excel(file)
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'Error reading file: {str(e)}'
            }), 400
        
        # Validate required columns
        required_columns = ['universityName', 'passkey']
        if not all(col in df.columns for col in required_columns):
            return jsonify({
                'success': False,
                'message': f'File must contain columns: {", ".join(required_columns)}'
            }), 400
        
        # Process the data
        added_count = 0
        updated_count = 0
        errors = []
        
        for index, row in df.iterrows():
            try:
                university_name = str(row['universityName']).strip()
                passkey = str(row['passkey']).strip()
                
                if not university_name or not passkey:
                    errors.append(f"Row {index + 2}: Empty universityName or passkey")
                    continue
                
                # Hash the passkey before storing
                hashed_passkey = generate_password_hash(passkey)
                
                # Check if university already exists by name (since passkey will be hashed)
                existing_uni = universitytable.query.filter_by(universityName=university_name).first()
                
                if existing_uni:
                    # Update existing university with new hashed passkey
                    existing_uni.passkey = hashed_passkey
                    updated_count += 1
                else:
                    # Add new university with hashed passkey
                    new_uni = universitytable(
                        universityName=university_name,
                        passkey=hashed_passkey
                    )
                    db.session.add(new_uni)
                    added_count += 1
                    
            except Exception as e:
                errors.append(f"Row {index + 2}: {str(e)}")
        
        # Commit changes
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Universities updated successfully',
            'added': added_count,
            'updated': updated_count,
            'errors': errors if errors else None
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error processing file: {str(e)}'
        }), 500

@universityDbUpdate_bp.route("/api/admin/universities/<int:university_id>", methods=['DELETE'])
def delete_university(university_id):
    """Delete a university by ID and all related records"""
    try:
        # Import all models that have university relationships
        from app.models import (
            studentAuth, otpVerification, companyAuth, 
            CompanyProfile, StudentProfile, JobDetails, JobApplication
        )
        
        university = universitytable.query.get(university_id)
        
        if not university:
            return jsonify({
                'success': False,
                'message': 'University not found'
            }), 404
        
        # Delete all related records in the correct order (respecting foreign key constraints)
        # 1. Delete job applications first (depends on jobs, students, companies)
        JobApplication.query.filter_by(universityid=university_id).delete()
        
        # 2. Delete job details (depends on companies)
        JobDetails.query.filter_by(universityid=university_id).delete()
        
        # 3. Delete student profiles
        StudentProfile.query.filter_by(universityid=university_id).delete()
        
        # 4. Delete company profiles
        CompanyProfile.query.filter_by(universityid=university_id).delete()
        
        # 5. Delete student authentication records
        studentAuth.query.filter_by(universityid=university_id).delete()
        
        # 6. Delete company authentication records
        companyAuth.query.filter_by(universityid=university_id).delete()
        
        # 7. Delete OTP verification records
        otpVerification.query.filter_by(universityid=university_id).delete()
        
        # 8. Finally, delete the university itself
        db.session.delete(university)
        
        # Commit all deletions
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'University and all related records deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error deleting university: {str(e)}'
        }), 500

@universityDbUpdate_bp.route("/api/universities/verify-passkey", methods=['POST'])
def verify_university_passkey():
    """Verify a university passkey and return university details if valid"""
    try:
        data = request.get_json()
        passkey = data.get('passkey')
        
        if not passkey:
            return jsonify({
                'success': False,
                'message': 'Passkey is required'
            }), 400
        
        # Get all universities and check passkey against each hashed value
        universities = universitytable.query.all()
        
        for university in universities:
            if check_password_hash(university.passkey, passkey):
                return jsonify({
                    'success': True,
                    'message': 'Passkey verified successfully',
                    'university': {
                        'id': university.id,
                        'universityName': university.universityName
                    }
                }), 200
        
        # No match found
        return jsonify({
            'success': False,
            'message': 'Invalid passkey'
        }), 401
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error verifying passkey: {str(e)}'
        }), 500

