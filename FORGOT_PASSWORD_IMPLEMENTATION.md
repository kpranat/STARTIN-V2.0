# Forgot Password Implementation Guide

This document describes the complete forgot password functionality for both students and companies in the STARTIN-V2 application.

## Overview

The forgot password feature allows users (both students and companies) to reset their passwords through a secure token-based system. The process involves:

1. Requesting a password reset (generates a secure token)
2. Verifying the token (sent via email)
3. Setting a new password

## Backend Implementation

### Database Model

A new `passwordResetToken` model has been added to `backend/app/models.py`:

```python
class passwordResetToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(100), nullable=False, unique=True)
    user_type = db.Column(db.String(20), nullable=False)  # 'student' or 'company'
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False, nullable=False)
    universityid = db.Column(db.Integer, db.ForeignKey("universitytable.id"), nullable=False)
```

**Features:**
- Tokens are generated using `secrets.token_urlsafe(32)` for security
- Tokens expire after 1 hour
- Tokens can only be used once (marked as `used=True` after successful reset)
- Tokens are university-specific for multi-tenancy support

### API Endpoints

#### Student Endpoints

**1. Request Password Reset**
- **URL:** `/auth/StudentRequestPasswordReset`
- **Method:** POST
- **Body:**
  ```json
  {
    "email": "student@example.com",
    "universityId": "1"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password reset token generated",
    "token": "secure-token-string",
    "expiresIn": 3600
  }
  ```

**2. Verify Reset Token**
- **URL:** `/auth/StudentVerifyResetToken`
- **Method:** POST
- **Body:**
  ```json
  {
    "token": "secure-token-string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Token is valid",
    "email": "student@example.com"
  }
  ```

**3. Reset Password**
- **URL:** `/auth/StudentResetPassword`
- **Method:** POST
- **Body:**
  ```json
  {
    "token": "secure-token-string",
    "newPassword": "newPassword123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password has been reset successfully"
  }
  ```

#### Company Endpoints

Same structure as student endpoints, with different URLs:
- `/auth/CompanyRequestPasswordReset`
- `/auth/CompanyVerifyResetToken`
- `/auth/CompanyResetPassword`

### Security Features

1. **Secure Token Generation:** Uses cryptographically secure random tokens
2. **Token Expiration:** Tokens automatically expire after 1 hour
3. **One-Time Use:** Tokens are marked as used and cannot be reused
4. **Email Obfuscation:** Success message returned even if email doesn't exist (prevents user enumeration)
5. **Password Hashing:** Passwords are hashed using Werkzeug's `generate_password_hash`
6. **University Context:** All operations are scoped to a specific university

## Frontend Implementation

### New Components

**1. StudentForgotPassword Component**
- **Location:** `frontend/src/pages/StudentForgotPassword.tsx`
- **Route:** `/student/forgot-password`
- **Features:**
  - Three-step wizard: Email → Token → New Password
  - Email validation and error handling
  - Token verification
  - Password strength validation
  - Success/error messages
  - Navigation back to login

**2. CompanyForgotPassword Component**
- **Location:** `frontend/src/pages/CompanyForgotPassword.tsx`
- **Route:** `/company/forgot-password`
- **Features:** Same as student component with company-specific styling

### API Integration

Added password reset action types to `frontend/src/services/api.ts`:

```typescript
// Student password reset
case 'student_request_reset':
case 'student_verify_reset_token':
case 'student_reset_password':

// Company password reset
case 'company_request_reset':
case 'company_verify_reset_token':
case 'company_reset_password':
```

### Email Service

Added `sendPasswordResetEmail` function to `frontend/src/services/emailService.ts`:

```typescript
export const sendPasswordResetEmail = async (
  toEmail: string,
  resetToken: string,
  userType: 'student' | 'company',
  userName?: string
): Promise<void>
```

**Note:** You'll need to create a separate EmailJS template for password reset emails or modify the existing template to handle both OTP and password reset scenarios.

### Login Page Updates

Both login pages now include "Forgot Password?" links:
- **Student Login:** Links to `/student/forgot-password`
- **Company Login:** Links to `/company/forgot-password`

## User Flow

### Step 1: Request Password Reset

1. User clicks "Forgot Password?" on login page
2. User enters their email address
3. System generates a secure token and stores it in database
4. Token is sent to user's email (via EmailJS)
5. User receives email with reset token

### Step 2: Verify Token

1. User enters the token from their email
2. System verifies the token is valid and not expired
3. If valid, user proceeds to password reset step

### Step 3: Reset Password

1. User enters new password (twice for confirmation)
2. System validates password meets minimum requirements (6+ characters)
3. Password is hashed and stored
4. Token is marked as used
5. User is redirected to login page

## Setup Instructions

### Backend Setup

1. **Run Database Migration:**
   ```bash
   cd backend
   flask db migrate -m "Add password reset token table"
   flask db upgrade
   ```

   Or if not using migrations, the table will be created automatically when you run the app.

2. **No additional backend configuration needed** - the routes are already added to the signin blueprints.

### Frontend Setup

1. **Install Dependencies:** (if not already installed)
   ```bash
   cd frontend
   npm install
   ```

2. **Configure EmailJS:**
   - Create a password reset email template in EmailJS
   - Or modify your existing OTP template to support password reset
   - Template variables needed:
     - `to_email`: Recipient email
     - `to_name`: User name
     - `reset_token`: The password reset token
     - `user_type`: 'Student' or 'Company'
     - `expiry_time`: Token expiry time

3. **Routes are already configured** in `App.tsx`

## Testing the Feature

### Test Scenario 1: Successful Password Reset

1. Navigate to student/company login page
2. Click "Forgot Password?"
3. Enter a valid email address registered in the system
4. Copy the token from the success message or email
5. Enter the token in the verification step
6. Set a new password
7. Verify you can log in with the new password

### Test Scenario 2: Invalid Email

1. Enter an email that doesn't exist
2. System should still show success message (security feature)
3. No token should be generated in the database

### Test Scenario 3: Expired Token

1. Request a password reset
2. Wait for 1 hour (or modify expiry time in code for testing)
3. Try to use the token
4. System should reject with "Token has expired" message

### Test Scenario 4: Token Reuse

1. Successfully reset password using a token
2. Try to use the same token again
3. System should reject with "Invalid or expired token" message

## Database Queries for Debugging

### Check all password reset tokens:
```sql
SELECT * FROM password_reset_token;
```

### Check tokens for a specific user:
```sql
SELECT * FROM password_reset_token 
WHERE email = 'user@example.com' 
ORDER BY created_at DESC;
```

### Clean up expired tokens:
```sql
DELETE FROM password_reset_token 
WHERE expires_at < NOW();
```

### Clean up used tokens:
```sql
DELETE FROM password_reset_token 
WHERE used = TRUE;
```

## Email Template Example

Here's a sample EmailJS template for password reset:

```
Subject: Reset Your Password - STARTIN

Hello {{to_name}},

You requested to reset your password for your {{user_type}} account.

Your password reset token is:

{{reset_token}}

This token will expire in {{expiry_time}}.

To reset your password:
1. Return to the password reset page
2. Enter this token
3. Create your new password

If you didn't request this password reset, please ignore this email.

Best regards,
STARTIN Team
```

## Security Considerations

1. **Token Storage:** Tokens are stored in the database and should be kept secure
2. **HTTPS:** Always use HTTPS in production to prevent token interception
3. **Rate Limiting:** Consider adding rate limiting to prevent abuse
4. **Email Security:** Ensure EmailJS credentials are kept secure and not committed to version control
5. **Token Cleanup:** Consider adding a cron job to clean up expired tokens periodically

## Future Enhancements

1. **Rate Limiting:** Add request limits per user/IP
2. **Email Templates:** Create dedicated password reset email template
3. **SMS Integration:** Add SMS option for token delivery
4. **Password History:** Prevent reuse of recent passwords
5. **Token Cleanup Job:** Automated cleanup of expired/used tokens
6. **Account Lockout:** Lock account after multiple failed reset attempts

## Troubleshooting

### Issue: Email not received
- Check EmailJS configuration
- Verify email service is active
- Check spam folder
- Ensure email address is correct

### Issue: Token invalid immediately
- Check server time is synchronized
- Verify timezone settings in code
- Check token generation process

### Issue: Database error
- Ensure migrations have been run
- Verify database connection
- Check table structure matches model

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
