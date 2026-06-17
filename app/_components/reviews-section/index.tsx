"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface ReviewData {
  _id: string;
  description: string;
  value: number;
  reviewBy: string;
  media?: string;
  mediaType?: string;
  isActive?: boolean;
  sortOrder?: number;
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

function VideoMediaCard({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
  };

  return (
    <div className="shrink-0 w-[260px] h-[340px] bg-[#F7EEE0] rounded-xl overflow-hidden relative cursor-pointer group">
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors" onClick={togglePlay}>
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

function ImageMediaCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="shrink-0 w-[260px] h-[340px] bg-[#F7EEE0] rounded-xl overflow-hidden relative">
      <Image src={src} alt={alt} fill className="object-cover" unoptimized />
    </div>
  );
}

function ReviewTextCard({ review }: { review: ReviewData }) {
  return (
    <div className="shrink-0 w-[260px] h-[340px] bg-[#F7EEE0] rounded-xl p-4 flex flex-col items-center text-center">
      <Stars rating={review.value} />
      <p className="font-brand text-base font-bold text-[#543826] leading-snug mt-3">
        <span className="text-xl font-bold">&ldquo;</span>
        {review.description}
        <span className="text-xl font-bold">&rdquo;</span>
      </p>
      <div className="flex-1" />
      <div className="flex flex-col items-center gap-0.5 mt-6">
        <p className="font-bold text-xs text-[#543826]">{review.reviewBy}</p>
        <div className="flex items-center gap-1">
          <p className="text-[11px] text-gray-500">Verified review</p>
          <BlueTick />
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data.data) ? data.data : [];
        setReviews(list.filter((r: ReviewData) => r.isActive));
      })
      .catch(() => setReviews([]));
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    pausedRef.current = true;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    setTimeout(() => { pausedRef.current = false; }, 1500);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || reviews.length === 0) return;

    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      if (pausedRef.current) {
        autoScrollRef.current = requestAnimationFrame(step);
        return;
      }
      scrollPos += speed;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (scrollPos >= maxScroll) {
        scrollPos = 0;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = 0;
        container.style.scrollBehavior = "smooth";
      }

      container.scrollLeft = scrollPos;
      autoScrollRef.current = requestAnimationFrame(step);
    };

    autoScrollRef.current = requestAnimationFrame(step);

    const handleHover = () => { pausedRef.current = true; };
    const handleLeave = () => { pausedRef.current = false; };

    container.addEventListener("mouseenter", handleHover);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current);
      container.removeEventListener("mouseenter", handleHover);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-brand text-2xl font-semibold text-[#543826]">
            Loved by our community
          </h2>
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

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden pb-4 pl-6 pr-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => {
          const cards = [];
          if (review.media && review.mediaType === "video") {
            cards.push(<VideoMediaCard key={`media-${review._id}`} src={review.media} />);
          } else if (review.media && review.mediaType === "image") {
            cards.push(<ImageMediaCard key={`media-${review._id}`} src={review.media} alt={review.reviewBy} />);
          }
          cards.push(<ReviewTextCard key={`text-${review._id}`} review={review} />);
          return cards;
        })}
      </div>
    </section>
  );
}
