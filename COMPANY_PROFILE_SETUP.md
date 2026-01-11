# Company Profile Setup Flow - Implementation Summary

## Overview
This document explains the complete flow for company profile setup and editing functionality.

## Flow Diagram

```
Company Login/Signup
        ↓
Store JWT Token + Company ID
        ↓
Navigate to /company/profile-check
        ↓
CompanyProfileCheck Component
        ↓
Check if profile exists (API call)
        ↓
    ┌───────┴───────┐
    ↓               ↓
Profile Exists   No Profile
    ↓               ↓
/company/home   /company/profile-setup
                    ↓
                Setup Profile Form
                    ↓
                Submit Profile
                    ↓
                /company/home
                    
From Dashboard:
Edit Profile Button → /company/profile (edit mode)
```

## Backend Changes

### 1. CompanyProfile Routes (`backend/app/CompanyProfile/routes.py`)

#### New Route: `/check/CompanyProfile` (GET/POST)
- **Purpose**: Check if a company has completed profile setup
- **Request Body**: `{ "company_id": <id> }`
- **Response**: 
  ```json
  {
    "success": true,
    "hasProfile": true/false,
    "profile": { ... } // if profile exists
  }
  ```

#### Updated Route: `/setup/CompanyProfile` (POST)
- **Purpose**: Create a new company profile
- **Request Body**: 
  ```json
  {
    "company_id": <id>,
    "name": "Company Name",
    "website": "https://...",
    "location": "City, Country",
    "about": "Description..."
  }
  ```
- **Changes**: 
  - Fixed to properly link profile to company via `id` foreign key
  - Added proper validation
  - Fixed return messages

#### Updated Route: `/update/CompanyProfile` (POST)
- **Purpose**: Update existing company profile
- **Request Body**: Same as setup
- **Changes**:
  - Fixed typo: `METHODS` → `methods`
  - Fixed query: `.query.filter_by().first()` instead of just `.query.filter_by()`
  - Added proper error handling for missing profile

## Frontend Changes

### 1. Auth Utils (`frontend/src/utils/auth.ts`)

Added new functions to manage company ID:
```typescript
setCompanyId(companyId: string | number): void
getCompanyId(): string | null
```

The company ID is stored in sessionStorage and cleared on logout.

### 2. CompanyLogin (`frontend/src/pages/CompanyLogin.tsx`)

**Changes**:
- Import `setCompanyId` from auth utils
- Store `company_id` from login response
- Navigate to `/company/profile-check` instead of directly to profile

### 3. CompanySignup (`frontend/src/pages/CompanySignup.tsx`)

**Changes**:
- Import `setCompanyId` from auth utils
- Store `company_id` from OTP verification response
- Navigate to `/company/profile-check` instead of directly to profile

### 4. New Component: CompanyProfileCheck (`frontend/src/components/CompanyProfileCheck.tsx`)

**Purpose**: Intelligent routing component that checks profile status

**Logic**:
1. Get company ID from session storage
2. Call `/check/CompanyProfile` API
3. Route based on result:
   - Profile exists → `/company/home` (dashboard)
   - No profile → `/company/profile-setup` (setup form)
   - No company ID → `/company/login` (redirect to login)

### 5. Updated CompanyProfile Page (`frontend/src/pages/company/CompanyProfile.tsx`)

**Major Changes**:
- Supports two modes: **setup** and **edit**
- Mode detection: Based on route pathname (`/company/profile-setup` vs `/company/profile`)
- Backend integration:
  - Loads existing profile from API (edit mode)
  - Submits to `/setup/CompanyProfile` (setup mode)
  - Submits to `/update/CompanyProfile` (edit mode)
- Field name change: `description` → `about` (to match backend)
- Added loading states and error/success messages
- Cancel button in edit mode
- Auto-navigation to home after successful setup

### 6. API Service (`frontend/src/services/api.ts`)

Added new company endpoints:
```typescript
company: {
  checkProfile: (companyId) => POST /check/CompanyProfile
  setupProfile: (data) => POST /setup/CompanyProfile
  updateProfile: (data) => POST /update/CompanyProfile
  // ... existing endpoints
}
```

### 7. App Routes (`frontend/src/App.tsx`)

Added new routes:
```tsx
<Route path="/company/profile-check" element={<CompanyProfileCheck />} />
<Route path="/company/profile-setup" element={<CompanyProfile />} />
<Route path="/company/profile" element={<CompanyProfile />} />
```

## Usage Flow

### For New Companies (Signup):
1. Company signs up → Verifies OTP
2. System stores JWT token + company_id
3. Redirects to `/company/profile-check`
4. CompanyProfileCheck detects no profile
5. Redirects to `/company/profile-setup`
6. Company fills form and submits
7. Profile created in database
8. Redirects to `/company/home` (dashboard)

### For Returning Companies (Login):
1. Company logs in
2. System stores JWT token + company_id
3. Redirects to `/company/profile-check`
4. CompanyProfileCheck detects existing profile
5. Redirects to `/company/home` (dashboard)

### For Profile Editing:
1. Company clicks "Edit Profile" from dashboard
2. Navigates to `/company/profile` (edit mode)
3. Profile data loaded from backend
4. Company makes changes and submits
5. Profile updated in database
6. Returns to view mode

## Security

- **Company ID Verification**: Every API call includes `company_id` to verify ownership
- **JWT Authentication**: All profile operations require valid JWT token
- **Session Storage**: Company ID stored in sessionStorage (cleared on tab close)
- **Backend Validation**: All fields validated before database operations

## Testing Checklist

- [ ] New company signup → should see profile setup form
- [ ] Complete profile setup → should redirect to dashboard
- [ ] Login with existing profile → should go directly to dashboard
- [ ] Click "Edit Profile" → should show profile form with existing data
- [ ] Update profile → should save changes and return to view mode
- [ ] Cancel edit → should return to view mode without saving
- [ ] Login without company_id → should redirect to login
- [ ] All API errors → should display error messages

## Notes

- The `company_id` is the primary key from the `companyAuth` table
- It's also used as the primary key in `CompanyProfile` table (one-to-one relationship)
- The backend already returns `company_id` in both login and signup responses
- Profile fields: `name`, `website`, `location`, `about` (all required)
