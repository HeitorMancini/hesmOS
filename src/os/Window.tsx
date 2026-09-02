"use client";

import { useRef, type PointerEvent } from "react";
import { AppContent } from "@/apps/AppContent";
import { useWindowManager } from "@/os/WindowManager";
import type { OsWindow } from "@/os/types";

type WindowFrameProps = {
  win: OsWindow;
};

export function WindowFrame({ win }: WindowFrameProps) {
  const {
    focusedId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
  } = useWindowManager();
  const drag = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const active = focusedId === win.id && win.mode !== "minimized";

  if (win.mode === "minimized") {
    return null;
  }

  const onTitlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;

    focusWindow(win.id);

    if (win.mode === "maximized") return;

    drag.current = {
      offsetX: event.clientX - win.x,
      offsetY: event.clientY - win.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onTitlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    moveWindow(
      win.id,
      event.clientX - drag.current.offsetX,
      event.clientY - drag.current.offsetY,
    );
  };

  const onTitlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className="window os-window"
      role="dialog"
      aria-label={win.title}
      style={{
        left: win.mode === "maximized" ? 0 : win.x,
        top: win.mode === "maximized" ? 0 : win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onPointerDown={() => focusWindow(win.id)}
    >
      <div
        className={`title-bar${active ? "" : " inactive"}`}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerUp}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="os-window__icon" src={win.icon} alt="" width={16} height={16} />
        <div className="title-bar-text">{win.title}</div>
        <div className="title-bar-controls">
          <button
            type="button"
            aria-label="Minimize"
            onClick={(event) => {
              event.stopPropagation();
              minimizeWindow(win.id);
            }}
          />
          <button
            type="button"
            aria-label={win.mode === "maximized" ? "Restore" : "Maximize"}
            onClick={(event) => {
              event.stopPropagation();
              maximizeWindow(win.id);
            }}
          />
          <button
            type="button"
            aria-label="Close"
            onClick={(event) => {
              event.stopPropagation();
              closeWindow(win.id);
            }}
          />
        </div>
      </div>
      <div className="window-body os-window__body">
        <AppContent appId={win.appId} />
      </div>
    </div>
  );
}
