# EmailJS OTP Configuration Guide

## Overview
This guide explains how to configure EmailJS for OTP email sending in the STARTIN application. The OTP system has been refactored to:
- **Backend**: Generate and store OTP, verify OTP
- **Frontend**: Send OTP emails using EmailJS

This approach prevents server crashes on free-tier hosting platforms by moving email sending to the client side.

## Why EmailJS?
- Free tier supports 200 emails/month
- No backend server load for email sending
- Client-side email sending
- Easy template customization
- No additional backend dependencies

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service
1. Navigate to **Email Services** in the EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the provider-specific setup:
   - **Gmail**: Allow less secure apps or use App Password
   - **Outlook**: Use your regular credentials
5. Note down the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Navigate to **Email Templates** in the EmailJS dashboard
2. Click **Create New Template**
3. Use the following template structure:

```
Subject: Your OTP Code for STARTIN

Hello {{to_name}},

Your OTP code for STARTIN is: {{otp_code}}

This code is valid for {{validity}}.

If you didn't request this code, please ignore this email.

Best regards,
STARTIN Team
```

4. Template variables used:
   - `{{to_email}}` - Recipient email
   - `{{to_name}}` - Recipient name
   - `{{otp_code}}` - The 6-digit OTP
   - `{{validity}}` - Time validity (10 minutes)
   - `{{message}}` - Additional message

5. Note down the **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Navigate to **Account** → **General**
2. Find your **Public Key** (e.g., `abc123XYZ`)
3. This is used for client-side authentication

### 5. Configure Frontend

Update the EmailJS configuration in `frontend/src/services/emailService.ts`:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',      // Your Service ID
  TEMPLATE_ID: 'template_xyz789',     // Your Template ID
  PUBLIC_KEY: 'abc123XYZ',            // Your Public Key
};
```

### 6. Initialize EmailJS (Optional)

If you want to initialize EmailJS when the app starts, add this to your `main.tsx`:

```typescript
import { initEmailJS } from './services/emailService';

// Initialize EmailJS
initEmailJS();
```

**Note**: EmailJS initialization is optional as the `send` method can work with the public key passed directly.

## How It Works

### Student Signup Flow
1. User submits signup form
2. Frontend sends request to backend `/auth/StudentSignup`
3. Backend generates OTP and returns it to frontend
4. Frontend sends OTP email using EmailJS
5. User enters OTP
6. Backend verifies OTP at `/auth/VerifyOTP`

### Company Signup Flow
1. User submits signup form with passkey
2. Frontend sends request to backend `/auth/CompanySignup`
3. Backend validates passkey, generates OTP, returns it to frontend
4. Frontend sends OTP email using EmailJS
5. User enters OTP
6. Backend verifies OTP at `/auth/CompanyVerifyOTP`

### Resend OTP Flow
1. User clicks "Resend OTP" (after 10-minute cooldown)
2. Frontend requests new OTP from backend
3. Backend generates new OTP and returns it
4. Frontend sends new OTP email using EmailJS

## Backend Changes

### StudentSignup Route Changes
```python
# Before: Backend sent email
# After: Backend returns OTP to frontend
return jsonify({
    "success": True, 
    "message": "OTP generated successfully",
    "otp": otp,
    "email": email
}), 200
```

### CompanySignup Route Changes
```python
# Before: Backend sent email
# After: Backend returns OTP to frontend
return jsonify({
    "success": True, 
    "message": "OTP generated successfully",
    "otp": otp,
    "email": email
}), 200
```

## Security Considerations

### 1. OTP Exposure
- OTP is transmitted over HTTPS (ensure SSL/TLS in production)
- OTP is only valid for 10 minutes
- OTP is deleted from database after verification
- Each email can only have one active OTP

### 2. Rate Limiting
- 10-minute cooldown between OTP requests
- Backend enforces rate limiting
- Frontend shows countdown timer

### 3. EmailJS Security
- Public key is safe to expose (client-side only)
- EmailJS has rate limiting (200 emails/month free tier)
- Consider upgrading EmailJS plan for production

### 4. Best Practices
- Use environment variables for EmailJS credentials in production
- Never commit credentials to version control
- Monitor EmailJS usage to avoid exceeding limits
- Implement additional backend rate limiting if needed

## Environment Variables (Production)

Create `.env` file in frontend:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123XYZ
```

Update `emailService.ts`:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
```

## Testing

### Test Email Sending
1. Try student signup with a valid email
2. Check email inbox (including spam folder)
3. Verify OTP in email matches format (6 digits)
4. Test OTP verification
5. Test resend OTP after 10 minutes

### Test Error Handling
1. Try signup with invalid email format
2. Test with EmailJS credentials not configured
3. Test with incorrect OTP
4. Test with expired OTP (wait 10+ minutes)

## Troubleshooting

### Email Not Received
1. Check spam/junk folder
2. Verify EmailJS service is connected
3. Check EmailJS dashboard for failed sends
4. Verify email template is published
5. Check browser console for errors

### EmailJS Errors
- **401 Unauthorized**: Check public key
- **404 Not Found**: Verify service/template IDs
- **Rate Limited**: Exceeded free tier limit
- **Template Error**: Check template variables

### Backend Issues
- OTP not generated: Check backend logs
- OTP verification fails: Ensure OTP not expired
- Rate limiting: Wait for cooldown period

## Monitoring

### EmailJS Dashboard
- Monitor email send success rate
- Track monthly usage (200 emails/month free)
- View failed email attempts
- Check service status

### Backend Logs
- OTP generation
- OTP verification attempts
- Rate limiting enforcement
- Database OTP cleanup

## Migration from Old System

The old system used Flask-Mail on the backend. Changes made:

### Removed from Backend
- `flask_mail` import and usage
- `mail.send()` calls
- Email configuration in backend

### Added to Frontend
- `@emailjs/browser` package
- `emailService.ts` utility
- Email sending in signup components

### Database Schema
- No changes required
- OTP table structure remains the same
- Expiry logic remains the same

## Cost Considerations

### Free Tier Limits
- EmailJS: 200 emails/month
- Suitable for small-scale applications
- Monitor usage in EmailJS dashboard

### Paid Tiers
If exceeding limits:
- EmailJS: $15/month for 1000 emails
- Alternative: SendGrid, AWS SES, Mailgun
- Consider implementing queue system

## Future Improvements

1. **Email Queue**: Implement retry logic for failed emails
2. **Templates**: Create multiple templates (welcome, password reset, etc.)
3. **Analytics**: Track email open rates
4. **Localization**: Support multiple languages in templates
5. **Backup Service**: Configure fallback email service

## Support

For issues or questions:
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- STARTIN Issues: Create GitHub issue

## Summary

✅ **Completed Changes**:
- Backend generates OTP, returns to frontend
- Frontend sends emails using EmailJS
- Both student and company signup updated
- Resend OTP functionality updated
- Rate limiting preserved

✅ **Benefits**:
- No backend server load for emails
- Prevents server crashes on free hosting
- Easy to configure and maintain
- Free tier suitable for development/testing

⚠️ **Next Steps**:
1. Create EmailJS account
2. Configure service and template
3. Update `emailService.ts` with credentials
4. Test signup flow end-to-end
5. Monitor usage and adjust as needed
