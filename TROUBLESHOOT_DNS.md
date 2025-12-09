# Troubleshoot DNS: ERR_NAME_NOT_RESOLVED

## Current Status

✅ Frontend correctly configured: `https://api.jm-placemats.com` (no port)
✅ DNS record created in Cloudflare
❌ Still getting `ERR_NAME_NOT_RESOLVED`

## Most Common Cause

**The Cloudflare tunnel is NOT running!**

The DNS record points to the tunnel, but if the tunnel isn't running, DNS can't resolve.

## Step-by-Step Fix

### Step 1: Check if Tunnel is Running

```bash
tasklist | findstr cloudflared
```

If nothing shows up, the tunnel is NOT running.

### Step 2: Start the Tunnel

Open a **new terminal window** and run:

```bash
cloudflared tunnel run jm-placemats-backend
```

**Important:** 
- Keep this terminal open
- You should see: `Connection established`
- If you close this terminal, the tunnel stops

### Step 3: Verify Tunnel is Connected

After starting, you should see:
```
Connection established
```

If you see errors, the tunnel isn't configured correctly.

### Step 4: Wait 1-2 Minutes

After starting the tunnel, wait 1-2 minutes for it to connect.

### Step 5: Test DNS Resolution

```bash
nslookup api.jm-placemats.com
```

Should now return Cloudflare IP addresses.

### Step 6: Test Backend

```bash
curl https://api.jm-placemats.com/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### Step 7: Test Frontend

1. Open: https://jm-placemats.com/checkout
2. Try checkout
3. Should work!

## Running Tunnel as Service (Auto-Start)

To avoid having to manually start the tunnel every time:

### Option 1: Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: "When the computer starts"
4. Action: Start a program
5. Program: `C:\path\to\cloudflared.exe`
6. Arguments: `tunnel run jm-placemats-backend`
7. Check "Run whether user is logged on or not"

### Option 2: NSSM (Recommended)

```bash
# Download NSSM: https://nssm.cc/download
# Extract to C:\nssm\

# Install service
C:\nssm\nssm.exe install CloudflaredTunnel "C:\path\to\cloudflared.exe" "tunnel run jm-placemats-backend"

# Set working directory
C:\nssm\nssm.exe set CloudflaredTunnel AppDirectory "C:\path\to\cloudflared"

# Start service
C:\nssm\nssm.exe start CloudflaredTunnel
```

## Verification Checklist

- [ ] Tunnel is running: `cloudflared tunnel run jm-placemats-backend`
- [ ] Shows: `Connection established`
- [ ] Backend is running: `npm run dev` in backend folder
- [ ] Waited 1-2 minutes after starting tunnel
- [ ] `nslookup api.jm-placemats.com` resolves
- [ ] `curl https://api.jm-placemats.com/health` works
- [ ] Frontend can connect

## Common Issues

### Issue: Tunnel Won't Start

**Error:** "Tunnel not found" or "Credentials not found"

**Solution:**
```bash
# Re-authenticate
cloudflared tunnel login

# Verify tunnel exists
cloudflared tunnel list
```

### Issue: Tunnel Starts But DNS Still Doesn't Resolve

**Check 1: DNS Record Target**
- Go to Cloudflare Dashboard → DNS → Records
- Check `api` CNAME record
- Target should be: `[tunnel-id].cfargotunnel.com`
- Make sure tunnel ID matches

**Check 2: Wait Longer**
- DNS can take 5-15 minutes
- Try flushing DNS: `ipconfig /flushdns`

**Check 3: Test from Different Network**
- Try from mobile data
- Sometimes local DNS caches

### Issue: Tunnel Connects But Backend Not Accessible

**Check 1: Backend is Running**
```bash
curl http://localhost:3000/health
```

**Check 2: Tunnel Config**
- Tunnel should point to: `http://localhost:3000`
- Check tunnel config file

## Quick Test Commands

```bash
# 1. Check tunnel is running
tasklist | findstr cloudflared

# 2. Test DNS
nslookup api.jm-placemats.com

# 3. Test backend locally
curl http://localhost:3000/health

# 4. Test through tunnel
curl https://api.jm-placemats.com/health
```

## Summary

**The tunnel MUST be running for DNS to work!**

1. Start tunnel: `cloudflared tunnel run jm-placemats-backend`
2. Keep it running
3. Wait 1-2 minutes
4. Test connection
5. Everything should work!

If the tunnel isn't running, DNS will never resolve, even though the DNS record exists.
