# Environment Variables Setup

## Quick Fix for Email Error

The error you're seeing means your `.env` file is missing or doesn't have email credentials configured.

## Step 1: Create .env File

In the `backend` folder, create a new file named `.env` (no extension, just `.env`)

## Step 2: Add These Variables

Copy and paste this into your `.env` file, then fill in your values:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority

# Email Configuration
# For Gmail: You need to create an App Password (not your regular password)
# See instructions below
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=noreply@jmplacemats.com
EMAIL_TO=contact@jmplacemats.com

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Node Environment
NODE_ENV=development
```

## Step 3: Configure Email (Gmail)

### Option A: Set Up Gmail App Password (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Google account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as device
   - Enter: "JM Placemats Backend"
   - Click "Generate"
   - **Copy the 16-character password** (no spaces)

3. **Add to .env**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop  (remove spaces: abcdefghijklmnop)
   ```

### Option B: Skip Email for Now (Development Only)

If you just want to test MongoDB connection first, you can leave email credentials empty:

```env
EMAIL_USER=
EMAIL_PASS=
```

The server will start but email won't work. You'll see a warning message.

## Step 4: Test

1. Save the `.env` file
2. Run `npm run dev`
3. You should see:
   - ✅ Connected to MongoDB
   - ⚠️ Email credentials not configured (if email not set up)
   - OR ✅ Email server is ready (if email is configured)

## Important Notes

- **Never commit `.env` to git** - it contains sensitive information
- **MongoDB URI**: Get this from MongoDB Atlas (see MONGODB_ATLAS_SETUP.md)
- **Email Password**: Must be an App Password for Gmail, not your regular password
- **No spaces** around the `=` sign in `.env` file
- **No quotes** needed around values (unless the value itself contains spaces)

## Troubleshooting

### Server still shows email error?
- Make sure `.env` file is in the `backend` folder (same folder as `package.json`)
- Restart the server after creating/editing `.env`
- Check for typos in variable names (must be exactly `EMAIL_USER` and `EMAIL_PASS`)

### Gmail App Password not working?
- Make sure 2FA is enabled
- Make sure you copied the password correctly (16 characters, no spaces)
- Try generating a new app password

### Want to use a different email provider?
- **Outlook/Hotmail**: Use your regular email and password
- **SendGrid**: Use API key in EMAIL_PASS
- **Mailgun**: Use SMTP credentials from dashboard

