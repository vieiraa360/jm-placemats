# Fix Payment Connection Issue

## The Problem

Frontend can't connect to backend at `http://localhost:3000` when trying to create Stripe checkout session.

## Quick Diagnostic Steps

### 1. Verify Backend is Running

Check if backend is actually running:

```bash
# In backend terminal, you should see:
🚀 Server running on http://localhost:3000
✅ Connected to MongoDB
```

If not, start it:
```bash
cd backend
npm run dev
```

### 2. Test Backend Connection

Open a new terminal and test:

```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok","message":"Server is running"}`

Or test in browser: http://localhost:3000/health

### 3. Check Frontend Port

The frontend might be running on a different port. Check your frontend terminal - it should show something like:
```
VITE v6.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

**Important:** The CORS is configured for `http://localhost:3001`, but Vite usually runs on port `5173`.

### 4. Fix CORS Configuration

**Option A: Update Backend CORS (Recommended)**

Edit `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

Then restart backend server.

**Option B: Update Frontend Port**

Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:3000
```

Or run frontend on port 3001:
```bash
npm run dev -- --port 3001
```

### 5. Check Browser Console

Open browser DevTools (F12) → Console tab and look for:
- CORS errors
- Network errors
- Specific error messages

## Common Issues

### Issue: "Cannot connect to server"

**Causes:**
1. Backend not running
2. Wrong port number
3. Firewall blocking connection

**Solution:**
1. Make sure backend is running: `cd backend && npm run dev`
2. Verify port: Check `PORT` in `backend/.env` (should be 3000)
3. Test connection: `curl http://localhost:3000/health`

### Issue: CORS Error

**Symptoms:**
- Browser console shows: "CORS policy" error
- Network tab shows: "CORS preflight" failed

**Solution:**
1. Check `FRONTEND_URL` in `backend/.env`
2. Make sure it matches your frontend URL
3. Restart backend after changing `.env`

### Issue: Frontend on Different Port

**Vite default port:** 5173
**Backend expects:** 3001 (from default config)

**Solution:**
Update `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

Or run frontend on port 3001:
```bash
npm run dev -- --port 3001
```

## Step-by-Step Fix

### Step 1: Check Backend Status

```bash
cd backend
npm run dev
```

Look for:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### Step 2: Test Backend

Open browser: http://localhost:3000/health

Should see: `{"status":"ok","message":"Server is running"}`

### Step 3: Check Frontend Port

Look at your frontend terminal - what port is it running on?

### Step 4: Update CORS

Edit `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```
(Replace 5173 with your actual frontend port)

### Step 5: Restart Backend

```bash
# Stop backend (Ctrl+C)
# Restart:
cd backend
npm run dev
```

### Step 6: Test Payment Again

Try the checkout process again.

## Quick Test Script

Run this to test the connection:

```bash
cd backend
node test-backend-connection.js
```

## Still Not Working?

1. **Check browser console** (F12) for specific errors
2. **Check network tab** (F12 → Network) to see the failed request
3. **Verify both servers are running:**
   - Backend: `http://localhost:3000`
   - Frontend: Check your Vite output
4. **Try accessing backend directly:**
   - http://localhost:3000/health
   - http://localhost:3000/api/products

## Expected Behavior

When working correctly:
1. Click "Proceed to Payment"
2. Request goes to: `http://localhost:3000/api/stripe/create-checkout-session`
3. Backend creates Stripe session
4. Redirects to Stripe checkout page

If you see "Cannot connect to server", the request never reaches the backend.
