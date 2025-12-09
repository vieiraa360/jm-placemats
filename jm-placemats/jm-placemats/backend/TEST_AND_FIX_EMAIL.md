# Testing API and Fixing Email Issues

## Step 1: Test the API Endpoint

### Using PowerShell (Windows):
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    message = "This is a test message"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/contact' -Method Post -Body $body -ContentType 'application/json'
```

### Using curl (if available):
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"This is a test message\"}"
```

### Expected Response:
```json
{
  "success": true,
  "message": "Contact inquiry submitted successfully",
  "data": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "..."
  }
}
```

## Step 2: Check Server Logs

When you submit the form, check your backend server console. You should see:
- `✅ Contact email sent: <message-id>` (if email works)
- `❌ Error sending email: ...` (if email fails)

## Step 3: Troubleshoot Email Issues

### Issue 1: Email Not Sending - Check .env Configuration

1. **Open `backend/.env` file**
2. **Verify email settings:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@jmplacemats.com
   EMAIL_TO=contact@jmplacemats.com
   ```

### Issue 2: Gmail App Password Not Working

**Common problems:**
- Using regular Gmail password instead of App Password
- App Password not generated correctly
- 2FA not enabled

**Fix:**
1. Go to: https://myaccount.google.com/apppasswords
2. Make sure 2FA is enabled
3. Generate a new App Password for "Mail"
4. Copy the 16-character password (no spaces)
5. Update `EMAIL_PASS` in `.env`
6. Restart server

### Issue 3: Email Goes to Spam

- Check spam/junk folder
- Verify `EMAIL_FROM` and `EMAIL_TO` are correct
- For production, use a proper email service (SendGrid, Mailgun)

### Issue 4: Email Error in Logs

**Check the error message:**
- `EAUTH` = Authentication failed (wrong password)
- `ETIMEDOUT` = Connection timeout (firewall/network)
- `ECONNREFUSED` = Can't connect to SMTP server

## Step 4: Test Email Directly

Create a test email script to verify email configuration:

```javascript
// test-email.js
import dotenv from 'dotenv';
import { sendContactEmail } from './src/config/email.js';

dotenv.config();

const testEmail = async () => {
  try {
    const result = await sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test email'
    });
    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
};

testEmail();
```

Run: `node test-email.js`

## Step 5: Verify Frontend Connection

1. **Start frontend:**
   ```bash
   npm run dev
   ```
   (Should run on http://localhost:3001)

2. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```
   (Should run on http://localhost:3000)

3. **Test in browser:**
   - Go to http://localhost:3001/contact
   - Fill out the form
   - Submit
   - Check browser console (F12) for errors
   - Check backend console for logs

## Step 6: Check CORS

If you see CORS errors in browser console:

1. **Verify `FRONTEND_URL` in `.env`:**
   ```env
   FRONTEND_URL=http://localhost:3001
   ```

2. **Restart backend server**

## Common Solutions

| Problem | Solution |
|---------|----------|
| API returns 404 | Check backend is running on port 3000 |
| CORS error | Verify FRONTEND_URL in .env matches frontend URL |
| Email not sending | Check EMAIL_USER and EMAIL_PASS in .env |
| Email auth error | Use Gmail App Password, not regular password |
| Form submits but no email | Check backend logs for email errors |
| Data not saving | Check MongoDB connection |

## Next Steps

1. ✅ Test API endpoint
2. ✅ Check server logs when submitting form
3. ✅ Verify email configuration in .env
4. ✅ Test email sending directly
5. ✅ Test form in browser
6. ✅ Check MongoDB for saved data

