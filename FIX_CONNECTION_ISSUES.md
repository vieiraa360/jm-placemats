# Fix: Connection Issues - DNS and Port Problems

## Two Issues Found

### Issue 1: DNS Not Resolving
Error: `ERR_NAME_NOT_RESOLVED` for `api.jm-placemats.com`

**Cause:** DNS record not set up in Cloudflare

**Fix:** See `CLOUDFLARE_DNS_FIX.md`

### Issue 2: Port Number in URL
Error shows: `https://api.jm-placemats.com:3000`

**Cause:** Cloudflare Tunnel doesn't use port numbers

**Fix:** Use `https://api.jm-placemats.com` (no `:3000`)

## Immediate Fixes Applied

I've updated the code to:
1. ✅ Remove port from production URL
2. ✅ Use correct API URL everywhere
3. ✅ Keep port only for localhost development

## Steps to Fix

### Step 1: Set Up DNS in Cloudflare

**Option A: Use Dashboard**
1. Go to: https://dash.cloudflare.com
2. Select domain: `jm-placemats.com`
3. DNS → Records → Add Record
4. Type: CNAME
5. Name: `api`
6. Target: `[your-tunnel-id].cfargotunnel.com`
7. Proxy: ON (orange cloud)
8. Save

**Option B: Use Command**
```bash
cloudflared tunnel route dns jm-placemats-backend api.jm-placemats.com
```

### Step 2: Verify Tunnel is Running

```bash
cloudflared tunnel run jm-placemats-backend
```

Should show: `Connection established`

### Step 3: Test DNS Resolution

Wait 5-10 minutes, then:

```bash
# Test DNS
nslookup api.jm-placemats.com

# Test backend
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### Step 4: Rebuild Frontend

```bash
# Delete old build
rmdir /s /q dist

# Rebuild (uses .env.production)
npm run build

# Deploy new dist/ folder
```

### Step 5: Clear Caches

1. Browser: `Ctrl+Shift+R` (hard refresh)
2. Cloudflare: Purge cache in dashboard
3. Hosting: Clear any caching

### Step 6: Test

1. Open: https://jm-placemats.com/checkout
2. Open Console (F12)
3. Should see: `API_BASE_URL set to: https://api.jm-placemats.com`
4. Should NOT see: `:3000` in the URL
5. Try checkout - should work!

## Verification

After fixes:

✅ **DNS resolves:**
```bash
nslookup api.jm-placemats.com
# Should return Cloudflare IPs
```

✅ **Backend accessible:**
```bash
curl https://api.jm-placemats.com/health
# Should return: {"status":"ok","message":"Server is running"}
```

✅ **Frontend uses correct URL:**
- Console shows: `https://api.jm-placemats.com` (no port)
- Network tab shows requests to `https://api.jm-placemats.com`
- No requests to `http://100.67.16.35:3000`

## Common Mistakes

❌ **Wrong:** `https://api.jm-placemats.com:3000`
✅ **Correct:** `https://api.jm-placemats.com`

❌ **Wrong:** DNS record points to `localhost:3000`
✅ **Correct:** DNS record points to `[tunnel-id].cfargotunnel.com`

❌ **Wrong:** Tunnel not running
✅ **Correct:** `cloudflared tunnel run jm-placemats-backend` is active

## Still Not Working?

### Check 1: DNS Propagation
- Wait 10-15 minutes
- Try `nslookup api.jm-placemats.com` again
- Check Cloudflare dashboard for DNS record

### Check 2: Tunnel Status
```bash
cloudflared tunnel list
cloudflared tunnel run jm-placemats-backend
```

### Check 3: Backend Running
```bash
cd backend
npm run dev
```

### Check 4: Test Locally First
```bash
curl http://localhost:3000/health
```

If this works but tunnel doesn't, it's a DNS/tunnel issue.

### Check 5: Frontend Build
- Check `dist/assets/` files
- Search for `api.jm-placemats.com` - should find it
- Search for `:3000` - should NOT find it in production URLs
