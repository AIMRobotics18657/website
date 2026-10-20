export type Reading = { ts: number; pm25: number };

export type Sensor = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  ts: number;
  online: boolean;
  hist: Reading[];
  pm1?: number;
  pm10?: number;
  /** Baseline PM2.5 for the simulation */
  base?: number;
};

const DAY = 864e5;

export const config = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  pollSeconds: Number(process.env.NEXT_PUBLIC_SCAN_POLL_SECONDS) || 60,
};
export const isLive = Boolean(config.url && config.key);

// ── Live data (Supabase REST) ───────────────────────

type LatestRow = {
  device_id: string; name: string; lat: number; lng: number; ts: string;
  pm1: number | null; pm25: number; pm10: number | null;
};
type HistRow = { device_id: string; ts: string; pm25: number };

export async function fetchLive(): Promise<Sensor[]> {
  const headers = { apikey: config.key, Authorization: `Bearer ${config.key}` };
  const since = new Date(Date.now() - DAY).toISOString();
  const [latest, hist] = await Promise.all([
    fetch(`${config.url}/rest/v1/latest_readings?select=*`, { headers }).then((r) => r.json() as Promise<LatestRow[]>),
    fetch(`${config.url}/rest/v1/readings?select=device_id,ts,pm25&ts=gte.${since}&order=ts.asc&limit=20000`, {
      headers,
    }).then((r) => r.json() as Promise<HistRow[]>),
  ]);
  return latest.map((d) => {
    const ts = Date.parse(d.ts);
    return {
      id: d.device_id,
      name: d.name,
      lat: d.lat,
      lng: d.lng,
      ts,
      pm1: d.pm1 ?? undefined,
      pm10: d.pm10 ?? undefined,
      online: Date.now() - ts < 15 * 60000,
      hist: hist
        .filter((r) => r.device_id === d.device_id)
        .map((r) => ({ ts: Date.parse(r.ts), pm25: r.pm25 }))
        .concat([{ ts, pm25: d.pm25 }]),
    };
  });
}

// ── Simulated data until sensors come online ────────

// Proposed sites: [id, name, lat, lng, baseline PM2.5]
const SITES: [string, string, number, number, number][] = [
  ["SCAN-01", "Riverdale · Fieldston", 40.8895, -73.9087, 6.5],
  ["SCAN-02", "Kingsbridge Heights", 40.8707, -73.899, 8.2],
  ["SCAN-03", "Bedford Park", 40.87, -73.8857, 8.8],
  ["SCAN-04", "Fordham", 40.8615, -73.89, 10.4],
  ["SCAN-05", "Morrisania", 40.8296, -73.9067, 11.6],
  ["SCAN-06", "Mott Haven", 40.8091, -73.9229, 13.8],
  ["SCAN-07", "Hunts Point", 40.8094, -73.8803, 15.9],
  ["SCAN-08", "Soundview", 40.825, -73.868, 10.1],
  ["SCAN-09", "Parkchester", 40.837, -73.8604, 9.6],
  ["SCAN-10", "Throgs Neck", 40.819, -73.817, 7.4],
  ["SCAN-11", "Pelham Bay", 40.8506, -73.8333, 7.0],
  ["SCAN-12", "Co-op City", 40.874, -73.829, 7.9],
];

export function simulate(): Sensor[] {
  const now = Date.now();
  return SITES.map(([id, name, lat, lng, base]) => {
    let v = base;
    const hist: Reading[] = [];
    // 24 h of 10-minute points with morning and evening rush-hour bumps
    for (let k = 143; k >= 0; k--) {
      const ts = now - k * 600000;
      const h = new Date(ts).getHours();
      const diurnal = 1 + 0.35 * Math.exp(-((h - 8) ** 2) / 6) + 0.25 * Math.exp(-((h - 18) ** 2) / 5);
      v += (base * diurnal - v) * 0.25 + (Math.random() - 0.5) * base * 0.18;
      hist.push({ ts, pm25: Math.max(1, v) });
    }
    return { id, name, lat, lng, base, hist, ts: now, online: true };
  });
}

export function simulateTick(sensors: Sensor[]): Sensor[] {
  const now = Date.now();
  return sensors.map((x) => {
    const base = x.base ?? 8;
    const last = x.hist[x.hist.length - 1].pm25;
    const v = Math.max(1, last + (base - last) * 0.15 + (Math.random() - 0.5) * base * 0.12);
    const hist = x.hist.slice();
    hist[hist.length - 1] = { ts: now, pm25: v };
    if (now - hist[hist.length - 2].ts > 600000) {
      hist.push({ ts: now, pm25: v });
      hist.shift();
    }
    return { ...x, hist, ts: now };
  });
}

export const current = (s: Sensor) => s.hist[s.hist.length - 1]?.pm25 ?? 0;
