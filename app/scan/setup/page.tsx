import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "SCAN firmware & setup guide" };

// Renders scan-network/README.md at build time so the guide has a single source.
async function loadGuide() {
  "use cache";
  cacheLife("max");
  return readFile(path.join(process.cwd(), "scan-network", "README.md"), "utf8");
}

export default async function SetupGuidePage() {
  const md = await loadGuide();
  return (
    <main className={styles.wrap}>
      <Link href="/scan" className={styles.back}>
        ← Back to SCAN
      </Link>
      <article className={styles.prose}>
        <Markdown remarkPlugins={[remarkGfm]}>{md}</Markdown>
      </article>
    </main>
  );
}
