# ⚠️ IMMEDIATE ACTION REQUIRED - EmailJS Configuration

## 🔴 What You Need to Do NOW

Before testing the signup functionality, you **MUST** configure EmailJS credentials.

### Step 1: Open Environment File
Open this file: `frontend/.env`

You'll see:
```env
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY
```

### Step 2: Get EmailJS Credentials

#### Option A: Already Have EmailJS Account
1. Go to https://dashboard.emailjs.com/
2. Find your Service ID in "Email Services"
3. Find your Template ID in "Email Templates"
4. Find your Public Key in "Account" → "General"
5. Update the values in `frontend/.env` file

#### Option B: Need to Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" and create account
3. Add email service (choose Gmail, Outlook, etc.)
4. Create email template (see template below)
5. Get Service ID, Template ID, and Public Key
6. Update the values in `frontend/.env` file

### Step 3: Update .env File

Replace the placeholder values in `frontend/.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_abc1234      # Your actual service ID
VITE_EMAILJS_TEMPLATE_ID=template_xyz5678    # Your actual template ID
VITE_EMAILJS_PUBLIC_KEY=user_ABCxyz123456    # Your actual public key
```

### Step 4: EmailJS Template Setup

When creating your email template in EmailJS dashboard, use this:

**Template Subject:**
```
Your OTP Code for STARTIN
```

**Template Body:**
```
Hello {{to_name}},

Your OTP code for STARTIN is: {{otp_code}}

This code is valid for {{validity}}.

If you didn't request this code, please ignore this email.

Best regards,
STARTIN Team
```

**Required Variables:**
- `{{to_email}}` - Auto-filled with recipient email
- `{{to_name}}` - User's name
- `{{otp_code}}` - The 6-digit OTP
- `{{validity}}` - Time period (10 minutes)
- `{{message}}` - Additional text

## ✅ Quick Test After Configuration

### Test Student Signup
1. Start backend: `cd backend && python run.py`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to student signup page
4. Fill in form and submit
5. Check your email for OTP
6. Enter OTP to complete signup

### Test Company Signup
1. Navigate to company signup page
2. Enter passkey (you should have this)
3. Check `frontend/.env` file exists
2. Verify Service ID is correct (no quotes, no extra spaces)
3. Verify Template ID is correct
4. Verify Public Key is correct
5. Restart the frontend dev server (`npm run dev`)
6# 🚨 Common Issues

### "Failed to send OTP email" Error
**Cause**: EmailJS credentials not configured correctly

**Fix**:
1. Double-check Service ID in `emailService.ts`
2. Double-check Template ID in `emailService.ts`
3. Double-check Public Key in `emailService.ts`
4. Make sure there are no extra spaces
5. Ensure email service is connected in EmailJS dashboard

### Email Not Received
**Cause**: Email service not properly configured

**Fix**:
1. Check spam/junk folder
2. Verify email service is connected in EmailJS dashboard
3. Check EmailJS dashboard for failed sends
4. Make sure template is published (not draft)

### "Rate Limited" Error
**Cause**: Exceeded EmailJS free tier (200 emails/month)

**Fix**:
1. Check usage in EmailJS dashboard
2. Wait until next month or upgrade plan
3. Use a differen`.env` file should look like (with YOUR actual values):

```env
VITE_API_URL=https://startin-v2-0.onrender.com/

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc1234
VITE_EMAILJS_TEMPLATE_ID=template_xyz5678
VITE_EMAILJS_PUBLIC_KEY=user_ABCxyz123456
```

**Important**: After updating `.env`, restart your dev server!
##Environment variables are stored in `.env` file
- `.env` file is excluded from Git (in `.gitignore`)
- Never commit real credentials to version control
- Use `.env.example` as a template for others
- Public key is safe to use client-side
- EmailJS automatically handles authentication
```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc1234',      // Your actual service ID
  TEMPLATE_ID: 'template_xyz5678',    // Your actual template ID
  PUBLIC_KEY: 'user_ABCxyz123456',    // Your actual public key
};
```

## 🔐 Security Note

- Public key is safe to use client-side
- Service and Template IDs are also safe to expose
- EmailJS automatically handles authentication
- For production, consider using environment variables

## ⏱️ Estimated Setup Time

- **Have EmailJS account**: 2-5 minutes
- **New EmailJS account**: 10-15 minutes

## 📞 Need Help?

1. EmailJS Documentation: https://www.emailjs.com/docs/
2. EmailJS Support: support@emailjs.com
3. Check other documentation files in this project

---

## Summary of What Changed

✅ **Backend**: Generates OTP but no longer sends emails  
✅ **Frontend**: Now sends emails using EmailJS  
✅ **You Need**: EmailJS account credentials  

**Until you configure EmailJS, signup will not work!**
