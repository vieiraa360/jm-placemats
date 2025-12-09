# Force API URL to Use Cloudflare Tunnel

## The Problem

Frontend is still trying to connect to `http://100.67.16.35:3000` instead of `https://api.jm-placemats.com`.

## Root Cause

The frontend build is using the old code or the detection isn't working. We need to **force** it to use the Cloudflare tunnel URL.

## Solution: Create .env.production File

### Step 1: Create `.env.production` File

In the **root directory** (same level as `package.json`), create a file named `.env.production`:

```env
VITE_API_URL=https://api.jm-placemats.com
```

**Important:** 
- File must be named exactly `.env.production`
- Must be in the root directory (not in `src/` or `backend/`)
- No spaces around the `=`

### Step 2: Delete Old Build

```bash
# Delete the old dist folder
rmdir /s /q dist
# Or on Mac/Linux:
# rm -rf dist
```

### Step 3: Rebuild Frontend

```bash
npm run build
```

This will:
- Read `.env.production`
- Set `VITE_API_URL` to `https://api.jm-placemats.com`
- Build with the correct API URL

### Step 4: Verify Build

Check the built files to confirm:

**Option A: Check dist folder**
- Open `dist/assets/` folder
- Find the main JS file (e.g., `index-abc123.js`)
- Search for `api.jm-placemats.com` - should find it
- Should NOT find `100.67.16.35` or `localhost:3000`

**Option B: Check build output**
- Look for any warnings about environment variables
- Should see Vite processing `.env.production`

### Step 5: Deploy New Build

Upload the entire new `dist/` folder to your hosting provider.

**Important:** Make sure you're uploading the NEW build, not the old one!

### Step 6: Clear All Caches

1. **Browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear cache in browser settings

2. **CDN cache (if using Cloudflare):**
   - Go to Cloudflare dashboard
   - Caching → Purge Everything

3. **Hosting cache:**
   - Clear any caching on your hosting provider

### Step 7: Test

1. Open: https://jm-placemats.com
2. Open Console (F12)
3. Should see: `API_BASE_URL set to: https://api.jm-placemats.com`
4. Try checkout - should connect to `https://api.jm-placemats.com`

## Alternative: Check Current Build

If you want to see what the current build is using:

1. Open your deployed site
2. View page source
3. Find the main JS file (usually in `<script>` tag)
4. Open that JS file
5. Search for `100.67.16.35` or `localhost:3000`
6. If found, the old build is still deployed

## Verification Checklist

- [ ] `.env.production` file created in root directory
- [ ] File contains: `VITE_API_URL=https://api.jm-placemats.com`
- [ ] Old `dist/` folder deleted
- [ ] Frontend rebuilt: `npm run build`
- [ ] New `dist/` folder deployed
- [ ] Browser cache cleared
- [ ] CDN cache purged (if using Cloudflare)
- [ ] Console shows: `API_BASE_URL set to: https://api.jm-placemats.com`
- [ ] Network tab shows requests to `https://api.jm-placemats.com`

## If Still Not Working

### Check 1: Verify .env.production Format

File should be exactly:
```
VITE_API_URL=https://api.jm-placemats.com
```

No quotes, no spaces, no extra lines.

### Check 2: Verify Build Process

When running `npm run build`, you should see:
```
vite v6.x.x building for production...
```

And it should process environment variables.

### Check 3: Check Deployed Files

Download a file from your hosting and check if it contains:
- ✅ `api.jm-placemats.com` (correct)
- ❌ `100.67.16.35` (wrong - old build)
- ❌ `localhost:3000` (wrong - old build)

### Check 4: Test Backend Directly

Make sure the Cloudflare tunnel is working:

```bash
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

If this doesn't work, the tunnel isn't set up correctly.

## Quick Command Summary

```bash
# 1. Create .env.production
echo VITE_API_URL=https://api.jm-placemats.com > .env.production

# 2. Delete old build
rmdir /s /q dist

# 3. Rebuild
npm run build

# 4. Deploy dist/ folder to hosting
```

## Important Notes

- **`.env.production` only works for production builds** (`npm run build`)
- **For development** (`npm run dev`), use `.env` file
- **Environment variables must start with `VITE_`** to be accessible in frontend
- **Rebuild is required** after changing environment variables
- **Old builds won't update** - you must rebuild and redeploy
