"use client";

export default function StatsSection() {
  const stats = [
    {
      value: "1 million+",
      label: "Care hours delivered",
      description: "Across online consults and at-home visits in the UAE.",
    },
    {
      value: "5 years",
      label: "Since launch",
      description: "Redefining healthcare in the UAE since 2021.",
    },
    {
      value: "100+",
      label: "Health and wellness professionals",
      description: "Doctors, nurses and more employed by NordicHC.",
    },
    {
      value: "Rated 4.9+",
      label: "11,000+ user reviews",
      description: "Trusted across the UAE for speed, warmth, and rigor.",
    },
  ];

  return (
    <section className="bg-[#543826] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-brand text-lg md:text-xl text-[#C9C3B3] mb-12 leading-relaxed max-w-2xl">
          Care that comes to you. Online or at your door, NordicHC is the full
          stack of healthcare across the UAE.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <p className="font-brand text-2xl md:text-3xl font-semibold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-[#C9C3B3] mb-2">
                {stat.label}
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}