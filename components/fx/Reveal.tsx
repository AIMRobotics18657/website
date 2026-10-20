"use client";

import { useRef } from "react";
import { useInViewOnce } from "./useInView";

type Props = {
  as?: "div" | "span" | "p";
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

// Fades and lifts its content in the first time it scrolls into view.
// The hidden starting state lives in globals.css so there's no flash before hydration.
export default function Reveal({ as: Tag = "div", delay = 0, className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInViewOnce(ref);
  return (
    <Tag
      // @ts-expect-error -- the ref type is the same for each allowed tag
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
