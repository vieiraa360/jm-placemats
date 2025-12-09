# Verify Tunnel Configuration for Backend

## Current Status

✅ Tunnel is running
✅ Frontend works (jm-placemats.com)
✅ DNS record created for api.jm-placemats.com
⏳ Waiting for DNS propagation

## Important: Check Tunnel Configuration

Since your tunnel serves both frontend and backend, make sure the backend route is configured.

### Find Your Tunnel Config File

The config is usually at:
- `C:\Users\helde\.cloudflared\config.yml`
- Or `C:\ProgramData\cloudflared\config.yml` (if running as service)

### Verify Backend Route Exists

Your config should have:

```yaml
tunnel: [your-tunnel-id]
credentials-file: C:\Users\helde\.cloudflared\[tunnel-id].json

ingress:
  # Frontend (already working)
  - hostname: jm-placemats.com
    service: http://localhost:3001  # or your frontend port
  
  # Backend (must be here!)
  - hostname: api.jm-placemats.com
    service: http://localhost:3000
  
  # Catch-all (must be last)
  - service: http_status:404
```

**Important:** The `api.jm-placemats.com` route must be in the config!

### If Backend Route is Missing

Add it to your config file, then restart the tunnel:

```bash
# Stop tunnel (Ctrl+C)
# Restart tunnel
cloudflared tunnel run jm-placemats-backend
```

## Test DNS Propagation

### Quick Test

```bash
# Test DNS resolution
nslookup api.jm-placemats.com

# Test backend
curl https://api.jm-placemats.com/health
```

### Or Use Test Script

I created `test-dns.js` - run it:

```bash
node test-dns.js
```

This will tell you if DNS is ready.

## DNS Propagation Timeline

- **0-2 minutes:** Usually not ready
- **2-5 minutes:** Should start resolving
- **5-15 minutes:** Fully propagated

## What to Do

1. **Verify tunnel config** has `api.jm-placemats.com` route
2. **Wait 2-5 minutes** for DNS propagation
3. **Test every 2 minutes:**
   ```bash
   curl https://api.jm-placemats.com/health
   ```
4. **When it works:** Frontend should connect!

## Quick Checklist

- [x] Tunnel is running ✅
- [x] Frontend works ✅
- [x] DNS record created ✅
- [ ] Tunnel config has `api.jm-placemats.com` route
- [ ] Wait 2-5 minutes
- [ ] Test DNS resolution
- [ ] Frontend connects

## Summary

Your setup looks good! Just:
1. Verify tunnel config includes backend route
2. Wait 2-5 minutes for DNS
3. Test connection
4. Should work! 🎉
