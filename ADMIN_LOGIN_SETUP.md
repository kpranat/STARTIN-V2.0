# Admin Login Setup Documentation

## Overview
The admin login system has been successfully integrated into the STARTIN-V2 application. This allows administrators to access a dedicated dashboard for managing the platform.

## Features Implemented

### 1. Admin Login Page
- **Location**: `frontend/src/pages/admin/AdminLogin.tsx`
- **Route**: `/admin/login`
- **Features**:
  - Email and password authentication
  - Error handling with user-friendly messages
  - Loading states during authentication
  - Redirect animation on successful login
  - Back button to return to role selection

### 2. Admin Dashboard
- **Location**: `frontend/src/pages/admin/AdminDashboard.tsx`
- **Route**: `/admin/dashboard`
- **Features**:
  - Welcome screen with admin ID display
  - Logout functionality
  - Dashboard cards for future features:
    - Manage Students
    - Manage Companies
    - Job Postings
    - Analytics
  - Protected route (requires authentication)

### 3. Backend Integration
- **Endpoint**: `/auth/AdminLogin`
- **File**: `backend/app/adminAuth/routes.py`
- **Fixed**: Corrected the route path from `/auth/StudentLogin` to `/auth/AdminLogin`

### 4. Authentication Utilities
- **File**: `frontend/src/utils/auth.ts`
- **Added Functions**:
  - `setAdminId(adminId)` - Store admin ID in session storage
  - `getAdminId()` - Retrieve admin ID from session storage
  - Updated `removeToken()` to clear admin data

### 5. API Service
- **File**: `frontend/src/services/api.ts`
- **Added**: `admin_login` action type to `connectToBackend` function

### 6. Navigation Updates
- **Landing Page**: Added "Admin Login" link at the bottom
- **App Routes**: Added admin login and dashboard routes

## How to Use

### Accessing Admin Login
1. Navigate to the application
2. Select your university
3. On the role selection page, click "Admin Login" at the bottom
4. Or directly access: `http://localhost:5173/admin/login`

### Login Credentials
Use the credentials set up in your backend database through `settingAdminPassword.py`.

### After Login
- Successfully logged-in admins are redirected to `/admin/dashboard`
- Admin ID is stored in session storage
- JWT token is stored in localStorage as `adminToken`

## File Structure
```
frontend/src/
├── pages/
│   ├── admin/
│   │   ├── AdminLogin.tsx       (NEW)
│   │   └── AdminDashboard.tsx   (NEW)
│   └── Landing.tsx              (UPDATED)
├── services/
│   └── api.ts                   (UPDATED)
├── utils/
│   └── auth.ts                  (UPDATED)
└── App.tsx                      (UPDATED)

backend/app/
└── adminAuth/
    └── routes.py                (FIXED)
```

## Security Features
- JWT token-based authentication
- Session storage for tokens (clears on tab close)
- Protected routes that check for valid tokens
- Automatic logout on token expiration

## Next Steps (Future Enhancements)
1. Implement actual functionality for dashboard cards:
   - Student management interface
   - Company management interface
   - Job posting moderation
   - Analytics and reporting
2. Add admin profile management
3. Implement role-based access control
4. Add activity logs and audit trails
5. Create admin-specific API endpoints

## Testing
To test the admin login:
1. Ensure backend is running on `http://127.0.0.1:5000`
2. Ensure frontend is running on `http://localhost:5173`
3. Navigate to `/admin/login`
4. Use valid admin credentials
5. Verify redirect to dashboard
6. Test logout functionality

## Color Scheme
- Admin theme color: `#dc2626` (Red - distinguishes from student blue and company teal)
- Dashboard cards use various colors for different sections

## Notes
- The admin dashboard is currently a placeholder with UI structure
- Backend admin authentication is already implemented
- Session storage is used for better security (clears on browser close)
- All admin routes are prefixed with `/admin/`
