# Setting Up Network Access for Backend

## The Problem

Backend works on the same PC but not from other machines on the network. This is because the server was only listening on `localhost`.

## What I Fixed

1. **Server now listens on all network interfaces** (`0.0.0.0`) instead of just `localhost`
2. **CORS updated** to allow connections from other machines on your local network
3. **Server shows your local IP** when it starts

## After Restarting Backend

When you restart the backend, you should now see:

```
🚀 Server running on http://localhost:3000
🌐 Server accessible on network at http://192.168.x.x:3000
```

The second line shows your computer's IP address on the local network.

## Configuring Frontend on Other Machine

### Option 1: Use Local IP Address (Recommended)

On the other machine, you need to tell the frontend where the backend is.

**Find your PC's IP address:**
- Look at the backend terminal output (shows after "🌐 Server accessible on network at")
- Or run: `ipconfig` (Windows) and look for "IPv4 Address"

**Create `.env` file in the root directory** (same level as `package.json`):

```env
VITE_API_URL=http://192.168.x.x:3000
```

Replace `192.168.x.x` with your actual IP address.

**Restart the frontend** on the other machine.

### Option 2: Use Environment Variable

When starting the frontend on the other machine:

```bash
VITE_API_URL=http://192.168.x.x:3000 npm run dev
```

## Finding Your IP Address

### Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your network adapter (usually Wi-Fi or Ethernet).

### Or check backend terminal:
The backend now shows your IP when it starts:
```
🌐 Server accessible on network at http://192.168.1.100:3000
```

## Firewall Configuration

Windows Firewall might block incoming connections. You may need to:

1. **Allow Node.js through firewall:**
   - Windows Security → Firewall & network protection
   - Allow an app through firewall
   - Find "Node.js" and allow it for Private networks

2. **Or create a firewall rule:**
   - Allow incoming connections on port 3000
   - For Private networks only

## Testing from Another Machine

### Step 1: Find Backend IP

Look at backend terminal output:
```
🌐 Server accessible on network at http://192.168.1.100:3000
```

### Step 2: Test Backend Connection

On the other machine, open browser:
```
http://192.168.1.100:3000/health
```

Should see: `{"status":"ok","message":"Server is running"}`

### Step 3: Configure Frontend

On the other machine, create `.env`:
```env
VITE_API_URL=http://192.168.1.100:3000
```

### Step 4: Start Frontend

```bash
npm run dev
```

### Step 5: Test Payment

Try the checkout process from the other machine.

## Troubleshooting

### Issue: Still can't connect from other machine

**Check 1: Firewall**
- Windows Firewall might be blocking port 3000
- Allow Node.js through firewall

**Check 2: IP Address**
- Make sure both machines are on the same network
- Verify the IP address is correct

**Check 3: Backend is listening**
- Check backend terminal shows: `🌐 Server accessible on network at http://...`
- If it only shows `localhost`, the fix didn't apply - restart backend

### Issue: CORS error from other machine

The CORS is now configured to allow local network IPs. If you still see CORS errors:

1. Check the error message - it will show which origin was blocked
2. Add that origin to `backend/.env`:
   ```env
   FRONTEND_URL=http://192.168.x.x:5173
   ```
3. Restart backend

### Issue: Connection timeout

**Possible causes:**
1. Firewall blocking port 3000
2. Wrong IP address
3. Machines not on same network

**Solution:**
- Check firewall settings
- Verify IP address with `ipconfig`
- Make sure both machines are on same Wi-Fi/network

## Production Deployment

For production (when deploying to a server), you'll want to:

1. Set specific allowed origins in `backend/.env`:
   ```env
   FRONTEND_URL=https://jm-placemats.com
   NODE_ENV=production
   ```

2. Use a reverse proxy (nginx) for better security

3. Use HTTPS for all connections

## Quick Checklist

- [ ] Backend restarted and shows network IP
- [ ] Found your PC's IP address
- [ ] Created `.env` on other machine with `VITE_API_URL`
- [ ] Tested backend health endpoint from other machine
- [ ] Firewall allows Node.js/port 3000
- [ ] Frontend restarted on other machine
- [ ] Payment works from other machine
