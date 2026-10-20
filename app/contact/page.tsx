import type { Metadata } from "next";
import Corners from "@/components/Corners";
import ContactForm from "./ContactForm";
import s from "../shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Contact" };

const lines = [
  {
    k: "Email",
    v: "aimrobotics1@gmail.com",
    href: "mailto:aimrobotics1@gmail.com",
    icon: ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"],
  },
  {
    k: "Sponsorship",
    v: "Become a sponsor",
    href: "/sponsors#become",
    icon: ["M20 7h-9", "M14 17H5M17 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  },
  {
    k: "Instagram",
    v: "@aimrobotics_",
    href: "https://www.instagram.com/aimrobotics_/",
    icon: ["M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z", "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"],
  },
  {
    k: "Location",
    v: "Fieldston School, Bronx",
    href: "https://maps.google.com/?q=Ethical+Culture+Fieldston+School",
    icon: ["M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  },
];

export default function ContactPage() {
  return (
    <main className={s.container}>
      <section className={styles.hero}>
        <span className="eyebrow">Contact us</span>
        <h1 className={s.h1} style={{ fontSize: "clamp(52px, 7.6vw, 112px)", lineHeight: 0.94 }}>
          <span>Send us</span>
          <span className={s.accent}>a message.</span>
        </h1>
        <p className={s.lede} style={{ maxWidth: "56ch" }}>
          Sponsorship, joining the team, a SCAN workshop for your school, or a question about FIRST.
          A student officer reads every message.
        </p>
      </section>

      <section className={`${s.split} ${styles.body}`} style={{ ["--min" as string]: "360px" }}>
        <div className={`blueprint ${styles.formFrame}`}>
          <Corners />
          <ContactForm />
        </div>

        <div className={s.stack}>
          <span className="eyebrow" style={{ letterSpacing: "0.08em", marginBottom: 12 }}>Direct lines</span>
          <div className={styles.rule} />
          {lines.map((l) => {
            const external = l.href.startsWith("http");
            return (
              <a
                key={l.k}
                href={l.href}
                className={styles.line}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={l.icon[0]} />
                  <path d={l.icon[1]} />
                </svg>
                <span className={styles.lineText}>
                  <span className={styles.lineKey}>{l.k}</span>
                  <span className={styles.lineValue}>{l.v}</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            );
          })}
          <p className={styles.where}>
            Based at the Ethical Culture Fieldston School in the Bronx. We practice at The Gaga Center
            on the Upper East Side.
          </p>
        </div>
      </section>
    </main>
  );
}
