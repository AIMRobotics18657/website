import Image from "next/image";
import Link from "next/link";
import CadViewer from "@/components/CadViewer";
import Corners from "@/components/Corners";
import CountUp from "@/components/fx/CountUp";
import Marquee from "@/components/fx/Marquee";
import Reveal from "@/components/fx/Reveal";
import Scramble from "@/components/fx/Scramble";
import styles from "./page.module.css";

const ticker = [
  "Team 18657",
  "Founded fall 2020",
  "Ethical Culture Fieldston School",
  "32 teams hosted",
  "Inspire Award",
  "Design Award",
  "Student Clean Air Network",
  "ESP32 + PMS5003",
  "Bronx, New York",
];

// Logos are shown in one ink color (see .sponsorLogo); h is the display height in px,
// tuned per logo so wide wordmarks and square badges read at a similar size.
const sponsors = [
  { name: "The Gaga Center", src: "/images/sponsors/logos/gaga-center.svg", w: 220, h: 220, height: 72 },
  { name: "Euro Trend", src: "/images/sponsors/logos/euro-trend.webp", w: 400, h: 51, height: 26 },
  { name: "Unqork", src: "/images/sponsors/logos/unqork.png", w: 297, h: 80, height: 40 },
  { name: "Sixfold", src: "/images/sponsors/logos/sixfold.svg", w: 164, h: 38, height: 38 },
  { name: "J.Crew", src: "/images/sponsors/logos/jcrew.svg", w: 1183, h: 593, height: 56 },
];

// `count` animates the number up on first view. The founding year stays static.
const record = [
  {
    n: "R-01",
    big: 32,
    count: true,
    title: "Teams hosted",
    note: "We hosted the North American Robotics Summit, with 32 teams from across the continent.",
  },
  {
    n: "R-02",
    big: 1,
    unit: "×",
    count: true,
    title: "Inspire Award",
    note: "FTC's top award. We won it at a qualifier as the team that best represents FIRST.",
  },
  {
    n: "R-03",
    big: 1,
    unit: "×",
    count: true,
    title: "Design Award",
    note: "Won at finals for a robot that was well designed and well built.",
  },
  {
    n: "R-04",
    big: 2020,
    title: "Founded",
    note: "Student-led since fall 2020. We've built, competed and mentored every season since.",
  },
];

const specs = [
  { k: "Size", v: "18 in cube" },
  { k: "CAD", v: "Onshape" },
  { k: "Code", v: "Java" },
];

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroSweep} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>
              <span className={styles.blinker} aria-hidden="true" />
              <Scramble text="FIRST Tech Challenge · Team 18657 · Bronx, NYC" />
            </span>
            <h1 className={styles.heroTitle}>
              <Reveal as="span">Student engineers.</Reveal>
              <Reveal as="span" delay={120}>Competition robots.</Reveal>
              <Reveal as="span" delay={240} className={styles.heroAccent}>Cleaner air.</Reveal>
            </h1>
            <Reveal as="p" delay={360} className={styles.heroLede}>
              AIM Robotics is a community-based, student-led FTC team from the Bronx. We design, build
              and code a new robot every season, and this year we&apos;re building a citywide network of
              student-made air-quality sensors.
            </Reveal>
            <Reveal delay={480} className={styles.ctaRow}>
              <Link href="/scan" className="btn btn-primary blueprint btn-caps btn-signal">
                <Corners />
                Explore SCAN
                <ArrowRight />
              </Link>
              <Link href="/about" className="btn btn-caps btn-outline-light">
                Meet the team
              </Link>
            </Reveal>
          </div>

          <div className={styles.viewerWrap}>
            {/*
              ROBOT CAD PLACEHOLDER
              Until the robot is finished this shows an 18 in wireframe sizing cube.
              To show the real robot: export the Onshape assembly as GLB, save it as
              public/models/robot.glb, then add src="/models/robot.glb" below and
              delete the placeholder prop.
            */}
            <CadViewer
              theme="dark"
              grid
              spin={1.4}
              placeholder="Robot CAD coming soon"
              className={styles.viewer}
            />
            <div className={styles.viewerFrame} aria-hidden="true">
              <i className={`${styles.tick} ${styles.tickTl}`} />
              <i className={`${styles.tick} ${styles.tickTr}`} />
              <i className={`${styles.tick} ${styles.tickBl}`} />
              <i className={`${styles.tick} ${styles.tickBr}`} />
              <span className={`${styles.viewerLabel} ${styles.labelTl}`}>Fig. 01 · Griffy</span>
              <span className={`${styles.viewerLabel} ${styles.labelTr}`}>18 × 18 × 18 in</span>
              <span className={`${styles.viewerLabel} ${styles.labelBr}`}>Drag to orbit</span>
            </div>
          </div>
        </div>

        <div className={styles.tickerBar}>
          <Marquee speed={36} className={styles.tickerMarquee} trackClassName={styles.ticker}>
            {ticker.map((t) => (
              <span key={t} className={styles.tickerItem}>
                <span className={styles.diamond} aria-hidden="true" />
                {t}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.record}>
          <Reveal className={styles.sectionHead}>
            <span className="eyebrow">01 · Track record</span>
            <span className={`eyebrow ${styles.muted}`}>2020 → 2026</span>
          </Reveal>
          <div className={styles.rule} />
          <div className={styles.recordGrid}>
            {record.map((r, i) => (
              <Reveal key={r.n} delay={i * 100} className={styles.recordItem}>
                <span className={styles.recordId}>{r.n}</span>
                <span className={styles.recordBig}>
                  {r.count ? <CountUp value={r.big} /> : r.big}
                  {r.unit && <span className={styles.recordUnit}>{r.unit}</span>}
                </span>
                <span className={styles.recordTitle}>{r.title}</span>
                <span className={styles.recordNote}>{r.note}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.griffy}>
          <Reveal>
            <figure className={`blueprint duotone ${styles.griffyPhoto}`}>
              <Image
                src="/images/team-competition.jpg"
                alt="AIM Robotics at competition"
                width={1024}
                height={768}
                sizes="(max-width: 900px) 100vw, 600px"
              />
              <Corners />
            </figure>
          </Reveal>
          <Reveal delay={120} className={styles.griffyCopy}>
            <span className="eyebrow">02 · The robot</span>
            <h2 className={styles.h2}>Meet Griffy</h2>
            <p className={styles.body}>
              Griffy is named after our old mascot, and we rebuild it every season. Each subsystem
              starts as a sketch, gets modeled in Onshape, and is then prototyped, machined and tuned
              by students until it scores consistently in matches.
            </p>
            <div className={styles.specs}>
              {specs.map((s) => (
                <div key={s.k} className={styles.spec}>
                  <span className={styles.specKey}>{s.k}</span>
                  <span className={styles.specValue}>{s.v}</span>
                </div>
              ))}
            </div>
            <a
              href="https://cad.onshape.com/documents/61af09bc2a094526c9ade066"
              target="_blank"
              rel="noopener"
              className={`btn btn-secondary ${styles.onshapeBtn}`}
            >
              Open the CAD in Onshape ↗
            </a>
          </Reveal>
        </section>
      </div>

      <section className={styles.scan}>
        <div className={styles.scanGrid} aria-hidden="true" />
        <div className={styles.scanInner}>
          <Reveal className={styles.scanCopy}>
            <span className={`eyebrow ${styles.eyebrowLight}`}>03 · This year&apos;s outreach project</span>
            <h2 className={styles.scanTitle}>
              Student
              <br />
              Clean Air
              <br />
              <span className={styles.heroAccent}>Network</span>
            </h2>
            <p className={styles.scanLede}>
              AIMing for clean air by building student engineers. Students design an enclosure, wire a
              particle sensor to a Wi-Fi microcontroller, and put their own sensor on the live map.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/scan" className="btn btn-primary blueprint btn-caps btn-signal">
                <Corners />
                See how it&apos;s built
              </Link>
              <Link href="/live-air" className="btn btn-caps btn-outline-light">
                Live Bronx air data
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <figure className={styles.scanFigure}>
              <Image
                src="/images/scan-assembled.png"
                alt="Student Clean Air Network sensor enclosure, assembled"
                width={3000}
                height={2000}
                sizes="(max-width: 900px) 120vw, 720px"
                className={styles.scanImage}
              />
            </figure>
          </Reveal>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.first}>
          <Reveal className={styles.firstGrid}>
            <div className={styles.stack}>
              <span className="eyebrow">04 · Why FIRST</span>
              <h2 className={styles.h2First}>Skills, empowerment, community, opportunity.</h2>
            </div>
            <div className={styles.stack}>
              <p className={styles.body}>
                FIRST Tech Challenge is a worldwide robotics competition. Every year thousands of teams
                design, build and program a robot for a new game. FIRST&apos;s values of Gracious
                Professionalism and Coopertition shape how we work with other teams, at competitions
                and outside them.
              </p>
              <Link href="/first" className={`btn btn-primary blueprint ${styles.firstBtn}`}>
                <Corners />
                Why we love FIRST
              </Link>
            </div>
          </Reveal>
        </section>

        <section className={styles.sponsors}>
          <div className={styles.sponsorsHead}>
            <span className="eyebrow">05 · Supported by</span>
            <Link href="/sponsors" className={styles.allSponsors}>
              All sponsors →
            </Link>
          </div>
          <div className={styles.rule} />
          <Marquee speed={50} className={styles.sponsorMarquee}>
            {sponsors.map((s) => (
              <span key={s.name} className={styles.sponsor}>
                <Image
                  src={s.src}
                  alt={s.name}
                  width={s.w}
                  height={s.h}
                  unoptimized
                  className={styles.sponsorLogo}
                  style={{ height: s.height, width: "auto" }}
                />
              </span>
            ))}
          </Marquee>
        </section>
      </div>
    </main>
  );
}
