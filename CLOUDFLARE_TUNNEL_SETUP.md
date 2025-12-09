# Cloudflare Tunnel Setup for Backend

## What is Cloudflare Tunnel?

Cloudflare Tunnel (cloudflared) creates a secure connection from your local backend to Cloudflare's network, making it publicly accessible without:
- Opening ports on your router
- Configuring firewall rules
- Dealing with dynamic IP addresses
- Exposing your local network

## Prerequisites

1. A Cloudflare account (free)
2. A domain managed by Cloudflare (or add your domain to Cloudflare)
3. Your backend running locally on port 3000

## Step-by-Step Setup

### Step 1: Install Cloudflared

**Windows:**
1. Download: https://github.com/cloudflare/cloudflared/releases
2. Download `cloudflared-windows-amd64.exe`
3. Rename to `cloudflared.exe`
4. Place in a folder (e.g., `C:\cloudflared\`)
5. Add to PATH or use full path

**Or use Chocolatey:**
```bash
choco install cloudflared
```

**Or use Scoop:**
```bash
scoop install cloudflared
```

### Step 2: Login to Cloudflare

```bash
cloudflared tunnel login
```

This will:
1. Open your browser
2. Ask you to select your domain (jm-placemats.com)
3. Authorize the tunnel
4. Save credentials

### Step 3: Create a Tunnel

```bash
cloudflared tunnel create jm-placemats-backend
```

This creates a tunnel named `jm-placemats-backend` and gives you a tunnel ID.

### Step 4: Create DNS Record

```bash
cloudflared tunnel route dns jm-placemats-backend api.jm-placemats.com
```

This creates a DNS record `api.jm-placemats.com` that points to your tunnel.

**Or manually in Cloudflare Dashboard:**
1. Go to DNS → Records
2. Add CNAME record:
   - Name: `api`
   - Target: `[tunnel-id].cfargotunnel.com`
   - Proxy: ON (orange cloud)

### Step 5: Create Config File

Create `config.yml` in `C:\cloudflared\` (or your cloudflared folder):

```yaml
tunnel: [your-tunnel-id]
credentials-file: C:\Users\helde\.cloudflared\[tunnel-id].json

ingress:
  - hostname: api.jm-placemats.com
    service: http://localhost:3000
  - service: http_status:404
```

**To find your tunnel ID:**
```bash
cloudflared tunnel list
```

### Step 6: Run the Tunnel

**Option A: Run directly**
```bash
cloudflared tunnel run jm-placemats-backend
```

**Option B: Run as Windows Service (Recommended)**

Create a service so it runs automatically:

1. **Create service:**
```bash
cloudflared service install
```

2. **Edit service config:**
   - Open: `C:\ProgramData\cloudflared\config.yml`
   - Add your tunnel configuration

3. **Start service:**
```bash
cloudflared service start
```

**Or use NSSM (Non-Sucking Service Manager):**
```bash
# Download NSSM from https://nssm.cc/download
nssm install CloudflaredTunnel "C:\path\to\cloudflared.exe" tunnel run jm-placemats-backend
nssm start CloudflaredTunnel
```

### Step 7: Verify It's Working

1. **Check tunnel is running:**
   - Should see: `Connection established`
   - No errors

2. **Test the endpoint:**
   ```bash
   curl https://api.jm-placemats.com/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

3. **Or test in browser:**
   - https://api.jm-placemats.com/health

### Step 8: Update Backend CORS

Make sure `backend/.env` has:
```env
FRONTEND_URL=https://jm-placemats.com
NODE_ENV=production
```

The CORS configuration I added earlier should already allow `https://jm-placemats.com`.

### Step 9: Update Frontend

The code I updated should automatically use `https://api.jm-placemats.com` when running on `jm-placemats.com`.

**Or create `.env.production`:**
```env
VITE_API_URL=https://api.jm-placemats.com
```

Then rebuild:
```bash
npm run build
```

## Running Tunnel Automatically

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

### Option 3: PM2 (If you have Node.js)

```bash
npm install -g pm2

pm2 start cloudflared --name tunnel -- tunnel run jm-placemats-backend
pm2 save
pm2 startup
```

## Troubleshooting

### Issue: "Connection refused"

**Solution:**
- Make sure backend is running on `localhost:3000`
- Check backend is accessible: `curl http://localhost:3000/health`

### Issue: "DNS not resolving"

**Solution:**
- Wait a few minutes for DNS propagation
- Check Cloudflare DNS dashboard
- Verify CNAME record is correct

### Issue: "Tunnel not connecting"

**Solution:**
- Check internet connection
- Verify tunnel credentials: `cloudflared tunnel list`
- Re-authenticate: `cloudflared tunnel login`

### Issue: "CORS errors"

**Solution:**
- Make sure backend `.env` has: `FRONTEND_URL=https://jm-placemats.com`
- Restart backend after changing `.env`
- Check backend logs for CORS warnings

## Security Notes

✅ **Benefits:**
- No ports exposed to internet
- Automatic HTTPS (Cloudflare handles SSL)
- DDoS protection
- Free SSL certificate

⚠️ **Important:**
- Keep your tunnel credentials secure
- Don't commit `config.yml` with credentials to git
- Use strong Cloudflare account password
- Enable 2FA on Cloudflare account

## Testing the Setup

1. **Backend running locally:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Tunnel running:**
   ```bash
   cloudflared tunnel run jm-placemats-backend
   ```

3. **Test from internet:**
   - https://api.jm-placemats.com/health
   - Should work from any device

4. **Test payment:**
   - Go to https://jm-placemats.com/checkout
   - Should connect to backend via tunnel

## Quick Command Reference

```bash
# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create jm-placemats-backend

# List tunnels
cloudflared tunnel list

# Create DNS record
cloudflared tunnel route dns jm-placemats-backend api.jm-placemats.com

# Run tunnel
cloudflared tunnel run jm-placemats-backend

# Delete tunnel (if needed)
cloudflared tunnel delete jm-placemats-backend
```

## Next Steps

1. ✅ Install cloudflared
2. ✅ Login and create tunnel
3. ✅ Set up DNS record
4. ✅ Run tunnel
5. ✅ Test https://api.jm-placemats.com/health
6. ✅ Update frontend to use https://api.jm-placemats.com
7. ✅ Rebuild and deploy frontend
8. ✅ Test payment flow

## Cost

**Cloudflare Tunnel is FREE!** 🎉

- Free tier includes unlimited tunnels
- No bandwidth limits for reasonable use
- Free SSL certificates
- DDoS protection included
