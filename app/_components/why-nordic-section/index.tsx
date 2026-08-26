import Image from "next/image";

const FEATURES = [
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    title: "DHA Licensed",
    desc: "Every nurse fully licensed by Dubai Health Authority.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: "30–60 Min Arrival",
    desc: "From booking to your door — across all of Dubai in under an hour.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
    title: "At Your Home",
    desc: "No waiting rooms. No travel. Premium care delivered to your door.",
  },
];

export default function WhyNordicSection() {
  return (
    <section className="relative overflow-hidden bg-[#0d0a08] py-20 sm:py-28">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-20">
        <source src="/video/mother.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[#543826]/60 via-transparent to-[#0d0a08]/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-transparent to-transparent" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#543826]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-[#543826]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-10 bg-[#C9C3B3]" />
          <span className="text-[#C9C3B3] text-xs font-semibold uppercase tracking-[0.2em]">Why Nordic</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <h2 className="font-bold text-white leading-[1.08] max-w-xl" style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>
            Healthcare that comes<br /><span className="text-[#C9C3B3]">to you.</span>
          </h2>
          <a
            href={`https://wa.me/971581649910?text=${encodeURIComponent("Hi Nordic! I'd like to book a home healthcare service.")}`}
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/50 text-sm font-semibold px-6 py-3 rounded-full transition-all"
          >
            Book now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {FEATURES.map((f, i) => (
            <div key={i} className="group rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#543826]/50 border border-[#543826] flex items-center justify-center text-[#C9C3B3] mb-5 group-hover:bg-[#543826] transition-colors">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "260px" }}>
            <Image src="/images/mother.png" alt="Nordic nurse at home" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Available now · All Dubai</p>
              <p className="text-white font-semibold text-xl leading-snug">IV Therapy · Blood Tests<br />Mother & Baby · Elderly Care</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-2xl bg-[#543826] p-8 flex flex-col justify-between min-h-[120px]">
              <p className="text-white/60 text-xs uppercase tracking-widest">Families served</p>
              <div className="mt-3">
                <p className="text-white font-bold leading-none" style={{ fontSize: "clamp(42px, 5vw, 64px)" }}>3,000<span className="text-[#C9C3B3]">+</span></p>
                <p className="text-white/50 text-sm mt-1">Across Dubai · Since 2020</p>
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between min-h-[120px]">
              <p className="text-white/60 text-xs uppercase tracking-widest">Average rating</p>
              <div className="flex items-end gap-3 mt-3">
                <p className="text-white font-bold leading-none" style={{ fontSize: "clamp(42px, 5vw, 64px)" }}>4.9<span className="text-[#C9C3B3]">★</span></p>
                <p className="text-white/50 text-sm mb-1">from 500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
