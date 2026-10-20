import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import Corners from "./Corners";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <Image src="/images/aim-logo.png" alt="AIM Robotics" width={40} height={40} priority />
        <span className={styles.brandText}>
          <span className={styles.brandName}>AIM Robotics</span>
          <span className={styles.brandSub}>FTC 18657 · Bronx, NYC</span>
        </span>
      </Link>
      <div className={styles.right}>
        <nav className={styles.links} aria-label="Main">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/scan">SCAN</NavLink>
          <NavLink href="/live-air" className={styles.live}>
            <span className={styles.liveDot} aria-hidden="true" />
            Live air
          </NavLink>
          <NavLink href="/sponsors">Sponsors</NavLink>
          <NavLink href="/bullseye">Bullseye</NavLink>
          <NavLink href="/first">Why FIRST</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        <Link href="/donate" className={`btn btn-primary blueprint ${styles.donate}`}>
          <Corners />
          Donate
        </Link>
      </div>
    </header>
  );
}
