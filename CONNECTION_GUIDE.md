# 🔗 Connection Scenarios & Quick Reference

This guide shows how to configure and test each part of the system.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          YOUR COMPUTER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────────┐ │
│  │   Backend Server     │         │   Frontend Dashboard     │ │
│  │   (Node.js/Express)  │         │   (React/Vite)          │ │
│  │                      │         │                          │ │
│  │ http://localhost:4000│         │ http://localhost:5173   │ │
│  │ (or IP:4000)         │         │                          │ │
│  │                      │         │  • Shows live vitals     │ │
│  │ • Receives POST from │         │  • Fetches from backend  │ │
│  │   ESP32              │◄────────┤  • Updates every 2sec    │
│  │ • Stores in memory   │         │  • Connection status     │ │
│  │ • Logs to console    │         └──────────────────────────┘ │
│  │                      │                                        │
│  └──────────────────────┘                                        │
│           ▲                                                       │
│           │                                                       │
│           │ POST every 2 seconds                                │
│           │ {heartRate, spO2, temp, lat, lng}                  │
│           │                                                       │
└───────────┼───────────────────────────────────────────────────────┘
            │
            │ WiFi
            │
       ┌────┴────┐
       │  ESP32   │ (Connected via WiFi)
       │          │
       │ • MAX30100 (pulse/SpO2)
       │ • LCD display
       │ • [Optional] DHT22 (temperature)
       │ • [Optional] GPS (location)
       └──────────┘
```

---

## 🎯 Scenario 1: Local Testing (Recommended First)

### What You Need

- Computer running backend and frontend
- No ESP32 required yet

### Setup

**Terminal 1 - Start Backend:**

```powershell
cd d:\qqqq\backend
npm install
node server.js
```

✓ See: "Backend server running on http://localhost:4000"

**Terminal 2 - Start Frontend:**

```powershell
cd d:\qqqq\frontend
npm install
npm run dev
```

✓ See: "Local: http://localhost:5173/"

### Test with PowerShell

```powershell
# Send test data to backend
$body = @{
    heartRate = 82
    spO2 = 97
    temperature = 36.7
    lat = 40.7128
    lng = -74.0060
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/vitals" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

✓ Dashboard should update instantly!

---

## 🎯 Scenario 2: With Real ESP32

### Prerequisites

- ESP32 Dev Module
- MAX30100 sensor
- 16x2 LCD display
- All three servers running (Arduino code, backend, frontend)

### Hardware Setup

**ESP32 Wiring:**

```
ESP32        MAX30100    LCD (0x27)
────────────────────────────────
3V3 ─────┬── VCC      ─── VCC
         └─(470Ω)──5V (if needed)

GND ─────┬── GND      ─── GND
         └────────────────────

GPIO 21 ─┬─ SDA       ─── SDA
         └─────────────────

GPIO 22 ─┬─ SCL       ─── SCL
         └─────────────────
```

### Configuration: Find Your Computer IP

**Windows:**

```powershell
ipconfig
```

Look for: `IPv4 Address . . . . . . . . . . . : 192.168.1.100`

**Example output:**

```
Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
```

### Update Arduino Code

**File:** `ESP32_Full_Vitals.ino`

Line 27-31:

```cpp
#define WIFI_SSID "Your WiFi Name"          // ← Change
#define WIFI_PASS "Your WiFi Password"      // ← Change
#define SERVER_URL "http://192.168.1.100:4000/api/vitals"  // ← Change IP
```

### Upload & Test

1. **Upload code** to ESP32 (Ctrl+U in Arduino IDE)
2. **Open Serial Monitor** (115200 baud)
3. **Place finger** on MAX30100 sensor
4. **Check logs:**
   - ESP32 Serial: Shows heart rate, spO2
   - Backend Console: Shows incoming POST
   - Frontend Dashboard: Displays live vitals

---

## 🧪 Scenario 3: Testing Each Component Independently

### Test 1: Just Backend

```powershell
cd d:\qqqq\backend
npm install
node server.js
```

Then send POST:

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/vitals" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"heartRate":80,"spO2":96,"temperature":36.5,"lat":40.7128,"lng":-74.0060}'
```

✓ Backend console shows received data

### Test 2: Just Frontend

```powershell
cd d:\qqqq\frontend
npm install
npm run dev
```

Visit http://localhost:5173

- You should see dashboard (no data yet)
- Shows "🔴 No Data Yet"

### Test 3: ESP32 Alone (check Serial)

1. Upload `ESP32_Full_Vitals.ino` to ESP32
2. Don't start backend or frontend
3. Open Serial Monitor (115200 baud)
4. Place finger on sensor
5. Watch output (shows local readings)

---

## 🔌 Network Architecture

### Same Computer (Localhost)

```
Browser
  ↓
http://localhost:5173  (Frontend)
  ↓
http://localhost:4000/api/vitals  (Backend)
```

### With ESP32 Same Network

```
ESP32 (192.168.1.150)
  ↓
http://192.168.1.100:4000/api/vitals
  ↓
Backend (192.168.1.100)
  ↓
Frontend (same computer as backend)
```

### Connection Checklist

- [ ] ESP32 connected to WiFi
- [ ] Backend computer has static IP or reserved DHCP
- [ ] Both ESP32 and backend on same WiFi network
- [ ] Firewall allows port 4000
- [ ] ESP32 code has correct IP and port

---

## 📡 API Testing Methods

### Method 1: PowerShell (Windows)

```powershell
# POST test
$headers = @{"Content-Type"="application/json"}
$body = @{
    heartRate = 85
    spO2 = 95
    temperature = 36.5
    lat = 40.7128
    lng = -74.0060
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/vitals" `
  -Method POST `
  -Headers $headers `
  -Body $body

# GET test
Invoke-WebRequest "http://localhost:4000/api/vitals"

# Health check
Invoke-WebRequest "http://localhost:4000/health"
```

### Method 2: curl (Mac/Linux/Git Bash)

```bash
# POST test
curl -X POST http://localhost:4000/api/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "heartRate": 85,
    "spO2": 95,
    "temperature": 36.5,
    "lat": 40.7128,
    "lng": -74.0060
  }'

# GET test
curl http://localhost:4000/api/vitals

# Health check
curl http://localhost:4000/health
```

### Method 3: Postman

1. Import the API collection (if provided)
2. Set up environment variables
3. Send requests with pre-defined test data
4. Check response times and headers

---

## 🔐 Security Notes

⚠️ **Current Setup = Development Only**

For production deployment:

- [ ] Remove CORS allow-all
- [ ] Add API authentication
- [ ] Use HTTPS instead of HTTP
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Add logging and monitoring

---

## 🚀 Performance Targets

| Metric          | Target     | Method                 |
| --------------- | ---------- | ---------------------- |
| Data Refresh    | 2 seconds  | Frontend `setInterval` |
| Sensor Read     | 1 second   | Arduino loop           |
| Server Response | <100ms     | HTTP timeout 5s        |
| WiFi Connection | <5 seconds | ESP32 WiFi begin       |

---

## 📊 Expected Data Values

| Metric           | Min  | Normal | Max  |
| ---------------- | ---- | ------ | ---- |
| Heart Rate (BPM) | 40   | 70-100 | 180  |
| SpO2 (%)         | 85   | 95-100 | 100  |
| Temperature (°C) | 35   | 36.5   | 40   |
| Latitude         | -90  | varies | +90  |
| Longitude        | -180 | varies | +180 |

---

## 🔄 Data Flow Timeline

### Every 2 Seconds

```
0s    → ESP32 reads sensor (HR, SpO2)
        ↓
0.5s  → MAX30100 returns values
        ↓
1s    → Arduino logs to Serial
        ↓
1s    → Core 1 triggers Core 0 for HTTP
        ↓
1.2s  → Core 0 sends POST to backend
        ↓
1.3s  → Backend receives, stores, logs
        ↓
1.3s  → Frontend fetches via GET
        ↓
1.4s  → React state updates
        ↓
1.5s  → Browser re-renders dashboard
        ↓
2s    → Cycle repeats
```

---

## 💾 File Reference

| File                    | Purpose    | Run Command           |
| ----------------------- | ---------- | --------------------- |
| `backend/server.js`     | API server | `node server.js`      |
| `frontend/src/App.jsx`  | React UI   | `npm run dev`         |
| `ESP32_Full_Vitals.ino` | ESP32 code | Upload in Arduino IDE |

---

## 🐛 Debugging Tips

### Backend Issues

```powershell
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Check logs
Invoke-WebRequest "http://localhost:4000/health"
```

### Network Issues

```powershell
# Ping ESP32
ping 192.168.1.150

# Check IP
ipconfig /all

# Flush DNS
ipconfig /flushdns
```

### Arduino Issues

- Open **Serial Monitor** at 115200 baud
- Look for error messages
- Check hardware connections
- Try different USB port

---

## 🎓 Learning Path

1. **Phase 1:** Get local testing working (Scenario 1)
2. **Phase 2:** Deploy ESP32 code (Scenario 2)
3. **Phase 3:** Monitor live vitals on dashboard
4. **Phase 4:** Add more sensors (temperature, GPS)
5. **Phase 5:** Deploy to cloud (optional)

---

## ✅ Success Checklist

### Local Testing

- [ ] Backend starts without errors
- [ ] Frontend displays at localhost:5173
- [ ] PowerShell POST updates dashboard
- [ ] Browser shows live data
- [ ] Connection status shows 🟢 Connected

### With ESP32

- [ ] Arduino IDE uploads successfully
- [ ] Serial Monitor shows startup messages
- [ ] Sensor detects finger placement
- [ ] Heart rate and SpO2 display on LCD
- [ ] Backend console shows incoming data
- [ ] Dashboard updates with live vitals

---

Ready to deploy! 🚀
