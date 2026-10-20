// U.S. EPA PM2.5 breakpoints (2024 revision): [concentration low, high, AQI low, high]
const BREAKPOINTS = [
  [0, 9.0, 0, 50],
  [9.1, 35.4, 51, 100],
  [35.5, 55.4, 101, 150],
  [55.5, 125.4, 151, 200],
  [125.5, 225.4, 201, 300],
  [225.5, 500, 301, 500],
] as const;

export type Category = { name: string; color: string; ink: string; advice: string };

export const CATEGORIES: Category[] = [
  { name: "Good", color: "#00e400", ink: "#1d1f20", advice: "Air quality is satisfactory. A great day to be outside." },
  { name: "Moderate", color: "#ffff00", ink: "#1d1f20", advice: "Acceptable. Unusually sensitive people should consider limiting long outdoor exertion." },
  { name: "Unhealthy for sensitive groups", color: "#ff7e00", ink: "#1d1f20", advice: "People with asthma, children and older adults should reduce prolonged outdoor exertion." },
  { name: "Unhealthy", color: "#ff0000", ink: "#ffffff", advice: "Everyone should reduce prolonged or heavy exertion outdoors." },
  { name: "Very unhealthy", color: "#8f3f97", ink: "#ffffff", advice: "Health alert. Everyone should avoid prolonged outdoor exertion." },
  { name: "Hazardous", color: "#7e0023", ink: "#ffffff", advice: "Emergency conditions. Stay indoors." },
];

export function aqiOf(pm25: number): { aqi: number; cat: number } {
  const c = Math.max(0, Math.round(pm25 * 10) / 10);
  for (let i = 0; i < BREAKPOINTS.length; i++) {
    const [lo, hi, a, b] = BREAKPOINTS[i];
    if (c <= hi) return { aqi: Math.round(((b - a) / (hi - lo)) * (c - lo) + a), cat: i };
  }
  return { aqi: 500, cat: 5 };
}
