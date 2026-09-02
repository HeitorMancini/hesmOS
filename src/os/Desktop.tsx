"use client";

import { APPS } from "@/apps/registry";
import { useWindowManager } from "@/os/WindowManager";

export function DesktopIcons() {
  const { openApp, setStartMenuOpen } = useWindowManager();

  return (
    <div className="desktop-icons" role="list">
      {APPS.map((app) => (
        <button
          key={app.id}
          type="button"
          className="desktop-icon"
          role="listitem"
          aria-label={`Abrir ${app.title}`}
          onDoubleClick={() => openApp(app.id)}
          onClick={(event) => {
            setStartMenuOpen(false);
            const coarse =
              typeof window !== "undefined" &&
              window.matchMedia("(pointer: coarse)").matches;
            if (event.detail === 0 || coarse) {
              openApp(app.id);
            }
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={app.icon} alt="" width={32} height={32} />
          <span>{app.title}</span>
        </button>
      ))}
    </div>
  );
}
