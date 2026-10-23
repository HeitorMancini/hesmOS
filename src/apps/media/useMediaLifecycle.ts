"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export type MediaState = {
  playing: boolean;
  currentTime: number;
  duration: number;
  error: boolean;
  ready: boolean;
};

const INITIAL: MediaState = { playing: false, currentTime: 0, duration: 0, error: false, ready: false };

export function useMediaLifecycle(
  ref: RefObject<HTMLMediaElement | null>,
  isVisible: boolean,
  src: string | undefined,
) {
  const [state, setState] = useState<MediaState>(INITIAL);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setState(INITIAL);

    const sync = () =>
      setState({
        playing: !el.paused && !el.ended,
        currentTime: el.currentTime,
        duration: Number.isFinite(el.duration) ? el.duration : 0,
        error: Boolean(el.error),
        ready: el.readyState >= 1,
      });
    const events = ["play", "pause", "timeupdate", "durationchange", "loadedmetadata", "ended", "error", "emptied"];
    events.forEach((name) => el.addEventListener(name, sync));
    return () => events.forEach((name) => el.removeEventListener(name, sync));
  }, [ref, src]);

  useEffect(() => {
    if (!isVisible) ref.current?.pause();
  }, [isVisible, ref]);

  const play = useCallback(() => {
    ref.current?.play().catch(() => setState((prev) => ({ ...prev, playing: false })));
  }, [ref]);

  const pause = useCallback(() => ref.current?.pause(), [ref]);

  const stop = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, [ref]);

  const seek = useCallback(
    (time: number) => {
      const el = ref.current;
      if (el) el.currentTime = time;
    },
    [ref],
  );

  return { ...state, play, pause, stop, seek };
}

export function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
