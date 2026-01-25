# University Management Feature

## Overview
The Admin Dashboard includes a comprehensive university management system that allows administrators to view existing universities and bulk upload university data via CSV or Excel files. **All university passkeys are securely hashed using industry-standard password hashing before being stored in the database.**

## Security Features

### Passkey Hashing
- All university passkeys are hashed using `werkzeug.security.generate_password_hash()`
- Passkeys are never stored in plain text
- Hashed passkeys use PBKDF2 with SHA-256 by default
- When viewing universities in the admin panel, passkeys are displayed as `********`
- Passkey verification uses `check_password_hash()` to compare against hashed values

## Features

### 1. View Universities
- Display all universities in the database
- Shows university ID, name, and passkey
- Real-time count of total universities

### 2. Upload Universities (Bulk Import)
- Support for CSV and Excel files (.csv, .xlsx, .xls)
- Automatically adds new universities or updates existing ones
- Updates are based on the university name (since passkeys are hashed and can't be compared directly)
- **Passkeys are automatically hashed before storage**
- Plain text passkeys in uploaded files are immediately hashed upon processing

### 3. Delete Universities
- Individual university deletion
- Confirmation prompt before deletion
- Automatic list refresh after deletion

## File Format

### Required Columns
Your CSV or Excel file must contain the following columns:
- `universityName` - The full name of the university
- `passkey` - A unique identifier/code for the university

### Sample CSV Format
```csv
universityName,passkey
"Massachusetts Institute of Technology","MIT2024"
"St

**Note:** The passkeys in your CSV/Excel file should be in plain text. They will be automatically hashed when uploaded to the database.anford University","STANFORD2024"
"Harvard University","HARVARD2024"
```

### Sample Excel Format
| universityName | passkey |
|----------------|---------|
| Massachusetts Institute of Technology | MIT2024 |
| Stanford University | STANFORD2024 |
| Harvard University | HARVARD2024 |

## Usage

### Accessing the Feature
1. Log in to the Admin Dashboard
2. Click on the "Manage Universities" card (🎓 icon)
3. The university management modal will open

### Uploading Universities
1. Click "Choose File" and select your CSV or Excel file
2. Ensure the file has the correct format with required columns
3. Click "Upload File"
4. The system will:
   - Add new universities (if passkey doesn't exist)
   - Update existing universities (if passkey already exists)
   - Display a summary of added/updated records
   - Show any errors encountered during processing

### Deleting Universities
1. In the universities list, find the university you want to delete
2. Click the "Delete" button in the Actions column
3. Confirm the deletion in the popup dialog
4. The university will be removed from the database

## API Endpoints

### Get All Universities
```
GET /api/admin/universities
```
**Response:**
```json
{
  "success": true,
  "universities": ********"
    }
  ],
  "count": 1
}
```
**Note:** Passkeys are returned as `********` for security since they are hashed in the database. }
  ],
  "count": 1
}
```

### Upload Universities File
```
POST /api/admin/universities/upload
Content-Type: multipart/form-data
```
**Request:** File upload with form field name "file"

**Response:**
```json
{
  "success": true,
  "message": "Universities updated successfully",
  "added": 5,
  "updated": 2,
  "errors": null
}
```

### Delete University
```
DELETE /api/admin/universities/{university_id}
```
**Response:**
```json
{
  "

### Verify University Passkey
```
POST /api/universities/verify-passkey
Content-Type: application/json
```
**Request:**
```json
{
  "passkey": "MIT2024"
}
```
**Response (Success):**
```json
{
  "success": true,
  "message": "Passkey verified successfully",
  "university": {
    "id": 1,
    "universityName": "MIT"
  }
}
```
**Response (Invalid):**
```json
{
  "success": false,
  "message": "Invalid passkey"
}
```
**Note:** This endpoint is used during student/company signup to verify a university passkey and retrieve the university details.success": true,
  "message": "University deleted successfully"
}
```

## Error Handling

### Common Errors
1. **No file provided** - No file was selected for upload
2. **Invalid file type** - File format is not CSV or Excel
3. **Missing required columns** - File doesn't contain universityName and/or passkey columns
4. **Empty fields** - Some rows have empty universityName or passkey values
5. **University not found** - Attempting to delete a non-existent university

### Error Messages
The system provides clear error messages for each type of issue:
- File validation errors appear immediately after upload attempt
- Row-specific errors show the row number and issue
- Database errors are logged and displayed to the admin

## Installation & Setup

### Backend Dependencies
The following packages are required (already added to requirements.txt):
```
pandas==2.2.0
openpyxl==3.1.2
```

Install them using:
```bash
cd backend
pip install -r requirements.txt
```
Passkey Hashing**
   - All passkeys are hashed using `werkzeug.security.generate_password_hash()`
   - Uses PBKDF2-SHA256 algorithm with salt
   - Passkeys cannot be decrypted or retrieved in plain text
   - Passkeys are hashed immediately upon processing

3. **Authentication**
2. **
### Frontend
No additional dependencies required. Uses standard React and Axios.
Authentication**
   - Admin token required for all operations
   - Token verified on each request

4. **
## Testing

### Sample Data
A sample CSV file is provided at:
```
backend/sample_universities.csv
```

### Testing Steps
1. Start the backend server:
   ```bash
   cd backend
   python run.py
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Log in to the admin dashboard
4. Click "Manage Universities"
5. Upload the sample CSV file
6. Verify universities are added/updated correctly

## Security Considerations

1. **File Upload Validation**
   - Only CSV and Excel files are accepted
   - File names are sanitized using `secure_filename`
   - File content is validated before processing

2. **Authentication**
   - Admin token required for all operations
   - Token verified on each request

3. **Database Operations**
   - Transactions are used for data consistency
   - Rollback on errors
   - Unique constraints prevent duplicates

## Future Enhancements

Potential improvements for future versions:
- [ ] Batch edit functionality
- [ ] Export universities to CSV/Excel
- [ ] Search and filter universities
- [ ] Pagination for large university lists
- [ ] Import history and audit logs
- [ ] Validation for duplicate university names
- [ ] Bulk delete functionality
- [ ] University statistics and analytics

## Support

For issues or questions:
1. Check the error messages in the UI
2. Review the backend logs for detailed error information
3. Verify file format matches the requirements
4. Ensure all required dependencies are installed
