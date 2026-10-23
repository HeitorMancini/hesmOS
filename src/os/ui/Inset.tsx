import type { HTMLAttributes, Ref } from "react";
import styles from "./ui.module.css";

type InsetProps = HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> };

export function Inset({ className, ...rest }: InsetProps) {
  return <div className={`${styles.inset}${className ? ` ${className}` : ""}`} {...rest} />;
}
