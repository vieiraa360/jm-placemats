# Fix: CORS Blocking Production Domain

## The Problem

CORS is blocking requests from `https://jm-placemats.com` because it's not in the allowed origins list.

## What I Fixed

I've updated the CORS configuration to allow:
- `https://jm-placemats.com`
- `https://www.jm-placemats.com`

## Next Step: Restart Backend

**Important:** You need to restart the backend for the changes to take effect:

```bash
# Stop backend (Ctrl+C)
cd backend
npm run dev
```

After restarting, requests from `https://jm-placemats.com` should be allowed.

## Production Configuration

For production, you should also set in `backend/.env`:

```env
NODE_ENV=production
FRONTEND_URL=https://jm-placemats.com
```

This ensures:
1. Production domain is explicitly allowed
2. CORS is properly configured for production
3. Better security settings

## Testing

After restarting backend:

1. Try accessing the site from `https://jm-placemats.com`
2. Check backend logs - should NOT see CORS warnings
3. Test payment process - should work now

## If Still Blocked

If you still see CORS errors after restarting:

1. **Check `.env` file:**
   ```env
   FRONTEND_URL=https://jm-placemats.com
   NODE_ENV=production
   ```

2. **Verify the exact origin:**
   - Check browser console for the exact origin being blocked
   - Make sure it matches exactly (including `www.` or not)

3. **Check backend logs:**
   - Should show which origin was blocked
   - Verify it's in the allowed list

## Current Allowed Origins

After the fix, these origins are allowed:
- `https://jm-placemats.com`
- `https://www.jm-placemats.com`
- `http://localhost:3001`
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:3000`
- Local network IPs (for development)
- Any origin in `FRONTEND_URL` environment variable
