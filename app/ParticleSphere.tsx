"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; z: number; red: boolean; size: number };

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dots: Dot[] = [];
    const count = window.innerWidth < 760 ? 620 : 1100;
    for (let i = 0; i < count; i++) {
      const u = Math.random(), v = Math.random();
      const phi = Math.acos(1 - 2 * u), theta = Math.PI * 2 * v;
      dots.push({ x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta), red: Math.random() < .24, size: .55 + Math.random() * 1.2 });
    }
    let frame = 0, angle = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight, radius = Math.min(w, h) * .31;
      ctx.clearRect(0, 0, w, h);
      angle += reduce ? 0 : .003;
      const ca = Math.cos(angle), sa = Math.sin(angle);
      const projected = dots.map((dot) => {
        const x = dot.x * ca - dot.z * sa, z = dot.x * sa + dot.z * ca;
        return { ...dot, x, z };
      }).sort((a,b) => a.z - b.z);
      for (const dot of projected) {
        const depth = (dot.z + 1) / 2, px = w / 2 + dot.x * radius, py = h / 2 + dot.y * radius;
        const alpha = .18 + depth * .82, r = dot.size * (.6 + depth * 1.45);
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = dot.red ? `rgba(220,38,30,${alpha})` : `rgba(242,242,238,${alpha})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return <div className="particleSphere" aria-hidden="true"><canvas ref={canvasRef}/><span/></div>;
}
