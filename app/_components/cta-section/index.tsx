"use client";

import React from "react";

interface CtaSectionProps {
  title: string;
  imageUrl: string;
  phoneNumber: string;
  message: string;
  buttonText: string;
}

export const CTASection: React.FC<CtaSectionProps> = ({
  title,
  imageUrl,
  phoneNumber,
  message,
  buttonText,
}) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <section
      className="relative w-full py-20 flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#543826]/90 via-[#543826]/70 to-[#543826]/90" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <p className="font-brand text-sm tracking-widest uppercase text-white/50 mb-3">
          Direct Booking
        </p>
        <h2 className="font-brand text-3xl md:text-5xl font-semibold leading-tight mb-3">
          {title}
        </h2>
        <p className="font-brand text-lg text-white/60 mb-8">
          Book your home healthcare service instantly via WhatsApp
        </p>

        <button
          onClick={handleClick}
          className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1eb954] text-white font-brand font-semibold px-10 py-5 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:gap-5"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/>
          </svg>
          Book via WhatsApp
        </button>

        <p className="font-brand text-xs text-white/30 mt-6">
          Quick response &bull; No app required &bull; Available 24/7
        </p>
      </div>
    </section>
  );
};