"use client";

import { useState } from "react";
import Corners from "@/components/Corners";
import styles from "./page.module.css";

const EMAIL = "aimrobotics1@gmail.com";

const ROLES = {
  Sponsor: {
    org: "Company or organization",
    prompt: "Tell us about your organization and how you would like to support the team.",
  },
  Student: {
    org: "School and grade",
    prompt: "Tell us a little about yourself and what interests you: building, coding, design or outreach.",
  },
  "SCAN workshop": {
    org: "School or organization",
    prompt: "Tell us about your group, how many students, and where a sensor could be mounted.",
  },
  Other: { org: "Organization", prompt: "How can we help?" },
} as const;
type Role = keyof typeof ROLES;

// There's no mail backend yet, so sending opens the visitor's email app with the message filled in.
// To receive messages directly, point handleSubmit at a form service or a Next.js server action.
export default function ContactForm() {
  const [role, setRole] = useState<Role>("Sponsor");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const org = String(f.get("org") || "");
    const signature = [name, String(f.get("email") || "")];
    if (org) signature.push(`${ROLES[role].org}: ${org}`);
    const body = `${f.get("message") || ""}\n\n${signature.join("\n")}`;
    const subject = `[${role}] Message from ${name}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.sent}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <h2 className={styles.sentTitle}>Almost there</h2>
        <p className={styles.sentText}>
          Thanks{name ? `, ${name.split(" ")[0]}` : ""}. Your email app should have opened with the
          message ready to send. If it didn&apos;t, write to us at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
        <button
          type="button"
          className={`btn btn-secondary ${styles.again}`}
          onClick={() => {
            setSent(false);
            setName("");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <fieldset className={`field ${styles.fieldset}`}>
        <legend className={styles.label}>I&apos;m writing as</legend>
        <div className={`seg ${styles.seg}`}>
          {(Object.keys(ROLES) as Role[]).map((r) => (
            <label key={r} className={`seg-opt ${styles.segOpt}`}>
              <input type="radio" name="role" checked={r === role} onChange={() => setRole(r)} />
              {r}
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.twoUp}>
        <div className="field">
          <label htmlFor="c-name" className={styles.label}>Name</label>
          <input id="c-name" className="input" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="c-email" className={styles.label}>Email</label>
          <input id="c-email" name="email" className="input" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-org" className={styles.label}>{ROLES[role].org}</label>
        <input id="c-org" name="org" className="input" placeholder="Optional" />
      </div>
      <div className="field">
        <label htmlFor="c-msg" className={styles.label}>Message</label>
        <textarea id="c-msg" name="message" className={`input ${styles.textarea}`} required rows={6} placeholder={ROLES[role].prompt} />
      </div>
      <button type="submit" className={`btn btn-primary blueprint ${styles.submit}`}>
        <Corners />
        Send message
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
