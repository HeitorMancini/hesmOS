"use client";

import { useEffect, useState } from "react";
import { APPS } from "@/apps/registry";
import { useWindowManager } from "@/os/WindowManager";

function formatClock(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Taskbar() {
  const {
    windows,
    focusedId,
    startMenuOpen,
    openApp,
    toggleTaskbarWindow,
    setStartMenuOpen,
  } = useWindowManager();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!startMenuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStartMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startMenuOpen, setStartMenuOpen]);

  return (
    <div className="taskbar" role="toolbar" aria-label="Barra de tarefas">
      <button
        type="button"
        className={`start-button${startMenuOpen ? " start-button--active" : ""}`}
        aria-label="Iniciar"
        aria-expanded={startMenuOpen}
        aria-haspopup="menu"
        onClick={() => setStartMenuOpen(!startMenuOpen)}
      >
        <span className="start-logo" aria-hidden="true" />
        Iniciar
      </button>

      {startMenuOpen ? (
        <div className="start-menu" role="menu" aria-label="Menu Iniciar">
          <div className="start-menu__banner">hesmOS</div>
          <ul className="start-menu__list">
            {APPS.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openApp(app.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={app.icon} alt="" width={24} height={24} />
                  {app.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="taskbar-programs">
        {windows.map((win) => {
          const pressed = focusedId === win.id && win.mode !== "minimized";
          return (
            <button
              key={win.id}
              type="button"
              className={`taskbar-app${pressed ? " taskbar-app--active" : ""}`}
              aria-pressed={pressed}
              aria-label={win.title}
              onClick={() => toggleTaskbarWindow(win.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={win.icon} alt="" width={16} height={16} />
              <span>{win.title}</span>
            </button>
          );
        })}
      </div>

      <div className="taskbar-tray" aria-label="Relógio">
        <time dateTime={now ? now.toISOString() : undefined}>
          {now ? formatClock(now) : "--:--"}
        </time>
      </div>
    </div>
  );
}
