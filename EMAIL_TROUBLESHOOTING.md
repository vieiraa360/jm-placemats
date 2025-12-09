# Email Troubleshooting Guide

## Quick Diagnostic Steps

### 1. Check Environment Variables

Run this to verify your .env file:
```bash
cd backend
node check-env.js
```

### 2. Test Email Directly

Run the email test script:
```bash
cd backend
node test-email-direct.js
```

This will:
- Show all email configuration
- Test SMTP connection
- Send a test email
- Show detailed error messages if it fails

### 3. Test via API

If your backend is running, test via the API:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

## Common Issues & Solutions

### Issue: "EAUTH" Error (Authentication Failed)

**Symptoms:**
- Error code: `EAUTH`
- Message: "Invalid login" or "Authentication failed"

**Solutions:**

1. **For Gmail - Use App Password:**
   - ❌ Don't use your regular Gmail password
   - ✅ Use an App Password instead
   
   **Steps:**
   1. Go to: https://myaccount.google.com/security
   2. Enable 2-Factor Authentication (if not already enabled)
   3. Go to: https://myaccount.google.com/apppasswords
   4. Select "Mail" → "Other (Custom name)"
   5. Enter: "JM Placemats Backend"
   6. Click "Generate"
   7. Copy the 16-character password (no spaces)
   8. Use it in `.env`:
      ```env
      EMAIL_PASS=abcdefghijklmnop
      ```

2. **Check for spaces in password:**
   - App passwords should NOT have spaces
   - Remove all spaces from the password

3. **Verify email address:**
   - Make sure `EMAIL_USER` is your full email address
   - Example: `your-email@gmail.com` (not just `your-email`)

### Issue: "ECONNECTION" or "ETIMEDOUT" Error

**Symptoms:**
- Error code: `ECONNECTION` or `ETIMEDOUT`
- Message: "Connection timeout" or "Connection refused"

**Solutions:**

1. **Check SMTP settings:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   ```

2. **For Gmail, use these exact settings:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   ```

3. **Check firewall/network:**
   - Make sure port 587 is not blocked
   - Try from a different network

### Issue: Emails Sent But Not Received

**Solutions:**

1. **Check spam folder** - Emails might be filtered

2. **Check EMAIL_TO setting:**
   ```env
   EMAIL_TO=contact@jmplacemats.com
   ```
   Make sure this is the correct email address

3. **Verify sender address:**
   ```env
   EMAIL_FROM=noreply@jmplacemats.com
   ```
   Some email providers reject emails if `EMAIL_FROM` doesn't match `EMAIL_USER`

4. **For Gmail:**
   - If sending to a different domain, Gmail might mark it as spam
   - Try sending to the same Gmail account first to test

### Issue: "Less Secure App Access" Error

**This is deprecated!** Gmail no longer supports "Less Secure App Access".

**Solution:**
- You MUST use App Passwords (see "EAUTH" section above)
- Enable 2-Factor Authentication first

## Email Provider Specific Settings

### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

### ProtonMail (Requires Bridge)
```env
EMAIL_HOST=127.0.0.1
EMAIL_PORT=1025
EMAIL_SECURE=false
EMAIL_USER=your-email@proton.me
EMAIL_PASS=your-bridge-password
```
Download Bridge: https://proton.me/mail/bridge

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### SendGrid (Recommended for Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
```

## Verification Checklist

Before testing, make sure:

- [ ] `.env` file exists in `backend/` directory
- [ ] `EMAIL_USER` is set (full email address)
- [ ] `EMAIL_PASS` is set (App Password for Gmail)
- [ ] `EMAIL_HOST` is correct for your provider
- [ ] `EMAIL_PORT` is correct (587 for most providers)
- [ ] `EMAIL_SECURE` is `false` for port 587
- [ ] Backend server is restarted after changing `.env`
- [ ] 2FA is enabled (for Gmail App Passwords)

## Testing Steps

1. **Check configuration:**
   ```bash
   cd backend
   node check-env.js
   ```

2. **Test SMTP connection:**
   ```bash
   node test-email-direct.js
   ```

3. **Check backend logs:**
   When you start the server, you should see:
   ```
   ✅ Email server is ready to send messages
   ```

4. **Test via contact form:**
   - Submit the contact form on your website
   - Check backend logs for email sending status
   - Check the recipient's inbox (and spam folder)

## Still Not Working?

1. **Check backend logs** - Look for detailed error messages
2. **Run diagnostic scripts** - They show exactly what's wrong
3. **Try a different email provider** - SendGrid or Mailgun are more reliable
4. **Check email provider status** - Some providers have outages
5. **Verify .env file** - Make sure there are no typos or extra spaces

## Getting Help

If you're still having issues, provide:
1. Output from `node check-env.js`
2. Output from `node test-email-direct.js`
3. Backend server logs when trying to send email
4. Error message from the API test
