
import { PointerEvent, useState } from "react";

export function MetallicTitle() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - .5) * -7, y: ((e.clientX - r.left) / r.width - .5) * 9 });
  };
  return <div className="metallicTitle" onPointerMove={move} onPointerLeave={() => setTilt({x:0,y:0})} style={{transform:`translateX(-50%) perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`}}><h1 data-text="GB IA">GB IA</h1></div>;
}
