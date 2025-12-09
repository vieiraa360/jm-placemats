# Fix DNS: api.jm-placemats.com Not Resolving

## The Good News ✅

Your frontend is now correctly configured! The console shows:
- `Using VITE_API_URL: https://api.jm-placemats.com`
- `API_BASE_URL set to: https://api.jm-placemats.com`
- No `:3000` port! 🎉

## The Problem ❌

`ERR_NAME_NOT_RESOLVED` means the DNS record for `api.jm-placemats.com` doesn't exist or isn't configured correctly.

## Solution: Set Up DNS in Cloudflare

### Step 1: Check if Cloudflare Tunnel is Running

Make sure your tunnel is running:

```bash
cloudflared tunnel run jm-placemats-backend
```

Should show: `Connection established`

### Step 2: Get Your Tunnel ID

```bash
cloudflared tunnel list
```

Note the Tunnel ID (looks like: `abc123def-4567-8901-...`)

### Step 3: Create DNS Record in Cloudflare Dashboard

**Option A: Use Dashboard (Recommended)**

1. Go to: https://dash.cloudflare.com
2. Select your domain: `jm-placemats.com`
3. Click **DNS** → **Records**
4. Click **Add record**
5. Fill in:
   - **Type:** `CNAME`
   - **Name:** `api`
   - **Target:** `[your-tunnel-id].cfargotunnel.com`
     - Replace `[your-tunnel-id]` with your actual tunnel ID from Step 2
   - **Proxy status:** Proxied (orange cloud) ✅
   - **TTL:** Auto
6. Click **Save**

**Option B: Use Command Line**

```bash
cloudflared tunnel route dns jm-placemats-backend api.jm-placemats.com
```

This automatically creates the DNS record.

### Step 4: Wait for DNS Propagation

DNS changes can take:
- **1-5 minutes** (usually)
- **Up to 24 hours** (rare)

### Step 5: Test DNS Resolution

After 2-3 minutes, test:

```bash
# Windows
nslookup api.jm-placemats.com

# Should return Cloudflare IP addresses
```

### Step 6: Test Backend Through Tunnel

```bash
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### Step 7: Test Frontend

Once DNS resolves:
1. Open: https://jm-placemats.com/checkout
2. Try checkout
3. Should connect successfully!

## Quick Checklist

- [ ] Cloudflare tunnel is running
- [ ] Got tunnel ID: `cloudflared tunnel list`
- [ ] Created CNAME record in Cloudflare dashboard
- [ ] Record points to: `[tunnel-id].cfargotunnel.com`
- [ ] Proxy is ON (orange cloud)
- [ ] Waited 2-5 minutes for DNS
- [ ] `nslookup api.jm-placemats.com` resolves
- [ ] `curl https://api.jm-placemats.com/health` works
- [ ] Frontend can connect

## Troubleshooting

### Issue: DNS Still Not Resolving After 10 Minutes

**Check 1: DNS Record Exists**
- Go to Cloudflare Dashboard → DNS → Records
- Should see CNAME record for `api`
- Target should be `[tunnel-id].cfargotunnel.com`

**Check 2: Tunnel is Running**
```bash
cloudflared tunnel run jm-placemats-backend
```

**Check 3: Tunnel ID is Correct**
- Make sure the DNS record uses the correct tunnel ID
- Check with: `cloudflared tunnel list`

**Check 4: Proxy is Enabled**
- In Cloudflare dashboard, the record should show orange cloud (Proxied)
- Not gray cloud (DNS only)

### Issue: Tunnel Not Connecting

**Check:**
- Backend is running: `npm run dev` in backend folder
- Backend is accessible locally: `curl http://localhost:3000/health`
- Tunnel config is correct

## Expected Result

After DNS is set up:

1. **DNS resolves:**
   ```bash
   nslookup api.jm-placemats.com
   # Returns Cloudflare IPs
   ```

2. **Backend accessible:**
   ```bash
   curl https://api.jm-placemats.com/health
   # Returns: {"status":"ok","message":"Server is running"}
   ```

3. **Frontend connects:**
   - No `ERR_NAME_NOT_RESOLVED` errors
   - Payment checkout works!

## Summary

Your frontend is fixed! ✅

Now you just need to:
1. Set up DNS record in Cloudflare
2. Wait for DNS to propagate
3. Test the connection

The DNS setup is the last step to get everything working!
