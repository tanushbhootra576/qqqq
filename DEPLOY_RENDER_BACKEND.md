# 🚀 Deploy Backend to Render (Free)

Render is the easiest free way to host your Node.js backend. It's free tier supports production use.

---

## 📋 Prerequisites

- GitHub account (free)
- Render account (free) - https://render.com/
- Backend pushed to GitHub

---

## Step 1: Prepare Backend for Production

### Update server.js for Environment Variables

The backend needs small changes to work on Render.

**File:** `backend/server.js` (around line 8)

Change from:

```javascript
const PORT = 4000;
```

To:

```javascript
const PORT = process.env.PORT || 4000;
```

This allows Render to assign the port dynamically.

### Add start script to package.json

**File:** `backend/package.json`

Make sure "scripts" section has:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node server.js"
}
```

---

## Step 2: Push to GitHub

If not done already:

```powershell
cd d:\qqqq

git init
git add .
git commit -m "Backend and frontend ready for deployment"
git remote add origin https://github.com/USERNAME/esp32-vitals-dashboard.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Render

### Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect"** next to your GitHub repository
4. Authorize Render to access GitHub
5. Select your `esp32-vitals-dashboard` repository
6. Click "Connect"

### Configure Deployment Settings

Fill in the form:

| Field              | Value                  |
| ------------------ | ---------------------- |
| **Name**           | `esp32-vitals-backend` |
| **Environment**    | `Node`                 |
| **Region**         | Pick closest to you    |
| **Branch**         | `main`                 |
| **Root Directory** | `backend`              |
| **Build Command**  | `npm install`          |
| **Start Command**  | `node server.js`       |
| **Plan**           | Free (sufficient)      |

Then click **"Create Web Service"**

---

## Step 4: Get Your Backend URL

After deployment (2-3 minutes), Render will show you:

```
Service: esp32-vitals-backend
URL: https://esp32-vitals-backend-xxxx.onrender.com
```

**This is your backend URL!** Copy it.

---

## Step 5: Update Frontend with Backend URL

Now update the frontend to use your hosted backend.

**File:** `frontend/src/App.jsx` (line ~21)

Change:

```javascript
const response = await fetch("http://localhost:4000/api/vitals");
```

To:

```javascript
const response = await fetch(
  "https://esp32-vitals-backend-xxxx.onrender.com/api/vitals",
);
```

(Replace `xxxx` with your actual Render URL)

---

## Step 6: Redeploy Frontend

```powershell
cd d:\qqqq

git add .
git commit -m "Update backend URL for production"
git push
```

Vercel will automatically rebuild and redeploy!

---

## ✅ Backend is Live!

Test it works:

```powershell
# Replace URL with your actual Render URL
$body = @{
    heartRate = 85
    spO2 = 95
    temperature = 36.5
    lat = 40.7128
    lng = -74.0060
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://esp32-vitals-backend-xxxx.onrender.com/api/vitals" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

You should get a success response!

---

## Step 7: Update ESP32 Code

Now update your Arduino code to use the hosted backend.

**File:** `ESP32_Full_Vitals.ino` (line ~31)

Change:

```cpp
#define SERVER_URL "http://192.168.1.100:4000/api/vitals"
```

To:

```cpp
#define SERVER_URL "https://esp32-vitals-backend-xxxx.onrender.com/api/vitals"
```

### Important: Also Update WiFi Credentials

**Lines 27-28:**

```cpp
#define WIFI_SSID "YOUR_SSID"
#define WIFI_PASS "YOUR_PASSWORD"
```

Add your actual WiFi network name and password.

### Upload to ESP32

1. Open `ESP32_Full_Vitals.ino` in Arduino IDE
2. Make sure ESP32 is connected via USB
3. Click **Upload** (Ctrl+U)
4. Open **Serial Monitor** (115200 baud)
5. Reset ESP32
6. Watch it connect and start sending data!

---

## 🔧 Troubleshooting

### "Build failed" or "Deployment error"

Check the logs:

1. Go to Render dashboard
2. Select your service
3. Click **"Logs"** tab
4. Look for error messages

### "Port already in use"

Render assigns the port, so this shouldn't happen. But if it does:

- Make sure `backend/server.js` uses `process.env.PORT || 4000`
- Render will set the PORT variable

### CORS errors

Add CORS header to backend to allow Vercel domain:

**File:** `backend/server.js` (update CORS config, around line 11)

Change from:

```javascript
app.use(cors());
```

To:

```javascript
app.use(
  cors({
    origin: [
      "https://esp32-vitals-dashboard.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
```

Then commit and push - Render will auto-redeploy!

### Backend shows "cold start" delay

Free tier Render services go to sleep after inactivity. Autoping with a cron job helps:

Use a free service like Uptimerobot: https://uptimerobot.com/

- Monitor: `https://your-backend-url.onrender.com/health`
- Interval: 5 minutes
- This keeps it awake

---

## 📊 Render Dashboard

You can:

- View logs: **Logs** tab
- Check metrics: **Metrics** tab
- Restart service: **More** → **Restart**
- View deployment history: Changes

---

## 🎯 Final Architecture

```
┌─────────────────────────────────────────────┐
│         HOSTED ON INTERNET                  │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Vercel)                          │
│  https://esp32-vitals-dashboard.vercel.app  │
│  ↓ GET /api/vitals                          │
│  ↓                                          │
│  Backend (Render)                           │
│  https://esp32-vitals-backend-xxxx.com      │
│  ↑ POST /api/vitals                         │
│  ↑                                          │
│  ESP32 (Your WiFi)                          │
│  Sends data every 2 seconds                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📚 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get backend URL
3. ✅ Update frontend URL
4. ✅ Redeploy frontend to Vercel
5. ✅ Update ESP32 code
6. ✅ Upload to ESP32
7. ✅ Monitor live vitals on your dashboard!

---

## 🚨 Important Notes

### Free Tier Limitations

- Render free tier services sleep after 15 min of inactivity
- Uses shared resources
- Perfect for testing/demo
- Upgrade if you need always-on service

### Production Considerations

- Add database (MongoDB Atlas is free)
- Add authentication
- Monitor performance
- Set up error logging
- Scale vertically if needed

### Keep Your Code Secure

- Never commit `.env` files
- Use Render environment variables for secrets
- Don't share API keys in code

---

## 🎉 You're Done!

Your full stack is now live on the internet:

- Frontend on Vercel ✅
- Backend on Render ✅
- Connected to ESP32 ✅

Check your live dashboard and watch real vitals stream in real-time!
