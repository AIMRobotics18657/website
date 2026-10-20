"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInViewOnce } from "./useInView";

// Counts a number up from 0 the first time it scrolls into view.
// Server output is the final value, so it reads correctly without JavaScript.
export default function CountUp({ value, duration = 1600 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref);
  const [shown, setShown] = useState(String(value));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to 0 once on the client before counting
    setShown("0");
  }, []);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - (1 - k) ** 4;
      setShown(k < 1 ? Math.round(value * eased).toLocaleString() : String(value));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return <span ref={ref}>{shown}</span>;
}
