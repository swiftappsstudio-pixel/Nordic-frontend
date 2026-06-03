"use client";

import { useState } from "react";

const FAQ_DATA = [
  {
    question: "What is Nordic, and what do you actually do?",
    answer:
      "Nordic is a licensed home healthcare provider in the UAE. We bring doctors, nurses, physiotherapists, and lab technicians directly to your home — so you get hospital-grade care without stepping outside.",
  },
  {
    question: "Where in the UAE do you operate?",
    answer:
      "We currently serve Dubai, Abu Dhabi, and Sharjah. We're expanding to other emirates soon — stay tuned.",
  },
  {
    question: "How qualified are the nurses and clinicians?",
    answer:
      "Every Nordic clinician holds a valid DHA or DOH license, has passed our internal clinical audits, and carries at least two years of hands-on experience. Our Chief Medical Officer reviews every protocol before it goes live.",
  },
  {
    question: "How fast can someone come to my home?",
    answer:
      "Most bookings are confirmed within 15 minutes, and a clinician can arrive at your door in under 60 minutes for urgent requests. Standard appointments are scheduled at your preferred time.",
  },
  {
    question: "Do I need a prescription before I book?",
    answer:
      "Not for most services. Consultations, nursing care, physiotherapy, and lab collections can be booked directly. If a prescription is required for a specific treatment, our visiting doctor can issue one on-site.",
  },
  {
    question: "What do things cost, and how can I pay?",
    answer:
      "Prices are listed transparently on each service page — no hidden fees. You can pay via credit/debit card, Apple Pay, or cash at the door. Insurance coverage depends on your provider; our team can verify your plan before booking.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#F7EEE0]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-brand text-2xl md:text-3xl font-semibold text-[#543826] mb-2 text-center">
          Questions?
        </h2>
        <p className="font-brand text-lg md:text-xl text-[#543826]/60 mb-10 text-center">
          Answers.
        </p>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
              >
                <span
                  className={`font-brand text-base md:text-lg font-semibold transition-colors duration-300 ${
                    openIndex === index
                      ? "text-[#543826]"
                      : "text-[#543826]/70 group-hover:text-[#543826]"
                  }`}
                >
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[#543826]/50 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-5 font-brand text-sm md:text-base text-[#543826]/60 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}