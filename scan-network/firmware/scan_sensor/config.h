// SCAN firmware configuration, shared by every sensor. Per-device ID/secret are entered in the setup portal.
#pragma once

// Supabase → Project Settings → API
#define SUPABASE_URL      "https://YOUR-PROJECT.supabase.co"
#define SUPABASE_ANON_KEY "YOUR-ANON-PUBLIC-KEY"

#define REPORT_SECONDS 60            // average and upload once a minute
#define WIFI_REBOOT_MS (10UL * 60 * 1000)  // reboot after 10 min without Wi-Fi

// Pins (ESP32 DevKit V1 / WROOM-32). Check your board's pinout.
#define PIN_PMS_RX 16   // ESP32 receives ← PMS5003 TX
#define PIN_PMS_TX 17   // ESP32 sends   → PMS5003 RX
#define PIN_SETUP  33   // push button to GND
#define PIN_LED_R  25
#define PIN_LED_G  26
#define PIN_LED_B  27
