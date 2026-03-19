"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiBurst() {
  useEffect(() => {
    const end = Date.now() + 1800;

    const colors = ["#c42d1c", "#101010", "#ff6a52", "#ead9c7"];

    const frame = () => {
      confetti({
        particleCount: 7,
        spread: 72,
        startVelocity: 48,
        ticks: 220,
        scalar: 1.1,
        origin: { x: 0.5, y: 0.68 },
        colors,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        window.setTimeout(frame, 180);
      }
    };

    window.setTimeout(frame, 120);
  }, []);

  return null;
}
