# Troubleshooting MongoDB Connection

## Current Issue: IP Whitelist Not Working

Even though you added your IP, the connection is still failing. Let's troubleshoot:

## Step 1: Verify IP in Atlas

1. Go to MongoDB Atlas → Network Access
2. Check if `31.41.250.237` shows as **"Active"** (green status)
3. If it shows "Pending" or "Failed", wait a few more minutes

## Step 2: Try "Allow Access from Anywhere" (Temporary)

This will help us determine if it's an IP issue or something else:

1. **In MongoDB Atlas Network Access:**
   - Click "Add IP Address"
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0`
   - Click "Confirm"
   - Wait 2-3 minutes

2. **Restart your server:**
   ```bash
   npm run dev
   ```

3. **If this works:**
   - The issue was IP-related
   - You can keep `0.0.0.0/0` for development
   - Remove it before production

4. **If this still doesn't work:**
   - The issue is likely with the connection string or credentials
   - See Step 3 below

## Step 3: Check Connection String

Common issues with connection strings:

### Issue A: Password Has Special Characters

If your MongoDB password has special characters like `@`, `#`, `$`, `%`, etc., they need to be URL-encoded:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`

**Example:**
If your password is `MyP@ss#123`, the connection string should be:
```
mongodb+srv://username:MyP%40ss%23123@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
```

### Issue B: Wrong Username or Password

1. **Double-check in MongoDB Atlas:**
   - Go to **Security** → **Database Access**
   - Verify your username is correct
   - If you forgot the password, you'll need to reset it

2. **Reset Password (if needed):**
   - Click on your database user
   - Click "Edit" or "Reset Password"
   - Generate a new password
   - **Save it!**
   - Update your `.env` file

### Issue C: Connection String Format

Make sure your connection string looks exactly like this:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
```

**Check:**
- ✅ Starts with `mongodb+srv://`
- ✅ Has username and password (no `<username>` or `<password>` placeholders)
- ✅ Has `/jm-placemats` before the `?`
- ✅ No extra spaces
- ✅ No quotes around the value in `.env`

### Issue D: Database Name

Make sure you added `/jm-placemats` to the connection string:
- ❌ Wrong: `mongodb+srv://...@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
- ✅ Correct: `mongodb+srv://...@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority`

## Step 4: Test Connection String Directly

You can test your connection string using MongoDB Compass or mongosh:

### Using mongosh (if installed):
```bash
mongosh "your-connection-string-here"
```

### Using MongoDB Compass:
1. Download: https://www.mongodb.com/try/download/compass
2. Paste your connection string
3. Click "Connect"
4. See if it connects

## Step 5: Check .env File

1. **Make sure `.env` is in the right place:**
   - Should be in `backend/.env` (same folder as `package.json`)

2. **Check for syntax errors:**
   - No spaces around `=`
   - No quotes around values (unless the value itself needs quotes)
   - Each variable on its own line

3. **Verify MONGODB_URI is set:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jm-placemats?retryWrites=true&w=majority
   ```

## Step 6: Get Fresh Connection String

Sometimes it helps to get a fresh connection string from Atlas:

1. Go to MongoDB Atlas
2. Click "Connect" on your cluster
3. Click "Connect your application"
4. Select "Node.js" driver
5. Copy the connection string
6. Replace `<username>` and `<password>`
7. Add `/jm-placemats` before the `?`
8. Update your `.env` file
9. Restart server

## Common Solutions Summary

| Problem | Solution |
|---------|----------|
| IP not whitelisted | Add IP or use `0.0.0.0/0` for development |
| Password has special chars | URL-encode them (`@` → `%40`) |
| Wrong username/password | Reset password in Atlas |
| Connection string format | Verify it matches the correct format |
| .env file location | Must be in `backend/` folder |
| Changes not taking effect | Wait 2-3 minutes, restart server |

## Still Not Working?

1. **Check MongoDB Atlas Status:**
   - Make sure your cluster is running (green status)
   - Check for any alerts or warnings

2. **Check Firewall:**
   - Make sure your firewall isn't blocking MongoDB connections
   - MongoDB uses port 27017

3. **Check VPN:**
   - If you're using a VPN, disconnect it or add the VPN IP to whitelist

4. **Contact Support:**
   - MongoDB Atlas Support: https://www.mongodb.com/support
   - Community Forums: https://developer.mongodb.com/community/forums/

