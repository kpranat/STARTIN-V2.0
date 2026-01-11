# Testing Guide - Company Profile Setup

## Prerequisites
1. Backend server running on `http://127.0.0.1:5000`
2. Frontend server running
3. Database properly configured

## Test Scenarios

### Scenario 1: New Company Registration
**Steps:**
1. Navigate to company signup page
2. Enter company details (name, email, password)
3. Submit the form
4. Enter the OTP received
5. Submit OTP verification

**Expected Result:**
- Company account created in database
- JWT token and company_id stored in session
- Redirected to `/company/profile-check`
- CompanyProfileCheck detects no profile
- Redirected to `/company/profile-setup`
- Profile setup form displayed

### Scenario 2: Complete Profile Setup
**Steps:**
1. Fill in all required fields:
   - Company Name
   - Website (e.g., https://example.com)
   - Location (e.g., New York, USA)
   - About (company description)
2. Click "Create Profile"

**Expected Result:**
- Profile saved to database with company_id
- Success message displayed
- After 1.5 seconds, redirected to `/company/home`
- Profile displayed in view mode

### Scenario 3: Returning Company Login
**Steps:**
1. Navigate to company login page
2. Enter credentials of a company that already has a profile
3. Submit login

**Expected Result:**
- JWT token and company_id stored in session
- Redirected to `/company/profile-check`
- CompanyProfileCheck detects existing profile
- Redirected to `/company/home` (dashboard)
- Profile displayed in view mode

### Scenario 4: Edit Existing Profile
**Steps:**
1. Login as a company with existing profile
2. On the profile page, click "Edit Profile" button
3. Modify any fields
4. Click "Save Changes"

**Expected Result:**
- Profile updated in database
- Success message displayed
- Form switches back to view mode
- Updated information displayed

### Scenario 5: Cancel Edit
**Steps:**
1. Login as a company with existing profile
2. Click "Edit Profile"
3. Make some changes
4. Click "Cancel" button

**Expected Result:**
- No changes saved to database
- Form switches back to view mode
- Original profile information displayed

## API Endpoint Testing

### Test 1: Check Profile (No Profile)
```bash
curl -X POST http://127.0.0.1:5000/check/CompanyProfile \
  -H "Content-Type: application/json" \
  -d '{"company_id": 1}'
```

**Expected Response:**
```json
{
  "success": true,
  "hasProfile": false
}
```

### Test 2: Setup Profile
```bash
curl -X POST http://127.0.0.1:5000/setup/CompanyProfile \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "name": "Test Company",
    "website": "https://test.com",
    "location": "Test City",
    "about": "Test description"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile Created Successfully"
}
```

### Test 3: Check Profile (Profile Exists)
```bash
curl -X POST http://127.0.0.1:5000/check/CompanyProfile \
  -H "Content-Type: application/json" \
  -d '{"company_id": 1}'
```

**Expected Response:**
```json
{
  "success": true,
  "hasProfile": true,
  "profile": {
    "name": "Test Company",
    "website": "https://test.com",
    "location": "Test City",
    "about": "Test description"
  }
}
```

### Test 4: Update Profile
```bash
curl -X POST http://127.0.0.1:5000/update/CompanyProfile \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "name": "Updated Company",
    "website": "https://updated.com",
    "location": "Updated City",
    "about": "Updated description"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile Updated Successfully"
}
```

## Error Cases to Test

### Error 1: Profile Setup Without Company ID
**Test:**
Submit profile setup form without company_id in session storage

**Expected:**
Error message: "Company ID not found. Please login again."

### Error 2: Duplicate Profile Setup
**Test:**
Try to setup profile for a company that already has one

**Expected:**
Backend returns 400 error: "Profile Already Setup"

### Error 3: Update Non-Existent Profile
**Test:**
Try to update profile for a company_id that doesn't have a profile

**Expected:**
Backend returns 404 error: "Profile not found"

### Error 4: Missing Required Fields
**Test:**
Submit profile form with empty fields

**Expected:**
Browser validation prevents submission (HTML5 required attribute)
If bypassed, backend returns 400: "All details are required"

## Browser Console Checks

After login/signup, check sessionStorage:
```javascript
console.log('Token:', sessionStorage.getItem('jwt_token'));
console.log('Company ID:', sessionStorage.getItem('company_id'));
```

## Database Verification

After profile setup, check database:
```sql
SELECT * FROM company_profile WHERE id = 1;
```

Should see:
- id = company_id
- name, website, location, about fields populated

## Common Issues & Solutions

**Issue:** "Company ID not found" error
**Solution:** Check if backend is returning company_id in login/signup response

**Issue:** Profile not loading on edit
**Solution:** Check browser console for API errors, verify company_id in session storage

**Issue:** Redirecting to login instead of profile
**Solution:** Verify JWT token is valid and not expired

**Issue:** "Profile not found" on update
**Solution:** Ensure profile was created successfully in database

## Success Criteria
✅ New companies can complete profile setup
✅ Companies with profiles go directly to dashboard
✅ Profile edit works correctly
✅ Cancel button doesn't save changes
✅ All validation works properly
✅ Error messages display correctly
✅ Navigation flow is smooth
✅ Company ID is properly stored and retrieved
