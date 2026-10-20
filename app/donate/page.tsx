import type { Metadata } from "next";
import Link from "next/link";
import Corners from "@/components/Corners";
import GridBackdrop from "@/components/GridBackdrop";
import Reveal from "@/components/fx/Reveal";
import Scramble from "@/components/fx/Scramble";
import s from "../shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Donate" };

const DONATION_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSdSUnl7PMwEqBzaAMxiCYDSU2jcjGpgXxzykQU42HEbzx3OTg/viewform?usp=sf_link";

const uses = [
  { t: "Robot parts", b: "Motors, servos, sensors, aluminum and filament for this season’s Griffy." },
  { t: "Competition season", b: "FTC registration and event fees." },
  { t: "Travel", b: "Getting students and the robot to qualifiers and championships." },
  { t: "SCAN kits", b: "An ESP32, a PMS5003 sensor and a printed case for each participating school." },
];

export default function DonatePage() {
  return (
    <main>
      <section className={s.dark}>
        <GridBackdrop />
        <div className={`${s.darkInner} ${s.split} ${styles.heroInner}`}>
          <div className={s.stack} style={{ gap: 24 }}>
            <span className={s.kicker}>
              <Scramble text="Support AIM Robotics" />
            </span>
            <h1 className={s.h1} style={{ fontSize: "clamp(56px, 8vw, 124px)", lineHeight: 0.88 }}>
              <Reveal as="span">Fuel the</Reveal>
              <Reveal as="span" delay={120} className={s.accent}>next build.</Reveal>
            </h1>
            <Reveal as="p" delay={240} className={s.lede}>
              Every gift goes directly to the robot, the competition season and SCAN sensor kits for
              Bronx students. Donations are made through a short form.
            </Reveal>
            <Reveal delay={320} className={styles.ctas}>
              <a href={DONATION_FORM} target="_blank" rel="noopener" className={`btn btn-primary blueprint btn-signal ${styles.big}`}>
                <Corners />
                Donate now ↗
              </a>
              <Link href="/sponsors#become" className={`btn btn-outline-light ${styles.big}`}>
                Corporate sponsorship
              </Link>
            </Reveal>
          </div>
          <div className={styles.uses}>
            {uses.map((u, i) => (
              <Reveal key={u.t} delay={i * 80} className={styles.use}>
                <span className={styles.useNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.useText}>
                  <span className={styles.useTitle}>{u.t}</span>
                  <span className={styles.useBody}>{u.b}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className={s.container} style={{ padding: "96px clamp(20px, 4vw, 56px) 112px" }}>
        <div className={`blueprint ${s.panel}`}>
          <Corners />
          <div className={s.stack} style={{ gap: 8, maxWidth: "56ch" }}>
            <h3 className={styles.otherTitle}>Other ways to help</h3>
            <p className={s.bodySm}>
              Mentor a department, donate materials or machining time, or host a SCAN sensor at your
              school or business.
            </p>
          </div>
          <Link href="/contact" className="btn btn-secondary btn-caps" style={{ padding: "12px 20px" }}>
            Get in touch
          </Link>
        </div>
      </div>
    </main>
  );
}
