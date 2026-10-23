import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

export function Toolbar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.toolbar}${className ? ` ${className}` : ""}`} role="toolbar">
      {children}
    </div>
  );
}

type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean };

export function ToolbarButton({ pressed, className, children, ...rest }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`${styles.toolbarButton}${pressed ? ` ${styles.toolbarButtonPressed}` : ""}${
        className ? ` ${className}` : ""
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ToolbarSeparator() {
  return <span className={styles.toolbarSeparator} aria-hidden="true" />;
}
