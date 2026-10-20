import type { Metadata } from "next";
import Image from "next/image";
import Corners from "@/components/Corners";
import GridBackdrop from "@/components/GridBackdrop";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/fx/Reveal";
import Scramble from "@/components/fx/Scramble";
import s from "../shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "About" };

const photos = ["/images/gallery/team-1.jpg", "/images/gallery/team-2.jpg", "/images/gallery/team-3.jpg"];

const departments = [
  ["Mechanics", "Drivetrains, mechanisms and the build itself, from first prototype to competition robot."],
  ["Programming", "Teleop control, autonomous routines and sensors, written in Java."],
  ["Design", "CAD in Onshape, industrial design and the team brand."],
  ["Outreach", "Workshops, mentoring and SCAN, our Student Clean Air Network."],
  ["Finances", "Budget, fundraising and sponsor relationships."],
  ["Management", "Schedules, operations and keeping a student-led team on target."],
  ["Safety & Sustainability", "Safe shop practice and responsible use of materials."],
];

const timeline = [
  ["2020", "Founded", "AIM Robotics forms in the fall and enters its first FTC season."],
  ["2021", "Freight Frenzy", "Our blog, The Bullseye, starts sharing robot tips and season stories."],
  ["2023", "Super Qualifiers", "The team competes at NYC Super Qualifiers."],
  ["2023", "CENTERSTAGE", "A new robot, a monthly newsletter and more outreach."],
  ["Summit", "North American Robotics Summit", "We host 32 teams from across the continent."],
  ["Awards", "Inspire & Design", "Inspire Award at a qualifier and Design Award at finals."],
  ["Now", "SCAN", "Launching the Student Clean Air Network across the Bronx."],
];

const team = [
  ["Amelia", "Communications and Game Strategy", "amelia"],
  ["Alex", "Safety and Sustainability", "alex"],
  ["Dahlia", "Outreach and Finance", "dahlia"],
  ["Daniel", "Mechanics", "daniel"],
  ["Ellie", "Management and Operations", "ellie"],
  ["Ethan", "Mechanics and CAD", "ethan"],
  ["Gideon", "Game Strategy", "gideon"],
  ["Julian", "Programming", "julian"],
  ["Kai", "Design and Mechanics", "kai"],
  ["Nate", "Programming and Finance", "nate"],
  ["Ryan", "Mechanics", "ryan"],
  ["Sophia T.", "Outreach and Mechanics", "sophia-t"],
  ["Sammy", "Communications and Game Strategy", "sammy"],
  ["Grant", "Mechanics", "grant"],
  ["Brooke", "Programming and Social Media", "brooke"],
];

export default function AboutPage() {
  return (
    <main>
      <section className={s.dark}>
        <GridBackdrop />
        <div className={`${s.darkInner} ${s.split} ${styles.heroInner}`}>
          <div className={s.stack} style={{ gap: 24 }}>
            <span className={s.kicker}>
              <Scramble text="About AIM Robotics · Est. fall 2020" />
            </span>
            <h1 className={s.h1} style={{ fontSize: "clamp(54px, 7.4vw, 112px)" }}>
              <Reveal as="span">We AIM to</Reveal>
              <Reveal as="span" delay={120}>hit the target</Reveal>
              <Reveal as="span" delay={240} className={s.accent}>in every way.</Reveal>
            </h1>
          </div>
          <Reveal as="p" delay={300} className={s.lede}>
            Our mission is to inspire the next generation of FIRST innovators by building skills in
            both mechanics and business. As a community-based, student-led robotics team, we want
            to be a place where curious people can try things, make things and work together.
          </Reveal>
        </div>
      </section>

      <div className={s.container}>
        <section className={styles.photos}>
          {photos.map((src, i) => (
            <Reveal key={src} delay={i * 100}>
              <figure className={`blueprint duotone ${s.photo}`} style={{ aspectRatio: "4 / 3" }}>
                <Image src={src} alt="AIM Robotics team" fill sizes="(max-width: 700px) 100vw, 400px" />
                <Corners />
              </figure>
            </Reveal>
          ))}
        </section>

        <section className={`${s.split} ${styles.drives}`} style={{ ["--min" as string]: "420px" }}>
          <Reveal className={s.stack}>
            <span className="eyebrow">01 · What drives us</span>
            <h2 className={s.h2} style={{ fontSize: "clamp(36px, 4.4vw, 60px)", marginTop: 18 }}>
              A community of lifelong learners and innovators
            </h2>
          </Reveal>
          <Reveal delay={120} className={s.stack}>
            <p className={s.body}>
              We AIM to provide a space where members can develop skills in engineering, design,
              communications, project management, and more. We&apos;re also working to make FTC more
              accessible. We are starting a second team at our school and mentoring it through its
              first seasons of competition.
            </p>
            <p className={s.body} style={{ marginTop: 18 }}>
              Gracious Professionalism and cooperation guide our decisions, on the engineering side
              and the operational side. Through the NYC FIRST STEM Center we have met and befriended
              many new people, and we try to learn something from each of them.
            </p>
          </Reveal>
        </section>

        <section className={styles.section}>
          <SectionHeader label="02 · Departments" />
          <div className={`${s.cells} ${styles.depts}`}>
            {departments.map(([title, body], i) => (
              <Reveal key={title} delay={i * 60} className={styles.dept}>
                <span className={s.label}>D-{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.deptTitle}>{title}</h3>
                <p className={s.note}>{body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <SectionHeader label="03 · Timeline" />
          <div className={styles.timeline}>
            {timeline.map(([year, title, body], i) => (
              <Reveal key={title} delay={i * 70} className={styles.event}>
                <span className={styles.marker} aria-hidden="true" />
                <span className={styles.year}>{year}</span>
                <span className={styles.eventTitle}>{title}</span>
                <span className={styles.eventBody}>{body}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="team" className={styles.team}>
          <SectionHeader
            label="04 · Meet the team"
            aside={<span className={`eyebrow ${s.muted}`}>{team.length} members</span>}
          />
          <div className={styles.people}>
            {team.map(([name, role, file], i) => (
              <Reveal key={name} delay={(i % 5) * 60} className={styles.person}>
                <figure className={`blueprint duotone ${s.photo}`} style={{ aspectRatio: "4 / 5" }}>
                  <Image
                    src={`/images/team/${file}.jpg`}
                    alt={name}
                    fill
                    sizes="(max-width: 500px) 100vw, 240px"
                    style={{ objectPosition: "top" }}
                  />
                  <Corners />
                </figure>
                <div className={styles.personText}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.role}>{role}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
