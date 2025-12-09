# Production Backend Setup Guide

## The Problem

Your production frontend at `https://jm-placemats.com` is trying to connect to `http://100.67.16.35:3000`, which is a **local network IP address** that's not accessible from the internet.

## Solution Options

You have **3 options** for production:

### Option 1: Deploy Backend to Cloud Server (Recommended)

Deploy your backend to a cloud hosting service:

**Popular Options:**
- **Heroku** (Easy, free tier available)
- **Railway** (Simple, good free tier)
- **Render** (Free tier available)
- **DigitalOcean** (More control, $5/month)
- **AWS/Google Cloud** (More complex, scalable)

**Steps:**
1. Deploy backend to cloud service
2. Get your backend URL (e.g., `https://jm-placemats-api.herokuapp.com`)
3. Update frontend `.env.production`:
   ```env
   VITE_API_URL=https://jm-placemats-api.herokuapp.com
   ```
4. Rebuild and deploy frontend

### Option 2: Use Subdomain for Backend

If you have control over DNS for `jm-placemats.com`:

1. **Create subdomain:** `api.jm-placemats.com`
2. **Point it to your backend server** (if you have a VPS/server)
3. **Set up reverse proxy** (nginx) to forward requests to backend
4. **Use HTTPS** (Let's Encrypt free SSL)
5. **Update frontend** to use `https://api.jm-placemats.com`

### Option 3: Keep Backend Local with Port Forwarding (Not Recommended)

**Only for testing, not production:**
- Set up port forwarding on your router
- Use dynamic DNS service
- Expose port 3000 to internet
- **Security risk** - not recommended for production

## Quick Fix: Update Frontend Configuration

I've updated the code to automatically detect production and use the correct backend URL.

**For now, you need to:**

1. **Create `.env.production` file** in root directory:
   ```env
   VITE_API_URL=https://api.jm-placemats.com
   ```
   (Replace with your actual backend URL)

2. **Or set environment variable when building:**
   ```bash
   VITE_API_URL=https://api.jm-placemats.com npm run build
   ```

## Recommended: Deploy Backend to Heroku (Easiest)

### Step 1: Prepare Backend for Heroku

Create `Procfile` in `backend/` directory:
```
web: node src/server.js
```

Update `backend/package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### Step 2: Deploy to Heroku

```bash
cd backend
heroku create jm-placemats-api
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Step 3: Set Environment Variables on Heroku

```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set STRIPE_SECRET_KEY=your-stripe-key
heroku config:set EMAIL_USER=your-email
heroku config:set EMAIL_PASS=your-password
heroku config:set FRONTEND_URL=https://jm-placemats.com
heroku config:set NODE_ENV=production
```

### Step 4: Update Frontend

Create `.env.production`:
```env
VITE_API_URL=https://jm-placemats-api.herokuapp.com
```

Rebuild frontend:
```bash
npm run build
```

## Current Code Changes

I've updated the frontend code to:
- **Automatically detect** if running on `jm-placemats.com`
- **Use production backend URL** when on production domain
- **Fall back to localhost** for development

**Default production URL:** `https://api.jm-placemats.com`

**To change it:**
1. Set `VITE_API_URL` in `.env.production`
2. Or update the code in `Checkout.jsx`, `PaymentSuccess.jsx`, and `base44Client.js`

## Testing Production Setup

1. **Deploy backend** to cloud service
2. **Get backend URL** (e.g., `https://api.jm-placemats.com`)
3. **Update frontend** `.env.production` with backend URL
4. **Rebuild frontend:** `npm run build`
5. **Deploy frontend** to your hosting
6. **Test** from `https://jm-placemats.com`

## Important Notes

- **Local IP addresses** (`100.67.16.35`) won't work from the internet
- **Backend must be publicly accessible** for production
- **Use HTTPS** for production (required for Stripe)
- **Set up CORS** properly for production domain
- **Use environment variables** to switch between dev/prod

## Next Steps

1. **Choose deployment option** (Heroku recommended for simplicity)
2. **Deploy backend** to cloud service
3. **Get backend URL**
4. **Update frontend** `.env.production`
5. **Rebuild and redeploy** frontend
6. **Test** payment flow from production site
