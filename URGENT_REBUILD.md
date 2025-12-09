# ⚠️ URGENT: Rebuild Frontend Now

## The Problem

Your frontend is still using the **old build** that has `:3000` in the URL. The code changes I made are correct, but they only work **after rebuilding**.

## Why You See `:3000`

The old JavaScript files are still deployed on your hosting. Even though:
- ✅ Code is updated
- ✅ `.env.production` is correct
- ✅ Everything looks right

**The old build is still live!**

## Solution: Complete Rebuild & Redeploy

### Step 1: Verify .env.production

File should be at: `C:\Users\helde\Documents\jm-placemats\.env.production`

Content should be:
```
VITE_API_URL=https://api.jm-placemats.com
```

**No port, no quotes, no spaces!**

### Step 2: Delete Old Build

```bash
cd C:\Users\helde\Documents\jm-placemats
rmdir /s /q dist
```

### Step 3: Rebuild

```bash
npm run build
```

**This is critical!** Without rebuilding, your changes don't take effect.

### Step 4: Verify Build

After building, check:

```bash
# Search for :3000 in built files (should find nothing for production URLs)
findstr /s /i "api.jm-placemats.com:3000" dist\assets\*.js
# Should return nothing

# Search for correct URL (should find it)
findstr /s /i "api.jm-placemats.com" dist\assets\*.js | findstr /v ":3000"
# Should find the URL without port
```

### Step 5: Deploy New Build

**CRITICAL:** Upload the **entire new `dist/` folder** to your hosting.

**Make sure:**
- You're uploading the NEW build (check file dates)
- You're replacing ALL old files
- No old files remain on the server

### Step 6: Clear All Caches

1. **Browser:** `Ctrl+Shift+R` (hard refresh)
2. **Cloudflare:** Dashboard → Caching → Purge Everything
3. **Hosting:** Clear any server-side cache

### Step 7: Test in Incognito

Open incognito/private window:
- https://jm-placemats.com/checkout
- Open Console (F12)
- Should see: `API_BASE_URL set to: https://api.jm-placemats.com`
- Should **NOT** see `:3000`

## Why This Keeps Happening

**The frontend code is compiled into JavaScript files during build.**

- Source code changes → Need rebuild → New JavaScript files
- Old JavaScript files → Still deployed → Still has old code

**You MUST rebuild and redeploy for changes to take effect!**

## Quick Test

After rebuilding and deploying:

1. Open: https://jm-placemats.com/checkout
2. Open Console (F12)
3. Look for: `API_BASE_URL set to: https://api.jm-placemats.com`
4. Check Network tab - requests should go to `https://api.jm-placemats.com` (no port)

If you still see `:3000`, the old build is still deployed.

## Most Common Mistakes

❌ **Updated code but didn't rebuild**
✅ **Rebuild:** `npm run build`

❌ **Rebuilt but didn't deploy new files**
✅ **Deploy:** Upload new `dist/` folder

❌ **Deployed but browser cached old files**
✅ **Clear cache:** Hard refresh or incognito

❌ **Cloudflare caching old files**
✅ **Purge cache:** Cloudflare dashboard

## Verification Checklist

- [ ] `.env.production` exists with correct URL
- [ ] Old `dist/` folder deleted
- [ ] `npm run build` completed successfully
- [ ] Built files checked - no `:3000` in production URLs
- [ ] New `dist/` folder uploaded to hosting
- [ ] Old files on hosting replaced
- [ ] Browser cache cleared
- [ ] Cloudflare cache purged
- [ ] Tested in incognito window
- [ ] Console shows URL without `:3000`

## If Still Not Working

The issue is **100% that the old build is still deployed.**

Check:
1. File dates on hosting - are they recent?
2. File sizes - do they match your new build?
3. Download a JS file from hosting and search for `:3000`

If you find `:3000` in the deployed files, the old build is still there.
