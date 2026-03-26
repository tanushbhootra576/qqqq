# 🤖 Arduino/ESP32 Setup Guide

Complete step-by-step instructions to configure your ESP32 with the MAX30100 sensor to send data to the local vitals dashboard.

---

## 📋 What You'll Need

### Hardware

- **ESP32 Dev Module** (or any ESP32 variant)
- **MAX30100 Pulse Oximeter sensor** (I2C)
- **16x2 LCD Display** (I2C, address 0x27)
- **Micro USB cable** (for programming)
- **Jumper wires** and breadboard

### Software

- **Arduino IDE** (v1.8.13+) - [Download](https://www.arduino.cc/en/software)
- **CH340 USB drivers** (if needed for your ESP32)

---

## 🔌 Wiring Diagram

### ESP32 I2C Pins

| Component    | Pin | ESP32 GPIO |
| ------------ | --- | ---------- |
| MAX30100 SDA | SDA | GPIO 21    |
| MAX30100 SCL | SCL | GPIO 22    |
| LCD SDA      | SDA | GPIO 21    |
| LCD SCL      | SCL | GPIO 22    |
| Power        | VCC | 3V3 or 5V  |
| Ground       | GND | GND        |

### Physical Connections

```
┌─────────────────┐
│     ESP32       │
├─────────────────┤
│ 3V3    ──────┬──┬─── MAX30100 VCC
│              │  └─── LCD VCC (5V)
│ GND    ──────┼───┬── MAX30100 GND
│              └───┴── LCD GND
│ GPIO21 (SDA) ──┬─── MAX30100 SDA
│               └──── LCD SDA
│ GPIO22 (SCL) ──┬─── MAX30100 SCL
│               └──── LCD SCL
│ GND ──────────────── (Ground plane)
└─────────────────┘
```

---

## 📲 Arduino IDE Setup

### Step 1: Add ESP32 Board Support

1. Open Arduino IDE
2. Go to **File → Preferences**
3. In "Additional Boards Manager URLs", paste:
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
4. Click OK
5. Go to **Tools → Board → Boards Manager**
6. Search for "esp32"
7. Install **ESP32 by Espressif Systems** (latest version)
8. Close Boards Manager

### Step 2: Select Board Settings

1. **Tools → Board → ESP32 Arduino → ESP32 Dev Module**
2. **Tools → Port** → Select your COM port
3. **Tools → Upload Speed → 115200**
4. **Tools → Flash Size → 4MB**

---

## 📚 Install Required Libraries

### Method 1: Arduino IDE Library Manager (Recommended)

1. Go to **Sketch → Include Library → Manage Libraries**
2. Search and install each:

| Library           | Author             | Search for          |
| ----------------- | ------------------ | ------------------- |
| MAX30100          | OXullo Intersecans | "MAX30100"          |
| LiquidCrystal_I2C | Frank de Brabander | "LiquidCrystal_I2C" |
| WiFi              | Espressif Systems  | (Built-in)          |
| HTTPClient        | Espressif Systems  | (Built-in)          |

### Method 2: Manual Installation

If copy-paste is easier:

```
ESP32 will have these built-in:
- WiFi.h
- HTTPClient.h
- Wire.h

Install from Library Manager:
- MAX30100lib by OXullo Intersecans
- LiquidCrystal I2C by Frank de Brabander
```

---

## ⚙️ Configuration Overview

### Your Arduino Code: `ESP32_Full_Vitals.ino`

The code has clear configuration section at the top:

```cpp
// 🔧 CONFIGURATION - CHANGE THESE VALUES
#define WIFI_SSID "YOUR_SSID"
#define WIFI_PASS "YOUR_PASSWORD"
#define SERVER_URL "http://192.168.1.100:4000/api/vitals"
```

---

## 🔑 Key Configuration Steps

### Step 1: Find Your Computer's IP Address

**Windows (PowerShell):**

```powershell
ipconfig
```

Look for something like:

```
IPv4 Address . . . . . . . . . . . : 192.168.1.100
```

**Mac/Linux:**

```bash
ifconfig
```

### Step 2: Update the Arduino Code

Open `ESP32_Full_Vitals.ino` and change:

```cpp
// Line 27-28: WiFi Credentials
#define WIFI_SSID "YOUR_SSID"          // ← Change this
#define WIFI_PASS "YOUR_PASSWORD"      // ← Change this

// Line 31: Backend URL
#define SERVER_URL "http://192.168.1.100:4000/api/vitals"
                       ↑↑↑↑↑↑↑↑↑↑↑↑
                    Change this IP!
```

### Step 3: Optional - Add Real Sensors

The code has placeholders for:

- **Temperature** (currently simulated ~36.5°C)
- **GPS** (currently hardcoded NYC coordinates)

To add real sensors, uncomment the example code or add your own.

---

## ⬆️ Upload to ESP32

### Step 1: Connect ESP32

- Connect via micro USB cable
- Wait for drivers to load
- Verify COM port appears in Tools → Port

### Step 2: Upload Code

1. Click the **Upload button** (→ icon) or **Ctrl+U**
2. Wait for compilation and upload
3. Should see: "Hard resetting via RTS pin..."

### Step 3: Monitor Serial Output

1. **Tools → Serial Monitor**
2. Set baud rate to **115200** (bottom right)
3. Should see startup messages

---

## 📊 Expected Serial Output

```
╔════════════════════════════════════════╗
║  ESP32 VITALS DASHBOARD - Startup      ║
╚════════════════════════════════════════╝

✅ LCD Initialized
✅ MAX30100 Initialized
⏳ Warming up sensor (10 readings)...
🔗 Connecting to WiFi: Somil's A35
✅ WiFi Connected!
   IP: 192.168.1.150
   Gateway: 192.168.1.1
✅ Background HTTP task created on Core 0
✅ Sensor read loop running on Core 1

📡 Backend URL: http://192.168.1.100:4000/api/vitals
⏱️  Send interval: 2000 ms
ℹ️  Sensor read interval: 1000 ms

🚀 Ready! Place your finger on the sensor...

[00:001] Warming up... (1/10)
[00:002] Warming up... (2/10)
...
[00:010] Warming up... (10/10)
[00:011] HR: 85.0 | SpO2: 95.0% | Temp: 36.5°C | Lat: 40.7128 | Lng: -74.0060
📤 [00:011] POST Success (Code: 200)
❤️[00:012] HR: 86.0 | SpO2: 94.5% | Temp: 36.4°C | Lat: 40.7128 | Lng: -74.0060
[00:013] HR: 85.5 | SpO2: 95.0% | Temp: 36.6°C | Lat: 40.7128 | Lng: -74.0060
📤 [00:013] POST Success (Code: 200)
```

---

## 🧪 Testing the Connection

### Check if ESP32 is sending data:

**Before running your dashboard**, stop the backend and frontend, then start just the backend:

```bash
cd backend
node server.js
```

Place your finger on the MAX30100 sensor. You should see in the console:

```
[HH:MM:SS] Vitals received: {
  heartRate: 85,
  spO2: 95,
  temperature: 36.5,
  lat: 40.7128,
  lng: -74.0060,
  timestamp: '2026-03-27T15:30:45.123Z'
}
```

This confirms ESP32 → Backend communication works!

---

## 🔧 Troubleshooting

### ❌ "Bad CRC in end of file message"

**Solution:** Your code has a syntax error. Check line numbers indicated in the error.

### ❌ "Board at COM3 is not responding"

**Solution:**

- Install CH340 driver (search "CH340 driver")
- Try different USB cable
- Try different USB port

### ❌ "MAX30100 not found!"

**Solution:**

- Double-check I2C connections (GPIO 21, 22)
- Check sensor power (3V3)
- Verify I2C address with I2C scanner
- Swap SDA/SCL if needed

### ❌ "WiFi Connection Failed"

**Solution:**

- Check SSID spelling (case-sensitive)
- Check password
- Verify 2.4GHz WiFi (not 5GHz)
- Move closer to router

### ❌ "POST Failed" error

**Solution:**

- Verify backend is running (`node server.js`)
- Check your computer's IP is correct in code
- Ensure ESP32 and computer on same network
- Check Windows firewall (allow port 4000)

### ❌ "Place Finger" shows but no heart rate

**Solution:**

- Ensure clean finger on sensor
- Wait 10 seconds (warmup phase)
- Try different finger
- Check sensor connections with multimeter

---

## 🌡️ Adding Real Temperature Sensor (DHT22)

If you want to add a real temperature sensor:

```cpp
// At the top, add:
#include "DHT.h"
#define DHT_PIN 4      // GPIO 4
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// In setup():
dht.begin();

// In readSensors():
currentTemp = dht.readTemperature();
```

---

## 📍 Adding Real GPS (NEO-6M)

For GPS coordinates:

```cpp
// At the top, add:
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
SoftwareSerial gpsSerial(16, 17);  // RX, TX
TinyGPSPlus gps;

// In setup():
gpsSerial.begin(9600);

// In readSensors():
while (gpsSerial.available() > 0) {
  gps.encode(gpsSerial.read());
}
if (gps.location.isValid()) {
  currentLat = gps.location.lat();
  currentLng = gps.location.lng();
}
```

---

## 📝 Key Code Sections

### WiFi Connection (Line ~220)

```cpp
void connectToWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  // Connects and displays on LCD
}
```

### Background HTTP Task (Line ~80)

```cpp
void httpTask(void * parameter) {
  // Runs on Core 0
  // Sends data every 2 seconds
  // Doesn't block sensor readings
}
```

### Main Sensor Loop (Line ~330)

```cpp
void loop() {
  pox.update();            // Must be constant
  // Reads every 1 second
  // Updates LCD
  // Signals Core 0 to send
}
```

---

## ✅ Complete Checklist

- [ ] Arduino IDE installed
- [ ] ESP32 board installed in IDE
- [ ] MAX30100 library installed
- [ ] LiquidCrystal_I2C library installed
- [ ] ESP32 connected via USB
- [ ] COM port selected in Tools
- [ ] WiFi SSID updated in code
- [ ] WiFi password updated in code
- [ ] Computer IP updated in SERVER_URL
- [ ] Code uploaded successfully
- [ ] Serial monitor shows startup messages
- [ ] Finger placed on sensor
- [ ] Heart rate and SpO2 showing on LCD
- [ ] Backend receiving POST requests
- [ ] Frontend dashboard updating

---

## 🚀 Final Steps

1. Ensure backend is running: `node server.js`
2. Ensure frontend is running: `npm run dev`
3. Place finger on MAX30100
4. Watch Serial Monitor for data logs
5. Check http://localhost:5173 for live updates
6. Check backend console for incoming POST requests

---

## 📞 Need Help?

Check the troubleshooting section above, or:

- Enable verbose output: **File → Preferences → Show verbose output**
- Check Serial Monitor (115200 baud)
- Read error messages carefully
- Verify hardware connections with multimeter

---

Good luck! 🎉
