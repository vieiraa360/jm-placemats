# Verify DNS and Tunnel Setup

## DNS Record Status ✅

Your DNS record is created:
- **Name:** `api.jm-placemats.com`
- **Type:** CNAME
- **Target:** `8164b817-6d70-4ebc-82e...` (your tunnel)
- **Proxy:** Proxied (orange cloud) ✅

## Next Steps: Verify Everything Works

### Step 1: Make Sure Tunnel is Running

The tunnel must be running for DNS to work:

```bash
cloudflared tunnel run jm-placemats-backend
```

Should show: `Connection established`

**Keep this running!** The tunnel needs to stay active.

### Step 2: Wait for DNS Propagation

DNS changes can take:
- **1-5 minutes** (usually)
- **Up to 15 minutes** (sometimes)

### Step 3: Test DNS Resolution

After 2-3 minutes, test:

```bash
# Windows
nslookup api.jm-placemats.com

# Should return Cloudflare IP addresses
```

### Step 4: Test Backend Through Tunnel

```bash
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### Step 5: Test Frontend

1. Open: https://jm-placemats.com/checkout
2. Open Console (F12)
3. Should see: `API_BASE_URL set to: https://api.jm-placemats.com`
4. Try checkout - should work!

## Troubleshooting

### Issue: Still Getting ERR_NAME_NOT_RESOLVED

**Check 1: Wait Longer**
- DNS can take 5-15 minutes
- Try again in a few minutes

**Check 2: Tunnel is Running**
```bash
cloudflared tunnel run jm-placemats-backend
```

**Check 3: Backend is Running**
```bash
cd backend
npm run dev
```

**Check 4: Test Locally First**
```bash
curl http://localhost:3000/health
```

Should work locally.

### Issue: DNS Resolves But Backend Not Accessible

**Check 1: Tunnel Configuration**
- Make sure tunnel config points to `http://localhost:3000`
- Check tunnel is connected: `Connection established`

**Check 2: Backend is Running**
- Backend must be running on `localhost:3000`
- Check backend terminal for errors

**Check 3: Test Tunnel Directly**
```bash
curl https://api.jm-placemats.com/health
```

If this fails, the tunnel isn't forwarding correctly.

## Quick Verification Checklist

- [ ] DNS record exists in Cloudflare (✅ Done!)
- [ ] Tunnel is running: `cloudflared tunnel run jm-placemats-backend`
- [ ] Backend is running: `npm run dev` in backend folder
- [ ] Waited 2-5 minutes for DNS
- [ ] `nslookup api.jm-placemats.com` resolves
- [ ] `curl https://api.jm-placemats.com/health` works
- [ ] Frontend can connect (no ERR_NAME_NOT_RESOLVED)

## Expected Timeline

1. **Now:** DNS record created ✅
2. **2-5 minutes:** DNS propagates
3. **After propagation:** `api.jm-placemats.com` resolves
4. **Test:** Frontend connects successfully

## If Still Not Working After 10 Minutes

1. **Check tunnel is running** - Most common issue
2. **Check backend is running** - Must be on localhost:3000
3. **Verify DNS record** - Make sure it's Proxied (orange cloud)
4. **Try different DNS server** - Sometimes local DNS caches

## Summary

Your DNS is set up correctly! Now:
1. Make sure tunnel is running
2. Wait 2-5 minutes for DNS
3. Test the connection
4. Everything should work! 🎉
