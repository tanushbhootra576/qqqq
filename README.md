# ❤️ ESP32 Vitals Dashboard - Full Stack Project

A simple full-stack application to display real-time vital signs (Heart Rate, SpO2, Temperature, Location) from an ESP32 device on a web dashboard.

---

## 📁 Project Structure

```
vitals-dashboard/
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # (created after npm install)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── main.jsx        # React entry point
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── package.json        # Frontend dependencies
│   └── node_modules/       # (created after npm install)
│
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### 1️⃣ Setup Backend

```bash
cd backend
npm install
node server.js
```

Expected output:

```
🚀 Backend server running on http://localhost:4000
📡 Ready to receive data from ESP32 at POST http://localhost:4000/api/vitals
📊 Frontend can fetch data from GET http://localhost:4000/api/vitals
```

### 2️⃣ Setup Frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

Expected output:

```
VITE v4.x.x  ready in xxx ms

➜ Local:   http://localhost:5173/
```

### 3️⃣ Open in Browser

Visit: **http://localhost:5173/**

You should see the dashboard. It will show "🔴 No Data Yet" until the ESP32 sends data.

---

## 📡 API Endpoints

### Backend Endpoints

#### **POST** `/api/vitals` - Receive vitals from ESP32

Request Body (JSON):

```json
{
  "heartRate": 85,
  "spO2": 95,
  "temperature": 36.5,
  "lat": 40.7128,
  "lng": -74.006
}
```

Response:

```json
{
  "success": true,
  "message": "Vitals received",
  "data": {
    "heartRate": 85,
    "spO2": 95,
    "temperature": 36.5,
    "lat": 40.7128,
    "lng": -74.006,
    "timestamp": "2026-03-27T14:30:00.000Z"
  }
}
```

#### **GET** `/api/vitals` - Fetch latest vitals

Response:

```json
{
  "heartRate": 85,
  "spO2": 95,
  "temperature": 36.5,
  "lat": 40.7128,
  "lng": -74.006,
  "timestamp": "2026-03-27T14:30:00.000Z"
}
```

#### **GET** `/health` - Health check

Response:

```json
{
  "status": "Backend running"
}
```

---

## 📱 ESP32 Configuration

Update your ESP32 code to send POST requests to the backend:

```cpp
#include <HTTPClient.h>
#include <WiFi.h>

void sendVitals(int heartRate, int spO2, float temp, float lat, float lng) {
  HTTPClient http;
  String url = "http://<YOUR_COMPUTER_IP>:4000/api/vitals";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{\"heartRate\":" + String(heartRate)
                     + ",\"spO2\":" + String(spO2)
                     + ",\"temperature\":" + String(temp)
                     + ",\"lat\":" + String(lat)
                     + ",\"lng\":" + String(lng) + "}";

  int httpCode = http.POST(jsonPayload);
  http.end();
}

// Call every 2 seconds:
// sendVitals(85, 95, 36.5, 40.7128, -74.0060);
```

### Finding Your Computer's IP Address

**Windows:**

```
ipconfig
```

Look for "IPv4 Address" (usually starts with 192.168.x.x or 10.0.x.x)

**Mac/Linux:**

```
ifconfig
```

---

## 🎨 Frontend Features

- ✅ Real-time data refresh every 2 seconds
- ✅ Displays Heart Rate, SpO2, Temperature
- ✅ Shows GPS Location (Latitude, Longitude)
- ✅ Connection status indicator (🟢 Connected / 🔴 No Data Yet)
- ✅ Last updated timestamp
- ✅ Responsive grid layout
- ✅ Clean, minimal UI

---

## ⚙️ Backend Features

- ✅ Express.js server on port 4000
- ✅ CORS enabled for cross-origin requests
- ✅ In-memory data storage
- ✅ Console logging of all incoming data
- ✅ JSON request/response handling
- ✅ Data validation

---

## 🧪 Testing the Backend

### Using curl (Windows PowerShell):

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

### Using curl (Mac/Linux):

```bash
curl -X POST http://localhost:4000/api/vitals \
  -H "Content-Type: application/json" \
  -d '{"heartRate":85,"spO2":95,"temperature":36.5,"lat":40.7128,"lng":-74.0060}'
```

### Test GET endpoint:

```bash
curl http://localhost:4000/api/vitals
```

---

## 🔍 Troubleshooting

### "Cannot find module 'express'" or "Cannot find module 'cors'"

**Solution:** Run `npm install` in the backend folder again.

### "Module not found" (Frontend)

**Solution:** Run `npm install` in the frontend folder again.

### CORS errors in browser console

**Solution:** Make sure the backend is running on http://localhost:4000

### "Port 4000 is already in use"

**Solution:** Either:

- Close the other application using port 4000
- Change the PORT in `server.js` to a different number (e.g., 5000)

### Frontend shows "Error: Failed to fetch vitals"

**Solution:**

- Ensure backend is running (`node server.js`)
- Check that backend is on http://localhost:4000
- Open browser console (F12) for more details

### ESP32 can't connect to backend

**Solution:**

- Make sure you're using your computer's actual IP address (not localhost)
- Check that firewall isn't blocking port 4000
- Verify ESP32 is on the same network as your computer

---

## 📦 Dependencies

### Backend

- **express** - Web server framework
- **cors** - Enable cross-origin requests
- **node** - JavaScript runtime

### Frontend

- **react** - UI library
- **react-dom** - React DOM rendering
- **vite** - Build tool and dev server

---

## 🛑 Stopping the Servers

- **Backend:** Press `Ctrl+C` in the terminal
- **Frontend:** Press `Ctrl+C` in the terminal

---

## 📝 Key Code Files

### Backend `server.js`

- Handles POST requests from ESP32
- Stores latest vitals in memory
- Returns vitals on GET requests
- Logs all data to console
- CORS enabled

### Frontend `App.jsx`

- Fetches data every 2 seconds using `useEffect`
- Displays vitals in card format
- Shows connection status
- Handles loading and error states

---

## 🚀 Next Steps (Optional)

- Add database persistence (MongoDB, PostgreSQL)
- Add authentication & user accounts
- Add data visualization (charts, graphs)
- Deploy to cloud (Heroku, AWS, Vercel)
- Add more health metrics
- Build iOS/Android app

---

## ✨ Notes

- All data is stored **in memory** - it resets when the server restarts
- The dashboard refreshes **every 2 seconds** to match ESP32 sending interval
- No database required - perfect for simple real-time monitoring
- Minimal dependencies - easy to understand and modify

---

Built with ❤️ for real-time health monitoring!
