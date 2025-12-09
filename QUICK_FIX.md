# Quick Fix Guide for Payment & Email Issues

## Immediate Steps to Fix

### 1. Check Backend is Running

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
✅ Stripe initialized
✅ Email server is ready to send messages
```

### 2. Run Diagnostic Test

```bash
cd backend
npm run test-config
```

This will check:
- MongoDB connection
- Stripe configuration
- Email configuration
- Environment variables

### 3. Fix Payment Gateway Issue

**Problem:** "Failed to fetch" error

**Solution:**

1. **Check if backend is running** (see step 1)

2. **Verify Stripe key is set** in `backend/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```
   Get your key from: https://dashboard.stripe.com/test/apikeys

3. **Check API URL** - Make sure frontend can reach backend:
   - Frontend should be at: http://localhost:3001 (or your port)
   - Backend should be at: http://localhost:3000
   - If different, create `.env` in root with:
     ```env
     VITE_API_URL=http://localhost:3000
     ```

4. **Test the endpoint directly:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

### 4. Fix Email Issue

**Problem:** Emails not getting through

**Solution:**

1. **For Gmail:**
   - Go to: https://myaccount.google.com/apppasswords
   - Generate an App Password (not your regular password!)
   - Add to `backend/.env`:
     ```env
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_SECURE=false
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-16-char-app-password
     EMAIL_FROM=noreply@jmplacemats.com
     EMAIL_TO=contact@jmplacemats.com
     ```

2. **For ProtonMail:**
   - Download ProtonMail Bridge: https://proton.me/mail/bridge
   - Install and configure
   - Use these settings in `backend/.env`:
     ```env
     EMAIL_HOST=127.0.0.1
     EMAIL_PORT=1025
     EMAIL_SECURE=false
     EMAIL_USER=your-email@proton.me
     EMAIL_PASS=your-bridge-password
     ```

3. **Test email:**
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"to": "your-email@example.com"}'
   ```

### 5. Verify Products are in Database

```bash
cd backend
npm run seed
```

This populates your database with products.

## Common Issues

### "Cannot connect to server"
- Backend is not running → Start it with `npm run dev` in backend folder
- Wrong port → Check `PORT` in `backend/.env`

### "Stripe is not configured"
- Missing `STRIPE_SECRET_KEY` → Add it to `backend/.env`
- Wrong key format → Should start with `sk_test_` or `sk_live_`

### "Email configuration error"
- Missing credentials → Add `EMAIL_USER` and `EMAIL_PASS` to `backend/.env`
- Using regular password for Gmail → Must use App Password
- Wrong SMTP settings → Check `EMAIL_HOST` and `EMAIL_PORT`

## Still Not Working?

1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Run `npm run test-config` to see what's wrong
4. See `TROUBLESHOOTING.md` for detailed solutions
