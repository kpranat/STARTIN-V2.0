import os
from storage3 import create_client as create_storage_client
from werkzeug.utils import secure_filename

def get_storage_client(use_service_key=True):
    """Initialize and return Supabase Storage client"""
    url = os.getenv("SUPABASE_URL")
    
    # Use service key for uploads/deletes to bypass RLS
    if use_service_key:
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not key:
            # Fallback to regular key if service key not available
            key = os.getenv("SUPABASE_KEY")
    else:
        key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
    
    # Create storage client directly
    storage_url = f"{url}/storage/v1"
    headers = {
        "apiKey": key,
        "Authorization": f"Bearer {key}"
    }
    return create_storage_client(storage_url, headers, is_async=False)

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
        # Use service key to bypass RLS for uploads
        storage = get_storage_client(use_service_key=True)
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
        
        # Try to remove existing file first (if it exists)
        try:
            storage.from_(bucket).remove([file_path])
        except:
            pass  # File might not exist, which is fine
        
        # Upload to Supabase Storage
        response = storage.from_(bucket).upload(
            file_path,
            file_content
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
        # Use service key to bypass RLS for deletes
        storage = get_storage_client(use_service_key=True)
        bucket = os.getenv("SUPABASE_BUCKET", "uploads")
        
        # Delete file
        storage.from_(bucket).remove([file_path])
        
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
        # Can use regular key for reading public URLs
        storage = get_storage_client(use_service_key=False)
        bucket = os.getenv("SUPABASE_BUCKET", "uploads")
        
        # Get public URL
        url = storage.from_(bucket).get_public_url(file_path)
        
        return url
        
    except Exception as e:
        return None
