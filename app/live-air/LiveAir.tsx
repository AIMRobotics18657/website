"use client";

import { useEffect, useMemo, useState } from "react";
import Corners from "@/components/Corners";
import Scramble from "@/components/fx/Scramble";
import { aqiOf, CATEGORIES } from "./aqi";
import SensorMap from "./SensorMap";
import { config, current, fetchLive, isLive, simulate, simulateTick, type Sensor } from "./sensors";
import s from "../shared.module.css";
import styles from "./page.module.css";

const DAY = 864e5;
const fmt = (v: number | undefined) => (v == null ? "—" : v.toFixed(1));

function downloadCsv(sensors: Sensor[]) {
  const lines = ["device_id,name,timestamp,pm25"];
  for (const x of sensors)
    for (const h of x.hist) lines.push(`${x.id},"${x.name}",${new Date(h.ts).toISOString()},${h.pm25.toFixed(2)}`);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
  a.download = "scan-bronx-24h.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function LiveAir() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [sel, setSel] = useState("SCAN-01");
  // null until mounted so server and client render the same markup
  const [now, setNow] = useState<number | null>(null);

  // Random simulated data and the local clock are client-only, so they start here after hydration
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let poll: ReturnType<typeof setInterval>;
    if (isLive) {
      const load = () =>
        fetchLive()
          .then((list) => {
            setSensors(list);
            setSel((cur) => (list.some((x) => x.id === cur) ? cur : (list[0]?.id ?? cur)));
          })
          .catch((e) => console.warn("SCAN fetch failed", e));
      load();
      poll = setInterval(load, config.pollSeconds * 1000);
    } else {
      setSensors(simulate());
      poll = setInterval(() => setSensors((list) => simulateTick(list)), 4000);
    }
    setNow(Date.now());
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(poll);
      clearInterval(clock);
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selected = sensors.find((x) => x.id === sel) ?? sensors[0];

  const view = useMemo(() => {
    if (!selected || now == null) return null;
    const v = current(selected);
    const { aqi, cat } = aqiOf(v);
    const vals = selected.hist.map((h) => h.pm25);
    const max = Math.max(20, ...vals) * 1.1;
    const t0 = now - DAY;
    const X = (ts: number) => Math.max(0, Math.min(600, ((ts - t0) / DAY) * 600));
    const Y = (p: number) => 160 - (p / max) * 156;
    const pts = selected.hist.map((h) => `${X(h.ts).toFixed(1)},${Y(h.pm25).toFixed(1)}`);
    const first = X(selected.hist[0].ts).toFixed(1);
    const last = X(selected.hist[selected.hist.length - 1].ts).toFixed(1);
    const sec = Math.max(0, Math.round((now - selected.ts) / 1000));
    return {
      aqi,
      cat: CATEGORIES[cat],
      max: Math.max(...vals).toFixed(1),
      ago: sec < 60 ? `${sec}s ago` : `${Math.round(sec / 60)} min ago`,
      pms: [
        { k: "PM1", v: fmt(selected.pm1 ?? v * 0.68) },
        { k: "PM2.5", v: fmt(v) },
        { k: "PM10", v: fmt(selected.pm10 ?? v * 1.32) },
      ],
      line: "M" + pts.join(" L"),
      area: `M${first},160 L${pts.join(" L")} L${last},160 Z`,
      goodY: Y(9).toFixed(1),
    };
  }, [selected, now]);

  const rows = useMemo(
    () =>
      sensors
        .slice()
        .sort((a, b) => current(b) - current(a))
        .map((x) => {
          const v = current(x);
          const { aqi, cat } = aqiOf(v);
          return { x, v, aqi, cat: CATEGORIES[cat] };
        }),
    [sensors],
  );

  const online = sensors.filter((x) => x.online).length;
  const clock =
    now == null ? "—" : new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <main>
      <section className={s.dark}>
        <div className={`${s.darkInner} ${styles.heroInner}`}>
          <div className={s.stack} style={{ gap: 18 }}>
            <span className={s.kicker}>
              <Scramble text="SCAN · Student Clean Air Network" />
            </span>
            <h1 className={s.h1} style={{ fontSize: "clamp(52px, 7vw, 104px)" }}>
              Live Bronx air
            </h1>
          </div>
          <div className={styles.status}>
            <span className={styles.badge}>
              <span className={styles.pulse} aria-hidden="true">
                <span />
                <span />
              </span>
              {isLive ? "Live network" : "Simulated data"}
            </span>
            <span className={styles.updated}>
              {online} of {sensors.length} sensors online · updated {clock}
            </span>
          </div>
        </div>
      </section>

      <div className={s.container} style={{ paddingTop: 40 }}>
        <div className={styles.grid}>
          <div className={`blueprint ${styles.mapFrame}`}>
            <Corners />
            <SensorMap sensors={sensors} selected={selected?.id ?? sel} onSelect={setSel} className={styles.map} />
            <div className={styles.legend}>
              {CATEGORIES.map((c) => (
                <span key={c.name} className={styles.legendItem}>
                  <span className={styles.swatch} style={{ background: c.color }} />
                  {c.name === "Unhealthy for sensitive groups" ? "USG" : c.name}
                </span>
              ))}
            </div>
          </div>

          <div className={`blueprint ${styles.detail}`}>
            <Corners />
            <div className={styles.detailHead}>
              <span className={s.label}>{selected?.id ?? "—"}</span>
              <span className={`${s.label} ${s.muted}`}>{view?.ago}</span>
            </div>
            <h2 className={styles.siteName}>{selected?.name ?? "Loading"}</h2>
            <div className={styles.aqiRow}>
              <div
                className={styles.aqiBox}
                style={{ background: view?.cat.color ?? "var(--color-surface)", color: view?.cat.ink ?? "var(--color-text)" }}
              >
                <span className={styles.aqiLabel}>US AQI</span>
                <span className={styles.aqiValue}>{view?.aqi ?? "—"}</span>
              </div>
              <div className={styles.aqiText}>
                <span className={styles.catName}>{view?.cat.name}</span>
                <span className={styles.advice}>{view?.cat.advice}</span>
              </div>
            </div>
            <div className={styles.pms}>
              {(view?.pms ?? []).map((p) => (
                <div key={p.k} className={styles.pm}>
                  <span className={styles.pmKey}>{p.k}</span>
                  <span className={styles.pmValue}>
                    {p.v}
                    <span className={styles.unit}> µg/m³</span>
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.chart}>
              <div className={styles.chartHead}>
                <span>PM2.5 · last 24 h</span>
                <span>max {view?.max ?? "—"}</span>
              </div>
              <svg viewBox="0 0 600 160" preserveAspectRatio="none" className={styles.chartSvg} role="img" aria-label="PM2.5 over the last 24 hours">
                {view && (
                  <>
                    <line x1="0" x2="600" y1={view.goodY} y2={view.goodY} stroke="var(--color-accent-400)" strokeDasharray="4 4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <path d={view.area} fill="color-mix(in srgb, var(--color-accent) 18%, transparent)" />
                    <path d={view.line} fill="none" stroke="var(--color-accent-700)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                  </>
                )}
              </svg>
              <div className={styles.chartFoot}>
                <span>24 h ago</span>
                <span>Dashed line: 9.0 µg/m³ “Good” limit</span>
                <span>Now</span>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.tableSection}>
          <div className={styles.tableHead}>
            <span className="eyebrow">All sensors · sorted by PM2.5</span>
            <button type="button" className={`btn btn-secondary ${styles.csv}`} onClick={() => downloadCsv(sensors)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5M5 21h14" />
              </svg>
              Download CSV
            </button>
          </div>
          <div className={styles.tableWrap}>
            <table className={`table ${styles.table}`}>
              <thead>
                <tr>
                  <th>Sensor</th>
                  <th>Neighborhood</th>
                  <th className={styles.num}>PM2.5</th>
                  <th className={styles.num}>PM10</th>
                  <th>AQI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ x, v, aqi, cat }) => (
                  <tr
                    key={x.id}
                    onClick={() => setSel(x.id)}
                    className={x.id === selected?.id ? styles.rowSelected : undefined}
                    aria-selected={x.id === selected?.id}
                  >
                    <td className={styles.id}>{x.id}</td>
                    <td>{x.name}</td>
                    <td className={`${styles.num} ${styles.pm25}`}>{fmt(v)}</td>
                    <td className={styles.num}>{fmt(x.pm10 ?? v * 1.32)}</td>
                    <td>
                      <span className={styles.aqiCell}>
                        <span className={styles.swatchLg} style={{ background: cat.color }} />
                        <span className={styles.tnum}>{aqi}</span>
                        <span className={styles.catSmall}>{cat.name}</span>
                      </span>
                    </td>
                    <td>
                      <span className={`tag tag-accent ${styles.status2}`}>{x.online ? "Online" : "Offline"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.footnote}>
            {isLive
              ? "Readings stream from SCAN sensors every minute."
              : "Showing simulated readings at proposed Bronx sites until sensors come online."}{" "}
            AQI uses the U.S. EPA PM2.5 breakpoints. Low-cost sensors are not regulatory monitors, so
            these readings are for education and for comparing sites.
          </p>
        </section>
      </div>
    </main>
  );
}
