import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Management | Nordic Home Healthcare",
  description:
    "Meet the management team behind Nordic Home Healthcare's clinical operations, nursing, finance and patient care in Dubai.",
};

type ManagementMember = {
  name: string;
  title: string;
  bio: string;
  photo?: string;
};

const MANAGEMENT_TEAM: ManagementMember[] = [
  {
    name: "Dr. Shakeela Moussazehi",
    title: "Founder, MD Family Medicine",
    bio: "Dr. Shakeela Moussazehi is the Founder of Nordic Home Healthcare. Focused on science-backed women's health and longevity, she helps high-achieving women navigate burnout, hormones and healthy aging — bringing that same patient-centered philosophy to Nordic's home healthcare services across Dubai.",
    photo: "/images/dr-shakeela-moussazehi.jpg",
  },
  {
    name: "Dr. Mohammad Ali Moussazehi",
    title: "Co-Founder & Internal Medicine Physician",
    bio: "Dr. Mohammad Ali Moussazehi is the Co-Founder of Nordic Home Healthcare and practices Internal Medicine, guiding the clinical direction of the company's home healthcare services.",
    photo: "/images/dr-ali-moussazehi.jpg",
  },
  {
    name: "Mahnoor Akbar Bloch",
    title: "General Manager",
    bio: "Responsible for the overall management and growth of the company, overseeing key operations, strategic decision-making, team performance, and business development. Plays a leading role in driving the company's progress and achieving its long-term goals.",
    photo: "/images/mahnoor-akbar-bloch.jpg",
  },
  {
    name: "Khadim Hussain",
    title: "Head of E-Commerce",
    bio: "Responsible for managing and developing the company's e-commerce operations, including online sales, digital platforms, customer experience, e-commerce strategy, and overall growth of the online business.",
    photo: "/images/khadim-hussain.jpg",
  },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
};

export default function OurManagementPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-6 pt-32 lg:pt-36 pb-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#543826]">Home</Link>
        <span>/</span>
        <span className="hover:text-[#543826]">Our Team</span>
        <span>/</span>
        <span className="text-[#543826] font-medium">Our Management</span>
      </nav>

      {/* Heading */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#543826]/60">Nordic Team</span>
        <h1 className="font-brand text-3xl md:text-4xl font-bold text-[#543826] mt-2 mb-3">Our Management</h1>
        <p className="text-[15px] text-gray-600 max-w-2xl">
          The leadership team guiding Nordic Home Healthcare&apos;s clinical standards, operations and patient care
          across Dubai.
        </p>
      </section>

      {/* Management list */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-5">
          {MANAGEMENT_TEAM.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start bg-white border border-[#C9C3B3]/40 rounded-2xl p-5 sm:p-6"
            >
              {member.photo ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-[#C9C3B3]/50 shrink-0 mx-auto sm:mx-0">
                  <Image src={member.photo} alt={member.name} fill unoptimized className="object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#F7EEE0] border border-[#C9C3B3]/50 flex items-center justify-center text-xl font-bold text-[#543826] shrink-0 mx-auto sm:mx-0">
                  {getInitials(member.name)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="font-brand text-xl font-bold text-[#543826] mb-0.5">{member.name}</h2>
                <p className="text-sm font-semibold text-[#543826]/70 mb-2">{member.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
