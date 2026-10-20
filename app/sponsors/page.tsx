import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Corners from "@/components/Corners";
import Reveal from "@/components/fx/Reveal";
import Scramble from "@/components/fx/Scramble";
import s from "../shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Sponsors" };

const sponsors = [
  {
    name: "The Gaga Center",
    kind: "Practice space",
    logo: "/images/sponsors/gaga-center.png",
    url: "https://www.gagacenter.com/nyc/",
    b: "The Gaga Center, on the Upper East Side of New York City, lets AIM Robotics use its space for practices. It's a place for people of all ages to play Gaga and have fun!",
  },
  {
    name: "Euro Trend",
    kind: "Sponsor",
    logo: "/images/sponsors/euro-trend.png",
    url: "https://www.eurotrendusa.com/",
    b: "Founded in 2003, Eurotrend pairs European design with local customization, making high-end furniture for contract, hospitality and residential projects with well-known designers and manufacturers.",
  },
  {
    name: "Unqork",
    kind: "Sponsor",
    logo: "/images/sponsors/unqork.png",
    url: "https://www.unqork.com/about-unqork/",
    b: "Unqork is a no-code platform that lets companies build enterprise software without writing code.",
  },
  {
    name: "Sixfold",
    kind: "Sponsor",
    logo: "/images/sponsors/sixfold.png",
    url: "https://www.sixfold.ai/product",
    b: "Sixfold is a New York company that builds AI tools made specifically for insurance underwriters.",
  },
  {
    name: "J.Crew",
    kind: "Sponsor",
    logo: "/images/sponsors/jcrew.png",
    url: "https://www.jcrew.com/",
    b: "J.Crew makes classic American clothing with a modern twist. J.Crew AIMs to help everyone confidently express themselves through their style.",
  },
];

const funds = [
  { t: "Compete", b: "FTC registration and event fees for the season." },
  { t: "Build", b: "Motors, servos, aluminum, sensors and printing filament." },
  { t: "Travel", b: "Getting the team and robot to qualifiers and championships." },
  { t: "SCAN", b: "Sensor kits so Bronx students can build their own monitors." },
];

export default function SponsorsPage() {
  return (
    <main>
      <div className={s.container}>
        <section className={`${s.split} ${styles.hero}`}>
          <div className={s.stack} style={{ gap: 24 }}>
            <span className={s.kicker}>
              <Scramble text="Sponsors & partners" />
            </span>
            <h1 className={s.h1} style={{ fontSize: "clamp(54px, 7.4vw, 112px)" }}>
              <Reveal as="span">Built with</Reveal>
              <Reveal as="span" delay={120} className={s.accent}>our partners.</Reveal>
            </h1>
          </div>
          <Reveal as="p" delay={200} className={s.lede}>
            Many people and organizations have helped our team along the way. We are grateful for
            all of their support.
          </Reveal>
        </section>

        <section className={styles.list}>
          {sponsors.map((sp, i) => (
            <Reveal key={sp.name} className={styles.sponsor}>
              <div className={`blueprint ${styles.logoFrame}`}>
                <Corners />
                <div className={styles.logo}>
                  <Image src={sp.logo} alt={sp.name} fill sizes="(max-width: 700px) 90vw, 560px" />
                </div>
              </div>
              <div className={s.stack} style={{ gap: 14 }}>
                <span className={s.label}>
                  P-{String(i + 1).padStart(2, "0")} · {sp.kind}
                </span>
                <h2 className={s.h2} style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>{sp.name}</h2>
                <p className={s.bodySm} style={{ maxWidth: "56ch" }}>{sp.b}</p>
                <a href={sp.url} target="_blank" rel="noopener" className={styles.visit}>
                  Visit website ↗
                </a>
              </div>
            </Reveal>
          ))}
        </section>
      </div>

      <section id="become" className={`${s.dark} ${styles.become}`}>
        <div className={`${s.darkInner} ${styles.becomeInner}`}>
          <div className={`${s.split} ${styles.becomeHead}`} style={{ ["--min" as string]: "420px" }}>
            <div className={s.stack} style={{ gap: 20 }}>
              <span className="eyebrow" style={{ color: "var(--color-accent-300)" }}>Become a sponsor</span>
              <h2 className={s.h2} style={{ fontSize: "clamp(40px, 5.4vw, 80px)", lineHeight: 0.92 }}>
                Your support goes on the robot and on the map
              </h2>
            </div>
            <p className={styles.becomeText}>
              Sponsorship pays for FTC registration, parts, tools and travel. This year it also puts
              SCAN air sensors into Bronx schools. Interested in joining our partners? Get in touch.
            </p>
          </div>
          <div className={styles.funds}>
            {funds.map((f, i) => (
              <Reveal key={f.t} delay={i * 80} className={styles.fund}>
                <span className={styles.fundNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.fundTitle}>{f.t}</span>
                <span className={styles.fundBody}>{f.b}</span>
              </Reveal>
            ))}
          </div>
          <div className={styles.actions}>
            <Link href="/contact" className="btn btn-primary blueprint btn-caps btn-signal">
              <Corners />
              Contact the team
            </Link>
            <Link href="/donate" className="btn btn-caps btn-outline-light">
              Make a donation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
