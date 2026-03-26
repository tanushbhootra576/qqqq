# Quick Start Guide - Step by Step

## ✅ Setup Checklist

### Step 1: Install Node.js

- Download from https://nodejs.org/
- Verify installation: `node --version` and `npm --version`

### Step 2: Start Backend Server

```bash
cd backend
npm install
node server.js
```

✓ You should see: "🚀 Backend server running on http://localhost:4000"

### Step 3: Start Frontend Server (new terminal)

```bash
cd frontend
npm install
npm run dev
```

✓ You should see: "Local: http://localhost:5173/"

### Step 4: Open Dashboard

Visit http://localhost:5173/ in your browser

### Step 5: Test Backend (optional)

In PowerShell:

```powershell
$body = @{
    heartRate = 85
    spO2 = 95
    temperature = 36.5
    lat = 40.7128
    lng = -74.0060
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/vitals" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

✓ Dashboard should update with the test data!

---

## 🔧 File Locations

| File                    | Purpose              |
| ----------------------- | -------------------- |
| backend/server.js       | Main backend server  |
| backend/package.json    | Backend dependencies |
| frontend/src/App.jsx    | Main React component |
| frontend/src/main.jsx   | React entry point    |
| frontend/vite.config.js | Vite configuration   |
| frontend/index.html     | HTML template        |
| ESP32_Example.ino       | ESP32 code example   |

---

## 📡 Data Flow

```
ESP32 (sends every 2 seconds)
  ↓ POST JSON vitals
  ↓
Backend (port 4000, stores in memory)
  ↓ Frontend fetches GET (every 2 seconds)
  ↓
Frontend (port 5173, displays vitals)
  ↓
Browser Dashboard
```

---

## 🆘 Help

| Issue                | Solution                                    |
| -------------------- | ------------------------------------------- |
| "Cannot find module" | Run `npm install` in that folder            |
| Port already in use  | Change PORT in server.js or close other app |
| CORS Error           | Backend must be running on :4000            |
| No data showing      | ESP32 might not be sending yet              |
| Blank dashboard      | Check browser console for errors            |

---

## 📱 For ESP32

1. Update ESP32_Example.ino with your WiFi credentials
2. Replace IP address with your computer's IP (use ipconfig)
3. Install ArduinoJson library
4. Upload to ESP32
5. Open Serial Monitor to verify sending

---

## 🎯 Default Ports

- Backend: **http://localhost:4000**
- Frontend: **http://localhost:5173**
- Health Check: **http://localhost:4000/health**

---

## ⬛ Terminal Commands Reference

### Backend

```bash
cd backend              # Enter backend folder
npm install            # Install dependencies
node server.js         # Start server
Ctrl+C                # Stop server
```

### Frontend

```bash
cd frontend           # Enter frontend folder
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
Ctrl+C              # Stop server
```

---

Ready to go! 🚀
