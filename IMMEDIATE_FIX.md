# IMMEDIATE FIX: Force API URL

## The Problem

Frontend is still using `http://100.67.16.35:3000` instead of `https://api.jm-placemats.com`.

## Solution: Force It with Environment Variable

### Step 1: Create `.env.production` File

In the **root directory** (where `package.json` is), create a file named `.env.production`:

**File location:** `C:\Users\helde\Documents\jm-placemats\.env.production`

**File contents:**
```
VITE_API_URL=https://api.jm-placemats.com
```

**Important:**
- No quotes around the URL
- No spaces around the `=`
- File must be named exactly `.env.production` (not `.env`)

### Step 2: Delete Old Build

```bash
# In the root directory
rmdir /s /q dist
```

This removes the old build so we start fresh.

### Step 3: Rebuild Frontend

```bash
npm run build
```

This will:
- Read `.env.production`
- Set `VITE_API_URL=https://api.jm-placemats.com`
- Build with the correct API URL baked in

### Step 4: Verify the Build

After building, check the built files:

1. Open `dist/assets/` folder
2. Find the main JS file (e.g., `index-abc123.js`)
3. Open it in a text editor
4. Search for `api.jm-placemats.com` - **should find it**
5. Search for `100.67.16.35` - **should NOT find it**

If you find `100.67.16.35`, the build didn't pick up the environment variable.

### Step 5: Deploy New Build

Upload the entire new `dist/` folder to your hosting provider.

**Make sure you're uploading the NEW build!**

### Step 6: Clear All Caches

1. **Browser:** Hard refresh (`Ctrl+Shift+R`)
2. **Cloudflare:** Purge cache in dashboard
3. **Hosting:** Clear any caching

### Step 7: Test

1. Open: https://jm-placemats.com
2. Open Console (F12)
3. Should see: `API_BASE_URL set to: https://api.jm-placemats.com`
4. Try checkout - should work!

## Quick Commands

```bash
# 1. Create .env.production
echo VITE_API_URL=https://api.jm-placemats.com > .env.production

# 2. Delete old build
rmdir /s /q dist

# 3. Rebuild
npm run build

# 4. Deploy dist/ folder
```

## Verification

After deploying, check:

1. **Browser Console:**
   - Should show: `Using VITE_API_URL: https://api.jm-placemats.com`
   - Should show: `API_BASE_URL set to: https://api.jm-placemats.com`

2. **Network Tab:**
   - Request should go to: `https://api.jm-placemats.com/api/stripe/create-checkout-session`
   - Should NOT see: `http://100.67.16.35:3000`

3. **Backend Logs:**
   - Should NOT see CORS warnings
   - Should see successful requests

## If Still Not Working

### Check 1: Is .env.production in the right place?

File should be at:
```
C:\Users\helde\Documents\jm-placemats\.env.production
```

NOT in:
- `src/.env.production` ❌
- `backend/.env.production` ❌
- `dist/.env.production` ❌

### Check 2: Is Cloudflare Tunnel Running?

```bash
cloudflared tunnel run jm-placemats-backend
```

Should show: `Connection established`

### Check 3: Test Backend Directly

```bash
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

If this doesn't work, the tunnel isn't set up.

### Check 4: Check Build Output

When running `npm run build`, look for:
- No errors
- Should process environment variables
- Should create `dist/` folder

## Most Common Issue

**The frontend wasn't rebuilt!**

The code changes I made are in the source files, but they only take effect after:
1. Running `npm run build`
2. Deploying the new `dist/` folder

The old build is still deployed, so it's still using the old code/IP.
