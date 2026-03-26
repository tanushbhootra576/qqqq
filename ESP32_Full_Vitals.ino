// ============================================================
// ESP32 VITALS DASHBOARD - Complete Arduino Sketch
// 
// Sends: Heart Rate, SpO2, Temperature, Latitude, Longitude
// To: Local Node.js Backend (http://<YOUR_IP>:4000/api/vitals)
// 
// Hardware:
//  - ESP32 Dev Module
//  - MAX30100 Pulse Oximeter (I2C: GPIO 21, 22)
//  - 16x2 LCD Display (I2C: 0x27 address)
//  - Optional: Temperature sensor (DHT22/DS18B20)
//  - Optional: GPS module (NEO-6M)
// ============================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include <LiquidCrystal_I2C.h>

// ============================================================
// 🔧 CONFIGURATION - CHANGE THESE VALUES
// ============================================================

// WiFi Credentials
#define WIFI_SSID "abrakadabra"          // Change to your WiFi name
#define WIFI_PASS "dabrakaabra"      // Change to your WiFi password

// Backend Server - CHANGE THE IP ADDRESS!
// Find your computer IP: Windows cmd → ipconfig
// Look for "IPv4 Address" (usually 192.168.x.x)
#define SERVER_URL "http://192.168.1.100:4000/api/vitals"

// Data sending interval (milliseconds)
#define SEND_INTERVAL_MS 2000          // Send every 2 seconds (matches frontend)
#define SENSOR_READ_INTERVAL_MS 1000   // Read sensor every 1 second

// ============================================================
// 🔌 SENSOR OBJECTS
// ============================================================

PulseOximeter pox;                     // MAX30100 sensor
LiquidCrystal_I2C lcd(0x27, 16, 2);   // LCD at address 0x27

// ============================================================
// 📊 GLOBAL VARIABLES
// ============================================================

float currentHR = 0.0;
float currentSpO2 = 0.0;
float currentTemp = 36.5;              // Placeholder temperature
float currentLat = 40.7128;            // Placeholder latitude (NYC)
float currentLng = -74.0060;           // Placeholder longitude (NYC)

uint32_t lastSensorRead = 0;
uint32_t lastServerSend = 0;
int warmupCount = 0;
int zeroCount = 0;

TaskHandle_t HttpTaskHandle;

// ============================================================
// 🎯 HEARTBEAT CALLBACK - Called when pulse detected
// ============================================================
void onBeatDetected() {
  Serial.print("❤️");
}

// ============================================================
// 📡 CORE 0: HTTP TASK (Background thread)
// Handles server communication without blocking sensor reads
// ============================================================
void httpTask(void * parameter) {
  for (;;) {
    // Check if it's time to send data
    if (millis() - lastServerSend > SEND_INTERVAL_MS) {
      if (WiFi.status() == WL_CONNECTED) {
        
        // Create JSON payload
        char jsonPayload[256];
        snprintf(jsonPayload, sizeof(jsonPayload),
          "{\"heartRate\":%.1f,\"spO2\":%.1f,\"temperature\":%.1f,\"lat\":%.4f,\"lng\":%.4f}",
          currentHR, currentSpO2, currentTemp, currentLat, currentLng);

        // Create HTTP client
        HTTPClient http;
        http.setTimeout(5000);
        http.setConnectTimeout(5000);

        // Send POST request
        http.begin(SERVER_URL);
        http.addHeader("Content-Type", "application/json");
        http.addHeader("User-Agent", "ESP32-Vitals");

        int httpCode = http.POST(jsonPayload);

        // Log result
        if (httpCode > 0) {
          Serial.printf("\n📤 [%s] POST Success (Code: %d)\n", 
            getTimeString(), httpCode);
          
          // Show on LCD
          lcd.setCursor(0, 0);
          lcd.print("Sent to Server");
          delay(500);
          
        } else {
          Serial.printf("\n❌ [%s] POST Failed: %s\n", 
            getTimeString(), http.errorToString(httpCode).c_str());
        }

        http.end();
        lastServerSend = millis();
        
      } else {
        Serial.println("\n⚠️ WiFi disconnected. Attempting reconnect...");
        WiFi.reconnect();
      }
    }

    delay(100); // Prevent Core 0 watchdog timeout
  }
}

// ============================================================
// 🌐 WiFi Connection
// ============================================================
void connectToWiFi() {
  Serial.print("\n🔗 Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  lcd.clear();
  lcd.print("WiFi Connect...");

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  int attempt = 0;
  
  while (WiFi.status() != WL_CONNECTED && attempt < 20) {
    delay(500);
    Serial.print(".");
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("\n✅ WiFi Connected!");
    Serial.print("   IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("   Gateway: ");
    Serial.println(WiFi.gatewayIP());
    
    lcd.clear();
    lcd.print("WiFi: OK");
    delay(1500);
    
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
    lcd.clear();
    lcd.print("WiFi: FAILED");
    delay(2000);
  }
}

// ============================================================
// 📊 Sensor Initialization
// ============================================================
void initializeSensor() {
  Serial.println("\n🔄 Initializing MAX30100 Sensor...");
  lcd.clear();
  lcd.print("Init Sensor...");

  if (!pox.begin()) {
    Serial.println("❌ MAX30100 not found!");
    lcd.clear();
    lcd.print("Sensor Error!");
    while (1) {
      delay(1000);
    }
  }

  // Configure sensor
  pox.setIRLedCurrent(MAX30100_LED_CURR_11MA);
  pox.setOnBeatDetectedCallback(onBeatDetected);
  
  Serial.println("✅ MAX30100 Initialized");
  Serial.println("⏳ Warming up sensor (10 readings)...");
  
  lcd.clear();
  lcd.print("Warming up...");
  warmupCount = 0;
}

// ============================================================
// 🕐 Helper: Get time string for logging
// ============================================================
String getTimeString() {
  static unsigned long bootTime = millis();
  unsigned long elapsed = millis() - bootTime;
  unsigned long seconds = elapsed / 1000;
  unsigned long milliseconds = elapsed % 1000;
  
  char timeStr[12];
  snprintf(timeStr, sizeof(timeStr), "%02lu:%03lu", seconds, milliseconds);
  return String(timeStr);
}

// ============================================================
// 📡 Reinitialize sensor if stuck
// ============================================================
void reinitializeSensor() {
  Serial.println("\n⚠️ Reinitializing sensor (data quality issue)...");
  lcd.clear();
  lcd.print("Reinit...");
  
  pox.begin();
  pox.setIRLedCurrent(MAX30100_LED_CURR_11MA);
  pox.setOnBeatDetectedCallback(onBeatDetected);
  warmupCount = 0;
  zeroCount = 0;
}

// ============================================================
// 🌡️ GET SENSOR VALUES (Replace with real sensors)
// ============================================================
void readSensors() {
  // HEART RATE & SpO2 - From MAX30100 (Real)
  currentHR = pox.getHeartRate();
  currentSpO2 = pox.getSpO2();

  // TEMPERATURE - Placeholder (Replace with DHT22/DS18B20)
  // Example with DHT22:
  // #include "DHT.h"
  // DHT dht(4, DHT22);  // GPIO 4, DHT22
  // currentTemp = dht.readTemperature();
  
  // For now, simulate temperature around 36.5°C
  currentTemp = 36.5 + (random(-2, 2) / 10.0);

  // LATITUDE & LONGITUDE - Placeholder (Replace with GPS)
  // Example with NEO-6M:
  // #include <TinyGPS++.h>
  // currentLat = gps.location.lat();
  // currentLng = gps.location.lng();
  
  // For now, use static coordinates
  // currentLat = 40.7128;   // NYC Latitude
  // currentLng = -74.0060;  // NYC Longitude
}

// ============================================================
// 📊 SETUP - Runs once at startup (Core 1)
// ============================================================
void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("\n\n╔════════════════════════════════════════╗");
  Serial.println("║  ESP32 VITALS DASHBOARD - Startup      ║");
  Serial.println("╚════════════════════════════════════════╝");

  // Initialize I2C for sensors
  Wire.begin(21, 22);          // SDA=21, SCL=22 (ESP32 defaults)
  Wire.setClock(100000);       // 100kHz clock speed

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Booting...");
  Serial.println("\n✅ LCD Initialized");

  // Initialize pressure sensor
  initializeSensor();

  // Connect to WiFi
  connectToWiFi();

  // Create background HTTP task on Core 0
  xTaskCreatePinnedToCore(
    httpTask,           /* Task function */
    "HttpTask",         /* Task name */
    8192,               /* Stack size */
    NULL,               /* Parameters */
    1,                  /* Priority */
    &HttpTaskHandle,    /* Task handle */
    0);                 /* Core 0 */

  Serial.println("\n✅ Background HTTP task created on Core 0");
  Serial.println("✅ Sensor read loop running on Core 1");

  Serial.printf("\n📡 Backend URL: %s\n", SERVER_URL);
  Serial.printf("⏱️  Send interval: %d ms\n", SEND_INTERVAL_MS);
  Serial.printf("ℹ️  Sensor read interval: %d ms\n\n", SENSOR_READ_INTERVAL_MS);

  lcd.clear();
  lcd.print("Place Finger");
  
  Serial.println("🚀 Ready! Place your finger on the sensor...\n");
}

// ============================================================
// 🔄 LOOP - Main sensor reading loop (Core 1)
// Must call pox.update() continuously without delay
// ============================================================
void loop() {
  // CRITICAL: Update sensor constantly
  pox.update();

  // Check if it's time to read sensor (every 1 second)
  if (millis() - lastSensorRead > SENSOR_READ_INTERVAL_MS) {
    
    readSensors();

    // WARMUP PHASE - Skip first 10 readings
    if (warmupCount < 10) {
      warmupCount++;
      Serial.printf("[%s] Warming up... (%d/10)\n", getTimeString(), warmupCount);
      lastSensorRead = millis();
      return;
    }

    // ZERO CHECK - Detect if sensor disconnected
    if (currentHR == 0 && currentSpO2 == 0) {
      zeroCount++;
      Serial.printf("⚠️ Zero reading (%d/10)\n", zeroCount);
      
      if (zeroCount >= 10) {
        reinitializeSensor();
      } else {
        lcd.clear();
        lcd.print("Place Finger");
      }
      lastSensorRead = millis();
      return;
    }
    zeroCount = 0;

    // UPDATE LCD DISPLAY
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("HR: ");
    lcd.print((int)currentHR);
    lcd.print(" bpm");
    
    lcd.setCursor(0, 1);
    lcd.print("SpO2: ");
    lcd.print((int)currentSpO2);
    lcd.print("%");

    // LOG TO SERIAL
    Serial.printf("[%s] HR: %.1f | SpO2: %.1f%% | Temp: %.1f°C | Lat: %.4f | Lng: %.4f\n",
      getTimeString(), currentHR, currentSpO2, currentTemp, currentLat, currentLng);

    lastSensorRead = millis();
  }
}

// ============================================================
// 📝 SETUP INSTRUCTIONS
// ============================================================
/*
HARDWARE SETUP:
1. ESP32 Dev Module
2. MAX30100 connections:
   - VCC   → 3V3
   - GND   → GND
   - SDA   → GPIO 21
   - SCL   → GPIO 22
3. LCD 16x2 (I2C 0x27):
   - VCC   → 5V
   - GND   → GND
   - SDA   → GPIO 21
   - SCL   → GPIO 22

ARDUINO IDE SETUP:
1. Board: ESP32 Dev Module
2. Flash Size: 4MB
3. Upload Speed: 115200
4. Port: Select your COM port

LIBRARIES TO INSTALL:
1. MAX30100lib by OXullo Intersecans
2. LiquidCrystal_I2C by Frank de Brabander
3. (Optional) DHT sensor library
4. (Optional) TinyGPS++

CONFIGURATION:
1. Update WIFI_SSID and WIFI_PASS
2. Find your computer IP: Windows cmd → ipconfig
3. Update SERVER_URL with your IP (replace 192.168.1.100)
4. Upload to ESP32
5. Open Serial Monitor (115200 baud)

EXPECTED OUTPUT:
✅ LCD Initialized
✅ MAX30100 Initialized
✅ WiFi Connected
✅ Background HTTP task created
🚀 Ready! Place your finger on the sensor...
[00:001] Warming up... (1/10)
[00:002] HR: 85.0 | SpO2: 95.0%
📤 [00:002] POST Success (Code: 200)

TROUBLESHOOTING:
- Sensor not found: Check I2C connections (GPIO 21, 22)
- WiFi failed: Check SSID and password
- No data: Ensure finger is placed on sensor
- POST errors: Check backend is running and IP is correct
*/
