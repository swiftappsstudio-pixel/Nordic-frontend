import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tania Jennifer, DPT | Physiotherapist | Nordic Home Healthcare",
  description:
    "Meet Tania Jennifer, DPT — DHA-licensed physiotherapist at Nordic Home Healthcare, delivering physiotherapy at home across Dubai.",
};

const WHATSAPP_NUMBER = "971581649910";
const bookMessage = encodeURIComponent(
  "Hi Nordic! I'd like to book a physiotherapy home visit with Tania Jennifer."
);
const bookUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${bookMessage}`;

const STAT_CHIPS = ["DHA Licensed", "EN · UR · HI · PA", "Practicing since 2022"];

const CARE_AREAS = [
  "Postpartum recovery & healing",
  "Musculoskeletal (MSK) rehab",
  "Gynecological rehabilitation",
  "Neuro & post-stroke rehab",
  "Orthopedic & post-operative care",
  "Geriatric & pediatric rehab",
  "Manual therapy & electrotherapy",
  "Pain management interventions",
  "Home exercise & injury prevention",
];

const NORDIC_HIGHLIGHTS = [
  "DHA licensed, Nordic-vetted clinician",
  "Home visits across Dubai in under an hour",
  "One of 100+ Nordic health & wellness professionals",
  "Held to Nordic's clinical audit & protocol standards",
  "Personalized treatment plans, no waiting rooms",
  "Rated 4.9★ across Nordic's home care patients",
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#543826] shrink-0 mt-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function TaniaJenniferProfile() {
  return (
    <main className="bg-white">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-6 pt-32 lg:pt-36 pb-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#543826]">Home</Link>
        <span>/</span>
        <span className="hover:text-[#543826]">Our Team</span>
        <span>/</span>
        <Link href="/our-physiotherapist" className="hover:text-[#543826]">Our Physiotherapist</Link>
        <span>/</span>
        <span className="text-[#543826] font-medium">Tania Jennifer</span>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-[320px_1fr] gap-10 items-center">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden ring-2 ring-[#543826] ring-offset-2 ring-offset-white shadow-lg bg-[#F7EEE0]">
            <Image
              src="/images/tania-jennifer.jpg"
              alt="Tania Jennifer, DPT — Physiotherapist at Nordic Home Healthcare"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute left-3 bottom-3 bg-white/95 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-[#543826]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#543826]" />
              Available for home visits
            </div>
          </div>

          <div>
            <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#543826]/60">
              Nordic Team &middot; Physiotherapy
            </span>
            <h1 className="font-brand text-3xl md:text-4xl font-bold text-[#543826] mt-2 mb-1">Tania Jennifer</h1>
            <p className="text-base text-[#543826]/70 font-medium mb-4">
              Doctor of Physical Therapy <span className="text-[#543826] font-semibold">&middot; DHA Licensed Physiotherapist</span>
            </p>
            <p className="text-[15px] text-gray-600 max-w-xl mb-6">
              Tania brings hospital-grade rehabilitation into the comfort of the home — combining musculoskeletal,
              orthopedic and postpartum expertise with the calm, unhurried pace that home-based care makes possible.
            </p>

            <div className="flex flex-wrap gap-2 mb-7">
              {STAT_CHIPS.map((chip) => (
                <span key={chip} className="border border-[#C9C3B3]/60 bg-white rounded-full px-3.5 py-2 text-xs font-semibold text-[#543826]">
                  {chip}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={bookUrl}
                target="_blank"
                rel="noopener"
                className="whitespace-nowrap text-sm font-semibold bg-[#543826] text-white px-6 py-3 rounded-full hover:bg-[#3e2a1c] transition shadow-sm"
              >
                Book Tania on WhatsApp
              </a>
              <a
                href="#license"
                className="whitespace-nowrap text-sm font-semibold border border-[#543826] text-[#543826] px-6 py-3 rounded-full hover:bg-[#C9C3B3]/20 transition"
              >
                View DHA License
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DHA License */}
      <section id="license" className="bg-[#543826]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#C9C3B3]">Verified Credential</span>
          <h2 className="font-brand text-2xl md:text-3xl font-bold text-white mt-2 mb-2">Dubai Health Authority License</h2>
          <p className="text-[#C9C3B3] text-sm max-w-xl mb-8">
            Every Nordic Home Healthcare clinician holds an active, independently verifiable DHA professional license.
          </p>

          <div className="bg-[#3e2a1c] border border-white/10 rounded-2xl p-8 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center text-center md:text-left">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#C9C3B3]/60 flex items-center justify-center mx-auto md:mx-0 shrink-0">
              <div className="w-[70px] h-[70px] rounded-full bg-[#C9C3B3] flex flex-col items-center justify-center text-[#543826]">
                <strong className="text-sm font-bold">DHA</strong>
                <span className="text-[9px] tracking-wider">VERIFIED</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left">
              <div>
                <div className="text-[10px] tracking-wider uppercase text-[#C9C3B3] mb-1">Professional Name</div>
                <div className="text-sm font-semibold text-white">Tania Jennifer</div>
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase text-[#C9C3B3] mb-1">License Title</div>
                <div className="text-sm font-semibold text-white">Physiotherapist</div>
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase text-[#C9C3B3] mb-1">DHA Unique ID</div>
                <div className="text-sm font-semibold text-white">86838340</div>
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase text-[#C9C3B3] mb-1">License Number</div>
                <div className="text-sm font-semibold text-white">86838340-001</div>
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase text-[#C9C3B3] mb-1">Issue Date</div>
                <div className="text-sm font-semibold text-white">05-04-2026</div>
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase text-[#C9C3B3] mb-1">Expiry Date</div>
                <div className="text-sm font-semibold text-white">05-04-2027</div>
              </div>
            </div>

            <a
              href="https://services.dha.gov.ae/sheryan/wps/portal/home/services-professional/online-verification"
              target="_blank"
              rel="noopener"
              className="whitespace-nowrap justify-self-center md:justify-self-end text-sm font-semibold bg-[#C9C3B3] text-[#543826] px-5 py-3 rounded-full hover:bg-white transition"
            >
              Verify on DHA Registry →
            </a>
          </div>
        </div>
      </section>

      {/* About / Quote */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[1.4fr_1fr] gap-11 items-start">
        <div>
          <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#543826]/60">Profile</span>
          <h2 className="font-brand text-2xl font-bold text-[#543826] mt-2 mb-4">Care that travels to the patient</h2>
          <p className="text-[15px] text-gray-600 mb-4">
            Tania is a Doctor of Physical Therapy with expertise across gynecological, musculoskeletal and orthopedic
            rehabilitation. She is an AHA-certified BLS provider, trained to deliver evidence-based assessment, manual
            therapy and functional training safely outside a clinical setting.
          </p>
          <p className="text-[15px] text-gray-600 mb-4">
            As part of the Nordic Home Healthcare team, Tania brings that same hospital-grade approach directly into
            patients&apos; homes across Dubai — building individualized rehabilitation plans and guiding patients through
            posture correction, ergonomics and home exercise programs, with the comfort and unhurried pace that home
            care makes possible.
          </p>
          <p className="text-[15px] text-gray-600">
            She is also completing specialist training as a Post Partum Healing Specialist, expanding her focus on
            mothers recovering after childbirth, alongside her ongoing geriatric and pediatric rehabilitation work.
          </p>
        </div>
        <div className="bg-[#543826] text-white rounded-2xl p-7">
          <p className="font-brand font-semibold text-lg leading-relaxed">
            &ldquo;Recovery happens faster when a patient feels at ease — and there&apos;s no place they feel more at ease than home.&rdquo;
          </p>
          <cite className="block mt-4 not-italic text-xs tracking-wide text-[#C9C3B3]">TANIA JENNIFER, DPT — PHYSIOTHERAPIST</cite>
        </div>
      </section>

      {/* Areas of Care */}
      <section className="bg-[#F7EEE0] border-y border-[#C9C3B3]/40">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-xl mb-8">
            <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#543826]/60">Areas of Care</span>
            <h2 className="font-brand text-2xl font-bold text-[#543826] mt-2 mb-2">What Tania treats at home</h2>
            <p className="text-[15px] text-gray-600">
              A home-care practice built around functional recovery, pain relief and independence — for patients across every life stage.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {CARE_AREAS.map((item) => (
              <div key={item} className="bg-white border border-[#C9C3B3]/40 rounded-xl p-4 flex items-start gap-2.5 text-sm font-semibold text-[#543826]">
                <CheckIcon />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nordic highlights */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="max-w-2xl mb-8">
          <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#543826]/60">Nordic Team</span>
          <h2 className="font-brand text-2xl font-bold text-[#543826] mt-2 mb-2">Proudly caring with Nordic Home Healthcare</h2>
          <p className="text-[15px] text-gray-600">
            Tania is a member of the Nordic Home Healthcare team, bringing DHA-licensed physiotherapy directly to
            patients&apos; doorsteps across Dubai — backed by Nordic&apos;s standards for licensing, safety and patient-centered care.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {NORDIC_HIGHLIGHTS.map((item) => (
            <div key={item} className="bg-white border border-[#C9C3B3]/40 rounded-xl p-4 flex items-start gap-2.5 text-sm font-semibold text-[#543826]">
              <CheckIcon />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F7EEE0] text-center px-6 py-14">
        <h2 className="font-brand text-2xl font-bold text-[#543826] mb-2">Book a home visit with Tania</h2>
        <p className="text-gray-600 text-sm mb-6">Physiotherapy at home, across Dubai — arranged in minutes over WhatsApp.</p>
        <a
          href={bookUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex whitespace-nowrap text-sm font-semibold bg-[#543826] text-white px-7 py-3.5 rounded-full hover:bg-[#3e2a1c] transition shadow-sm"
        >
          Chat on WhatsApp
        </a>
      </section>
    </main>
  );
}
