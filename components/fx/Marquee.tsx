"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useInView";

// Scrolls a row of items horizontally forever. Items are rendered twice so the loop is seamless;
// the second copy is hidden from screen readers. Pauses on hover.
export default function Marquee({
  speed = 40,
  className,
  trackClassName,
  children,
}: {
  speed?: number;
  className?: string;
  trackClassName?: string;
  children: React.ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    const inner = track.current;
    if (!el || !inner || prefersReducedMotion()) return;
    const w = inner.scrollWidth / 2;
    const anim = inner.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${-w}px)` }],
      { duration: (w / speed) * 1000, iterations: Infinity },
    );
    const pause = () => anim.pause();
    const play = () => anim.play();
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", play);
    return () => {
      anim.cancel();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", play);
    };
  }, [speed]);

  return (
    <div ref={outer} className={className} style={{ overflow: "hidden" }}>
      <div ref={track} className={trackClassName} style={{ display: "flex", width: "max-content" }}>
        {children}
        <div aria-hidden="true" style={{ display: "contents" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
