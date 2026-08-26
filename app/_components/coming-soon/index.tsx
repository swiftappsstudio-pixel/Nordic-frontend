import Link from "next/link";
import Image from "next/image";

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <section className="min-h-screen bg-[#F7EEE0] flex items-center justify-center">
      <div className="text-center px-6">
        <Image
          src="/images/logo.jpeg"
          alt="Nordic"
          width={90}
          height={38}
          className="mx-auto mb-8 rounded-full"
        />
        <h1 className="font-brand text-4xl md:text-5xl font-semibold text-[#543826] mb-4">
          {title}
        </h1>
        <p className="font-brand text-lg text-[#543826]/50 mb-8">
          This page is under construction. We&apos;re working on something great.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-[#543826] hover:bg-[#3e2a1c] text-white font-brand font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:gap-5"
        >
          Back to Home
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}