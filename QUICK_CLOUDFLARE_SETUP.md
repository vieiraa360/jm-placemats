# Quick Cloudflare Tunnel Setup

## 5-Minute Setup Guide

### Step 1: Install Cloudflared

**Windows (PowerShell as Admin):**
```powershell
# Using Chocolatey
choco install cloudflared

# Or download from: https://github.com/cloudflare/cloudflared/releases
```

### Step 2: Login

```bash
cloudflared tunnel login
```
- Select your domain: `jm-placemats.com`
- Authorize in browser

### Step 3: Create Tunnel

```bash
cloudflared tunnel create jm-placemats-backend
```

**Note the Tunnel ID** (you'll need it)

### Step 4: Create DNS Record

```bash
cloudflared tunnel route dns jm-placemats-backend api.jm-placemats.com
```

This creates `api.jm-placemats.com` pointing to your tunnel.

### Step 5: Run Tunnel

```bash
cloudflared tunnel run jm-placemats-backend
```

**Keep this running!** (Or set it up as a service - see full guide)

### Step 6: Test

Open in browser: **https://api.jm-placemats.com/health**

Should see: `{"status":"ok","message":"Server is running"}`

### Step 7: Update Backend .env

```env
FRONTEND_URL=https://jm-placemats.com
NODE_ENV=production
```

Restart backend.

### Step 8: Rebuild Frontend

The frontend code already detects production and will use `https://api.jm-placemats.com`.

Rebuild:
```bash
npm run build
```

Deploy the new build.

## Running Tunnel as Service (Auto-start)

### Using NSSM:

1. Download NSSM: https://nssm.cc/download
2. Extract to `C:\nssm\`
3. Run:
```bash
C:\nssm\nssm.exe install CloudflaredTunnel "C:\path\to\cloudflared.exe" "tunnel run jm-placemats-backend"
C:\nssm\nssm.exe start CloudflaredTunnel
```

## That's It! 🎉

Your backend is now publicly accessible at:
- **https://api.jm-placemats.com**

No port forwarding, no firewall changes needed!

## Troubleshooting

**Can't connect?**
- Make sure backend is running: `cd backend && npm run dev`
- Make sure tunnel is running: `cloudflared tunnel run jm-placemats-backend`
- Test locally first: `curl http://localhost:3000/health`

**DNS not working?**
- Wait 2-5 minutes for DNS propagation
- Check Cloudflare dashboard → DNS → Records

**CORS errors?**
- Restart backend after updating `.env`
- Check backend logs for CORS warnings
