import os
from supabase import create_client, Client
from werkzeug.utils import secure_filename
from flask import current_app

def get_supabase_client() -> Client:
    """Initialize and return Supabase client"""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
    
    return create_client(url, key)

def upload_file_to_supabase(file, folder: str, filename_prefix: str = ""):
    """
    Upload file to Supabase Storage
    
    Args:
        file: File object from request.files
        folder: Folder path in the bucket (e.g., 'resumes', 'universities')
        filename_prefix: Prefix to add to filename (e.g., student_id)
    
    Returns:
        tuple: (success: bool, file_path: str or error_message: str)
    """
    try:
        supabase = get_supabase_client()
        bucket = os.getenv("SUPABASE_BUCKET", "uploads")
        
        # Secure the filename
        original_filename = secure_filename(file.filename)
        
        # Create unique filename with prefix
        if filename_prefix:
            filename = f"{filename_prefix}_{original_filename}"
        else:
            filename = original_filename
        
        # Create full path in bucket
        file_path = f"{folder}/{filename}"
        
        # Read file content
        file_content = file.read()
        
        # Upload to Supabase (upsert=True will overwrite if exists)
        response = supabase.storage.from_(bucket).upload(
            file_path,
            file_content,
            file_options={"upsert": "true"}
        )
        
        # Return the path that was uploaded
        return True, file_path
        
    except Exception as e:
        return False, str(e)

def delete_file_from_supabase(file_path: str):
    """
    Delete file from Supabase Storage
    
    Args:
        file_path: Full path to file in bucket (e.g., 'resumes/student_123_resume.pdf')
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        supabase = get_supabase_client()
        bucket = os.getenv("SUPABASE_BUCKET", "uploads")
        
        # Delete file
        supabase.storage.from_(bucket).remove([file_path])
        
        return True, "File deleted successfully"
        
    except Exception as e:
        return False, str(e)

def get_file_url_from_supabase(file_path: str):
    """
    Get public URL for a file in Supabase Storage
    
    Args:
        file_path: Full path to file in bucket (e.g., 'resumes/student_123_resume.pdf')
    
    Returns:
        str: Public URL of the file
    """
    try:
        supabase = get_supabase_client()
        bucket = os.getenv("SUPABASE_BUCKET", "uploads")
        
        # Get public URL
        url = supabase.storage.from_(bucket).get_public_url(file_path)
        
        return url
        
    except Exception as e:
        return None
