# 🔴 URGENT: Fix Gmail Email Issue

## The Problem

Gmail is blocking your app because it needs you to log in via web browser first.

**Error:** `534-5.7.9 Please log in with your web browser and then try again`

## Quick Fix (5 minutes)

### 1. Log into Gmail Web Browser (REQUIRED)

**Do this first:**
1. Open Chrome/Firefox/Edge
2. Go to: **https://mail.google.com**
3. Log in with: `nmailer978@gmail.com`
4. Complete any security checks Google asks for
5. **Stay on the page for 2-3 minutes**

### 2. Generate NEW App Password

**After logging in via web browser:**
1. Go to: **https://myaccount.google.com/apppasswords**
2. You might need to verify your identity again
3. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - **Name:** JM Placemats
4. Click **Generate**
5. **Copy the password** (16 characters, no spaces!)

### 3. Update .env File

Open `backend/.env` and update:

```env
EMAIL_PASS=your-new-16-char-password-here
```

**Important:**
- Remove ALL spaces
- Should be exactly 16 characters
- Example: If Google shows `abcd efgh ijkl mnop`, use `abcdefghijklmnop`

### 4. Restart Backend Server

```bash
# In the terminal where backend is running:
# Press Ctrl+C to stop

# Then restart:
cd backend
npm run dev
```

### 5. Test Again

```bash
cd backend
node test-email-direct.js
```

## Why This Happens

Gmail blocks app access when:
- Account hasn't been logged into via web browser recently
- Google detected unusual activity
- Account needs to be "unlocked" for app access

**Solution:** Log in via web browser first, then generate App Password.

## Expected Result

After fixing, you should see:
```
✅ SMTP connection successful!
✅ Test email sent successfully!
```

## Still Not Working?

1. **Try a different Gmail account** - Some accounts have restrictions
2. **Wait 10-15 minutes** after web login before testing
3. **Check Gmail security:** https://myaccount.google.com/security-checkup
4. **Use alternative:** Consider SendGrid or Mailgun (easier setup)

## Need More Help?

See `GMAIL_WEBLOGIN_FIX.md` for detailed troubleshooting.
