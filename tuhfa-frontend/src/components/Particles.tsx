/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Particles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate soft, warm pink & beige floatings
    const items: Sparkle[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 8 + 4, // size in px
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setSparkles(items);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          className="absolute rounded-full"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            width: sp.size,
            height: sp.size,
            background: sp.id % 2 === 0 ? "radial-gradient(circle, #F2C4C4 0%, rgba(242,196,196,0) 70%)" : "radial-gradient(circle, #FAF0E8 0%, rgba(250,240,232,0) 70%)",
            opacity: 0.6,
          }}
          animate={{
            y: ["0px", "-120px", "0px"],
            x: ["0px", `${(sp.id % 3 - 1) * 30}px`, "0px"],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: sp.duration,
            repeat: Infinity,
            delay: sp.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Elegant rose petals floating at the margins occasionally */}
      <div className="absolute top-20 right-10 opacity-30 pointer-events-none float-animation">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5C10 10 5 20 10 25C15 30 25 35 30 30C35 25 30 10 20 5Z" fill="#F2C4C4" />
        </svg>
      </div>
      <div className="absolute bottom-40 left-10 opacity-20 pointer-events-none float-animation-delayed">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 10C15 15 10 30 15 40C20 50 35 55 45 45C55 35 45 15 30 10Z" fill="#E8A0A0" />
        </svg>
      </div>
    </div>
  );
}
