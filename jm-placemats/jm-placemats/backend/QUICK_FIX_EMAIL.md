# Quick Fix: Email Not Sending

## Step 1: Check Your Backend Console

When you submit the contact form, look at your backend server console. You should see one of these:

**✅ If email works:**
```
✅ Contact email sent successfully
✅ Confirmation email sent successfully
```

**❌ If email fails:**
```
❌ Email sending failed, but inquiry saved:
   Error code: EAUTH
   Error message: Invalid login
```

## Step 2: Common Email Issues & Fixes

### Issue 1: "EAUTH" Error (Authentication Failed)

**Problem:** Wrong email password or using regular password instead of App Password

**Fix for Gmail:**
1. Go to: https://myaccount.google.com/apppasswords
2. Make sure 2-Factor Authentication is enabled
3. Generate a new App Password for "Mail"
4. Copy the 16-character password (remove spaces)
5. Update `EMAIL_PASS` in `backend/.env`
6. Restart your server

**Example .env:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop  # 16 characters, no spaces
```

### Issue 2: Email Credentials Not Set

**Check your `.env` file:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@jmplacemats.com
EMAIL_TO=your-email@gmail.com  # Where you want to receive inquiries
```

### Issue 3: Test Email Configuration

Run this test script:

```bash
cd backend
node test-email.js
```

This will show you:
- If email credentials are set
- What error you're getting (if any)
- If email can be sent

## Step 3: Verify Frontend Connection

1. **Start frontend** (in project root):
   ```bash
   npm run dev
   ```
   Should run on http://localhost:3001

2. **Start backend** (in backend folder):
   ```bash
   cd backend
   npm run dev
   ```
   Should run on http://localhost:3000

3. **Test the form:**
   - Go to http://localhost:3001/contact
   - Fill out the form
   - Submit
   - Check backend console for email logs
   - Check browser console (F12) for any errors

## Step 4: Check CORS (if frontend can't connect)

If you see CORS errors in browser:

1. **Check `.env` in backend folder:**
   ```env
   FRONTEND_URL=http://localhost:3001
   ```

2. **Restart backend server**

## Step 5: Verify Data is Saving

Even if email fails, data should still save to MongoDB:

1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Find `jm-placemats` database
4. Check `contactinquiries` collection
5. You should see your test submissions

## Quick Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 3001
- [ ] `.env` file has EMAIL_USER and EMAIL_PASS set
- [ ] Using Gmail App Password (not regular password)
- [ ] 2FA enabled on Gmail account
- [ ] EMAIL_TO is set to your email address
- [ ] Backend console shows email errors (if any)
- [ ] Data is saving to MongoDB (check Atlas)

## Still Not Working?

1. **Run email test:**
   ```bash
   cd backend
   node test-email.js
   ```

2. **Check backend logs** when submitting form

3. **Verify .env values** are correct (no typos, no extra spaces)

4. **Try a different email provider:**
   - Outlook: Use regular email/password
   - SendGrid: Use API key
   - Mailgun: Use SMTP credentials

## Need More Help?

See `TEST_AND_FIX_EMAIL.md` for detailed troubleshooting.

