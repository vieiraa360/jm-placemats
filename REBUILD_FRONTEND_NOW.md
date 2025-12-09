# URGENT: Rebuild Frontend - Port Still in URL

## The Problem

Frontend is still trying to connect to `https://api.jm-placemats.com:3000` even though you removed the port from `.env.production`.

**This is because the frontend wasn't rebuilt!**

## Why This Happens

The `.env.production` file and code changes only take effect **after rebuilding**. The old build is still deployed, so it's still using the old code.

## Solution: Complete Rebuild

### Step 1: Verify .env.production

Check that `.env.production` exists and has:

```
VITE_API_URL=https://api.jm-placemats.com
```

**Important:** No port number, no quotes, no spaces.

### Step 2: Delete Old Build Completely

```bash
cd C:\Users\helde\Documents\jm-placemats

# Delete the entire dist folder
rmdir /s /q dist
```

### Step 3: Clear Node Cache (Optional but Recommended)

```bash
# Clear Vite cache
rmdir /s /q node_modules\.vite
```

### Step 4: Rebuild Frontend

```bash
npm run build
```

**Watch for:**
- Should process `.env.production`
- Should create new `dist/` folder
- No errors

### Step 5: Verify the Build

After building, check the built files:

1. Open `dist/assets/` folder
2. Find the main JS file (e.g., `index-abc123.js`)
3. Open it in a text editor
4. **Search for:** `api.jm-placemats.com:3000`
   - Should **NOT find it** ❌
5. **Search for:** `api.jm-placemats.com` (without port)
   - Should **find it** ✅

### Step 6: Deploy New Build

**Important:** Upload the ENTIRE new `dist/` folder, replacing the old one.

### Step 7: Clear ALL Caches

1. **Browser:**
   - Hard refresh: `Ctrl+Shift+R`
   - Or clear cache completely

2. **Cloudflare:**
   - Dashboard → Caching → Purge Everything

3. **Hosting:**
   - Clear any caching on your hosting provider

### Step 8: Test

1. Open: https://jm-placemats.com/checkout
2. Open Console (F12)
3. Should see: `API_BASE_URL set to: https://api.jm-placemats.com`
4. Should **NOT** see `:3000` anywhere
5. Network tab should show: `https://api.jm-placemats.com/api/stripe/...`
6. Should **NOT** show `:3000` in URLs

## If Still Shows :3000

### Check 1: Old Build Still Deployed

- Verify you uploaded the NEW `dist/` folder
- Check file dates - should be recent
- Delete old files completely before uploading

### Check 2: Browser Cache

- Try incognito/private window
- Clear browser cache completely
- Try different browser

### Check 3: CDN Cache

- Cloudflare might be caching old files
- Purge Cloudflare cache
- Wait 5-10 minutes

### Check 4: Build Actually Updated

Check the built file directly:
- Download a JS file from your hosting
- Search for `:3000`
- If found, the build didn't update correctly

## Quick Verification Commands

```bash
# 1. Check .env.production
type .env.production
# Should show: VITE_API_URL=https://api.jm-placemats.com

# 2. Delete old build
rmdir /s /q dist

# 3. Rebuild
npm run build

# 4. Check built file (after build)
findstr /s /i ":3000" dist\assets\*.js
# Should find NOTHING (or only localhost:3000 for dev)

# 5. Check correct URL exists
findstr /s /i "api.jm-placemats.com" dist\assets\*.js
# Should find it (without :3000)
```

## Most Common Issue

**The old build is still deployed!**

Even if you:
- ✅ Updated `.env.production`
- ✅ Rebuilt locally
- ✅ Have new `dist/` folder

If you didn't **upload the new build** to your hosting, the old build is still live.

## Checklist

- [ ] `.env.production` exists with correct URL (no port)
- [ ] Old `dist/` folder deleted
- [ ] Frontend rebuilt: `npm run build`
- [ ] Verified built files don't contain `:3000` (except localhost)
- [ ] New `dist/` folder uploaded to hosting
- [ ] Old files on hosting deleted/replaced
- [ ] Browser cache cleared
- [ ] Cloudflare cache purged
- [ ] Tested in incognito window
- [ ] Console shows URL without `:3000`
