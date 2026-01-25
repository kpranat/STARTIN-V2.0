# Resend OTP Implementation Guide

## Overview
This document describes the implementation of the resend OTP feature for both student and company signup processes. The feature includes a 10-minute cooldown period before users can request a new OTP.

## Database Changes

### Model Update: `otpVerification`
Added a new field to track when the OTP was created:

```python
created_at = db.Column(db.DateTime, nullable=False)
```

### Database Migration Required
After deploying these changes, you need to update the database schema:

**Option 1: Using Flask-Migrate (Recommended)**
```bash
cd backend
.vnv/Scripts/activate  # On Windows
# source .vnv/bin/activate  # On Linux/Mac

flask db migrate -m "Add created_at to otpVerification"
flask db upgrade
```

**Option 2: Manual Migration (If Flask-Migrate is not set up)**
```sql
ALTER TABLE otp_verification ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

## Backend Changes

### 1. Student Signup Routes (`backend/app/StudentSignup/routes.py`)
- Added new endpoint: `/auth/ResendOTP` (POST)
- Validates 10-minute cooldown before sending new OTP
- Returns remaining seconds if cooldown not expired

### 2. Company Signup Routes (`backend/app/CompanySignup/routes.py`)
- Added new endpoint: `/auth/CompanyResendOTP` (POST)
- Same logic as student resend with company-specific route

## Frontend Changes

### 1. API Service (`frontend/src/services/api.ts`)
Added two new action types:
- `resend_otp` - For student OTP resend
- `company_resend_otp` - For company OTP resend

### 2. Student Signup (`frontend/src/pages/StudentSignup.tsx`)
Added features:
- 10-minute countdown timer
- Resend button (enabled after countdown)
- Error handling for cooldown period
- Success messages for resend actions

### 3. Company Signup (`frontend/src/pages/CompanySignup.tsx`)
Same features as student signup with company-specific styling

## How It Works

### User Flow:
1. User enters signup details and receives OTP
2. Timer starts counting down from 10 minutes
3. If OTP is not received or expired:
   - Wait for 10-minute countdown
   - Click "Resend OTP" button when enabled
   - New OTP is generated and sent
   - Timer resets to 10 minutes

### Backend Logic:
1. When resend is requested:
   - Check if OTP record exists
   - Calculate time elapsed since `created_at`
   - If < 10 minutes: Return error with remaining seconds
   - If ≥ 10 minutes: Generate new OTP, update timestamps, send email

### Frontend Logic:
1. Timer decrements every second
2. When timer reaches 0: Enable resend button
3. On resend click: Call backend API
4. If successful: Reset timer and show success message
5. If too early: Display remaining time from backend response

## API Endpoints

### Student Resend OTP
```
POST /auth/ResendOTP
Content-Type: application/json

{
  "email": "student@example.com",
  "universityId": 1
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "New OTP sent successfully"
}
```

**Too Early Response (429):**
```json
{
  "error": "Please wait before requesting a new OTP",
  "remainingSeconds": 300
}
```

### Company Resend OTP
```
POST /auth/CompanyResendOTP
Content-Type: application/json

{
  "email": "company@example.com",
  "universityId": 1
}
```

Same response format as student resend.

## Testing

### Test Cases:
1. **Initial Signup**: Verify OTP is sent and timer starts
2. **Early Resend**: Try resending before 10 minutes - should show countdown
3. **After Cooldown**: Resend after 10 minutes - should work successfully
4. **Multiple Resends**: Each resend should reset the 10-minute timer
5. **Invalid Email**: Resend with non-existent email should return 404
6. **OTP Verification**: New OTP should work for verification

### Manual Testing Steps:
1. Start backend server: `cd backend && .vnv/Scripts/activate && python run.py`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to signup page
4. Fill in details and submit
5. On OTP screen, observe countdown timer
6. Try clicking resend before 10 minutes (should be disabled/show countdown)
7. Wait for timer or manually test with shorter cooldown for testing

## Configuration

### Cooldown Period
Currently set to 10 minutes. To change:

**Backend** (`routes.py`):
```python
if time_elapsed < timedelta(minutes=10):  # Change this value
    # ...
```

**Frontend** (Component state):
```typescript
const [remainingTime, setRemainingTime] = useState(600);  // 10 * 60 seconds
```

## Security Considerations

1. **Rate Limiting**: 10-minute cooldown prevents OTP spam
2. **Existing OTP**: Old OTP is replaced, not accumulated
3. **Email Validation**: Only existing signup emails can request resend
4. **University Scoping**: OTP tied to specific university
5. **Expiration**: New OTP still expires after 10 minutes

## Troubleshooting

### Issue: Timer not working
- Check browser console for JavaScript errors
- Verify useEffect dependencies

### Issue: 429 error on resend
- This is expected - user must wait for cooldown
- Display the `remainingSeconds` to the user

### Issue: Database error
- Ensure migration was run successfully
- Check `created_at` column exists in `otp_verification` table

### Issue: OTP not received
- Check email server configuration
- Verify email in backend logs
- Test email functionality separately

## Future Enhancements

1. **SMS OTP**: Add mobile number option
2. **Configurable Cooldown**: Admin panel to adjust cooldown
3. **Attempt Limiting**: Max resend attempts per email/day
4. **Email Templates**: Rich HTML email templates
5. **Analytics**: Track OTP success/failure rates
