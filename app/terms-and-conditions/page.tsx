import Link from "next/link";
import Image from "next/image";

export default function TermsAndConditionsPage() {
  return (
    <section className="min-h-screen bg-[#F7EEE0] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-block mb-8">
          <Image
            src="/images/logo.jpeg"
            alt="Nordic"
            width={90}
            height={38}
            className="rounded-full"
          />
        </Link>
        <h1 className="font-brand text-3xl md:text-4xl font-semibold text-[#543826] mb-8">
          Terms & Conditions
        </h1>
        <div className="prose prose-lg max-w-none text-[#543826]/80">
          <p className="font-brand">
            Welcome to Nordic Home Healthcare. By accessing or using our services, you agree to be bound by these Terms and Conditions.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">Use of Services</h2>
          <p className="font-brand">
            Our healthcare services are provided by licensed professionals. You agree to provide accurate information and comply with the treatment plans recommended by our healthcare providers.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">Booking and Payments</h2>
          <p className="font-brand">
            All bookings are subject to availability. Payment must be completed before services are rendered. Cancellation policies apply as per our service agreements.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">Limitation of Liability</h2>
          <p className="font-brand">
            While we strive to provide excellent care, Nordic Home Healthcare is not liable for indirect or consequential damages arising from the use of our services.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">Changes to Terms</h2>
          <p className="font-brand">
            We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the modified terms.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-3 bg-[#543826] hover:bg-[#3e2a1c] text-white font-brand font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:gap-5 mt-12"
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