"use client";

import { useState, useRef } from "react";

const REVIEWS = [
  {
    text: "Was nervous about starting Wegovy but the doctor consult was super thorough. Down 9kg in 3 months and they check in every 2 weeks. Easiest part of my week.",
    name: "Aisha A",
    badge: "Verified user",
    video: "/images/video_4.mp4",
  },
  {
    text: "Ordered BPC-157 on a Tuesday afternoon. Was at my door Wednesday morning with the pharmacy receipt in the box. No shady stuff, exactly what I ordered.",
    name: "Vikram P",
    badge: "Verified user",
    video: "/images/video_2.mp4",
  },
  {
    text: "Called at 2am when my baby wouldn't latch. The nurse was at our place within the hour and stayed for two. I don't know what we would have done without her.",
    name: "Layla H",
    badge: "Verified user",
    video: "/images/video_3.mp4",
  },
  {
    text: "Six weeks on GHK-Cu and my skin honestly looks better than it has in years. Started telling friends because people keep asking what I changed.",
    name: "Sofia M",
    badge: "Verified user",
    video: "/images/video_1.mp4",
  },
  {
    text: "Booked a full blood panel for 8am. Phlebotomist was on time, done in fifteen minutes, super gentle. Results were on the app by the next afternoon.",
    name: "Ahmed S",
    badge: "Verified user",
    video: "/images/video_5.mp4",
  },
  
];

function Stars() {
  return (
    <div className="flex gap-1 items-center justify-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-4 h-4 text-[#C9C3B3]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.392 2.463a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.392-2.463a1 1 0 00-1.175 0l-3.392 2.463c-.784.487-1.838-.197-1.539-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.014 8.427c-.783-.487-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.948z" />
        </svg>
      ))}
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
    <div className="shrink-0 w-[260px] h-[230px] bg-[#F7EEE0] rounded-xl relative overflow-hidden cursor-pointer group">
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
          <>
            <div
              key={`review-${i}`}
              className="shrink-0 w-[260px] min-h-[230px] bg-[#F7EEE0] rounded-xl p-4 relative flex flex-col items-center text-center"
            >
              <Stars />

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

            {review.video && <VideoCard key={`video-${i}`} src={review.video} />}
          </>
        ))}
      </div>
    </section>
  );
}