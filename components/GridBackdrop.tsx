// Blueprint grid lines behind a dark section. The parent must be position: relative.
export default function GridBackdrop({ size = 80, strength = 12 }: { size?: number; strength?: number }) {
  const line = `color-mix(in srgb, var(--color-accent-400) ${strength}%, transparent)`;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
