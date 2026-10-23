import styles from "./SeekBar.module.css";

type SeekBarProps = {
  value: number;
  max: number;
  onSeek: (value: number) => void;
  disabled?: boolean;
  label?: string;
};

export function SeekBar({ value, max, onSeek, disabled, label = "Posição" }: SeekBarProps) {
  return (
    <div className={styles.root}>
      <input
        type="range"
        className={styles.range}
        min={0}
        max={max || 1}
        step={0.01}
        value={Math.min(value, max || 1)}
        disabled={disabled || !max}
        aria-label={label}
        onChange={(event) => onSeek(Number(event.target.value))}
      />
      <div className={styles.ticks} aria-hidden="true" />
    </div>
  );
}
