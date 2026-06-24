"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
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
          <svg key={i} className="w-4 md:w-5 h-4 md:h-5" viewBox="0 0 20 20" fill="none">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.392 2.463a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.392-2.463a1 1 0 00-1.175 0l-3.392 2.463c-.784.487-1.838-.197-1.539-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.014 8.427c-.783-.487-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.948z" fill="#543826" clipPath={partial ? `inset(0 ${(1 - fraction) * 100}% 0 0)` : undefined} />
            {!filled && !partial && (
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.392 2.463a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.392-2.463a1 1 0 00-1.175 0l-3.392 2.463c-.784.487-1.838-.197-1.539-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.014 8.427c-.783-.487-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.948z" fill="#C9C3B3" />
            )}
          </svg>
        );
      })}
      <span className="font-brand text-xs md:text-sm font-extrabold text-[#543826] ml-1">{rating}</span>
    </div>
  );
}

function BlueTick() {
  return (
    <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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
    <div className="shrink-0 w-[200px] md:w-[260px] lg:w-[280px] h-[280px] md:h-[340px] lg:h-[360px] bg-[#F7EEE0] rounded-xl overflow-hidden relative cursor-pointer group">
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
          <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-[#543826] flex items-center justify-center group-hover:bg-[#3e2a1c] transition-colors shadow-lg">
            <svg className="w-4 md:w-5 h-4 md:h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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
    <div className="shrink-0 w-[200px] md:w-[260px] lg:w-[280px] h-[280px] md:h-[340px] lg:h-[360px] bg-[#F7EEE0] rounded-xl overflow-hidden relative">
      <Image src={src} alt={alt} fill className="object-cover" unoptimized />
    </div>
  );
}

function ReviewTextCard({ review, onSeeMore }: { review: ReviewData; onSeeMore: () => void }) {
  const textRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    if (pRef.current && textRef.current) {
      setOverflows(pRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [review.description]);

  return (
    <div className="shrink-0 w-[200px] md:w-[260px] lg:w-[280px] h-[280px] md:h-[340px] lg:h-[360px] bg-[#F7EEE0] rounded-xl p-3 md:p-4 flex flex-col items-center text-center overflow-hidden">
      <Stars rating={review.value} />
      <div ref={textRef} className="w-full flex-1 min-h-0 mt-2 md:mt-3 overflow-hidden">
        <p ref={pRef} className="font-brand text-sm md:text-base font-bold text-[#543826] leading-snug">
          <span className="text-lg md:text-xl font-bold">&ldquo;</span>
          {review.description}
          <span className="text-lg md:text-xl font-bold">&rdquo;</span>
        </p>
      </div>
      {overflows && (
        <button onClick={onSeeMore} className="text-[#543826] text-xs font-semibold hover:underline mb-4 md:mb-6">
          See more
        </button>
      )}
      <div className="flex flex-col items-center gap-0.5">
        <p className="font-bold text-[10px] md:text-xs text-[#543826]">{review.reviewBy}</p>
        <div className="flex items-center gap-1">
          <p className="text-[10px] md:text-[11px] text-gray-500">Verified review</p>
          <BlueTick />
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [modalReview, setModalReview] = useState<ReviewData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const scrollTimer = useRef<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data.data) ? data.data : [];
        setReviews(list.filter((r: ReviewData) => r.isActive));
      })
      .catch(() => setReviews([]));
  }, []);

  const pauseTemporarily = () => {
    pausedRef.current = true;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, 2000);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    pausedRef.current = true;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    scrollTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, 2000);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || reviews.length === 0) return;

    const speed = 0.5;

    const step = () => {
      if (pausedRef.current) {
        autoScrollRef.current = requestAnimationFrame(step);
        return;
      }

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 1) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft = 0;
        container.style.scrollBehavior = "smooth";
      } else {
        container.scrollLeft += speed;
      }

      autoScrollRef.current = requestAnimationFrame(step);
    };

    autoScrollRef.current = requestAnimationFrame(step);

    container.addEventListener("mouseenter", () => { pausedRef.current = true; });
    container.addEventListener("mouseleave", () => { pausedRef.current = false; });
    container.addEventListener("wheel", (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
      pauseTemporarily();
    }, { passive: false });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        container.scrollBy({ left: -container.clientWidth * 0.4, behavior: "smooth" });
        pauseTemporarily();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        container.scrollBy({ left: container.clientWidth * 0.4, behavior: "smooth" });
        pauseTemporarily();
      }
    };
    container.addEventListener("keydown", handleKey);

    return () => {
      if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      container.removeEventListener("keydown", handleKey);
    };
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <h2 className="font-brand text-xl md:text-2xl font-semibold text-[#543826]">
            Loved by our community
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#543826] hover:text-[#543826] transition"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#543826] hover:text-[#543826] transition"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        tabIndex={0}
        className="flex gap-3 md:gap-4 overflow-x-auto pb-4 pl-4 md:pl-6 pr-4 md:pr-6 scrollbar-hide focus:outline-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((review) => {
          const cards = [];
          if (review.media && review.mediaType === "video") {
            cards.push(<VideoMediaCard key={`media-${review._id}`} src={review.media} />);
          } else if (review.media && review.mediaType === "image") {
            cards.push(<ImageMediaCard key={`media-${review._id}`} src={review.media} alt={review.reviewBy} />);
          }
          cards.push(<ReviewTextCard key={`text-${review._id}`} review={review} onSeeMore={() => setModalReview(review)} />);
          return cards;
        })}
      </div>

      {modalReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10"
          onClick={() => setModalReview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-8 md:p-10 relative max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalReview(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <Stars rating={modalReview.value} />
              <div className="mt-6 w-12 h-0.5 bg-[#543826]/20 rounded-full" />
              <p className="font-brand text-base md:text-lg font-bold text-[#543826] leading-relaxed mt-6">
                <span className="text-2xl md:text-3xl font-bold">&ldquo;</span>
                {modalReview.description}
                <span className="text-2xl md:text-3xl font-bold">&rdquo;</span>
              </p>
              <div className="flex flex-col items-center gap-1 mt-8">
                <p className="font-bold text-sm text-[#543826]">{modalReview.reviewBy}</p>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.245.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM7.4 5.802a1 1 0 00-1.414-1.414L9 11.586l-.84-.896a1 1 0 00-1.414 1.414l1.746 1.746a1 1 0 001.414 0l3.586-3.586a1 1 0 00-1.414-1.414L9 11.586 7.4 5.802z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-gray-500">Verified review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
