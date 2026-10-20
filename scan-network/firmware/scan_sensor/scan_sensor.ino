// SCAN (Student Clean Air Network): ESP32 + PMS5003 firmware
// AIM Robotics 18657
//
// What it does
//   1. Reads the PMS5003 particle sensor over UART every second.
//   2. Averages PM1 / PM2.5 / PM10 over REPORT_SECONDS (default 60 s).
//   3. Posts the average to Supabase through the submit_reading() function.
//   4. Shows status on the RGB LED (AQI color when healthy).
//
// First boot (or hold SETUP for 3 s): the unit opens a Wi-Fi network "SCAN-Setup-XXXX".
// Join it from a phone, pick the school Wi-Fi, and enter the Device ID and Device Secret
// that were registered in Supabase. Settings are saved in flash.
//
// Board: "ESP32 Dev Module" (Arduino core for ESP32, v2.x or v3.x)
// Library: WiFiManager by tzapu (Library Manager → "WiFiManager")
//
// Wiring (verify against YOUR DevKit's pinout before powering on)
//   PMS5003 pin 1 VCC  → 5V (VIN)        PMS5003 pin 2 GND → GND
//   PMS5003 pin 5 TX   → GPIO16 (RX2)    PMS5003 pin 4 RX  → GPIO17 (TX2)
//   PMS5003 pin 3 SET  → leave unconnected (internal pull-up = run mode)
//   SETUP button       → GPIO33 to GND (internal pull-up enabled)
//   RGB LED (common cathode) R/G/B → GPIO25/26/27, each through a 330 Ω resistor; cathode → GND
// These pins avoid GPIO6–11 (flash) and GPIO34–39 (no pull-ups), per the Espressif GPIO reference.

#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Preferences.h>
#include "config.h"

HardwareSerial PMS(2);
Preferences prefs;
WiFiManager wm;

char deviceId[24] = "";
char deviceSecret[72] = "";

struct Sample { float pm1, pm25, pm10; };
double sum1 = 0, sum25 = 0, sum10 = 0;
uint32_t nSamples = 0;
uint32_t lastReport = 0, wifiLostAt = 0;
float lastPm25 = -1;

// ---------- LED ----------
void led(uint8_t r, uint8_t g, uint8_t b) {
  analogWrite(PIN_LED_R, r); analogWrite(PIN_LED_G, g); analogWrite(PIN_LED_B, b);
}
void ledForPm25(float pm) {  // EPA PM2.5 categories
  if (pm < 0) led(0, 0, 40);
  else if (pm <= 9.0) led(0, 120, 0);
  else if (pm <= 35.4) led(140, 110, 0);
  else if (pm <= 55.4) led(180, 60, 0);
  else if (pm <= 125.4) led(200, 0, 0);
  else led(120, 0, 120);
}

// ---------- PMS5003 ----------
// 32-byte frame: 0x42 0x4D, len(2), 13 data words, checksum(2). Words 4–6 are "atmospheric" PM1/2.5/10.
bool readPms(Sample &s) {
  static uint8_t buf[32];
  while (PMS.available() >= 32) {
    if (PMS.peek() != 0x42) { PMS.read(); continue; }
    PMS.readBytes(buf, 32);
    if (buf[1] != 0x4D) continue;
    uint16_t sum = 0;
    for (int i = 0; i < 30; i++) sum += buf[i];
    if (sum != ((buf[30] << 8) | buf[31])) continue;
    s.pm1  = (buf[10] << 8) | buf[11];
    s.pm25 = (buf[12] << 8) | buf[13];
    s.pm10 = (buf[14] << 8) | buf[15];
    return true;
  }
  return false;
}

// ---------- Setup portal ----------
void loadSettings() {
  prefs.begin("scan", true);
  prefs.getString("id", deviceId, sizeof(deviceId));
  prefs.getString("secret", deviceSecret, sizeof(deviceSecret));
  prefs.end();
}
void saveSettings(const char *id, const char *secret) {
  prefs.begin("scan", false);
  prefs.putString("id", id); prefs.putString("secret", secret);
  prefs.end();
  strlcpy(deviceId, id, sizeof(deviceId)); strlcpy(deviceSecret, secret, sizeof(deviceSecret));
}
void runPortal(bool force) {
  led(80, 0, 80);  // magenta = setup mode
  WiFiManagerParameter pId("devid", "Device ID (e.g. SCAN-01)", deviceId, sizeof(deviceId) - 1);
  WiFiManagerParameter pSecret("secret", "Device secret", deviceSecret, sizeof(deviceSecret) - 1);
  wm.addParameter(&pId); wm.addParameter(&pSecret);
  wm.setConfigPortalTimeout(300);
  wm.setTitle("SCAN sensor setup");
  char ap[24]; snprintf(ap, sizeof(ap), "SCAN-Setup-%04X", (uint16_t)(ESP.getEfuseMac() & 0xFFFF));
  bool ok = force ? wm.startConfigPortal(ap) : wm.autoConnect(ap);
  if (strlen(pId.getValue()) && strlen(pSecret.getValue())) saveSettings(pId.getValue(), pSecret.getValue());
  if (!ok) { led(120, 0, 0); delay(2000); ESP.restart(); }
}

// ---------- Upload ----------
bool postReading(float pm1, float pm25, float pm10) {
  WiFiClientSecure client;
  client.setInsecure();  // TODO for production: client.setCACert(SUPABASE_ROOT_CA);
  HTTPClient http;
  String url = String(SUPABASE_URL) + "/rest/v1/rpc/submit_reading";
  if (!http.begin(client, url)) return false;
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
  char body[256];
  snprintf(body, sizeof(body),
    "{\"p_device\":\"%s\",\"p_token\":\"%s\",\"p_pm1\":%.1f,\"p_pm25\":%.1f,\"p_pm10\":%.1f,\"p_rssi\":%d}",
    deviceId, deviceSecret, pm1, pm25, pm10, WiFi.RSSI());
  int code = http.POST((uint8_t *)body, strlen(body));
  Serial.printf("[SCAN] POST %d  pm2.5=%.1f\n", code, pm25);
  if (code < 200 || code >= 300) Serial.println(http.getString());
  http.end();
  return code >= 200 && code < 300;
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_SETUP, INPUT_PULLUP);
  pinMode(PIN_LED_R, OUTPUT); pinMode(PIN_LED_G, OUTPUT); pinMode(PIN_LED_B, OUTPUT);
  led(0, 0, 80);  // blue = booting / connecting
  PMS.begin(9600, SERIAL_8N1, PIN_PMS_RX, PIN_PMS_TX);
  loadSettings();
  WiFi.mode(WIFI_STA);
  bool force = digitalRead(PIN_SETUP) == LOW || !strlen(deviceId) || !strlen(deviceSecret);
  runPortal(force);
  Serial.printf("[SCAN] %s online, IP %s\n", deviceId, WiFi.localIP().toString().c_str());
  lastReport = millis();
}

void loop() {
  // Hold SETUP for 3 s to re-enter the portal
  static uint32_t pressedAt = 0;
  if (digitalRead(PIN_SETUP) == LOW) {
    if (!pressedAt) pressedAt = millis();
    else if (millis() - pressedAt > 3000) { pressedAt = 0; runPortal(true); }
  } else pressedAt = 0;

  Sample s;
  if (readPms(s)) { sum1 += s.pm1; sum25 += s.pm25; sum10 += s.pm10; nSamples++; }

  if (WiFi.status() != WL_CONNECTED) {
    if (!wifiLostAt) wifiLostAt = millis();
    led(0, 0, (millis() / 300) % 2 ? 80 : 0);  // blinking blue = Wi-Fi lost
    if (millis() - wifiLostAt > WIFI_REBOOT_MS) ESP.restart();
  } else wifiLostAt = 0;

  if (millis() - lastReport >= REPORT_SECONDS * 1000UL && nSamples > 0) {
    float a1 = sum1 / nSamples, a25 = sum25 / nSamples, a10 = sum10 / nSamples;
    sum1 = sum25 = sum10 = 0; nSamples = 0; lastReport = millis();
    lastPm25 = a25;
    if (WiFi.status() == WL_CONNECTED && postReading(a1, a25, a10)) ledForPm25(a25);
    else led(120, 0, 0);  // red = upload failed (see Serial Monitor)
  }
  delay(20);
}
