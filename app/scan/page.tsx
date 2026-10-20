import type { Metadata } from "next";
import Link from "next/link";
import CadViewer from "@/components/CadViewer";
import Corners from "@/components/Corners";
import GridBackdrop from "@/components/GridBackdrop";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/fx/Reveal";
import Scramble from "@/components/fx/Scramble";
import ExplodedView from "./ExplodedView";
import s from "../shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "SCAN: Student Clean Air Network" };

const INTRO_VIDEO = "/media/scan-intro.mp4";
const LEGO_BASE_STL = "/models/scan-lego-base.stl";

const sheet = [
  { n: "S-01", v: "112×148×44", k: "Case body, mm" },
  { n: "S-02", v: "50×38×21", k: "PMS5003 envelope, mm" },
  { n: "S-03", v: "28×54", k: "ESP32 DevKit board, mm" },
  { n: "S-04", v: "96×166", k: "Mounting plate, mm" },
  { n: "S-05", v: "105", k: "Solids in the CAD assembly" },
];

const pipeline = [
  {
    t: "Sense",
    b: "The PMS5003 counts particles in a sample of air every second.",
    tech: "PMS5003 · UART",
    icon: ["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M12 8v4l3 2"],
  },
  {
    t: "Connect",
    b: "The ESP32 averages a minute of data and joins Wi-Fi set up from a phone.",
    tech: "ESP32 · WiFiManager",
    icon: ["M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0", "M2 8.82a15 15 0 0 1 20 0M12 20h.01"],
  },
  {
    t: "Store",
    b: "Readings post to a shared Postgres database with a per-device key.",
    tech: "Supabase · REST",
    icon: ["M3 5c0-1.7 4-3 9-3s9 1.3 9 3-4 3-9 3-9-1.3-9-3z", "M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"],
  },
  {
    t: "Share",
    b: "The live map shows every sensor, its AQI and its history.",
    tech: "Live Air dashboard",
    icon: ["M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z", "M9 3v15M15 6v15"],
  },
];

export default function ScanPage() {
  return (
    <main>
      <section className={s.dark}>
        <GridBackdrop />
        <div className={`${s.darkInner} ${styles.heroInner}`}>
          <div className={`${s.split} ${styles.heroTop}`}>
            <div className={s.stack} style={{ gap: 24 }}>
              <span className={s.kicker}>
                <Scramble text="Outreach project · 2026–27" />
              </span>
              <h1 className={s.h1} style={{ fontSize: "clamp(60px, 9vw, 148px)", lineHeight: 0.86 }}>
                <Reveal as="span">SCAN</Reveal>
              </h1>
            </div>
            <Reveal delay={150} className={s.stack}>
              <span className={styles.subtitle}>Student Clean Air Network</span>
              <p className={s.lede} style={{ maxWidth: "48ch", marginTop: 16 }}>
                AIMing for clean air by building student engineers. Students customize a sensor case,
                assemble the electronics, connect it to Wi-Fi and learn how their engineering
                decisions affect the measurements.
              </p>
            </Reveal>
          </div>
          <Reveal delay={250}>
            <figure className={styles.videoFrame}>
              <i className={`${styles.tick} ${styles.tl}`} />
              <i className={`${styles.tick} ${styles.tr}`} />
              <i className={`${styles.tick} ${styles.bl}`} />
              <i className={`${styles.tick} ${styles.br}`} />
              <video src={INTRO_VIDEO} controls playsInline muted autoPlay loop className={styles.video} />
            </figure>
            <div className={styles.caption}>
              <span>Fig. 01 · Introducing SCAN</span>
              <span>Design · Build · Measure · Share</span>
            </div>
          </Reveal>
        </div>
      </section>

      <ExplodedView />

      <div className={s.container}>
        <section className={styles.section}>
          <SectionHeader label="02 · Spec sheet" space={40} />
          <div className="blueprint">
            <Corners />
            <div className={styles.sheetHead}>
              <span className={styles.sheetTitle}>Student Air Network · enclosure assembly</span>
              <span className={styles.sheetMeta}>Rev A</span>
              <span className={styles.sheetMeta}>Units mm</span>
            </div>
            <div className={styles.sheet}>
              {sheet.map((x, i) => (
                <Reveal key={x.n} delay={i * 80} className={styles.sheetCell}>
                  <span className={s.label}>{x.n}</span>
                  <span className={styles.sheetValue}>{x.v}</span>
                  <span className={styles.sheetKey}>{x.k}</span>
                </Reveal>
              ))}
            </div>
            <p className={styles.sheetNote}>
              Presentation concept. Fit, wiring, airflow and mounting are being tested on a bench unit.
              Indoor use only.
            </p>
          </div>
        </section>

        <section className={styles.sectionLg}>
          <SectionHeader label="03 · From sensor to map" space={40} />
          <div className={styles.networkHead}>
            <h2 className={s.h2} style={{ fontSize: "clamp(36px, 4.4vw, 60px)", maxWidth: "16ch" }}>
              Every sensor reports to one live map
            </h2>
            <p className={s.bodySm} style={{ maxWidth: "44ch" }}>
              Each unit joins school Wi-Fi through a setup portal, then posts a reading every minute.
              Anyone can watch the whole Bronx network update in real time.
            </p>
          </div>
          <div className={styles.pipeline}>
            {pipeline.map((p, i) => (
              <Reveal key={p.t} delay={i * 100} className={`blueprint ${styles.stage4}`}>
                <Corners />
                <div className={styles.stageTop}>
                  <span className={styles.stageNum}>{String(i + 1).padStart(2, "0")}</span>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={p.icon[0]} />
                    <path d={p.icon[1]} />
                  </svg>
                </div>
                <h3 className={styles.stageTitle}>{p.t}</h3>
                <p className={s.note}>{p.b}</p>
                <span className={`${s.label} ${styles.stageTech}`}>{p.tech}</span>
              </Reveal>
            ))}
          </div>
          <div className={styles.actions}>
            <Link href="/live-air" className="btn btn-primary blueprint btn-caps" style={{ padding: "12px 20px" }}>
              <Corners />
              Open the live map
            </Link>
            <Link href="/scan/setup" className="btn btn-secondary btn-caps" style={{ padding: "12px 20px" }}>
              Firmware &amp; setup guide
            </Link>
          </div>
        </section>

        <section className={`${s.split} ${styles.fll}`} style={{ ["--min" as string]: "420px" }}>
          <Reveal className={`blueprint ${styles.stlFrame}`}>
            <Corners />
            <CadViewer src={LEGO_BASE_STL} zUp grid spin={2} className={styles.stlViewer} />
            <span className={styles.figLabel}>Fig. 02 · SCAN base, LEGO edition</span>
          </Reveal>
          <Reveal delay={120} className={s.stack}>
            <span className="eyebrow">04 · For FIRST LEGO League</span>
            <h2 className={s.h2} style={{ fontSize: "clamp(36px, 4.4vw, 60px)", marginTop: 20 }}>
              A case younger engineers can build
            </h2>
            <p className={s.body} style={{ maxWidth: "46ch", marginTop: 20 }}>
              We modeled a LEGO-compatible SCAN base so FIRST LEGO League teams can build their own
              enclosure out of bricks, mount the same sensor, and join the network alongside high
              school teams.
            </p>
            <a href={LEGO_BASE_STL} download className={`btn btn-secondary ${styles.download}`}>
              Download STL
            </a>
          </Reveal>
        </section>

        <section className={styles.join}>
          <div className={`blueprint ${s.panel}`} style={{ padding: "clamp(28px, 4vw, 56px)", gap: 28 }}>
            <Corners />
            <div className={s.stack} style={{ gap: 10, maxWidth: "56ch" }}>
              <h3 className={styles.joinTitle}>Bring SCAN to your school</h3>
              <p className={s.bodySm}>
                AIM students lead the workshop. Your group customizes its own case, builds the sensor,
                and puts your school on the map.
              </p>
            </div>
            <Link href="/contact" className="btn btn-primary blueprint btn-caps">
              <Corners />
              Request a workshop
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
