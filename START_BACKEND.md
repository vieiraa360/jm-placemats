# How to Start the Backend Server

## The Issue

The backend server is **not running**. That's why you're getting "Cannot connect to server" errors.

## Solution: Start the Backend

### Step 1: Open a Terminal

Open a new terminal/command prompt window.

### Step 2: Navigate to Backend Folder

```bash
cd C:\Users\helde\Documents\jm-placemats\backend
```

### Step 3: Start the Server

```bash
npm run dev
```

### Step 4: Wait for These Messages

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
✅ Email server is ready to send messages
✅ Stripe initialized
```

**Important:** Keep this terminal window open! The server needs to keep running.

### Step 5: Test the Connection

Once you see "🚀 Server running", test it:

**Option A: Browser**
- Open: http://localhost:3000/health
- Should see: `{"status":"ok","message":"Server is running"}`

**Option B: Command Line**
```bash
curl http://localhost:3000/health
```

### Step 6: Try Payment Again

Now that backend is running, go back to your website and try the checkout process again.

## Common Issues

### Issue: "MongoDB connection error"

**Solution:** Make sure MongoDB is running or check your `MONGODB_URI` in `backend/.env`

### Issue: "Port 3000 already in use"

**Solution:** 
1. Another process is using port 3000
2. Change port in `backend/.env`: `PORT=3001`
3. Or stop the other process using port 3000

### Issue: "Cannot find module"

**Solution:**
```bash
cd backend
npm install
```

## Keep Backend Running

**Important:** The backend server must stay running while you're testing!

- ✅ Keep the terminal window open
- ✅ Don't close it
- ✅ If you close it, the backend stops and payments won't work

## Quick Checklist

- [ ] Backend terminal shows "🚀 Server running on http://localhost:3000"
- [ ] Can access http://localhost:3000/health in browser
- [ ] Frontend is also running (in a different terminal)
- [ ] Try checkout process again

## Running Both Servers

You need **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Both must be running at the same time!
