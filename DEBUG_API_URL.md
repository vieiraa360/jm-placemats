# Debug API URL Configuration

## Check What URL is Being Used

### Step 1: Check Browser Console

1. Open your site: https://jm-placemats.com
2. Open DevTools (F12)
3. Go to Console tab
4. Look for: `API_BASE_URL set to: ...`

This will show you what URL the frontend is trying to use.

### Step 2: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try the checkout process
4. Look for the request to `/api/stripe/create-checkout-session`
5. Check the "Request URL" - it should show the full URL being used

### Step 3: Verify Frontend Was Rebuilt

**Important:** After code changes, you MUST rebuild the frontend:

```bash
npm run build
```

Then deploy the new `dist/` folder to your hosting.

### Step 4: Check Environment Variables

If you're using a build system, check if `.env.production` exists:

```env
VITE_API_URL=https://api.jm-placemats.com
```

## Common Issues

### Issue: Still Using Local IP

**Cause:** Frontend wasn't rebuilt after code changes

**Solution:**
```bash
npm run build
# Deploy the new dist/ folder
```

### Issue: Wrong Domain Detection

**Check:** Browser console should show:
- `Production detected, using: https://api.jm-placemats.com`

If it shows `Development mode`, the domain detection isn't working.

**Solution:** Check `window.location.hostname` in console:
```javascript
console.log(window.location.hostname)
```

Should show: `jm-placemats.com` or `www.jm-placemats.com`

### Issue: CORS Errors

**Check backend logs** - should NOT see CORS warnings for `https://jm-placemats.com`

**Solution:** Make sure `backend/.env` has:
```env
FRONTEND_URL=https://jm-placemats.com
NODE_ENV=production
```

Then restart backend.

## Quick Test

1. Open: https://jm-placemats.com
2. Open Console (F12)
3. Type: `window.location.hostname`
4. Should see: `jm-placemats.com` or `www.jm-placemats.com`
5. Check console for: `API_BASE_URL set to: https://api.jm-placemats.com`

If it shows `http://localhost:3000` or `http://100.67.16.35:3000`, the code changes weren't applied.

## Force API URL

If detection isn't working, create `.env.production`:

```env
VITE_API_URL=https://api.jm-placemats.com
```

Then rebuild:
```bash
npm run build
```
