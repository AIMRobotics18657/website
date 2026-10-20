import type { Metadata } from "next";
import Link from "next/link";
import Corners from "@/components/Corners";
import Placeholder from "@/components/Placeholder";
import SectionHeader from "@/components/SectionHeader";
import s from "../shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Why FIRST" };

const programs = [
  ["FIRST LEGO League Discover", "Ages 4–6", "Playful building with large LEGO bricks."],
  ["FIRST LEGO League Explore", "Ages 6–10", "Teams build and code simple LEGO models."],
  ["FIRST LEGO League Challenge", "Ages 9–16", "Robot games and research projects."],
  ["FIRST Tech Challenge", "Grades 7–12", "Teams design and build 18-inch robots from a reusable kit."],
  ["FIRST Robotics Competition", "Grades 9–12", "Full-scale industrial robots built in a short season."],
];
const OURS = 3;

const values = [
  ["Discovery", "We explore new skills and ideas."],
  ["Innovation", "We use creativity and persistence to solve problems."],
  ["Impact", "We apply what we learn to improve our world."],
  ["Inclusion", "We respect each other and embrace our differences."],
  ["Teamwork", "We are stronger when we work together."],
  ["Fun", "We enjoy and celebrate what we do."],
];

const voices = [
  {
    t: "The first time our autonomous ran clean at a qualifier, nobody on our side said a word for about five seconds. Then all of us were yelling. I've been chasing that feeling every season since.",
    who: "Ben Fink",
  },
  {
    t: "I joined to help with wiring. Two seasons later I'm the one people come find when the drivetrain is acting up, and I'm still not totally sure how that happened.",
    who: "Noah Lodish",
  },
  {
    t: "A rival team lent us a servo twenty minutes before eliminations. We beat them in the semis with it. They were the first ones over to congratulate us.",
    who: "Grant Easton",
  },
];

export default function FirstPage() {
  return (
    <main>
      <div className={s.container}>
        <section className={styles.hero}>
          <span className="eyebrow">Why FIRST</span>
          <h1 className={s.h1} style={{ fontSize: "clamp(52px, 7.6vw, 112px)", lineHeight: 0.94 }}>
            <span>It was never</span>
            <span className={s.accent}>only about robots.</span>
          </h1>
          <p className={s.lede} style={{ maxWidth: "60ch" }}>
            FIRST gave each of us a reason to stay after school, a room full of people who care about
            the same hard problems, and a way to see ourselves as engineers. This page is our
            thank-you.
          </p>
        </section>

        <section className={`${s.split} ${styles.what}`} style={{ ["--min" as string]: "380px" }}>
          <div className={s.stack} style={{ gap: 18 }}>
            <span className={`eyebrow ${styles.tight}`}>01 · What FIRST is</span>
            <div className={styles.rule} />
            <h2 className={s.h2} style={{ fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: 1.02 }}>
              For Inspiration and Recognition of Science and Technology
            </h2>
            <p className={s.bodySm}>
              FIRST is a global nonprofit founded in 1989 by inventor Dean Kamen, with MIT professor
              Woodie Flowers shaping its culture. Its goal is to inspire young people to become
              leaders and innovators in science and technology.
            </p>
            <p className={s.bodySm}>
              Each season, students around the world get the same challenge on the same day, then
              have a few months to design, build and program a solution with help from volunteer
              mentors.
            </p>
          </div>
          {/* PHOTO PLACEHOLDER: swap for a competition-day photo (next/image inside a blueprint duotone figure) */}
          <Placeholder label="Competition-day photo" />
        </section>

        <section className={styles.section}>
          <SectionHeader label="02 · A path from kindergarten to college" />
          <div className={styles.programs}>
            {programs.map(([name, age, note], i) => (
              <div
                key={name}
                className={`blueprint ${styles.program} ${i === OURS ? styles.ours : ""}`}
                style={{ minHeight: 200 + i * 50 }}
              >
                <Corners />
                {i === OURS && <span className={`tag tag-accent ${styles.ourTag}`}>Our program</span>}
                <span className={styles.age}>{age}</span>
                <span className={styles.programName}>{name}</span>
                <span className={styles.programNote}>{note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeader label="03 · Core values" />
          <div className={`${s.cells} ${styles.values}`}>
            {values.map(([t, b], i) => (
              <div key={t} className={styles.value}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.valueTitle}>{t}</h3>
                <p className={s.note}>{b}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={`${s.dark} ${styles.gp}`}>
        <div className={`${s.darkInner} ${s.split} ${styles.gpInner}`} style={{ ["--min" as string]: "380px" }}>
          <div className={s.stack} style={{ gap: 20 }}>
            <span className="eyebrow" style={{ color: "var(--color-accent-300)", letterSpacing: "0.08em" }}>
              04 · Gracious Professionalism®
            </span>
            <h2 className={s.h2} style={{ fontSize: "clamp(40px, 5.4vw, 76px)", lineHeight: 0.96 }}>
              Compete hard. Help the team across the pit.
            </h2>
          </div>
          <div className={s.stack} style={{ gap: 28, alignSelf: "end" }}>
            <p className={styles.gpText}>
              Gracious Professionalism means doing high-quality work, respecting others, and being
              kind while you compete. In FTC that can mean lending a spare part to a team you&apos;re
              about to play, or helping a rival debug their code in the pits.
            </p>
            <p className={styles.gpText}>
              Coopertition® is the same idea on the field. Alliances change every match, so
              today&apos;s opponent is tomorrow&apos;s partner. You win by making everyone better.
            </p>
          </div>
        </div>
      </section>

      <div className={s.container}>
        <section className={styles.section}>
          <SectionHeader label="05 · What FIRST gave us" space={56} />
          <div className={styles.voices}>
            {voices.map((q, i) => (
              <figure key={i} className={styles.voice}>
                <blockquote className={styles.quote}>“{q.t}”</blockquote>
                <figcaption className={styles.who}>— {q.who}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={`blueprint ${s.panel}`}>
            <Corners />
            <div className={s.stack} style={{ gap: 8, maxWidth: "54ch" }}>
              <h3 className={styles.ctaTitle}>Start a team. Volunteer. Mentor.</h3>
              <p className={s.note}>
                FIRST runs on volunteers and mentors. Whether you have an hour to give or a whole
                career&apos;s worth of experience, there is a place for you.
              </p>
            </div>
            <div className={styles.ctaButtons}>
              <a href="https://www.firstinspires.org" target="_blank" rel="noopener" className="btn btn-primary blueprint btn-caps" style={{ padding: "12px 20px" }}>
                <Corners />
                Visit firstinspires.org
              </a>
              <Link href="/contact" className="btn btn-secondary btn-caps" style={{ padding: "12px 20px" }}>
                Mentor AIM Robotics
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
