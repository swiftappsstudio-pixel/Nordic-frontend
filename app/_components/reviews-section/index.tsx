"use client";

import { useState, useRef } from "react";

const REVIEWS = [
  {
    text: "Nordic transformed how I experience healthcare at home. The nurse was punctual, warm, and incredibly knowledgeable. I will never go back to a clinic for routine care again.",
    name: "Valeria Costa Martínez",
    badge: "Verified user",
    rating: 5,
  },
  {
    text: "From the moment I messaged Nordic on WhatsApp to the moment the nurse left, everything felt effortless. Real professionals who treat you like a person, not a patient number.",
    name: "Erik Johansson",
    badge: "Verified user",
    rating: 4.8,
  },
  {
    text: "The IV therapy at home was a revelation. No waiting, no clinic, no stress. The nurse was expert and reassuring. I felt the difference within an hour. Absolutely worth it.",
    name: "Sofia Andersen",
    badge: "Verified user",
    rating: 4.9,
  },
  {
    text: "Nordic made booking home healthcare feel as easy as ordering a cab. The nurse arrived on time, explained everything clearly, and the whole experience was genuinely five-star.",
    name: "Ahmed Al-Mansoori",
    badge: "Verified user",
    rating: 5,
  },
  {
    text: "Having a NICU-trained nurse at home after my baby arrived gave our whole family confidence. She knew every answer before we even asked the question. Nordic is simply the best.",
    name: "Priya Sharma",
    badge: "Verified user",
    rating: 4.9,
  },
  {
    text: "My father needed post-surgery care and Nordic provided a caregiver who was clinically excellent and deeply compassionate. The family finally had peace of mind. We are truly grateful.",
    name: "James Mitchell",
    badge: "Verified user",
    rating: 5,
  },
  {
    text: "I used Nordic for a blood test at home and the results were ready faster than any clinic I have visited. Seamless, professional and completely stress-free. Highly recommended.",
    name: "Fatima Al-Hassan",
    badge: "Verified user",
    rating: 5,
  },
  {
    text: "The weight management programme Nordic set up for me has been life-changing. Doctor-led, delivered at home, with real follow-up care. I have lost 10kg and feel better than ever.",
    name: "Sarah Mitchell",
    badge: "Verified user",
    rating: 4.8,
  },
  {
    text: "Our night nurse was extraordinary. She handled every feed, every unsettled moment, and every question — all while we slept and recovered. Nordic gave us our lives back.",
    name: "Aisha Al-Mansoori",
    badge: "Verified user",
    rating: 5,
  },
];

// All videos in order — no repeats
// Original 2 from images folder + video1-7 + mother
const VIDEOS = [
  "/images/video_4.mp4",   // original larki wali
  "/images/video_1.mp4",   // original second
  "/video/video1.mp4",
  "/video/video2.mp4",
  "/video/video3.mp4",
  "/video/video4.mp4",
  "/video/video5.mp4",
  "/video/video6.mp4",
  "/video/video7.mp4",
  "/video/mother.mp4",
];

// Build flat items: video → review → video → review → video → review → video → video
// Result: v1, r1, v2, r2, v3, r3, v4, v5
type Item =
  | { type: "video"; src: string; key: string }
  | { type: "review"; review: typeof REVIEWS[0]; key: string };

const ITEMS: Item[] = [];
let vIdx = 0;
for (let i = 0; i < REVIEWS.length; i++) {
  ITEMS.push({ type: "video", src: VIDEOS[vIdx++], key: `v-${vIdx}` });
  ITEMS.push({ type: "review", review: REVIEWS[i], key: `r-${i}` });
}
// remaining videos
while (vIdx < VIDEOS.length) {
  ITEMS.push({ type: "video", src: VIDEOS[vIdx++], key: `v-${vIdx}` });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 items-center justify-center">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating);
        const partial = !filled && i === Math.ceil(rating);
        const fraction = partial ? rating - Math.floor(rating) : 0;
        return (
          <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.392 2.463a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.392-2.463a1 1 0 00-1.175 0l-3.392 2.463c-.784.487-1.838-.197-1.539-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.014 8.427c-.783-.487-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.948z" fill="#543826" clipPath={partial ? `inset(0 ${(1 - fraction) * 100}% 0 0)` : undefined} />
            {!filled && !partial && (
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.392 2.463a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.392-2.463a1 1 0 00-1.175 0l-3.392 2.463c-.784.487-1.838-.197-1.539-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.014 8.427c-.783-.487-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.948z" fill="#C9C3B3" />
            )}
          </svg>
        );
      })}
      <span className="font-brand text-sm font-extrabold text-[#543826] ml-1">{rating}</span>
    </div>
  );
}

function BlueTick() {
  return (
    <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.245.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM7.4 5.802a1 1 0 00-1.414-1.414L9 11.586L8.16 10.69a1 1 0 00-1.414 1.414l1.746 1.746a1 1 0 001.414 0l3.586-3.586z" clipRule="evenodd" />
    </svg>
  );
}

function VideoCard({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
  };

  return (
    <div className="shrink-0 w-[260px] h-[340px] bg-[#F7EEE0] rounded-xl relative overflow-hidden cursor-pointer group">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="w-full h-full object-cover"
      />
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
          onClick={togglePlay}
        >
          <div className="w-12 h-12 rounded-full bg-[#543826] flex items-center justify-center group-hover:bg-[#3e2a1c] transition-colors shadow-lg">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {playing && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={togglePlay} />
      )}
    </div>
  );
}

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-brand text-2xl font-semibold text-[#543826]">
            Loved by our community
          </h2>
          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#543826] hover:text-[#543826] transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#543826] hover:text-[#543826] transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pl-6 pr-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {ITEMS.map((item) => {
          if (item.type === "video") {
            return <VideoCard key={item.key} src={item.src} />;
          }
          const review = item.review;
          return (
            <div
              key={item.key}
              className="shrink-0 w-[260px] h-[340px] bg-[#F7EEE0] rounded-xl p-4 flex flex-col items-center text-center"
            >
              <Stars rating={review.rating} />
              <p className="font-brand text-base font-bold text-[#543826] leading-snug mt-2">
                <span className="text-xl font-bold">&ldquo;</span>
                {review.text}
                <span className="text-xl font-bold">&rdquo;</span>
              </p>
              <div className="flex-1" />
              <div className="flex flex-col items-center gap-0.5 mt-6">
                <p className="font-bold text-xs text-[#543826]">{review.name}</p>
                <div className="flex items-center gap-1">
                  <p className="text-[11px] text-gray-500">{review.badge}</p>
                  <BlueTick />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}