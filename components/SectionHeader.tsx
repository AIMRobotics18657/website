import styles from "./SectionHeader.module.css";

// Numbered eyebrow label over a hairline rule, used to open most content sections.
export default function SectionHeader({
  label,
  aside,
  space = 48,
  className,
}: {
  label: string;
  aside?: React.ReactNode;
  /** Gap below the rule, in px. */
  space?: number;
  className?: string;
}) {
  return (
    <div className={className} style={{ marginBottom: space }}>
      <div className={styles.row}>
        <span className="eyebrow">{label}</span>
        {aside}
      </div>
      <div className={styles.rule} />
    </div>
  );
}
