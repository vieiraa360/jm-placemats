# Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your actual values.

### 3. MongoDB Setup

**Option A: Local MongoDB**

1. Download and install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The default connection string should work: `mongodb://localhost:27017/jm-placemats`

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` and `<dbname>` in the connection string
7. Update `MONGODB_URI` in `.env`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
```

### 4. Email Configuration

**For Gmail (Recommended for testing):**

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Generate an app password for "Mail"
5. Use this app password in `EMAIL_PASS` (not your regular Gmail password)

**For Other Email Providers:**

- **SendGrid**: Use API key instead of password
- **Mailgun**: Use SMTP credentials from dashboard
- **Outlook/Hotmail**: Use your email and password

Update these in `.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@jmplacemats.com
EMAIL_TO=contact@jmplacemats.com
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### 6. Test the API

Test the contact endpoint:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

Or use Postman/Thunder Client to test the endpoint.

## Troubleshooting

### MongoDB Connection Issues

- Make sure MongoDB is running (if using local)
- Check your connection string in `.env`
- For Atlas, ensure your IP is whitelisted in Network Access

### Email Not Sending

- Verify SMTP credentials are correct
- For Gmail, make sure you're using an App Password, not your regular password
- Check firewall/network settings
- Verify `EMAIL_TO` address is correct

### CORS Issues

- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Default is `http://localhost:3001`

## Next Steps

1. The frontend is already configured to connect to `http://localhost:3000/api/contact`
2. Test the contact form on your website
3. Check MongoDB to see saved inquiries
4. Check your email inbox for notifications

