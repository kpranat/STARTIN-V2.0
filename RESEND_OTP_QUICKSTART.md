# Resend OTP Feature - Quick Start Guide

## What Was Added

A resend OTP feature has been added to both **Student** and **Company** signup processes with the following characteristics:

✅ **10-minute countdown timer** before resend button is enabled  
✅ **Automatic OTP expiration** after 10 minutes  
✅ **Backend validation** to prevent OTP spam  
✅ **User-friendly UI** with countdown display  
✅ **Email notifications** for new OTP requests  

---

## Installation Steps

### 1. Apply Database Migration (IMPORTANT - Do this first!)

```bash
cd backend
.vnv\Scripts\activate
python migrate_db.py
```

When prompted, type `yes` to confirm the migration.

**What this does**: Adds a `created_at` column to the `otp_verification` table to track when OTPs are sent.

---

### 2. Install Frontend Dependencies (if needed)

```bash
cd frontend
npm install
```

---

### 3. Start the Application

**Backend:**
```bash
cd backend
.vnv\Scripts\activate
python run.py
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```

---

## How to Use

### For Students:

1. Go to Student Signup page
2. Fill in your details and click "Sign Up"
3. Check your email for the OTP code
4. On the OTP verification screen:
   - Enter the 6-digit OTP
   - See the countdown timer (starts at 10:00)
   - After 10 minutes, "Resend OTP" button becomes clickable
   - Click to receive a new OTP (timer resets)

### For Companies:

Same process as students, but via the Company Signup page.

---

## Files Modified

### Backend:
- ✏️ `backend/app/models.py` - Added `created_at` field
- ✏️ `backend/app/StudentSignup/routes.py` - Added `/auth/ResendOTP` endpoint
- ✏️ `backend/app/CompanySignup/routes.py` - Added `/auth/CompanyResendOTP` endpoint
- ➕ `backend/migrate_db.py` - Database migration script

### Frontend:
- ✏️ `frontend/src/services/api.ts` - Added resend API calls
- ✏️ `frontend/src/pages/StudentSignup.tsx` - Added resend UI and timer
- ✏️ `frontend/src/pages/CompanySignup.tsx` - Added resend UI and timer

### Documentation:
- ➕ `RESEND_OTP_IMPLEMENTATION.md` - Detailed implementation guide
- ➕ `RESEND_OTP_QUICKSTART.md` - This file

---

## Testing the Feature

### Test Scenario 1: Normal Flow
1. Sign up with valid details
2. Wait for OTP email
3. Verify the countdown timer is running
4. Enter OTP and verify account

### Test Scenario 2: Resend Before Cooldown
1. Sign up with valid details
2. Try to click resend before 10 minutes
3. Should see: "Resend OTP available in: X:XX"
4. Button should be disabled/showing countdown

### Test Scenario 3: Resend After Cooldown
1. Sign up with valid details
2. Wait for 10 minutes (or adjust cooldown in code for testing)
3. Click "Resend OTP" button
4. Should receive new OTP email
5. Timer should reset to 10:00

### Test Scenario 4: Using New OTP
1. Request resend OTP
2. Old OTP should not work
3. New OTP should work for verification

---

## Troubleshooting

### ❌ Database Error: "no such column: created_at"
**Solution**: Run the migration script:
```bash
cd backend
.vnv\Scripts\activate
python migrate_db.py
```

### ❌ "Resend OTP" button not appearing
**Solution**: 
- Check that you're on the OTP verification screen (step 2)
- Wait for the 10-minute countdown to complete
- Check browser console for errors

### ❌ Timer not counting down
**Solution**:
- Refresh the page
- Clear browser cache
- Check browser console for JavaScript errors

### ❌ OTP email not received
**Solution**:
- Check spam/junk folder
- Verify email configuration in `backend/app/config.py`
- Check backend console for email errors

### ❌ "Please wait before requesting a new OTP" error
**Solution**: This is expected! The 10-minute cooldown is working correctly. The error message will show how much time is remaining.

---

## Configuration

### Change Cooldown Period

**For Testing** (reduce to 1 minute):

**Backend** - `backend/app/StudentSignup/routes.py` and `backend/app/CompanySignup/routes.py`:
```python
# Line ~119 in both files
if time_elapsed < timedelta(minutes=1):  # Changed from 10 to 1
```

**Frontend** - `frontend/src/pages/StudentSignup.tsx` and `frontend/src/pages/CompanySignup.tsx`:
```typescript
// Near the top of the component
const [remainingTime, setRemainingTime] = useState(60);  // Changed from 600 (10 min) to 60 (1 min)
```

**Remember**: Change it back to 10 minutes for production!

---

## API Reference

### Student Resend OTP
```
POST http://127.0.0.1:5000/auth/ResendOTP
Content-Type: application/json

{
  "email": "student@example.com",
  "universityId": 1
}
```

### Company Resend OTP
```
POST http://127.0.0.1:5000/auth/CompanyResendOTP
Content-Type: application/json

{
  "email": "company@example.com",
  "universityId": 1
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "New OTP sent successfully"
}
```

**Cooldown Active (429)**:
```json
{
  "error": "Please wait before requesting a new OTP",
  "remainingSeconds": 342
}
```

---

## Security Features

1. ✅ **Rate Limiting**: 10-minute cooldown prevents spam
2. ✅ **OTP Replacement**: New OTP invalidates old one
3. ✅ **Expiration**: All OTPs expire after 10 minutes
4. ✅ **University Scoping**: OTPs are tied to specific universities
5. ✅ **Email Validation**: Only registered emails can request resend

---

## Support

For issues or questions:
1. Check the `RESEND_OTP_IMPLEMENTATION.md` for detailed technical information
2. Review error messages in browser console (F12)
3. Check backend logs in the terminal running Flask
4. Verify database migration was applied successfully

---

**Implementation Date**: January 2026  
**Version**: 1.0  
**Status**: ✅ Ready for Testing
