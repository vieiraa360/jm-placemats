# Quick DNS Setup for api.jm-placemats.com

## Current Status

✅ Frontend is correctly configured (no port!)
❌ DNS not resolving for `api.jm-placemats.com`

## 2-Minute Fix

### Step 1: Get Tunnel ID

```bash
cloudflared tunnel list
```

Copy the Tunnel ID (the long string).

### Step 2: Create DNS Record

**Go to Cloudflare Dashboard:**
1. https://dash.cloudflare.com
2. Select: `jm-placemats.com`
3. Click: **DNS** → **Records**
4. Click: **Add record**

**Fill in:**
- **Type:** `CNAME`
- **Name:** `api`
- **Target:** `[paste-your-tunnel-id].cfargotunnel.com`
- **Proxy:** ON (orange cloud) ✅
- **TTL:** Auto

**Click Save**

### Step 3: Wait 2-3 Minutes

DNS needs time to propagate.

### Step 4: Test

```bash
# Test DNS
nslookup api.jm-placemats.com

# Test backend
curl https://api.jm-placemats.com/health
```

### Step 5: Try Frontend

Go to: https://jm-placemats.com/checkout

Should work now! 🎉

## Alternative: Use Command

```bash
cloudflared tunnel route dns jm-placemats-backend api.jm-placemats.com
```

This creates the DNS record automatically.

## That's It!

Once DNS resolves, everything should work. Your frontend is already correctly configured!
