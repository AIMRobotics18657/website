import Corners from "./Corners";
import styles from "./Placeholder.module.css";

// Framed empty slot for media that hasn't been added yet (photos, renders, video).
export default function Placeholder({
  label,
  dark,
  aspect = "4 / 3",
  className,
}: {
  label: string;
  dark?: boolean;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure
      className={`blueprint ${styles.slot} ${dark ? styles.dark : ""} ${className ?? ""}`}
      style={{ aspectRatio: aspect }}
    >
      <Corners />
      <span>{label}</span>
    </figure>
  );
}
