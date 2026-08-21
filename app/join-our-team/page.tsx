import type { Metadata } from "next";
import Link from "next/link";
import ApplyButton from "./apply-button";

export const metadata: Metadata = {
  title: "Join Our Team | Nordic Home Healthcare",
  description:
    "Explore current openings at Nordic Home Healthcare and apply to join a multicultural team of licensed healthcare professionals in Dubai.",
};

const CONTACT_EMAIL = "hr@nordichc.ae";
const CONTACT_PHONE = "+971569147945";

const WHY_WORK_WITH_US = [
  {
    title: "Great Work Culture",
    description: "Unmatched professionalism, world-class opportunities, and a team that treats every patient like family.",
  },
  {
    title: "Awards & Recognition",
    description: "Regular anonymous assessment surveys ensure every team member's contribution is seen and rewarded.",
  },
  {
    title: "Work-Life Balance",
    description: "We're committed to a healthy equilibrium between your career and personal life.",
  },
  {
    title: "Growth",
    description: "A continuous-learning mindset, backed by ongoing research, training and innovation in home healthcare.",
  },
  {
    title: "Diversity",
    description: "Our team represents over 15 nationalities, bringing a truly multicultural approach to patient care.",
  },
];

type JobOpening = {
  title: string;
  description: string;
};

const JOB_OPENINGS: JobOpening[] = [
  {
    title: "Registered Nurse",
    description: "Bachelor's degree in Nursing (BSN) or equivalent, valid DHA license, minimum 2 years clinical experience.",
  },
  {
    title: "Assistant Nurse",
    description: "Diploma in Nursing or equivalent, valid DHA license, minimum 1 year clinical experience.",
  },
  {
    title: "Physiotherapist",
    description: "Bachelor's/Doctor of Physical Therapy (DPT) or equivalent, valid DHA license, minimum 2 years clinical experience.",
  },
  {
    title: "Site Nurse",
    description: "Bachelor's degree in Nursing or equivalent, valid DHA license, minimum 2 years experience in on-site patient care.",
  },
  {
    title: "Baby Care Nurse",
    description: "Diploma/Bachelor's in Nursing or equivalent, neonatal or pediatric care experience, valid DHA license preferred.",
  },
  {
    title: "Elderly Care Nurse",
    description: "Bachelor's degree in Nursing or equivalent, geriatric care experience, valid DHA license.",
  },
];

export default function JoinOurTeamPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-6 pt-32 lg:pt-36 pb-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#543826]">Home</Link>
        <span>/</span>
        <span className="hover:text-[#543826]">Our Team</span>
        <span>/</span>
        <span className="text-[#543826] font-medium">Join Our Team</span>
      </nav>

      {/* Hero / intro */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#543826]/60">Careers</span>
        <h1 className="font-brand text-3xl md:text-4xl font-bold text-[#543826] mt-2 mb-4">Join Our Team</h1>
        <p className="text-[15px] text-gray-600 max-w-2xl">
          At Nordic Home Healthcare, we welcome highly qualified, challenge-seeking, committed and multicultural
          professionals to join our growing team. If you&apos;re passionate about delivering exceptional care directly
          to patients&apos; homes, we&apos;d love to hear from you.
        </p>
      </section>

      {/* Why work with us */}
      <section className="bg-[#F7EEE0] border-y border-[#C9C3B3]/40 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="font-brand text-2xl font-bold text-[#543826] mb-8">Why Work With Us?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {WHY_WORK_WITH_US.map((item) => (
              <div key={item.title} className="bg-white border border-[#C9C3B3]/40 rounded-2xl p-5">
                <h3 className="font-brand text-base font-semibold text-[#543826] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available positions */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="font-brand text-2xl font-bold text-[#543826] mb-2">Available Positions</h2>
        <p className="text-sm text-gray-600 mb-8">
          Email your CV and cover letter to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#543826] font-semibold underline hover:no-underline">
            {CONTACT_EMAIL}
          </a>{" "}
          or use the apply button on any listing below.
        </p>

        <div className="flex flex-col gap-4">
          {JOB_OPENINGS.map((job) => (
            <div
              key={job.title}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white border border-[#C9C3B3]/40 rounded-2xl p-5 sm:p-6 hover:border-[#543826]/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-brand text-lg font-bold text-[#543826] mb-1.5">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>

              <ApplyButton jobTitle={job.title} />
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#F7EEE0] text-center px-6 py-14">
        <h2 className="font-brand text-2xl font-bold text-[#543826] mb-2">Don&apos;t see the right role?</h2>
        <p className="text-gray-600 text-sm mb-6">
          We&apos;re always open to hearing from great healthcare professionals. Send us your CV and we&apos;ll be in touch.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex whitespace-nowrap text-sm font-semibold bg-[#543826] text-white px-7 py-3.5 rounded-full hover:bg-[#3e2a1c] transition shadow-sm"
          >
            Email {CONTACT_EMAIL}
          </a>
          <a
            href={`https://wa.me/${CONTACT_PHONE.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener"
            className="inline-flex whitespace-nowrap text-sm font-semibold border border-[#543826] text-[#543826] px-7 py-3.5 rounded-full hover:bg-white transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
