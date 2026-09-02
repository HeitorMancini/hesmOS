"use client";

import { DesktopIcons } from "@/os/Desktop";
import { Taskbar } from "@/os/Taskbar";
import { WindowFrame } from "@/os/Window";
import { useWindowManager, WindowManagerProvider } from "@/os/WindowManager";

function DesktopInner() {
  const { windows, setStartMenuOpen } = useWindowManager();

  return (
    <div className="desktop">
      <div
        className="desktop-surface"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            setStartMenuOpen(false);
          }
        }}
      >
        <DesktopIcons />
        {windows.map((win) => (
          <WindowFrame key={win.id} win={win} />
        ))}
      </div>
      <Taskbar />
    </div>
  );
}

export function DesktopShell() {
  return (
    <WindowManagerProvider>
      <DesktopInner />
    </WindowManagerProvider>
  );
}
