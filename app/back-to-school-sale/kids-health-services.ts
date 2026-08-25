export type KidsHealthService = {
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  offBadge?: string;
  /** A real photo — only set when we have an actual on-brand child photo for this service. */
  image?: string;
  /** Tailwind gradient stops, used as a clean icon-tile visual when no real child photo fits. */
  gradient?: string;
  icon: string;
  description: string;
  highlights: string[];
};

export const KIDS_HEALTH_SERVICES: KidsHealthService[] = [
  {
    slug: "flu-influenza-vaccine-for-kids",
    title: "Flu and Influenza Vaccine for Kids",
    subtitle: "Your best bet for avoiding influenza",
    price: 149,
    originalPrice: 199,
    offBadge: "AED 50 OFF",
    image: "/images/promos/child-checkup.jpg",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description:
      "Protect your child from seasonal flu with a single at-home influenza vaccination, administered by a DHA-licensed pediatric nurse — no clinic visit, no waiting room.",
    highlights: [
      "Administered by DHA-licensed pediatric nurses",
      "Suitable for school-age children",
      "Quick visit, done at home",
      "Helps reduce missed school days from flu",
    ],
  },
  {
    slug: "seasonal-flu-pcr-swab-test",
    title: "Seasonal Flu PCR Swab Test",
    subtitle: "Identify viral infections causing cold, cough, and flu",
    price: 199,
    offBadge: "AED 40 OFF",
    image: "/images/blood_test_intrument.png",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
    description:
      "A gentle nasal/throat swab test to accurately identify the virus behind your child's cold, cough or flu-like symptoms — collected at home and processed by an accredited lab.",
    highlights: [
      "Fast, accredited lab processing",
      "Gentle swab collection at home",
      "Helps confirm the right treatment early",
      "Same-day booking available",
    ],
  },
  {
    slug: "basic-vitamins-minerals-blood-test",
    title: "Basic Vitamins & Minerals Blood Test",
    subtitle: "9 essential biomarkers",
    price: 299,
    originalPrice: 399,
    offBadge: "AED 100 OFF",
    image: "/images/blood_test_intrument.png",
    icon: "M12 21.75c4.97 0 9-3.694 9-8.25 0-4.556-9-13.5-9-13.5S3 8.944 3 13.5c0 4.556 4.03 8.25 9 8.25z",
    description:
      "Check the 9 essential vitamins and minerals every growing child needs, from Vitamin D to Iron, with a simple at-home blood draw.",
    highlights: [
      "9 essential biomarkers",
      "Flags common childhood deficiencies early",
      "Simple at-home blood draw",
      "Clear, easy-to-read results",
    ],
  },
  {
    slug: "vitamin-d-injection",
    title: "Vitamin D Injection",
    subtitle: "Replenish your child's vitamin D",
    price: 350,
    originalPrice: 500,
    offBadge: "AED 150 OFF",
    image: "/images/promos/school-girl-face.png",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    description:
      "A single Vitamin D injection to quickly restore healthy levels — especially useful for children with low sun exposure during the school term.",
    highlights: [
      "Fast, effective way to correct deficiency",
      "Administered by a licensed nurse at home",
      "Recommended after a vitamin D blood test",
      "Supports bone growth & immunity",
    ],
  },
  {
    slug: "vitamin-b12-injection",
    title: "Vitamin B12 Injection",
    subtitle: "Boost your child's Vitamin B12 levels",
    price: 399,
    originalPrice: 500,
    offBadge: "AED 101 OFF",
    image: "/images/promos/school-girl-backpack.png",
    icon: "M13.5 4.5L21 12l-7.5 7.5M3 12h17.25",
    description:
      "Boost energy, focus and red blood cell production with a Vitamin B12 injection administered at home by our nursing team.",
    highlights: [
      "Supports energy & concentration",
      "Administered at home by a licensed nurse",
      "Quick, low-discomfort injection",
      "Works well alongside a vitamin panel",
    ],
  },
  {
    slug: "pediatric-doctor-home-visit",
    title: "Pediatric Doctor Home Visits & Consultation",
    subtitle: "One-on-one time with a pediatric doctor, at home",
    price: 349,
    image: "/images/promos/school-girl-portrait.png",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
    description:
      "A full consultation with a pediatric doctor in the comfort of your home — covering general health, growth, and any back-to-school concerns you have.",
    highlights: [
      "One-on-one time with a pediatric doctor",
      "Covers general health & growth check",
      "No clinic visit or waiting room",
      "Follow-up guidance included",
    ],
  },
  {
    slug: "teenage-buddy-package",
    title: "Teenage Buddy Package",
    subtitle: "30 essential biomarkers",
    price: 399,
    gradient: "from-[#1a2e28] to-[#2D5B4F]",
    icon: "M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description:
      "A dedicated health package for teenagers, screening 30 essential biomarkers to catch nutrition gaps, hormonal changes and growth concerns early.",
    highlights: [
      "30 essential biomarkers for teens",
      "Covers nutrition, hormones & growth markers",
      "Single at-home blood draw",
      "Results reviewed by our clinical team",
    ],
  },
  {
    slug: "iron-deficiency-test",
    title: "Iron Deficiency Test",
    subtitle: "Screens for one of the most common childhood deficiencies",
    price: 99,
    originalPrice: 199,
    offBadge: "AED 100 OFF",
    image: "/images/blood_test_intrument.png",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
    description:
      "A focused blood test to check for iron deficiency — one of the most common nutritional gaps in growing children — with a simple at-home draw.",
    highlights: [
      "Screens for a common childhood deficiency",
      "Simple, quick at-home blood draw",
      "Fast lab turnaround",
      "Helps guide diet & supplement decisions",
    ],
  },
];

export const getKidsHealthService = (slug: string) =>
  KIDS_HEALTH_SERVICES.find((s) => s.slug === slug);
