# Quick Setup Checklist

Follow these steps to get MongoDB Atlas set up quickly:

## ✅ Step-by-Step Checklist

### 1. Create MongoDB Atlas Account
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Click "Try Free" and sign up
- [ ] Verify your email if needed

### 2. Create Cluster
- [ ] Click "Build a Database"
- [ ] Choose **M0 Sandbox** (Free tier)
- [ ] Select region closest to you
- [ ] Click "Create Deployment"
- [ ] Wait 3-5 minutes for cluster to be created

### 3. Create Database User
- [ ] Click "Create Database User" (or Security → Database Access)
- [ ] Choose username (e.g., `jmplacemats-admin`)
- [ ] Click "Autogenerate Secure Password" (or create your own)
- [ ] **⚠️ COPY AND SAVE THE PASSWORD!**
- [ ] Select "Atlas admin" privileges
- [ ] Click "Add User"

### 4. Configure Network Access
- [ ] Click "Network Access" (or you'll see a prompt)
- [ ] Click "Add IP Address"
- [ ] Click "Add Current IP Address" (for development)
- [ ] **OR** Click "Allow Access from Anywhere" (`0.0.0.0/0`) for testing
- [ ] Click "Confirm"

### 5. Get Connection String
- [ ] Wait for cluster to finish (green checkmark)
- [ ] Click "Connect" button on your cluster
- [ ] Click "Connect your application"
- [ ] Select "Node.js" driver
- [ ] Copy the connection string
- [ ] Replace `<username>` with your database username
- [ ] Replace `<password>` with your database password
- [ ] Add `/jm-placemats` before the `?` in the connection string

**Example:**
```
mongodb+srv://jmplacemats-admin:MyPassword123@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
```

### 6. Create .env File
- [ ] In the `backend` folder, create a file named `.env`
- [ ] Copy the template below and fill in your values:

```env
PORT=3000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@jmplacemats.com
EMAIL_TO=contact@jmplacemats.com
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

### 7. Test Connection
- [ ] Run `npm install` in the backend folder
- [ ] Run `npm run dev`
- [ ] Look for: `✅ Connected to MongoDB`
- [ ] If you see an error, check the troubleshooting section in MONGODB_ATLAS_SETUP.md

### 8. Verify It Works
- [ ] Make a test API request to `/api/contact`
- [ ] Go to MongoDB Atlas → Browse Collections
- [ ] You should see your data!

---

## 🚨 Common Issues

**Connection Error?**
- Check username/password are correct
- Make sure IP is whitelisted
- Wait 1-2 minutes after adding IP address

**Password has special characters?**
- URL-encode them (e.g., `@` becomes `%40`)
- Or regenerate password without special characters

**Can't see data?**
- Make a test API request first
- MongoDB creates databases/collections automatically on first write

---

## 📚 Need More Details?

See the full guide: `MONGODB_ATLAS_SETUP.md`

