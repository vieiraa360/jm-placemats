# Fix: DNS Not Resolving for api.jm-placemats.com

## The Problem

Console shows: `ERR_NAME_NOT_RESOLVED` for `api.jm-placemats.com`

This means the DNS record isn't set up correctly in Cloudflare.

## Solution: Set Up DNS Record in Cloudflare

### Step 1: Check Cloudflare Tunnel Status

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

1. **Go to Cloudflare Dashboard:**
   - https://dash.cloudflare.com
   - Select your domain: `jm-placemats.com`

2. **Go to DNS → Records**

3. **Add CNAME Record:**
   - **Type:** CNAME
   - **Name:** `api`
   - **Target:** `[your-tunnel-id].cfargotunnel.com`
     - Replace `[your-tunnel-id]` with your actual tunnel ID
   - **Proxy status:** Proxied (orange cloud) ✅
   - **TTL:** Auto

4. **Click Save**

### Step 4: Or Use Command Line

```bash
cloudflared tunnel route dns jm-placemats-backend api.jm-placemats.com
```

This automatically creates the DNS record.

### Step 5: Wait for DNS Propagation

DNS changes can take:
- **Immediate to 5 minutes** (usually)
- **Up to 24 hours** (rare)

### Step 6: Test DNS Resolution

```bash
# Windows
nslookup api.jm-placemats.com

# Or test in browser
# Should resolve to a Cloudflare IP
```

### Step 7: Test Backend

```bash
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

## Important: Remove Port Number

**Cloudflare Tunnel uses standard ports:**
- HTTP → Port 80 (automatic)
- HTTPS → Port 443 (automatic)

**Don't include `:3000` in the URL!**

✅ Correct: `https://api.jm-placemats.com`
❌ Wrong: `https://api.jm-placemats.com:3000`

## Verify Tunnel Configuration

Check your tunnel config file (usually `~/.cloudflared/config.yml`):

```yaml
tunnel: [your-tunnel-id]
credentials-file: C:\Users\helde\.cloudflared\[tunnel-id].json

ingress:
  - hostname: api.jm-placemats.com
    service: http://localhost:3000
  - service: http_status:404
```

**Important:** The `service` points to `localhost:3000` (your local backend), but the public URL is just `https://api.jm-placemats.com` (no port).

## Troubleshooting

### Issue: DNS Still Not Resolving

**Check 1: DNS Record Exists**
- Go to Cloudflare Dashboard → DNS → Records
- Should see CNAME record for `api`
- Target should be `[tunnel-id].cfargotunnel.com`

**Check 2: Tunnel is Running**
```bash
cloudflared tunnel run jm-placemats-backend
```

**Check 3: Tunnel is Connected**
- Should see: `Connection established`
- Should NOT see errors

**Check 4: Wait Longer**
- DNS can take time to propagate
- Try again in 10-15 minutes

### Issue: Still Getting Connection Errors

**Check 1: Backend is Running**
```bash
cd backend
npm run dev
```

**Check 2: Test Locally**
```bash
curl http://localhost:3000/health
```

Should work locally.

**Check 3: Test Through Tunnel**
```bash
curl https://api.jm-placemats.com/health
```

Should work through tunnel.

### Issue: Mixed Content Errors

The frontend is still trying to use `http://100.67.16.35:3000`.

**Solution:**
1. Make sure `.env.production` has: `VITE_API_URL=https://api.jm-placemats.com`
2. Rebuild: `npm run build`
3. Deploy new build
4. Clear browser cache

## Quick Checklist

- [ ] Cloudflare tunnel is running
- [ ] DNS CNAME record created in Cloudflare
- [ ] DNS record points to `[tunnel-id].cfargotunnel.com`
- [ ] Proxy is enabled (orange cloud)
- [ ] Waited for DNS propagation (5-15 minutes)
- [ ] `nslookup api.jm-placemats.com` resolves
- [ ] `curl https://api.jm-placemats.com/health` works
- [ ] Frontend uses `https://api.jm-placemats.com` (no port)
- [ ] Frontend rebuilt and deployed
