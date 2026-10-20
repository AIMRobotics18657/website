# SCAN network: sensors → Wi-Fi → database → live map

This folder has everything needed to connect Student Clean Air Network sensors to the **Live Air** page (`/live-air`).

```
PMS5003 ──UART──▶ ESP32 ──Wi-Fi/HTTPS──▶ Supabase (Postgres) ──REST──▶ /live-air
 particles         averages 60 s           submit_reading()             map + charts
```

- `firmware/scan_sensor/`: Arduino sketch for each sensor (`scan_sensor.ino` + `config.h`)
- `supabase/schema.sql`: tables, security rules and the upload function
- `../.env.example`: the two environment variables that switch the website from simulated to live data

Why Supabase: it's free for a network this size (500 MB database ≈ several years of 1-minute data from 30 sensors), it's real Postgres you can query with SQL for science-fair analysis, and the website can read it directly with no server of our own.

---

## 1. Parts per sensor

| Part | Notes |
|---|---|
| ESP32 DevKit (WROOM-32, 30 or 38 pin) | Any board with the Arduino ESP32 core |
| Plantower PMS5003 + its cable | 5 V supply, 3.3 V UART logic (safe for ESP32) |
| Common-cathode RGB LED + 3 × 330 Ω | Status light on the cover |
| Momentary push button | SETUP |
| USB cable + 5 V 1 A adapter | Power through the top service opening |
| Printed enclosure | See the SCAN CAD kit |

## 2. Wiring

| From | To |
|---|---|
| PMS5003 VCC (pin 1) | ESP32 **5V / VIN** |
| PMS5003 GND (pin 2) | ESP32 GND |
| PMS5003 TX (pin 5) | ESP32 **GPIO16** |
| PMS5003 RX (pin 4) | ESP32 **GPIO17** |
| PMS5003 SET (pin 3) | not connected |
| SETUP button | GPIO33 ↔ GND |
| LED red / green / blue | GPIO25 / 26 / 27 through 330 Ω each; cathode → GND |

These pins avoid GPIO6–11 (connected to flash) and GPIO34–39 (no internal pull-ups). **Bench-test one unit and confirm against your exact board's pinout before building a batch.**

## 3. Create the database (once, ~10 min)

1. Sign up at supabase.com → **New project** (pick region *East US*). Save the database password.
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, **Run**.
3. **Project Settings → API**: copy the **Project URL** and the **anon public** key.
4. Register each sensor (SQL Editor). Make a secret with `openssl rand -hex 16` or any password generator:

```sql
insert into devices (id, name, neighborhood, lat, lng, token_hash) values
  ('SCAN-01', 'Riverdale · Fieldston', 'Riverdale', 40.8895, -73.9087, crypt('3f9c…your-secret…', gen_salt('bf')));
```

Get lat/lng by right-clicking the spot in Google Maps. Write the ID on the case; keep the secret in the team's password manager.

**Security model:** the anon key is public (it ships with the website). It can *read* readings, but the only way to *write* is `submit_reading()`, which checks the device's bcrypt-hashed secret and rate-limits to one post per 20 s. A lost sensor can be revoked with `delete from devices where id = 'SCAN-07';`.

## 4. Flash a sensor

1. Install the Arduino IDE 2 → **Boards Manager**: "esp32 by Espressif" → **Library Manager**: "WiFiManager" by tzapu.
2. Open `firmware/scan_sensor/scan_sensor.ino`. In `config.h`, paste the Project URL and anon key.
3. Board: **ESP32 Dev Module**; select the port; **Upload**. Open Serial Monitor at 115200.

Every sensor runs the same firmware. The ID and secret are entered on site, not compiled in.

## 5. Set up on site (2 min, from a phone)

1. Power the sensor. LED turns **magenta**, meaning setup mode.
2. On a phone, join Wi-Fi **SCAN-Setup-XXXX**. A setup page opens (or browse to 192.168.4.1).
3. Choose the school network, enter its password, the **Device ID** (`SCAN-01`) and the **Device secret**. Save.
4. LED: **blue** while connecting, then the **AQI color** after the first upload (~1 min).

Hold SETUP for 3 seconds at any time to change Wi-Fi.

| LED | Meaning |
|---|---|
| Magenta | Setup portal open |
| Blue | Booting / connecting |
| Blinking blue | Wi-Fi lost (reboots after 10 min) |
| Green / yellow / orange / red / purple | Last PM2.5 reading's EPA category |
| Solid red | Upload failed: check Serial Monitor (wrong secret, no internet, captive-portal Wi-Fi) |

**School Wi-Fi note:** networks that need a browser login page or WPA2-Enterprise (username + password) won't work with this setup. Ask IT for a device/IoT network or MAC-address allow-listing; that's the most common deployment blocker.

## 6. Turn the website live

Copy `.env.example` to `.env.local` in the site root (and add the same variables in your host's
environment settings, e.g. Vercel → Project → Settings → Environment Variables):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi…
NEXT_PUBLIC_SCAN_POLL_SECONDS=60
```

Rebuild the site. The Live Air badge changes from "Simulated data" to "Live network", and the map, table, chart and CSV export use real readings. Sensors are shown as offline after 15 minutes of silence.

## 7. Data quality checklist

- Co-locate two units for a week and compare. Readings should agree within ~10 %.
- If possible, co-locate one unit near a NYC DEC regulatory monitor to build a correction factor (low-cost sensors read high in humid air).
- Record mount height, indoor/outdoor and nearby sources (bus depot, kitchen vent) in `devices.neighborhood` or a new column.
- The enclosure is an **indoor** concept. Outdoor use needs a rain shield and has not been validated.

## Useful queries

```sql
-- hourly average per sensor, last 7 days
select device_id, date_trunc('hour', ts) as hour, round(avg(pm25)::numeric, 1) as pm25
from readings where ts > now() - interval '7 days' group by 1, 2 order by 2 desc;

-- sensors that went quiet
select device_id, max(ts) from readings group by 1 having max(ts) < now() - interval '30 minutes';
```
