import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Nurses | Nordic Home Healthcare",
  description:
    "Meet the Nordic Home Healthcare nursing team — DHA-licensed professionals delivering home healthcare across Dubai.",
};

type NurseListing = {
  slug: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
};

const NURSES: NurseListing[] = [
  {
    slug: "nishat-anjum",
    name: "Nishat Anjum",
    title: "Senior Nurse · DHA Licensed Assistant Nurse & Midwife",
    photo: "/images/nishat-anjum.jpg",
    bio: "Nishat is a compassionate senior nurse with a strong foundation in operating-theatre patient care and surgical assistance, bringing hospital-grade nursing experience into attentive care at home.",
  },
];

export default function OurNursesPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-6 pt-32 lg:pt-36 pb-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#543826]">Home</Link>
        <span>/</span>
        <span className="hover:text-[#543826]">Our Team</span>
        <span>/</span>
        <span className="text-[#543826] font-medium">Our Nurses</span>
      </nav>

      {/* Heading */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <span className="font-brand text-xs font-semibold tracking-widest uppercase text-[#543826]/60">Nordic Team</span>
        <h1 className="font-brand text-3xl md:text-4xl font-bold text-[#543826] mt-2 mb-3">Our Nurses</h1>
        <p className="text-[15px] text-gray-600 max-w-2xl">
          Meet the DHA-licensed nurses who deliver Nordic&apos;s home healthcare across Dubai — tap a profile to see
          their full background, credentials and areas of care.
        </p>
      </section>

      {/* Nurse list */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        {NURSES.length > 0 ? (
          <div className="flex flex-col gap-5">
            {NURSES.map((nurse) => (
              <Link
                key={nurse.slug}
                href={`/our-nurses/${nurse.slug}`}
                className="group flex flex-col sm:flex-row gap-5 sm:gap-7 items-start sm:items-center bg-white border border-[#C9C3B3]/40 rounded-2xl p-5 sm:p-6 hover:border-[#543826]/50 hover:shadow-md transition-all duration-200"
              >
                <div className="relative w-full sm:w-28 h-56 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#F7EEE0]">
                  <Image src={nurse.photo} alt={nurse.name} fill unoptimized className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-brand text-xl font-bold text-[#543826] mb-1 group-hover:underline">{nurse.name}</h2>
                  <p className="text-sm font-medium text-[#543826]/70 mb-2">{nurse.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{nurse.bio}</p>
                </div>

                <span className="whitespace-nowrap text-sm font-semibold text-[#543826] border border-[#543826] rounded-full px-5 py-2.5 group-hover:bg-[#543826] group-hover:text-white transition-colors shrink-0">
                  View Profile
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#F7EEE0] border border-[#C9C3B3]/40 rounded-2xl p-10 text-center">
            <h2 className="font-brand text-lg font-bold text-[#543826] mb-2">Nurse profiles coming soon</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              We&apos;re adding our DHA-licensed nurses here shortly. Check back soon to meet the team.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
