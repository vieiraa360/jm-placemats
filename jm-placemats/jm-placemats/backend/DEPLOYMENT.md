# Deployment Guide

## Recommended Approach: Develop Locally, Deploy to Server

**Best Practice:** Use MongoDB Atlas (cloud database) and develop locally, then deploy code to your production server.

### Why This Approach?

✅ **Faster Development** - Work locally without network latency  
✅ **No Database Migration** - MongoDB Atlas works from anywhere  
✅ **Safer Development** - Test without affecting production  
✅ **Easier Debugging** - Local tools and faster iteration  
✅ **Simple Deployment** - Just copy code and environment variables

---

## Step-by-Step Deployment Strategy

### Phase 1: Local Development Setup

1. **Set up MongoDB Atlas (Cloud Database)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Create a cluster (free tier is fine)
   - Get your connection string
   - **Important:** Whitelist your local IP address AND your server's IP address in Network Access

2. **Develop Locally**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with MongoDB Atlas connection string
   npm run dev
   ```

3. **Test Everything Locally**
   - Test API endpoints
   - Verify database connections
   - Test email functionality
   - Ensure everything works

### Phase 2: Server Deployment

When ready to deploy to your production server:

1. **Transfer Code to Server**
   ```bash
   # Option A: Using Git (recommended)
   git clone <your-repo-url>
   cd jm-placemats/backend
   
   # Option B: Using SCP/SFTP
   scp -r backend/ user@server:/path/to/deployment/
   ```

2. **Install Dependencies on Server**
   ```bash
   cd backend
   npm install --production
   ```

3. **Set Up Environment Variables on Server**
   ```bash
   cp .env.example .env
   nano .env  # or use your preferred editor
   ```

   **Update these values for production:**
   ```env
   PORT=3000  # or your server's port
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
   # (Same MongoDB Atlas connection - no migration needed!)
   
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@jmplacemats.com
   EMAIL_TO=contact@jmplacemats.com
   
   FRONTEND_URL=https://yourdomain.com  # Your production frontend URL
   ```

4. **Run the Server**
   
   **Option A: Using PM2 (Recommended for Production)**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name jm-placemats-api
   pm2 save
   pm2 startup  # Follow instructions to enable auto-start on reboot
   ```

   **Option B: Using systemd**
   ```bash
   # Create service file: /etc/systemd/system/jm-placemats-api.service
   # See systemd example below
   sudo systemctl enable jm-placemats-api
   sudo systemctl start jm-placemats-api
   ```

   **Option C: Simple Node (Not recommended for production)**
   ```bash
   npm start
   ```

5. **Set Up Reverse Proxy (if using Nginx)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Alternative Approaches (Not Recommended)

### ❌ Option 1: Local MongoDB + Migration

**Why not recommended:**
- Requires exporting/importing database
- More complex setup
- Potential data loss risk
- Environment differences

**If you must use this approach:**
```bash
# Export from local MongoDB
mongodump --uri="mongodb://localhost:27017/jm-placemats" --out=./backup

# Import to server MongoDB
mongorestore --uri="mongodb://server:27017/jm-placemats" ./backup/jm-placemats
```

### ❌ Option 2: Develop Directly on Server

**Why not recommended:**
- Slow development (network latency)
- Harder debugging
- Risk breaking production
- Requires constant server access

---

## Production Checklist

Before going live, ensure:

- [ ] MongoDB Atlas cluster is running
- [ ] Server IP is whitelisted in MongoDB Atlas Network Access
- [ ] Environment variables are set correctly on server
- [ ] Email credentials are working
- [ ] CORS is configured for production frontend URL
- [ ] Server is running with PM2 or systemd (auto-restart)
- [ ] Firewall allows traffic on your port
- [ ] SSL/HTTPS is configured (if using domain)
- [ ] Logs are being monitored
- [ ] Backup strategy is in place

---

## Monitoring & Maintenance

### Check Server Status
```bash
# If using PM2
pm2 status
pm2 logs jm-placemats-api

# If using systemd
sudo systemctl status jm-placemats-api
sudo journalctl -u jm-placemats-api -f
```

### Update Deployment
```bash
# Pull latest code
git pull origin main

# Restart server
pm2 restart jm-placemats-api
# or
sudo systemctl restart jm-placemats-api
```

---

## Systemd Service Example

Create `/etc/systemd/system/jm-placemats-api.service`:

```ini
[Unit]
Description=JM Placemats Backend API
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/jm-placemats/backend
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## Troubleshooting

### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist includes server IP
- Test connection: `mongosh "your-connection-string"`

### Email Not Sending
- Verify SMTP credentials
- Check firewall allows outbound port 587
- Test with a simple Node script

### Server Won't Start
- Check logs: `pm2 logs` or `journalctl -u jm-placemats-api`
- Verify environment variables are set
- Check port is not already in use: `netstat -tulpn | grep 3000`

---

## Summary

**Recommended Workflow:**
1. ✅ Set up MongoDB Atlas (cloud)
2. ✅ Develop and test locally
3. ✅ Deploy code to server
4. ✅ Use same MongoDB Atlas connection on server
5. ✅ No database migration needed!

This approach gives you the best of both worlds: fast local development with a production-ready cloud database that works everywhere.

