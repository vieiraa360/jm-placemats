# MongoDB Atlas Setup Guide - Step by Step

This guide will walk you through setting up MongoDB Atlas for your JM Placemats backend.

## Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click **"Try Free"** or **"Sign Up"**

2. **Sign Up**
   - Choose your preferred sign-up method:
     - Google account (easiest)
     - Email address
   - Fill in your details and verify your email if needed

---

## Step 2: Create Your First Cluster

1. **After logging in**, you'll see the **"Deploy a cloud database"** screen

2. **Choose a Cloud Provider & Region**
   - **Recommended:** Select the provider closest to you (AWS, Google Cloud, or Azure)
   - **Region:** Choose a region close to your location or your server's location
   - **Important:** The free tier (M0) is perfect for development and small projects

3. **Select Cluster Tier**
   - Choose **"M0 Sandbox"** (Free tier)
   - This gives you:
     - 512 MB storage
     - Shared RAM and vCPU
     - Perfect for development and small production apps

4. **Name Your Cluster** (optional)
   - Default name is fine: `Cluster0`
   - Or use something like: `jm-placemats-cluster`

5. **Click "Create Deployment"**
   - This will take 3-5 minutes to set up

---

## Step 3: Create Database User

While your cluster is being created:

1. **Set Up Database Access**
   - You'll see a prompt: **"Create your first database user"**
   - Or go to: **Security** → **Database Access** (left sidebar)

2. **Create User**
   - Click **"Add New Database User"**
   - Choose **"Password"** authentication method
   - **Username:** Choose a username (e.g., `jmplacemats-admin`)
   - **Password:** 
     - Click **"Autogenerate Secure Password"** (recommended)
     - **OR** create your own strong password
     - **⚠️ IMPORTANT:** Copy and save this password! You'll need it for the connection string.

3. **Set User Privileges**
   - Select **"Atlas admin"** (full access) - fine for your own project
   - Or **"Read and write to any database"** if you prefer

4. **Click "Add User"**

---

## Step 4: Configure Network Access (Whitelist IPs)

This is crucial - MongoDB Atlas blocks all connections by default for security.

1. **Go to Network Access**
   - Click **"Network Access"** in the left sidebar
   - Or you'll see a prompt during setup

2. **Add IP Address**
   - Click **"Add IP Address"**
   
3. **For Development (Local Machine):**
   - Click **"Add Current IP Address"** button (easiest)
   - **OR** manually enter your IP
   - **OR** click **"Allow Access from Anywhere"** (for development only - less secure)
     - This adds `0.0.0.0/0` which allows all IPs
     - ⚠️ Only use this for development/testing

4. **For Production Server:**
   - You'll need to add your server's IP address later
   - For now, you can use "Allow Access from Anywhere" during development
   - **Before production:** Remove `0.0.0.0/0` and add only your server's IP

5. **Click "Confirm"**

---

## Step 5: Get Your Connection String

1. **Wait for Cluster to Finish Creating**
   - You'll see a green checkmark when it's ready (usually 3-5 minutes)

2. **Click "Connect"** button on your cluster

3. **Choose Connection Method**
   - Click **"Connect your application"**

4. **Select Driver**
   - **Driver:** Node.js
   - **Version:** 5.5 or later (or latest)

5. **Copy Connection String**
   - You'll see something like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Replace Placeholders**
   - Replace `<username>` with your database username (from Step 3)
   - Replace `<password>` with your database password (from Step 3)
   - **Example:**
     ```
     mongodb+srv://jmplacemats-admin:MySecurePassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

7. **Add Database Name**
   - Add `/jm-placemats` before the `?` in the connection string
   - **Final connection string should look like:**
     ```
     mongodb+srv://jmplacemats-admin:MySecurePassword123@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
     ```

---

## Step 6: Configure Your Backend

1. **Create `.env` file** (if you haven't already)
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` file**
   - Open `.env` in your text editor
   - Find the `MONGODB_URI` line
   - Paste your connection string:
     ```env
     MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
     ```
   - **Important:** Make sure there are no spaces around the `=` sign
   - **Important:** If your password has special characters, they might need URL encoding:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `$` becomes `%24`
     - etc.

---

## Step 7: Test Your Connection

1. **Start your backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Look for success message**
   - You should see: `✅ Connected to MongoDB`
   - If you see an error, check the troubleshooting section below

3. **Test the API**
   - Make a test request to your contact endpoint
   - Check MongoDB Atlas to see if data was saved:
     - Go to **"Browse Collections"** in Atlas
     - You should see your `contactinquiries` collection

---

## Step 8: View Your Data in Atlas

1. **Go to Collections**
   - Click **"Browse Collections"** button on your cluster
   - Or go to **"Database"** → **"Browse Collections"**

2. **Create Database** (if needed)
   - If you don't see `jm-placemats` database:
     - Click **"Create Database"**
     - Database name: `jm-placemats`
     - Collection name: `contactinquiries` (or whatever your model uses)

3. **View Data**
   - Click on your collection to see stored documents
   - You can view, edit, and delete data directly in Atlas

---

## Troubleshooting

### ❌ Connection Error: "Authentication failed"

**Problem:** Wrong username or password in connection string

**Solution:**
- Double-check your username and password
- Make sure you're using the database user password, not your Atlas account password
- If password has special characters, URL-encode them:
  - Use an online URL encoder: https://www.urlencoder.org/
  - Or regenerate password without special characters

### ❌ Connection Error: "IP not whitelisted"

**Problem:** Your IP address isn't allowed to connect

**Solution:**
- Go to **Network Access** in Atlas
- Click **"Add IP Address"**
- Click **"Add Current IP Address"**
- Wait 1-2 minutes for changes to propagate

### ❌ Connection Error: "getaddrinfo ENOTFOUND"

**Problem:** Network/DNS issue or wrong connection string

**Solution:**
- Check your connection string is correct
- Make sure you didn't accidentally delete part of the URL
- Try copying the connection string again from Atlas

### ❌ Connection Timeout

**Problem:** Firewall or network blocking MongoDB port

**Solution:**
- MongoDB Atlas uses port 27017
- Make sure your firewall allows outbound connections
- If on corporate network, contact IT to allow MongoDB connections

### ✅ Connection Works But No Data Appears

**Problem:** Database/collection doesn't exist yet

**Solution:**
- This is normal! MongoDB creates databases and collections automatically
- Make a test API request first
- Then check Atlas - the database will appear after first write

---

## Security Best Practices

### For Development:
- ✅ Use "Allow Access from Anywhere" (`0.0.0.0/0`) is okay for testing
- ✅ Use strong database user password
- ✅ Don't commit `.env` file to git

### For Production:
- ⚠️ **Remove** `0.0.0.0/0` from Network Access
- ✅ Add only your server's specific IP address
- ✅ Use strong, unique password
- ✅ Consider using MongoDB Atlas IP Access List with specific IPs
- ✅ Enable MongoDB Atlas monitoring and alerts
- ✅ Regularly rotate database passwords

---

## Quick Reference

### Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### Where to Find Things in Atlas:
- **Connection String:** Cluster → Connect → Connect your application
- **Database Users:** Security → Database Access
- **IP Whitelist:** Security → Network Access
- **View Data:** Database → Browse Collections
- **Cluster Status:** Deployments → Your cluster name

### Important URLs:
- MongoDB Atlas Dashboard: https://cloud.mongodb.com/
- MongoDB Documentation: https://docs.atlas.mongodb.com/
- Connection String Help: https://docs.atlas.mongodb.com/connect-to-cluster/

---

## Next Steps

Once MongoDB Atlas is set up:

1. ✅ Test your backend connection
2. ✅ Make a test API request
3. ✅ Verify data appears in Atlas
4. ✅ Set up email configuration (see SETUP.md)
5. ✅ When deploying to server, add server IP to Network Access

---

## Need Help?

- **MongoDB Atlas Support:** https://www.mongodb.com/support
- **MongoDB Community Forums:** https://developer.mongodb.com/community/forums/
- **Atlas Documentation:** https://docs.atlas.mongodb.com/

---

**You're all set!** Your MongoDB Atlas database is ready to use. 🎉

