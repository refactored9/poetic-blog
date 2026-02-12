"use client";

import { useMemo } from "react";
import { useTheme } from "./ThemeProvider";

export default function StarField() {
  const { resolvedTheme } = useTheme();

  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
  }, []);

  if (resolvedTheme !== "dark") return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `starTwinkle ${star.duration} ease-in-out ${star.delay} infinite`,
            opacity: 0.2,
          }}
        />
      ))}
    </div>
  );
}
