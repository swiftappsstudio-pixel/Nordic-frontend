"use client";

import { useState, useRef } from "react";

const REVIEWS = [
  {
    text: "I've been using Nordic Home Healthcare for a while now, and I love their services! :) The nurses are very friendly and well trained. The products are very high-quality, I've been checking the labels. I can highly recommend this home service, it's so convenient and the prices are also much better than in other places! Thank you so much. I'm very satisfied.",
    name: "Valeria Costa Martínez",
    badge: "Verified user",
    rating: 5,
    video: "/images/video_4.mp4",
  },
  {
    text: "Nordic changed my routine completely. The home visits are punctual, the staff is incredibly caring, and I feel safe knowing a professional is looking after my health at home. It saved me so much time compared to going to the clinic every week. Truly a blessing for seniors like me!",
    name: "Erik Johansson",
    badge: "Verified user",
    rating: 4.8,
    video: "/images/video_1.mp4",
  },
  {
    text: "I was skeptical at first, but Nordic exceeded all my expectations. The nurse who visits me is so kind and knowledgeable. The products they recommended have really improved my daily comfort. And the pricing is fair — no hidden fees. I've already told all my friends about it!",
    name: "Sofia Andersen",
    badge: "Verified user",
    rating: 4.9,
    video: "/images/video_5.mp4",
    videoAfter: "/images/video_3.mp4",
  },
];

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
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  return (
    <div className="shrink-0 w-[260px] min-h-[230px] bg-[#F7EEE0] rounded-xl relative overflow-hidden cursor-pointer group flex-1">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="w-full h-full object-cover rounded-xl"
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
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={togglePlay}
        />
      )}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto pl-6">
        <h2 className="font-brand text-2xl font-semibold text-[#543826] mb-10">
          Loved by our community
        </h2>
      </div>

      <div
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pl-6"
        style={{ scrollbarWidth: "none" }}
      >
        {REVIEWS.map((review, i) => (
          <div key={`pair-${i}`} className="flex shrink-0 gap-4 items-stretch">
            {review.video && <VideoCard key={`video-before-${i}`} src={review.video} />}
            <div
              key={`review-${i}`}
              className="shrink-0 w-[260px] min-h-[230px] bg-[#F7EEE0] rounded-xl p-4 relative flex flex-col items-center text-center"
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
            {review.videoAfter && <VideoCard key={`video-after-${i}`} src={review.videoAfter} />}
          </div>
        ))}
      </div>
    </section>
  );
}