# Quick Fix: Payment Connection Issue

## The Problem

Frontend can't connect to backend at `http://localhost:3000` when clicking "Proceed to Payment".

## Immediate Steps

### 1. Verify Backend is Running

**Check your backend terminal.** You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

**If not running, start it:**
```bash
cd backend
npm run dev
```

### 2. Test Backend Connection

Open in browser: **http://localhost:3000/health**

Should show: `{"status":"ok","message":"Server is running"}`

**Or test with curl:**
```bash
curl http://localhost:3000/health
```

### 3. Restart Backend (After CORS Fix)

I've updated the CORS configuration to allow more ports. **You need to restart the backend:**

```bash
# Stop backend (Ctrl+C)
cd backend
npm run dev
```

### 4. Check Browser Console

Open browser DevTools (F12) → **Console** tab

Look for:
- Any error messages
- CORS errors
- Network errors

### 5. Check Network Tab

F12 → **Network** tab → Try checkout again

Look for the request to `/api/stripe/create-checkout-session`:
- **Status:** Should be 200 (not failed/blocked)
- **CORS:** Check if there's a CORS error

## What I Fixed

1. **Updated CORS** to allow common development ports:
   - `http://localhost:3001` (your Vite config)
   - `http://localhost:5173` (Vite default)
   - `http://localhost:5174`
   - Development mode allows all origins

2. **Better error handling** in the frontend

## Common Issues

### Issue: Backend Not Running

**Solution:**
```bash
cd backend
npm run dev
```

### Issue: Wrong Port

**Check:**
- Backend should be on: `http://localhost:3000`
- Frontend should be on: `http://localhost:3001` (from vite.config.js)

### Issue: CORS Error

**After my fix, this should be resolved.** But if you still see CORS errors:

1. Make sure backend is restarted (to load new CORS config)
2. Check `backend/.env` has:
   ```env
   FRONTEND_URL=http://localhost:3001
   ```

### Issue: Firewall/Network

**Try:**
- Disable Windows Firewall temporarily to test
- Check if antivirus is blocking localhost connections

## Testing Steps

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify Backend:**
   - Open: http://localhost:3000/health
   - Should see: `{"status":"ok","message":"Server is running"}`

3. **Start Frontend:**
   ```bash
   npm run dev
   ```

4. **Test Checkout:**
   - Go to checkout page
   - Fill in form
   - Click "Proceed to Payment"
   - Should redirect to Stripe (not show error)

## Still Not Working?

1. **Check backend logs** - Look for error messages
2. **Check browser console** (F12) - Look for specific errors
3. **Check network tab** (F12 → Network) - See the failed request
4. **Verify both servers:**
   - Backend: http://localhost:3000/health
   - Frontend: Check your Vite output for the URL

## Expected Result

When working:
1. Click "Proceed to Payment"
2. No error message
3. Redirects to Stripe checkout page
4. Can enter payment details

If you see "Cannot connect to server", the request never reached the backend.
