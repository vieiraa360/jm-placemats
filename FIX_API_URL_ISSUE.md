# Fix: API URL Still Using Wrong Address

## The Problem

Even after code changes, the frontend is still trying to connect to the wrong backend URL.

## Most Likely Cause

**The frontend wasn't rebuilt after code changes!**

Vite needs to rebuild the production bundle for changes to take effect.

## Solution Steps

### Step 1: Rebuild Frontend

```bash
npm run build
```

This creates a new `dist/` folder with the updated code.

### Step 2: Deploy New Build

Upload the new `dist/` folder to your hosting provider.

### Step 3: Clear Browser Cache

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear cache in browser settings

### Step 4: Verify

1. Open: https://jm-placemats.com
2. Open Console (F12)
3. Should see: `API_BASE_URL set to: https://api.jm-placemats.com`

## Alternative: Force API URL via Environment Variable

If the detection still doesn't work, force it:

### Create `.env.production` file:

```env
VITE_API_URL=https://api.jm-placemats.com
```

### Rebuild:

```bash
npm run build
```

### Deploy:

Upload the new `dist/` folder.

## Verify It's Working

### Check 1: Browser Console

Open Console (F12) and look for:
```
API_BASE_URL set to: https://api.jm-placemats.com
```

### Check 2: Network Tab

1. Open Network tab (F12)
2. Try checkout
3. Look for request to: `https://api.jm-placemats.com/api/stripe/create-checkout-session`

Should NOT see: `http://100.67.16.35:3000` or `http://localhost:3000`

### Check 3: Test Backend Directly

Open: https://api.jm-placemats.com/health

Should see: `{"status":"ok","message":"Server is running"}`

## If Still Not Working

### Check 1: Is Cloudflare Tunnel Running?

```bash
cloudflared tunnel run jm-placemats-backend
```

Should show: `Connection established`

### Check 2: Is Backend Running?

```bash
cd backend
npm run dev
```

Should show: `🚀 Server running on http://localhost:3000`

### Check 3: Test Tunnel

```bash
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### Check 4: Check CORS

Backend logs should NOT show CORS warnings for `https://jm-placemats.com`

If you see CORS warnings:
1. Update `backend/.env`:
   ```env
   FRONTEND_URL=https://jm-placemats.com
   NODE_ENV=production
   ```
2. Restart backend

## Quick Checklist

- [ ] Frontend rebuilt: `npm run build`
- [ ] New `dist/` folder deployed
- [ ] Browser cache cleared
- [ ] Console shows: `API_BASE_URL set to: https://api.jm-placemats.com`
- [ ] Network tab shows requests to `https://api.jm-placemats.com`
- [ ] Backend running locally
- [ ] Cloudflare tunnel running
- [ ] https://api.jm-placemats.com/health works
- [ ] No CORS errors in backend logs
