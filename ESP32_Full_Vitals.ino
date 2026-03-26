#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include <LiquidCrystal_I2C.h>

#define WIFI_SSID "abrakadabra"
#define WIFI_PASS "dabrakaabra"

#define SERVER_HOST "https://qqqq-yiqg.onrender.com"
#define SERVER_PORT 443
#define SERVER_PATH "/api/vitals"

#define SERVER_URL "https://qqqq-yiqg.onrender.com/api/vitals"

#define SEND_INTERVAL_MS 2000
#define SENSOR_READ_INTERVAL_MS 1000

PulseOximeter pox;
LiquidCrystal_I2C lcd(0x27, 16, 2);

float currentHR = 0.0;
float currentSpO2 = 0.0;
float currentTemp = 36.5;
float currentLat = 40.7128;
float currentLng = -74.0060;

uint32_t lastSensorRead = 0;
uint32_t lastServerSend = 0;
int warmupCount = 0;
int zeroCount = 0;

TaskHandle_t HttpTaskHandle;

void onBeatDetected() {
  Serial.print("❤️");
}

void httpTask(void * parameter) {
  int skipCount = 0;
  
  for (;;) {
    if (millis() - lastServerSend > SEND_INTERVAL_MS) {
      if (WiFi.status() == WL_CONNECTED) {
        
        char jsonPayload[256];
        snprintf(jsonPayload, sizeof(jsonPayload),
          "{\"heartRate\":%.1f,\"spO2\":%.1f,\"temperature\":%.1f,\"lat\":%.4f,\"lng\":%.4f}",
          currentHR, currentSpO2, currentTemp, currentLat, currentLng);

        if (skipCount < 10) {
          skipCount++;
          lastServerSend = millis();
          delay(100);
          continue;
        }

        WiFiClientSecure client;
        client.setInsecure();
        
        HTTPClient http;
        http.setTimeout(8000);
        http.setConnectTimeout(8000);

        if (http.begin(client, SERVER_URL)) {
          http.addHeader("Content-Type", "application/json");
          http.addHeader("User-Agent", "ESP32-Vitals");

          int httpCode = http.POST(jsonPayload);

          if (httpCode == HTTP_CODE_OK || httpCode == 201) {
            Serial.printf("\n📤 [%s] POST Success (Code: %d)\n", 
              getTimeString(), httpCode);
            
            lcd.setCursor(0, 0);
            lcd.print("✓ Data Sent");
            delay(500);
            
          } else {
            Serial.printf("\n❌ [%s] POST Failed (Code: %d): %s\n", 
              getTimeString(), httpCode, http.errorToString(httpCode).c_str());
          }
          
          http.end();
        } else {
          Serial.printf("\n❌ [%s] Failed to connect to server\n", getTimeString());
        }

        lastServerSend = millis();
        
      } else {
        Serial.println("\n⚠️ WiFi disconnected. Attempting reconnect...");
        WiFi.reconnect();
        delay(1000
      } else {
        Serial.println("\n⚠️ WiFi disconnected. Attempting reconnect...");
        WiFi.reconnect();
      }
    }

    delay(100);
  }
}

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

  pox.setIRLedCurrent(MAX30100_LED_CURR_11MA);
  pox.setOnBeatDetectedCallback(onBeatDetected);
  
  Serial.println("✅ MAX30100 Initialized");
  Serial.println("⏳ Warming up sensor (10 readings)...");
  
  lcd.clear();
  lcd.print("Warming up...");
  warmupCount = 0;
}

String getTimeString() {
  static unsigned long bootTime = millis();
  unsigned long elapsed = millis() - bootTime;
  unsigned long seconds = elapsed / 1000;
  unsigned long milliseconds = elapsed % 1000;
  
  char timeStr[12];
  snprintf(timeStr, sizeof(timeStr), "%02lu:%03lu", seconds, milliseconds);
  return String(timeStr);
}

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

void readSensors() {
  currentHR = pox.getHeartRate();
  currentSpO2 = pox.getSpO2();

  currentTemp = 36.5 + (random(-2, 2) / 10.0);
}

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("\n\n╔════════════════════════════════════════╗");
  Serial.println("║  ESP32 VITALS DASHBOARD - Startup      ║");
  Serial.println("╚════════════════════════════════════════╝");

  Wire.begin(21, 22);
  Wire.setClock(100000);

  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Booting...");
  Serial.println("\n✅ LCD Initialized");

  initializeSensor();

  connectToWiFi();

  xTaskCreatePinnedToCore(
    httpTask,
    "HttpTask",
    8192,
    NULL,
    1,
    &HttpTaskHandle,
    0);

  Serial.println("\n✅ Background HTTP task created on Core 0");
  Serial.println("✅ Sensor read loop running on Core 1");

  Serial.printf("\n📡 Backend URL: %s\n", SERVER_URL);
  Serial.printf("⏱️  Send interval: %d ms\n", SEND_INTERVAL_MS);
  Serial.printf("ℹ️  Sensor read interval: %d ms\n\n", SENSOR_READ_INTERVAL_MS);

  lcd.clear();
  lcd.print("Place Finger");
  
  Serial.println("🚀 Ready! Place your finger on the sensor...\n");
}

void loop() {
  pox.update();

  if (millis() - lastSensorRead > SENSOR_READ_INTERVAL_MS) {
    
    readSensors();

    if (warmupCount < 10) {
      warmupCount++;
      Serial.printf("[%s] Warming up... (%d/10)\n", getTimeString(), warmupCount);
      lastSensorRead = millis();
      return;
    }

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

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("HR: ");
    lcd.print((int)currentHR);
    lcd.print(" bpm");
    
    lcd.setCursor(0, 1);
    lcd.print("SpO2: ");
    lcd.print((int)currentSpO2);
    lcd.print("%");

    Serial.printf("[%s] HR: %.1f | SpO2: %.1f%% | Temp: %.1f°C | Lat: %.4f | Lng: %.4f\n",
      getTimeString(), currentHR, currentSpO2, currentTemp, currentLat, currentLng);

    lastSensorRead = millis();
  }
}

