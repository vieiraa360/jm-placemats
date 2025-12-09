# Troubleshooting Guide

## Payment Gateway "Failed to fetch" Error

### Issue
The checkout page shows "Failed to fetch" when clicking "Proceed to Payment".

### Solutions

#### 1. Check if Backend is Running
```bash
cd backend
npm run dev
```
You should see: `🚀 Server running on http://localhost:3000`

#### 2. Verify API URL
Check that your frontend is using the correct backend URL. The default is `http://localhost:3000`.

If your backend runs on a different port or URL, create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000
```

#### 3. Check Stripe Configuration
Make sure your `backend/.env` file has:
```env
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
```

To get your Stripe keys:
1. Go to https://dashboard.stripe.com
2. Click "Developers" → "API keys"
3. Copy your "Secret key" (starts with `sk_test_` for test mode)

#### 4. Check CORS Settings
The backend should allow requests from your frontend. Check `backend/src/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
```

Make sure `FRONTEND_URL` in `backend/.env` matches where your frontend is running.

#### 5. Check Browser Console
Open browser DevTools (F12) → Console tab and look for:
- CORS errors
- Network errors
- Specific error messages

#### 6. Test the API Directly
```bash
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": "test", "quantity": 1}],
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "shippingAddress": "123 Test St"
  }'
```

#### 7. Check Backend Logs
Look at the terminal where the backend is running for error messages.

---

## Email Not Getting Through

### Issue
Emails sent from the contact form are not being received.

### Solutions

#### 1. Check Email Configuration
Verify your `backend/.env` has email settings:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@jmplacemats.com
EMAIL_TO=contact@jmplacemats.com
```

#### 2. Gmail Setup (Most Common)
If using Gmail, you **must** use an App Password, not your regular password:

1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other (Custom name)" → "JM Placemats"
   - Copy the 16-character password (remove spaces)
3. Use it in `.env`:
   ```env
   EMAIL_PASS=abcdefghijklmnop
   ```

#### 3. ProtonMail Setup
If using ProtonMail, you need to use ProtonMail Bridge or SMTP settings:

**Option A: Use ProtonMail Bridge (Recommended)**
1. Download ProtonMail Bridge: https://proton.me/mail/bridge
2. Install and configure
3. Use these settings:
   ```env
   EMAIL_HOST=127.0.0.1
   EMAIL_PORT=1025
   EMAIL_SECURE=false
   EMAIL_USER=your-proton-email@proton.me
   EMAIL_PASS=your-bridge-password
   ```

**Option B: Use ProtonMail SMTP (Requires paid plan)**
```env
EMAIL_HOST=mail.protonmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-proton-email@proton.me
EMAIL_PASS=your-proton-password
```

#### 4. Test Email Configuration
Use the test endpoint:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

Or create a test file `test-email.js`:
```javascript
import dotenv from 'dotenv';
import { sendContactEmail } from './src/config/email.js';

dotenv.config();

sendContactEmail({
  name: 'Test',
  email: 'test@example.com',
  message: 'Test message'
}).then(() => {
  console.log('Email sent!');
}).catch(error => {
  console.error('Error:', error);
});
```

Run: `node test-email.js`

#### 5. Check Email Logs
Look at backend console for:
- `✅ Email server is ready to send messages` (good)
- `⚠️ Email configuration error:` (bad - check credentials)
- `❌ Error sending email:` (check error details)

#### 6. Check Spam Folder
Sometimes emails end up in spam. Check the recipient's spam folder.

#### 7. Alternative Email Providers
If Gmail/ProtonMail don't work, try:

**SendGrid** (Free tier available):
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

**Mailgun** (Free tier available):
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
```

---

## Common Error Messages

### "Cannot connect to server"
- Backend is not running
- Wrong API URL
- Firewall blocking connection

### "Stripe is not configured"
- Missing `STRIPE_SECRET_KEY` in `backend/.env`
- Key is incorrect

### "Validation failed"
- Missing required fields in checkout form
- Invalid email format
- Address too short

### "Product not found"
- Product ID doesn't exist in database
- Run `npm run seed` in backend to populate products

### "Email configuration error"
- Missing email credentials
- Wrong SMTP settings
- Need to use App Password for Gmail

---

## Quick Diagnostic Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend can reach backend (check Network tab in DevTools)
- [ ] `STRIPE_SECRET_KEY` is set in `backend/.env`
- [ ] `EMAIL_USER` and `EMAIL_PASS` are set in `backend/.env`
- [ ] Products are seeded in database (`npm run seed`)
- [ ] CORS is configured correctly
- [ ] Browser console shows no errors
- [ ] Backend logs show no errors

---

## Getting Help

If issues persist:
1. Check backend logs for specific error messages
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test API endpoints directly with curl or Postman
5. Check Stripe Dashboard for webhook/API errors
