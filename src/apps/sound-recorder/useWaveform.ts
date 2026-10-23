"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const WAVE_COLOR = "#00ff00";
const BG_COLOR = "#000";

function drawLine(canvas: HTMLCanvasElement, data?: Uint8Array) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = WAVE_COLOR;
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (!data) {
    ctx.moveTo(0, height / 2 + 0.5);
    ctx.lineTo(width, height / 2 + 0.5);
  } else {
    const step = data.length / width;
    for (let x = 0; x < width; x++) {
      const v = data[Math.floor(x * step)] / 255;
      const y = Math.round(v * height) + 0.5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

export function useWaveform(
  audioRef: RefObject<HTMLAudioElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  playing: boolean,
) {
  const graph = useRef<{ ctx: AudioContext; analyser: AnalyserNode } | null>(null);

  const connect = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || graph.current || typeof AudioContext === "undefined") {
      void graph.current?.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    graph.current = { ctx, analyser };
  }, [audioRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const analyser = graph.current?.analyser;
    if (!playing || !analyser) {
      drawLine(canvas);
      return;
    }
    const data = new Uint8Array(analyser.fftSize);
    let frame = 0;
    const tick = () => {
      analyser.getByteTimeDomainData(data);
      drawLine(canvas, data);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [playing, canvasRef]);

  useEffect(
    () => () => {
      void graph.current?.ctx.close();
      graph.current = null;
    },
    [],
  );

  return connect;
}
