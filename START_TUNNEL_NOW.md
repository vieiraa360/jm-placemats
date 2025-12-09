# ⚠️ START CLOUDFLARE TUNNEL NOW

## The Problem

You're getting `ERR_NAME_NOT_RESOLVED` because **the Cloudflare tunnel is not running**.

The DNS record exists, but it points to a tunnel that needs to be active.

## Quick Fix

### Open a New Terminal Window

**Keep your backend terminal running**, and open a **second terminal** for the tunnel.

### Run This Command

```bash
cloudflared tunnel run jm-placemats-backend
```

### What You Should See

```
Connection established
```

### Keep It Running!

**Don't close this terminal!** The tunnel must stay running.

## Verify It's Working

After starting the tunnel, wait 1-2 minutes, then:

```bash
# Test DNS
nslookup api.jm-placemats.com

# Test backend
curl https://api.jm-placemats.com/health
```

Should work now!

## Why This Is Needed

- DNS record points to: `[tunnel-id].cfargotunnel.com`
- This tunnel needs to be **active** to work
- When tunnel stops, DNS can't resolve
- Tunnel creates the connection between internet and your local backend

## Running Both Services

You need **TWO terminals running**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Tunnel:**
```bash
cloudflared tunnel run jm-placemats-backend
```

**Both must stay running!**

## Auto-Start Tunnel (Optional)

To avoid starting manually every time, set it up as a Windows service (see `TROUBLESHOOT_DNS.md`).

## Quick Test

1. Start tunnel: `cloudflared tunnel run jm-placemats-backend`
2. Wait 1-2 minutes
3. Test: `curl https://api.jm-placemats.com/health`
4. Should work!

## Summary

**The tunnel is the missing piece!** Start it and everything should work.
