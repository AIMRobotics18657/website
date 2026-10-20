import Link from "next/link";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.about}>
          <div className={styles.wordmark}>
            AIM Robotics
            <br />
            <span className={styles.number}>18657</span>
          </div>
          <p className={styles.blurb}>
            A student-led FIRST Tech Challenge team founded in fall 2020, based at the Ethical
            Culture Fieldston School in the Bronx.
          </p>
        </div>
        <div className={styles.column}>
          <span className={styles.heading}>Explore</span>
          <Link href="/about">About &amp; team</Link>
          <Link href="/scan">Student Clean Air Network</Link>
          <Link href="/live-air">Live air data</Link>
          <Link href="/bullseye">The Bullseye</Link>
          <Link href="/first">Why FIRST</Link>
        </div>
        <div className={styles.column}>
          <span className={styles.heading}>Reach us</span>
          <a href="mailto:aimrobotics1@gmail.com" className={styles.email}>
            aimrobotics1@gmail.com
          </a>
          <a href="https://www.instagram.com/aimrobotics_/" target="_blank" rel="noopener">
            Instagram @aimrobotics_
          </a>
          <Link href="/sponsors">Become a sponsor</Link>
          <Link href="/donate">Donate</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2026 AIM Robotics · FTC Team 18657 · Bronx, New York</span>
        <span>FIRST® and FIRST® Tech Challenge are registered trademarks of FIRST.</span>
      </div>
    </footer>
  );
}
