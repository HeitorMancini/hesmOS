"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { getPath, ROOT_ID } from "@/content/vfs";
import { useWindowManager } from "@/os/WindowManager";
import type { AppProps } from "@/os/types";
import { BANNER, completeName, runCommand } from "./commands";
import styles from "./Terminal.module.css";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

function linkify(line: string): ReactNode[] {
  return line.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function Terminal({ win, file, isActive }: AppProps) {
  const { openFile, closeWindow } = useWindowManager();
  const [cwd, setCwd] = useState(file?.kind === "folder" ? file.id : ROOT_ID);
  const [lines, setLines] = useState<string[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prompt = `${getPath(cwd)}>`;

  useEffect(() => {
    if (isActive) inputRef.current?.focus({ preventScroll: true });
  }, [isActive]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const result = runCommand(input, cwd);
    if (input.trim()) setHistory((prev) => [...prev, input]);
    setHistoryIndex(null);
    setInput("");

    if (result.exit) {
      closeWindow(win.id);
      return;
    }
    if (result.clear) {
      setLines([]);
    } else {
      setLines((prev) => [...prev, `${prompt}${input}`, ...result.output, ...(result.output.length ? [""] : [])]);
    }
    if (result.cwd) setCwd(result.cwd);
    if (result.openFileId) openFile(result.openFileId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const match = input.match(/^(\S+\s+)(.*)$/);
      if (!match) return;
      const completed = completeName(cwd, match[2]);
      if (completed) setInput(match[1] + completed);
    }
  };

  return (
    <div
      className={styles.root}
      ref={scrollRef}
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      {lines.map((line, i) => (
        <div key={i} className={styles.line}>
          {line ? linkify(line) : "\u00a0"}
        </div>
      ))}
      <div className={styles.inputLine}>
        <span>{prompt}</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Linha de comando"
          style={{ width: `${Math.max(1, input.length + 1)}ch` }}
        />
        <span className={styles.cursor} aria-hidden="true" />
      </div>
    </div>
  );
}
