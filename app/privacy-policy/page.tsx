import Link from "next/link";
import Image from "next/image";

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen bg-[#F7EEE0] py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-block mb-8">
          <Image
            src="/images/logo.jpeg"
            alt="Nordic"
            width={90}
            height={38}
            unoptimized
            className="rounded-full"
          />
        </Link>
        <h1 className="font-brand text-3xl md:text-4xl font-semibold text-[#543826] mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-lg max-w-none text-[#543826]/80">
          <p className="font-brand">
            At Nordic Home Healthcare, we are committed to protecting your personal information and your right to privacy.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">Information We Collect</h2>
          <p className="font-brand">
            We collect information that you provide directly to us, including your name, email address, phone number, and health-related information necessary for providing our services.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">How We Use Your Information</h2>
          <p className="font-brand">
            We use your information to provide healthcare services, communicate with you, process bookings, and improve our platform.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">Data Security</h2>
          <p className="font-brand">
            We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <h2 className="font-brand text-xl font-semibold text-[#543826] mt-6 mb-3">Contact Us</h2>
          <p className="font-brand">
            If you have questions about this Privacy Policy, please contact us at info@nordichc.com.
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