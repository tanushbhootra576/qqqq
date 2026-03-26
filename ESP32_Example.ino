// =========================================================
// ESP32 Code Example - Vital Signs Sender
// =========================================================
// 
// This is example code for your ESP32 to send vital 
// signs to the backend server.
//
// IMPORTANT: Replace "YOUR_COMPUTER_IP" with your 
// actual computer IP address!
// 
// =========================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ===== WiFi Configuration =====
const char* ssid = "YOUR_SSID";           // Your WiFi name
const char* password = "YOUR_PASSWORD";   // Your WiFi password

// ===== Server Configuration =====
// CHANGE THIS to your computer's IP address!
// Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
const char* serverUrl = "http://192.168.1.100:4000/api/vitals";

// ===== Sample Sensor Variables =====
int heartRate = 75;
int spO2 = 95;
float temperature = 36.5;
float latitude = 40.7128;   // NYC example
float longitude = -74.0060;  // NYC example

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\nStarting ESP32 Vitals Sender...");
  
  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  // Simulate changing sensor values
  heartRate = random(60, 100);
  spO2 = random(92, 100);
  temperature = 36.0 + (random(0, 10) / 10.0);
  
  // Send data to backend
  if (WiFi.status() == WL_CONNECTED) {
    sendVitals();
  } else {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Wait 2 seconds before next send (matches frontend refresh)
  delay(2000);
}

// ===== Connect to WiFi =====
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ Failed to connect to WiFi");
  }
}

// ===== Send Vitals to Backend =====
void sendVitals() {
  HTTPClient http;
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["heartRate"] = heartRate;
  doc["spO2"] = spO2;
  doc["temperature"] = temperature;
  doc["lat"] = latitude;
  doc["lng"] = longitude;
  
  String json;
  serializeJson(doc, json);
  
  // Send POST request
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(json);
  
  if (httpCode > 0) {
    Serial.print("[");
    Serial.print(getTime());
    Serial.print("] POST sent - Response: ");
    Serial.println(httpCode);
    
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.print("Error sending POST: ");
    Serial.println(http.errorToString(httpCode));
  }
  
  http.end();
}

// ===== Simple Time Display =====
String getTime() {
  // For real implementation, use time library
  static unsigned long startTime = millis();
  unsigned long seconds = (millis() - startTime) / 1000;
  return String(seconds) + "s";
}

// ===== NOTES =====
/*
REQUIREMENTS:
- Install ArduinoJson library (Sketch > Include Library > Manage Libraries)
- Select your ESP32 board (Tools > Board > ESP32 Dev Module)
- Select correct COM port (Tools > Port)

CONFIGURATION STEPS:
1. Replace "YOUR_SSID" with your WiFi network name
2. Replace "YOUR_PASSWORD" with your WiFi password
3. Find your computer IP:
   - Windows: Open cmd, type "ipconfig", look for IPv4 Address
   - Mac: Open Terminal, type "ifconfig", look for inet
4. Replace "192.168.1.100" with your computer's IP address
5. Upload to ESP32

TESTING:
- Open Serial Monitor (Tools > Serial Monitor) at 115200 baud
- You should see connection logs and POST responses
- Check your backend console for incoming vitals

REAL SENSORS:
Replace these with actual sensor readings:
- heartRate: From pulse sensor
- spO2: From SpO2 sensor
- temperature: From temperature sensor
- latitude/longitude: From GPS module
*/
