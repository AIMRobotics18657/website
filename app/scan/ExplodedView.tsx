"use client";

import { useEffect, useRef, useState } from "react";
import CadViewer from "@/components/CadViewer";
import styles from "./page.module.css";

const STEPS = [
  {
    t: "The assembled sensor",
    b: "A customizable enclosure designed for indoor wall or pole mounting, with a status LED and a setup button on the face.",
    spec: [["Case body", "112 × 148 × 44"], ["Parts modeled", "105"]],
  },
  {
    t: "Cover off",
    b: "A 3.2 mm front cover held by four screws lifts away from a back tray with 2.4 mm walls. Students design and print their own cover.",
    spec: [["Tray wall", "2.4 mm"], ["Cover", "3.2 mm"]],
  },
  {
    t: "The brain: ESP32",
    b: "An ESP32 DevKit reads the sensor over serial and sends readings to the network over Wi-Fi.",
    spec: [["Board", "28 × 54 mm"], ["Radio", "2.4 GHz Wi-Fi"]],
  },
  {
    t: "The nose: PMS5003",
    b: "A laser particle counter measures PM1, PM2.5 and PM10. Bottom vents and a divider keep intake and exhaust air separate.",
    spec: [["Envelope", "50 × 38 × 21"], ["Measures", "PM1 · PM2.5 · PM10"]],
  },
  {
    t: "Mount & deploy",
    b: "A 96 × 166 mm backplate with screw eyelets and zip-tie slots mounts the unit to a wall or pole.",
    spec: [["Plate", "96 × 166 × 4"], ["Total depth", "≈ 54 mm"]],
  },
];

// Part names in this GLB match the patterns in CadViewer's SCAN_MAP, which drive the exploded view.
const SCAN_MODEL = "/models/scan.glb";

// Tall scroll track with a sticky stage. Scrolling through it explodes the enclosure and
// steps through the five descriptions.
export default function ExplodedView() {
  const track = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = Math.max(0, Math.min(0.999, span > 0 ? -r.top / span : 0));
      setI(Math.floor(p * STEPS.length));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const step = STEPS[i];
  return (
    <section id="explode-track" ref={track} className={styles.track}>
      <div className={styles.stage}>
        <div className={styles.stageInner}>
          <div className={styles.stepCopy}>
            <span className="eyebrow">01 · Inside the sensor</span>
            <div className={styles.progress} aria-hidden="true">
              {STEPS.map((_, k) => (
                <span key={k} className={k <= i ? styles.barOn : styles.bar} />
              ))}
            </div>
            <span className={styles.stepCount}>
              {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </span>
            <div aria-live="polite" className={styles.stepText}>
              <h2 className={styles.stepTitle}>{step.t}</h2>
              <p className={styles.stepBody}>{step.b}</p>
            </div>
            <div className={styles.stepSpecs}>
              {step.spec.map(([k, v]) => (
                <div key={k} className={styles.stepSpec}>
                  <span>{k}</span>
                  <span className={styles.stepSpecValue}>{v}</span>
                </div>
              ))}
            </div>
            <span className={styles.hint}>Scroll to take it apart · drag to orbit</span>
          </div>
          <div className={styles.modelCol}>
            <CadViewer
              src={SCAN_MODEL}
              explode="scan"
              scrollTrack="#explode-track"
              labels
              spin={0.6}
              view={[0.9, 0.35, 1]}
              fit={2.4}
              className={styles.model}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
