"use client";

import { getApp } from "@/apps/registry";
import { DESKTOP_SHORTCUTS } from "@/content/content";
import type { DesktopShortcut } from "@/content/types";
import { getNode, iconForNode } from "@/content/vfs";
import { useWindowManager } from "@/os/WindowManager";

function shortcutIcon(shortcut: DesktopShortcut): string {
  if (shortcut.icon) return shortcut.icon;
  if ("appId" in shortcut.target) return getApp(shortcut.target.appId)?.icon ?? "";
  const node = getNode(shortcut.target.fileId);
  return node ? iconForNode(node) : "";
}

export function DesktopIcons() {
  const { openApp, openFile, setStartMenuOpen } = useWindowManager();

  const launch = (shortcut: DesktopShortcut) => {
    if ("appId" in shortcut.target) openApp(shortcut.target.appId);
    else openFile(shortcut.target.fileId);
  };

  return (
    <div className="desktop-icons" role="list">
      {DESKTOP_SHORTCUTS.map((shortcut) => (
        <button
          key={shortcut.label}
          type="button"
          className="desktop-icon"
          role="listitem"
          aria-label={`Abrir ${shortcut.label}`}
          onDoubleClick={() => launch(shortcut)}
          onClick={(event) => {
            setStartMenuOpen(false);
            const coarse =
              typeof window !== "undefined" &&
              window.matchMedia("(pointer: coarse)").matches;
            if (event.detail === 0 || coarse) {
              launch(shortcut);
            }
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shortcutIcon(shortcut)} alt="" width={32} height={32} />
          <span>{shortcut.label}</span>
        </button>
      ))}
    </div>
  );
}
