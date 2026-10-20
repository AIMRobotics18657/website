"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";

type Props = {
  /** .glb, .gltf or .stl under /public. Leave unset to show the wireframe placeholder. */
  src?: string;
  /** Rotate Z-up meshes (STL exports) so they stand upright. */
  zUp?: boolean;
  /** Auto-rotate speed. 0 turns it off. */
  spin?: number;
  /** Exploded-view mapping. "scan" spreads out the SCAN enclosure's named parts. */
  explode?: "scan";
  /** CSS selector of an element whose scroll position drives the explode amount. */
  scrollTrack?: string;
  /** Explode amount 0..1 when not scroll-driven. */
  progress?: number;
  /** Show numbered part callouts while exploded. */
  labels?: boolean;
  grid?: boolean;
  theme?: "dark" | "light";
  /** Fill color for STL meshes. Defaults to --color-accent. */
  color?: string;
  /** Note shown under the model when no file is loaded. */
  placeholder?: string;
  /** Camera distance multiplier. */
  fit?: number;
  /** Camera direction as [x, y, z]. */
  view?: [number, number, number];
  className?: string;
  children?: React.ReactNode;
};

// SCAN enclosure part offsets in model millimetres (+Z points out of the front face)
const SCAN_MAP: [RegExp, [number, number, number]][] = [
  [/^03_front_cover|^04_accent_badge|^cover_screw/, [0, 0, 120]],
  [/^08_RGB|^LED_carrier|^RGB_resistor|^09_setup|^setup_switch/, [0, 0, 92]],
  [/^06_ESP32|^RF_shield|^antenna|^pin_|^socket_|^DevKit_USB|^onboard_button|^USB_serial/, [0, 18, 62]],
  [/^jumper|^Dupont/, [0, 0, 40]],
  [/^05_PMS|^PMS_|^fan_guard/, [0, -26, 50]],
  [/^07_USB|^USB_bulkhead/, [0, 36, 22]],
  [/^02_mounting/, [0, 0, -70]],
];
const SCAN_LABELS: [string, string, string][] = [
  ["03_front_cover", "01", "AIM enclosure cover"],
  ["05_PMS5003_50x38x21", "02", "PMS5003 particle sensor"],
  ["06_ESP32_DevKit_generic", "03", "ESP32 Wi-Fi controller"],
  ["08_RGB_LED_lens", "04", "RGB status LED + setup"],
  ["02_mounting_plate", "05", "Mounting plate"],
];

async function loadThree() {
  const [THREE, { OrbitControls }, { GLTFLoader }, { STLLoader }] = await Promise.all([
    import("three"),
    import("three/examples/jsm/controls/OrbitControls.js"),
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/loaders/STLLoader.js"),
  ]);
  return { THREE, OrbitControls, GLTFLoader, STLLoader };
}

export default function CadViewer({
  src,
  zUp,
  spin = 1.2,
  explode,
  scrollTrack,
  progress = 0,
  labels,
  grid,
  theme = "light",
  color,
  placeholder,
  fit,
  view = [0.75, 0.42, 1],
  className,
  children,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const target = useRef(progress);
  const [missing, setMissing] = useState(false);
  const dark = theme === "dark";

  useEffect(() => {
    target.current = Math.max(0, Math.min(1, progress));
  }, [progress]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];
    const css = (name: string, fallback: string) =>
      getComputedStyle(el).getPropertyValue(name).trim() || fallback;

    (async () => {
      const { THREE, OrbitControls, GLTFLoader, STLLoader } = await loadThree();
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      Object.assign(renderer.domElement.style, {
        position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", touchAction: "pan-y",
      });
      el.prepend(renderer.domElement);
      cleanups.push(() => {
        renderer.dispose();
        renderer.domElement.remove();
      });

      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xffffff, 0x3a4450, 1.5));
      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(3, 5, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffffff, 1.0);
      rim.position.set(-4, 2, -3);
      scene.add(rim);

      const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
      const ctl = new OrbitControls(cam, renderer.domElement);
      ctl.enableZoom = false;
      ctl.enablePan = false;
      ctl.enableDamping = true;
      ctl.dampingFactor = 0.08;
      ctl.autoRotate = spin > 0;
      ctl.autoRotateSpeed = spin;
      let idle: ReturnType<typeof setTimeout>;
      ctl.addEventListener("start", () => {
        ctl.autoRotate = false;
        clearTimeout(idle);
      });
      ctl.addEventListener("end", () => {
        idle = setTimeout(() => (ctl.autoRotate = spin > 0), 2500);
      });
      cleanups.push(() => {
        clearTimeout(idle);
        ctl.dispose();
      });

      const load = async (): Promise<THREE_NS.Object3D | null> => {
        if (!src) return null;
        if (/\.stl(\?|$)/i.test(src)) {
          const geo = await new STLLoader().loadAsync(src);
          geo.computeVertexNormals();
          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color || css("--color-accent", "#5980a6")),
            metalness: 0.08,
            roughness: 0.5,
          });
          const mesh = new THREE.Mesh(geo, mat);
          if (zUp) mesh.rotation.x = -Math.PI / 2;
          const g = new THREE.Group();
          g.add(mesh);
          return g;
        }
        return (await new GLTFLoader().loadAsync(src)).scene;
      };

      // FTC sizing cube: an 18 in wireframe box with a rough drivetrain and arm inside.
      // Stands in until the robot CAD is exported.
      const placeholderObj = () => {
        const g = new THREE.Group();
        const col = new THREE.Color(css("--color-accent-300", "#b5d9fd"));
        const lines = (geo: THREE_NS.BufferGeometry, opacity = 1) =>
          new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: col, transparent: opacity < 1, opacity }),
          );
        g.add(lines(new THREE.BoxGeometry(1, 1, 1)));
        const chassis = lines(new THREE.BoxGeometry(0.62, 0.22, 0.8), 0.6);
        chassis.position.y = -0.36;
        g.add(chassis);
        const arm = lines(new THREE.BoxGeometry(0.12, 0.62, 0.12), 0.6);
        arm.position.set(0, 0.06, 0.18);
        g.add(arm);
        for (const x of [-0.36, 0.36])
          for (const z of [-0.3, 0.3]) {
            const wheel = lines(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16), 0.6);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(x, -0.4, z);
            g.add(wheel);
          }
        return g;
      };

      let obj: THREE_NS.Object3D | null = null;
      try {
        obj = await load();
      } catch (e) {
        console.warn("CadViewer: could not load", src, e);
      }
      if (disposed) return;
      if (!obj) {
        obj = placeholderObj();
        setMissing(true);
      }

      // Center and normalize the model to a unit box
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const s = 1 / Math.max(size.x, size.y, size.z);
      const pivot = new THREE.Group();
      obj.position.sub(center);
      pivot.add(obj);
      pivot.scale.setScalar(s);
      scene.add(pivot);

      if (grid) {
        const gridCol = new THREE.Color(css(dark ? "--color-accent-500" : "--color-accent-400", "#749dc4"));
        const helper = new THREE.GridHelper(3, 30, gridCol, gridCol);
        const mat = helper.material as THREE_NS.Material;
        mat.transparent = true;
        mat.opacity = 0.35;
        helper.position.y = (-size.y * s) / 2 - 0.02;
        scene.add(helper);
      }

      const parts: { o: THREE_NS.Object3D; base: THREE_NS.Vector3; off: THREE_NS.Vector3 }[] = [];
      let callouts: { o: THREE_NS.Object3D; local: THREE_NS.Vector3; el: HTMLDivElement }[] = [];
      if (explode === "scan") {
        obj.updateMatrixWorld(true);
        obj.traverse((o) => {
          const name = o.name || "";
          let off: [number, number, number] | null = null;
          for (const [re, v] of SCAN_MAP)
            if (re.test(name)) {
              off = v;
              break;
            }
          if (!off && o.userData?.group === "cover") off = SCAN_MAP[0][1];
          if (!off && o.userData?.group === "mount") off = SCAN_MAP[6][1];
          if (off && (o as THREE_NS.Mesh).isMesh)
            parts.push({ o, base: o.position.clone(), off: new THREE.Vector3(...off) });
        });
        if (labels) {
          callouts = SCAN_LABELS.flatMap(([name, n, text]) => {
            const o = obj!.getObjectByName(name);
            if (!o) return [];
            const wc = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
            const local = o.worldToLocal(wc.clone());
            const tag = document.createElement("div");
            Object.assign(tag.style, {
              position: "absolute", left: "0", top: "0", pointerEvents: "none", display: "flex",
              alignItems: "center", gap: "8px", opacity: "0", transition: "opacity .3s",
              font: "600 13px/1 var(--font-heading)", letterSpacing: "0.08em", textTransform: "uppercase",
              whiteSpace: "nowrap", color: dark ? "var(--color-bg)" : "var(--color-text)",
            });
            tag.innerHTML = `<span style="width:9px;height:9px;border:1px solid var(--color-accent);background:${dark ? "var(--color-accent-900)" : "var(--color-bg)"};transform:rotate(45deg)"></span><span style="padding:5px 8px;border:1px solid ${dark ? "color-mix(in srgb, var(--color-bg) 30%, transparent)" : "var(--color-divider)"};background:${dark ? "color-mix(in srgb, var(--color-accent-900) 80%, transparent)" : "color-mix(in srgb, var(--color-bg) 85%, transparent)"}"><b style="color:${dark ? "var(--color-accent-300)" : "var(--color-accent-700)"};font-weight:600">${n}</b>&nbsp;&nbsp;${text}</span>`;
            el.append(tag);
            cleanups.push(() => tag.remove());
            return [{ o, local, el: tag }];
          });
        }
      }

      const distance = (fit ?? (parts.length ? 2.6 : 2.1)) / (2 * Math.tan((cam.fov * Math.PI) / 360));
      cam.position.set(...view).normalize().multiplyScalar(distance);
      ctl.target.set(0, 0, 0);
      ctl.update();

      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        cam.aspect = w / h;
        cam.zoom = w / h < 0.9 ? w / h / 0.9 : 1;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      // Skip rendering while the viewer is off screen
      let visible = true;
      const io = new IntersectionObserver((es) => (visible = es[0].isIntersecting));
      io.observe(el);
      cleanups.push(() => {
        ro.disconnect();
        io.disconnect();
      });

      const tracked = scrollTrack ? document.querySelector(scrollTrack) : null;
      const v = new THREE.Vector3();
      let p = 0;
      const frame = () => {
        if (tracked) {
          const rc = tracked.getBoundingClientRect();
          const span = rc.height - window.innerHeight;
          target.current = Math.max(0, Math.min(1, span > 0 ? -rc.top / span : 0));
        }
        p += (target.current - p) * 0.1;
        const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
        for (const part of parts) part.o.position.copy(part.base).addScaledVector(part.off, e);
        ctl.update();
        renderer.render(scene, cam);
        if (callouts.length) {
          const w = el.clientWidth;
          const h = el.clientHeight;
          for (const c of callouts) {
            v.copy(c.local);
            c.o.localToWorld(v);
            v.project(cam);
            c.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w - 4}px, ${(-v.y * 0.5 + 0.5) * h - 12}px)`;
            c.el.style.opacity = e > 0.55 ? "1" : "0";
          }
        }
      };
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (visible) frame();
      };
      tick();
    })().catch((e) => {
      console.warn("CadViewer", e);
      if (!disposed) setMissing(true);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
    // view is an inline array; compare by value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, zUp, spin, explode, scrollTrack, labels, grid, dark, color, fit, view.join(",")]);

  return (
    // className must give the viewer a size and a non-static position; the canvas fills it
    <div ref={host} className={className}>
      {missing && placeholder && (
        <div
          style={{
            position: "absolute", left: "50%", bottom: "16%", transform: "translateX(-50%)",
            pointerEvents: "none", textAlign: "center", font: "600 12px/1.4 var(--font-body)",
            letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap",
            color: dark ? "var(--color-accent-300)" : "var(--color-accent-700)",
          }}
        >
          {placeholder}
        </div>
      )}
      {children}
    </div>
  );
}
