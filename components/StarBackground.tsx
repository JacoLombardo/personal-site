"use client";

import { useMemo } from "react";
import { Mode } from "@/types";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  delay: number;
  duration: number;
  twinkle: boolean;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 2000,
    y: Math.random() * 4000,
    r: Math.random() * 1.1 + 0.2,
    opacity: Math.random() * 0.35 + 0.08,
    delay: Math.random() * 6,
    duration: Math.random() * 3 + 3,
    twinkle: Math.random() > 0.4,
  }));
}

interface Props {
  theme: Mode;
}

export default function StarBackground({ theme }: Props) {
  const stars = useMemo(() => generateStars(300), []);

  if (theme === "light") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 2000 4000"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%" }}
      >
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fff"
            opacity={s.opacity}
            style={
              s.twinkle
                ? {
                    animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                  }
                : undefined
            }
          />
        ))}
      </svg>
    </div>
  );
}
