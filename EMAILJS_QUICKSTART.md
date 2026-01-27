# EmailJS Environment Configuration Template

## Quick Setup Checklist

- [ ] Created EmailJS account
- [ ] Added email service (Gmail/Outlook/etc.)
- [ ] Created email template with OTP variables
- [ ] Obtained Service ID
- [ ] Obtained Template ID
- [ ] Obtained Public Key
- [ ] Updated emailService.ts with credentials
- [ ] Tested student signup
- [ ] Tested company signup
- [ ] Tested resend OTP

## Configuration File Location

Update this file: `frontend/src/services/emailService.ts`

## Replace These Values

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID',      // Replace with actual Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',    // Replace with actual Template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',      // Replace with actual Public Key
};
```

## Email Template Variables

Your EmailJS template should include these variables:

- `{{to_email}}` - Recipient's email address
- `{{to_name}}` - User's name (or "User" for company)
- `{{otp_code}}` - The 6-digit OTP code
- `{{validity}}` - Time validity ("10 minutes")
- `{{message}}` - Additional message text

## Example Template (Copy to EmailJS)

**Subject**: Your OTP Code for STARTIN

**Body**:
```
Hello {{to_name}},

Your OTP code for STARTIN is: {{otp_code}}

This code is valid for {{validity}}.

If you didn't request this code, please ignore this email.

Best regards,
STARTIN Team
```

## Testing Commands

### 1. Start Backend Server
```bash
cd backend
python run.py
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```

### 3. Test Signup Flow
1. Navigate to student or company signup
2. Fill in the form
3. Submit and check email
4. Enter OTP received
5. Verify successful registration

## Common Issues

### Issue: Email not received
**Solution**: 
- Check spam folder
- Verify EmailJS service is active
- Check browser console for errors
- Verify credentials in emailService.ts

### Issue: "Failed to send OTP email"
**Solution**:
- Check EmailJS credentials
- Ensure template is published
- Check EmailJS dashboard for errors
- Verify free tier limit not exceeded

### Issue: OTP verification fails
**Solution**:
- OTP might be expired (10 min limit)
- Check if OTP in email matches entered OTP
- Verify backend is running
- Check backend logs for errors

## EmailJS Dashboard Links

- Dashboard: https://dashboard.emailjs.com/
- Services: https://dashboard.emailjs.com/admin
- Templates: https://dashboard.emailjs.com/admin/templates
- Usage: https://dashboard.emailjs.com/admin/usage

## Environment Variables (Production - Optional)

Create `.env` in frontend folder:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Then update `emailService.ts`:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
};
```

## Rate Limits

- **Free Tier**: 200 emails/month
- **Cooldown**: 10 minutes between resends per user
- **OTP Validity**: 10 minutes

## Support Resources

- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- Full Guide: See EMAILJS_OTP_SETUP.md

---

**Note**: Keep your EmailJS credentials secure. Do not commit them to public repositories.
