"use client";

import { useState } from "react";
import Image from "next/image";

const PRESS_LOGOS = [
  { src: "/images/the-national.png", alt: "The National" },
  { src: "/images/khaleej-times.png", alt: "Khaleej Times" },
  { src: "/images/entrepreneur-me.png", alt: "Entrepreneur Middle East" },
  { src: "/images/forbes-me.png", alt: "Forbes Middle East" },
];

export default function PressMarquee() {
  const [paused, setPaused] = useState(false);
  const items = [...PRESS_LOGOS, ...PRESS_LOGOS, ...PRESS_LOGOS];

  return (
    <section
      className="overflow-hidden bg-white my-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="font-brand text-xs text-gray-400 text-center py-1">As featured in</p>
      <div
        className="flex"
        style={{
          animation: "marquee-scroll 20s linear infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {items.map((logo, i) => (
          <div
            key={i}
            className="shrink-0 mx-6 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}