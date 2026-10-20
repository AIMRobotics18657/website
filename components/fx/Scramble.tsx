"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInViewOnce } from "./useInView";

const GLYPHS = "01<>/[]{}#+=*ABCDEFGHJKLMNPQRSTUVWXYZ";

// Decodes its text from random glyphs the first time it scrolls into view.
export default function Scramble({ text, duration = 900 }: { text: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, "0px");
  const [shown, setShown] = useState(text);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reveal immediately when motion is off
      setRunning(true);
      return;
    }
    let raf = 0;
    const total = duration + text.length * 18;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / total);
      setShown(
        [...text]
          .map((ch, i) => {
            if (ch === " ") return " ";
            const at = i / text.length;
            if (at < k) return ch;
            if (at < k + 0.25) return GLYPHS[(Math.random() * GLYPHS.length) | 0];
            return " ";
          })
          .join(""),
      );
      if (k < 1) raf = requestAnimationFrame(step);
      else setShown(text);
    };
    setRunning(true);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, duration]);

  return (
    <span ref={ref} className={`scramble${running ? " is-running" : ""}`} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
