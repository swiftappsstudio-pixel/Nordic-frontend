"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const TEAM = [
  {
    name: "Keswin Suresh",
    role: "Co-Founder & COO",
    badges: ["Forbes 30 Under 30", "Khaleej Times 150+"],
    quote: "I started Nordic as a patient, not a founder. Every visit has to clear the bar I once needed someone to clear for me.",
    image: "/images/CEO.jpg",
  },
  {
    name: "Samer Al Masri",
    role: "Co-Founder & CEO",
    badges: [],
    quote: "Healthcare shouldn't be a privilege. We built Nordic to make world-class care accessible to every family in the UAE.",
    image: "/images/CEO.jpg",
  },
  {
    name: "Aditya Yadav",
    role: "CTO",
    badges: [],
    quote: "Great technology disappears into the experience. When a patient books, pays, and gets results without friction — that's the product.",
    image: "/images/manager.jpg",
  },
  {
    name: "Dr. Sami Mohammed Yusuf",
    role: "Chief Medical Officer",
    badges: [],
    quote: "Every protocol we write has a name behind it. I wouldn't approve anything I wouldn't prescribe to my own family.",
    image: "/images/manager.jpg",
  },
  {
    name: "Dr. Eli Abi Rached",
    role: "Medical Director",
    badges: [],
    quote: "Home healthcare isn't convenience — it's dignity. People heal better where they feel safe, and that's usually home.",
    image: "/images/manager.jpg",
  },
];

const SLIDE_DURATION = 4000;

export default function TeamSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const member = TEAM[active];

  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const step = 100 / (SLIDE_DURATION / 50);
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return next;
      });
    }, 50);
  }, []);

  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % TEAM.length);
    startProgress();
  }, [startProgress]);

  useEffect(() => {
    startProgress();
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [nextSlide, startProgress]);

  const goToSlide = (index: number) => {
    setActive(index);
    setProgress(0);
    startProgress();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
  };

  const circleRadius = 20;
  const circumference = 2 * Math.PI * circleRadius;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-brand text-2xl md:text-3xl font-semibold text-[#543826] mb-12 text-center leading-tight">
Built by healthcare professionals, wellness experts, and technology specialists committed to delivering exceptional care.        </h2>

        {/* <div className="relative flex items-center justify-center mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#C9C3B3] -translate-y-1/2" />

          <div className="flex gap-6 relative z-10">
            {TEAM.map((m, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className="relative w-12 h-12 flex items-center justify-center transition-all duration-300"
              >
                <svg
                  className="absolute inset-0 w-12 h-12 -rotate-90"
                  viewBox="0 0 48 48"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r={circleRadius}
                    fill="none"
                    stroke={i === active ? "#543826" : "#C9C3B3"}
                    strokeWidth="2"
                    opacity={i === active ? 0.2 : 1}
                  />
                  {i === active && (
                    <circle
                      cx="24"
                      cy="24"
                      r={circleRadius}
                      fill="none"
                      stroke="#543826"
                      strokeWidth="2"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (circumference * progress) / 100}
                      strokeLinecap="round"
                      className="transition-none"
                    />
                  )}
                </svg>

                <div
                  className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 ${
                    i === active
                      ? "scale-110 shadow-lg ring-2 ring-[#543826] ring-offset-2 ring-offset-white"
                      : "hover:scale-105"
                  }`}
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </button>
            ))}
          </div>
        </div> */}

        {/* <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/2 bg-[#F7EEE0] rounded-2xl min-h-[340px] flex items-center justify-center overflow-hidden">
            <Image
              src={member.image}
              alt={member.name}
              width={340}
              height={340}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            <p className="font-brand text-2xl font-bold text-[#543826]">
              {member.name}
            </p>

            <p className="font-brand text-base text-[#543826]/70 mt-1">
              {member.role}
            </p>

            {member.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {member.badges.map((badge, j) => (
                  <span
                    key={j}
                    className="text-xs bg-[#543826]/10 text-[#543826] font-brand px-3 py-1 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <p className="font-brand text-lg font-semibold text-[#543826] leading-snug mt-8">
              <span className="text-3xl font-bold">&ldquo;</span>
              {member.quote}
              <span className="text-3xl font-bold">&rdquo;</span>
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}