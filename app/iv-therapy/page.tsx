"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getServices, getAddOnsByService, createBooking } from "@/app/_common/api";
import { Service, AddOn, BookingRequest } from "@/app/_common/interfaces";
import { useAuth } from "@/app/_common/auth-context";

// ── Constants ────────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const WA_MSG = encodeURIComponent("Hi! I'd like to book an IV Therapy session at home in Dubai.");
const CALL_NUM = "tel:+971581649910";

const BENEFITS = [
  { icon: "💧", title: "Instant Hydration", desc: "Rapid cellular rehydration faster than oral intake" },
  { icon: "⚡", title: "Increased Energy", desc: "B-vitamins & minerals restore natural energy levels" },
  { icon: "🛡️", title: "Stronger Immunity", desc: "High-dose Vitamin C & zinc boost your immune system" },
  { icon: "✨", title: "Better Skin & Glow", desc: "Glutathione & antioxidants brighten from within" },
  { icon: "🧠", title: "Improved Focus & Recovery", desc: "Magnesium & amino acids sharpen mental clarity" },
  { icon: "🏠", title: "Treatment at Home", desc: "Zero waiting — we come to you in 30–60 minutes" },
];

const COMPARISON = [
  { nordic: "Treatment at Home", clinic: "Travel Required" },
  { nordic: "DHA Licensed Nurses", clinic: "Varies by Clinic" },
  { nordic: "Available 24 / 7", clinic: "Limited Hours" },
  { nordic: "Personalised Care", clinic: "Standardised" },
  { nordic: "Fast Booking", clinic: "Long Waiting Time" },
  { nordic: "Hotel & Office Visits", clinic: "Clinic Only" },
];

const HOW_STEPS = [
  { num: "01", icon: "📱", title: "Book Online or WhatsApp", desc: "Choose your drip and pick a time that suits you — 24/7." },
  { num: "02", icon: "🩺", title: "Quick Medical Assessment", desc: "Our team confirms your health details in minutes." },
  { num: "03", icon: "🚗", title: "Nurse Arrives at Your Location", desc: "A DHA-licensed nurse comes to your home, hotel or office." },
  { num: "04", icon: "💉", title: "Receive Your IV Therapy", desc: "Sit back, relax and feel revitalised within the hour." },
];

const BEFORE_AFTER = [
  { before: "😴 Fatigue", after: "⚡ Energised" },
  { before: "🥵 Dehydration", after: "💧 Fully Hydrated" },
  { before: "🔋 Low Energy", after: "🚀 High Performance" },
  { before: "🌫️ Brain Fog", after: "🧠 Laser Focus" },
];

const FAQS = [
  { q: "How long does IV therapy take?", a: "Most sessions take 30–60 minutes depending on the formula selected." },
  { q: "Is IV therapy safe?", a: "Yes. All sessions are administered by DHA-licensed nurses using pharmaceutical-grade ingredients after a brief health assessment." },
  { q: "Can I get treatment at my home or hotel?", a: "Absolutely. We deliver to any location across Dubai — home, hotel, office or event." },
  { q: "Which IV drip is best for energy?", a: "Our NAD+ IV Therapy and Energy Boost drip are most popular for instant energy and mental clarity." },
  { q: "Do you provide same-day appointments?", a: "Yes! We offer same-day bookings subject to availability. WhatsApp us for fastest confirmation." },
  { q: "What areas do you cover in Dubai?", a: "We cover all Dubai areas including Marina, JBR, Downtown, Palm Jumeirah, DIFC, Business Bay, JLT, and more." },
];

const REVIEWS = [
  { name: "Sarah M.", area: "Dubai Marina", stars: 5, text: "The nurse arrived in 40 minutes and was incredibly professional. I felt energised within hours — absolutely worth it!" },
  { name: "Ahmed K.", area: "Downtown Dubai", stars: 5, text: "Booked the Immunity Boost before a big work trip. Seamless experience, fast booking and amazing team." },
  { name: "Priya R.", area: "Palm Jumeirah", stars: 5, text: "I was exhausted and this completely turned my day around. Will definitely be booking again!" },
  { name: "James T.", area: "DIFC", stars: 5, text: "I've tried several IV therapy services in Dubai — Nordic is by far the most professional and reliable." },
];

const OFFER_DRIPS = ["NAD+ IV Therapy", "Immunity Boost", "Energy Boost", "Hydration Therapy"];

// ── Small reusable components ────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i<=n?"text-amber-400":"text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition group">
        <span className="font-semibold text-gray-800 pr-4">{q}</span>
        <span className={`shrink-0 w-7 h-7 rounded-full border-2 border-[#543826] text-[#543826] flex items-center justify-center font-bold text-lg transition-transform duration-300 ${open?"rotate-45":""}`}>+</span>
      </button>
      {open && <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</div>}
    </div>
  );
}

function WaIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/>
    </svg>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const { user, token } = useAuth();
  const isGuest = !token;
  const [form, setForm] = useState({ fullName: user?.name ?? "", email: user?.email ?? "", phone: "", date: "", time: "" });
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [loadingA, setLoadingA] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getAddOnsByService(service._id)
      .then(list => { setAddOns(list); setSel(new Set(list.filter(a=>a.isRequired).map(a=>a._id))); })
      .catch(() => setAddOns([]))
      .finally(() => setLoadingA(false));
  }, [service._id]);

  const addOnsTotal = addOns.filter(a=>sel.has(a._id)).reduce((s,a)=>s+a.price,0);
  const base = service.discountPrice ?? service.actualPrice ?? 0;
  const total = base + addOnsTotal;

  const toggle = (id: string, req: boolean) => {
    if (req) return;
    setSel(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  };

  const submit = async () => {
    if (!form.date || !form.time) return alert("Please select date & time");
    if (isGuest && (!form.fullName || !form.email || !form.phone)) return alert("Please fill in your contact details");
    const payload: BookingRequest = {
      serviceId: service._id, preferredDate: form.date, preferredTime: form.time,
      addOnIds: sel.size > 0 ? Array.from(sel) : undefined,
    };
    if (isGuest) payload.guestInfo = { fullName: form.fullName, email: form.email, phone: form.phone };
    try {
      setSubmitting(true);
      const res = await createBooking(payload, token ?? undefined);
      setDone(true);
      const msg = encodeURIComponent(`✅ IV Therapy Booking!\nID: ${res._id}\nService: ${service.title}\nDate: ${form.date} at ${form.time}\nTotal: AED ${total}\n${isGuest?`Name: ${form.fullName} | Phone: ${form.phone}`:""}`);
      setTimeout(() => window.open(`https://wa.me/${WA_NUM}?text=${msg}`, "_blank"), 600);
    } catch(e) {
      alert(e instanceof Error ? e.message : "Booking failed. Try again.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        <div className="bg-[#543826] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl shrink-0">
          <div><p className="text-xs text-white/50 uppercase tracking-wider">Book Now</p><h3 className="font-bold text-base leading-tight">{service.title}</h3></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">✕</button>
        </div>

        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-400 mb-6 text-sm">Redirecting you to WhatsApp to notify our team…</p>
            <button onClick={onClose} className="bg-[#543826] text-white px-8 py-3 rounded-full hover:bg-[#3e2a1c] transition font-semibold">Close</button>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {isGuest && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Details</p>
                {([["Full Name","fullName","text","John Doe"],["Email","email","email","john@email.com"],["Phone","phone","tel","+971 50 000 0000"]] as [string,string,string,string][]).map(([label,key,type,ph])=>(
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <input type={type} placeholder={ph} value={form[key as keyof typeof form]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826]/30"/>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Date</label><input type="date" min={today} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826]/30"/></div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Time</label><input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826]/30"/></div>
              </div>
            </div>
            {!loadingA && addOns.length>0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Add-ons</p>
                {addOns.map(a=>{const ch=sel.has(a._id);return(
                  <label key={a._id} className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${ch?"border-[#543826] bg-[#543826]/5":"border-gray-200"}`}>
                    <div className="flex items-center gap-3"><input type="checkbox" checked={ch} disabled={a.isRequired} onChange={()=>toggle(a._id,a.isRequired)} className="accent-[#543826]"/><div><p className="text-sm font-medium text-gray-800">{a.name}{a.isRequired&&<span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Required</span>}</p>{a.description&&<p className="text-xs text-gray-400">{a.description}</p>}</div></div>
                    <span className="text-sm font-bold text-[#543826] whitespace-nowrap">+AED {a.price}</span>
                  </label>
                );})}
              </div>
            )}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between"><span className="text-gray-500 text-sm">Total Amount</span><span className="text-2xl font-bold text-[#543826]">AED {total}</span></div>
              <p className="text-xs text-gray-400">💵 Cash on Delivery · 🏥 DHA Licensed Nurses</p>
              <button onClick={submit} disabled={submitting} className="w-full bg-[#543826] hover:bg-[#3e2a1c] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 text-base">
                {submitting?<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:null}
                {submitting?"Confirming…":"Confirm Booking"}
              </button>
              <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb954] text-white font-semibold py-3 rounded-xl transition text-sm">
                <WaIcon/>Or Book via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function IVTherapyPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingSvc, setLoadingSvc] = useState(true);
  const [selected, setSelected] = useState<Service | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getServices()
      .then(all => {
        const iv = all.filter(s =>
          s.title.toLowerCase().includes("iv") ||
          s.title.toLowerCase().includes("drip") ||
          s.title.toLowerCase().includes("infusion") ||
          s.title.toLowerCase().includes("boost") ||
          s.title.toLowerCase().includes("hydration") ||
          s.title.toLowerCase().includes("glutathione") ||
          s.title.toLowerCase().includes("nad") ||
          s.category?.toLowerCase().includes("iv")
        );
        setServices(iv.length > 0 ? iv : all.slice(0, 8));
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingSvc(false));
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-white font-sans overflow-x-hidden">

      {/* ════════════════════════════════════════
          2. HERO SECTION
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 bg-[#0d0704]">
        <div className="absolute inset-0 pt-16">
          <Image src="/images/Immune-Boost-Hydration-B.webp" alt="IV Therapy at Home Dubai" fill className="object-cover opacity-35" unoptimized priority/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0704]/95 via-[#0d0704]/70 to-[#0d0704]/30"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0704]/80 via-transparent to-transparent"/>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="max-w-xl">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-semibold px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
              🔥 Limited Time — Up to 40% OFF Selected IV Therapies
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-4">
              IV Therapy at Home<br/>
              <span className="text-[#C9C3B3]">in Dubai</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl mb-7 leading-relaxed">
              DHA-Licensed Nurses deliver premium IV drips to your <strong className="text-white">home, hotel, or office</strong> across Dubai.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["✅ Available 24/7","🏥 DHA Licensed Team","⚡ 30–60 Min Arrival","📍 All Dubai Areas"].map(b=>(
                <span key={b} className="text-xs text-white/80 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">{b}</span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={scrollToForm} className="flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-[#543826]/30">
                📅 Book IV Therapy
              </button>
              <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb954] text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/20">
                <WaIcon/> WhatsApp Now
              </a>
            </div>

            {/* Google reviews strip */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3 w-fit">
              <Stars n={5}/>
              <span className="text-white font-bold">4.9 / 5</span>
              <span className="text-white/50 text-sm">·</span>
              <span className="text-white/60 text-sm">500+ Happy Clients in Dubai</span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs animate-bounce">
          <span>Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7"/></svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. TRUST STRIP
      ════════════════════════════════════════ */}
      <section className="bg-[#543826] py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 text-white/80 text-sm font-medium">
            {["🏥 DHA License No. 3171506","⭐ 500+ Happy Clients","🚗 All Dubai Areas","💊 Pharmaceutical-Grade","📞 24/7 Support","🎉 Up to 40% Off Today"].map(t=>(
              <span key={t} className="whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. BENEFITS
      ════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-3">Why IV Therapy?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">Feel the difference<br/><span className="text-[#543826]">from within</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(b=>(
              <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#543826] transition">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. POPULAR IV DRIPS (from API)
      ════════════════════════════════════════ */}
      <section id="drips" className="py-20 bg-white" ref={formRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-3">Our Menu</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">Popular <span className="text-[#543826]">IV Drips</span></h2>
            <p className="text-gray-400 mt-3 max-w-lg mx-auto text-sm">All formulas prepared by licensed pharmacists · Administered by DHA-certified nurses</p>
          </div>

          {loadingSvc ? (
            <div className="flex justify-center py-16"><div className="w-12 h-12 border-4 border-[#543826]/20 border-t-[#543826] rounded-full animate-spin"/></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {services.map(svc=>(
                <div key={svc._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#543826] to-[#8b6347]">
                    {svc.images?.[0] ? (
                      <Image src={svc.images[0]} alt={svc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">💧</div>
                    )}
                    {svc.discountPrice && svc.actualPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {Math.round(((svc.actualPrice-svc.discountPrice)/svc.actualPrice)*100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    {svc.category && <span className="text-[10px] text-[#543826] font-bold uppercase tracking-wider mb-1">{svc.category}</span>}
                    <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug">{svc.title}</h3>
                    {svc.description && <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">{svc.description}</p>}
                    <div className="mb-3">
                      {svc.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-[#543826]">AED {svc.discountPrice}</span>
                          <span className="text-sm text-gray-300 line-through">AED {svc.actualPrice}</span>
                        </div>
                      ) : svc.actualPrice ? (
                        <span className="text-xl font-extrabold text-[#543826]">AED {svc.actualPrice}</span>
                      ) : null}
                    </div>
                    <button onClick={()=>setSelected(svc)} className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-bold py-2.5 rounded-xl transition text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          6. SPECIAL OFFER BANNER
      ════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-[#2d1810] to-[#543826] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"/>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"/>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 animate-pulse">
            🎉 LIMITED TIME OFFER
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">Up to <span className="text-yellow-400">40% OFF</span></h2>
          <p className="text-white/60 text-lg mb-6">On selected IV therapies — book today before slots run out!</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {OFFER_DRIPS.map(d=>(
              <span key={d} className="bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full">{d}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToForm} className="flex items-center justify-center gap-2 bg-white text-[#543826] font-extrabold px-8 py-4 rounded-full text-lg hover:bg-[#C9C3B3] transition">
              📅 Book Today & Save
            </button>
            <a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Hi! I want to claim the 40% off IV therapy offer.")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb954] text-white font-bold px-8 py-4 rounded-full text-lg transition">
              <WaIcon/> Claim via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. WHY CHOOSE NORDIC (Comparison)
      ════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-3">Why Nordic?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">We come <span className="text-[#543826]">to you</span></h2>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid grid-cols-2">
              <div className="bg-[#543826] text-white text-center py-4 font-bold text-base">🏆 Nordic Home Healthcare</div>
              <div className="bg-gray-100 text-gray-500 text-center py-4 font-semibold text-base">🏥 Typical Clinic</div>
            </div>
            {COMPARISON.map((row,i)=>(
              <div key={row.nordic} className={`grid grid-cols-2 ${i%2===0?"bg-white":"bg-gray-50/50"}`}>
                <div className="py-4 px-6 flex items-center gap-2 border-r border-gray-100">
                  <span className="text-green-500 font-bold text-lg">✓</span>
                  <span className="font-semibold text-gray-800 text-sm">{row.nordic}</span>
                </div>
                <div className="py-4 px-6 flex items-center gap-2">
                  <span className="text-red-400 font-bold text-lg">✗</span>
                  <span className="text-gray-400 text-sm">{row.clinic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          8. HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">How it <span className="text-[#543826]">works</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((s,i)=>(
              <div key={s.num} className="relative flex flex-col items-center text-center">
                {i<HOW_STEPS.length-1 && <div className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gradient-to-r from-[#543826]/30 to-transparent"/>}
                <div className="w-20 h-20 rounded-full bg-[#543826] text-white flex flex-col items-center justify-center mb-5 shadow-lg shadow-[#543826]/20 shrink-0">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-[10px] font-bold opacity-60">{s.num}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={scrollToForm} className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-bold px-10 py-4 rounded-full text-lg transition hover:scale-105">
              📅 Book Your Session Now
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          9. BEFORE & AFTER
      ════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-3">Transformation</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">Before <span className="text-[#543826]">&</span> After</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BEFORE_AFTER.map(row=>(
              <div key={row.before} className="flex items-center gap-0 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                <div className="flex-1 bg-gray-100 px-6 py-5 text-center">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Before</p>
                  <p className="text-gray-600 font-semibold text-sm">{row.before}</p>
                </div>
                <div className="px-3 text-[#543826] text-2xl font-bold shrink-0">→</div>
                <div className="flex-1 bg-[#543826]/5 px-6 py-5 text-center">
                  <p className="text-xs text-[#543826] font-bold uppercase tracking-wider mb-2">After</p>
                  <p className="text-[#543826] font-bold text-sm">{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          10. TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-3">Client Reviews</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">Trusted across <span className="text-[#543826]">Dubai</span></h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Stars n={5}/><span className="font-bold text-gray-800">4.9 / 5</span><span className="text-gray-300">·</span><span className="text-gray-400 text-sm">Based on 500+ bookings</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map(r=>(
              <div key={r.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-3">
                <Stars n={r.stars}/>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
                <div className="border-t border-gray-200 pt-3">
                  <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          11. FAQ
      ════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-3">Got Questions?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">Frequently <span className="text-[#543826]">Asked</span></h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(f=><FaqItem key={f.q} {...f}/>)}
          </div>
          <div className="text-center mt-10">
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1eb954] text-white font-bold px-8 py-4 rounded-full text-base transition">
              <WaIcon/> Ask Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          12. FINAL CTA
      ════════════════════════════════════════ */}
      <section className="py-20 bg-[#0d0704] relative overflow-hidden">
        <div className="absolute inset-0"><Image src="/images/CTA!.jpg" alt="Book IV Therapy" fill className="object-cover opacity-15" unoptimized/></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Book Today</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">Feel better,<br/><span className="text-[#C9C3B3]">faster.</span></h2>
          <p className="text-white/50 text-base mb-8 max-w-lg mx-auto">DHA-licensed nurses. Premium IV drips. At your door in Dubai within 30–60 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button onClick={scrollToForm} className="flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-bold px-10 py-4 rounded-full text-lg transition hover:scale-105">
              📅 Book IV Therapy
            </button>
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb954] text-white font-bold px-10 py-4 rounded-full text-lg transition hover:scale-105">
              <WaIcon/> WhatsApp Now
            </a>
          </div>
          <p className="text-white/20 text-xs">No subscription · Cash on Delivery · DHA License No. 3171506</p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          13. MINI FOOTER
      ════════════════════════════════════════ */}
      <footer className="bg-[#543826] py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/50 text-xs">
          <p>© 2025 Nordic Home Health Care · DHA License No. 3171506</p>
          <div className="flex gap-4">
            <a href={CALL_NUM} className="hover:text-white transition">📞 Call Us</a>
            <a href={`https://wa.me/${WA_NUM}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">💬 WhatsApp</a>
            <a href="/" className="hover:text-white transition">🌐 Main Site</a>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════
          14. STICKY MOBILE CTA BAR
      ════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-2xl">
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          <a href={CALL_NUM} className="flex flex-col items-center justify-center py-3 gap-0.5 text-gray-600 hover:bg-gray-50 transition active:bg-gray-100">
            <span className="text-xl">📞</span>
            <span className="text-[10px] font-semibold">Call Now</span>
          </a>
          <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center py-3 gap-0.5 bg-[#25D366] text-white active:bg-[#1eb954] transition">
            <span className="text-xl">💬</span>
            <span className="text-[10px] font-semibold">WhatsApp</span>
          </a>
          <button onClick={scrollToForm} className="flex flex-col items-center justify-center py-3 gap-0.5 bg-[#543826] text-white active:bg-[#3e2a1c] transition">
            <span className="text-xl">📅</span>
            <span className="text-[10px] font-semibold">Book Now</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          FLOATING WHATSAPP (desktop)
      ════════════════════════════════════════ */}
      <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="hidden sm:flex fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-full shadow-xl shadow-green-500/30 items-center justify-center transition-all hover:scale-110" title="WhatsApp">
        <WaIcon/>
      </a>

      {/* ════════════════════════════════════════
          BOOKING MODAL
      ════════════════════════════════════════ */}
      {selected && <BookingModal service={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}
