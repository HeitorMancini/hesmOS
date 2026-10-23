import type { ReactNode } from "react";
import styles from "./ui.module.css";

export function StatusBar({ fields }: { fields: ReactNode[] }) {
  return (
    <div className={`status-bar ${styles.statusBar}`}>
      {fields.map((field, i) => (
        <p key={i} className="status-bar-field">
          {field}
        </p>
      ))}
    </div>
  );
}
