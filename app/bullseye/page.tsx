import type { Metadata } from "next";
import Link from "next/link";
import Corners from "@/components/Corners";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/fx/Reveal";
import Scramble from "@/components/fx/Scramble";
import { formatDate, posts } from "@/lib/bullseye";
import s from "../shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "The Bullseye" };

const letters = [
  { t: "December 2023", url: "/newsletters/aim-newsletter-2023-12.pdf" },
  { t: "November 2023", url: "/newsletters/aim-newsletter-2023-11.pdf" },
  { t: "October 2023", url: "/newsletters/aim-newsletter-2023-10.pdf" },
];

function ArrowRight({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function BullseyePage() {
  return (
    <main className={s.container}>
      <section className={`${s.split} ${styles.hero}`}>
        <div className={s.stack} style={{ gap: 24 }}>
          <span className={s.kicker}>
            <Scramble text="The team blog · newsletters" />
          </span>
          <h1 className={s.h1} style={{ fontSize: "clamp(60px, 8.4vw, 132px)", lineHeight: 0.88 }}>
            <Reveal as="span">The</Reveal>
            <Reveal as="span" delay={120} className={s.accent}>Bullseye</Reveal>
          </h1>
        </div>
        <Reveal as="p" delay={200} className={s.lede}>
          Our blog, with posts about events, our robot and team members, plus a monthly newsletter
          with highlights.
        </Reveal>
      </section>

      <section className={styles.posts}>
        {posts.map((p) => (
          <Link key={p.slug} href={`/bullseye/${p.slug}`} className={styles.post}>
            <time dateTime={p.date} className={styles.date}>
              {formatDate(p.date)}
            </time>
            <span className={styles.postText}>
              <span className={styles.postTitle}>{p.title}</span>
              <span className={styles.meta}>
                {p.author}
                {p.readTime && ` · ${p.readTime}`}
              </span>
            </span>
            <ArrowRight />
          </Link>
        ))}
      </section>

      <section className={styles.letters}>
        <SectionHeader label="Monthly newsletters" space={40} />
        <div className={styles.letterGrid}>
          {letters.map((l) => (
            <a key={l.t} href={l.url} target="_blank" rel="noopener" className={`blueprint ${styles.letter}`}>
              <Corners />
              <span className={s.label}>PDF · Newsletter</span>
              <span className={styles.letterTitle}>{l.t}</span>
              <span className={styles.read}>Read ↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
