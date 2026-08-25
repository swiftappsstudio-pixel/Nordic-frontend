export type ParentsWellnessService = {
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
  gradient?: string;
  icon: string;
  description: string;
  highlights: string[];
};

export const PARENTS_WELLNESS_SERVICES: ParentsWellnessService[] = [
  {
    slug: "full-body-health-checkup",
    title: "Full Body Health Checkup",
    subtitle: "A comprehensive at-home checkup covering the essentials, so you can focus on your family worry-free.",
    image: "/images/healthcare.png",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description:
      "A comprehensive at-home health checkup covering the essentials — vitals, general wellness markers and a review with our clinical team — so busy parents can stay on top of their health without a clinic visit.",
    highlights: [
      "Covers key vitals & wellness markers",
      "No clinic visit or waiting room",
      "Results reviewed by our clinical team",
      "Ideal for a back-to-school health reset",
    ],
  },
  {
    slug: "vitamin-d-essential-vitamins-panel",
    title: "Vitamin D & Essential Vitamins Panel",
    subtitle: "Check for the deficiencies that drain busy parents most, with results delivered straight to you.",
    image: "/images/nurse2.png",
    icon: "M12 21.75c4.97 0 9-3.694 9-8.25 0-4.556-9-13.5-9-13.5S3 8.944 3 13.5c0 4.556 4.03 8.25 9 8.25z",
    description:
      "A focused blood panel checking Vitamin D and other essential vitamins that commonly run low in busy parents — collected at home, with clear results delivered straight to you.",
    highlights: [
      "Screens for common parent fatigue triggers",
      "Simple at-home blood draw",
      "Clear, easy-to-read results",
      "Guides supplementation & diet decisions",
    ],
  },
  {
    slug: "immunity-energy-boost-iv-drip",
    title: "Immunity & Energy Boost IV Drip",
    subtitle: "Restore energy and immunity for the busy school-run season with an at-home IV infusion.",
    image: "/images/nurse.png",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    description:
      "An at-home IV infusion built for the school-run season — restoring energy, hydration and immune support so parents can keep up with the family's routine.",
    highlights: [
      "Restores energy & hydration fast",
      "Supports immune system function",
      "30–45 minute session at home",
      "Administered by a DHA-licensed nurse",
    ],
  },
  {
    slug: "stress-sleep-mental-wellness-consultation",
    title: "Stress, Sleep & Mental Wellness Consultation",
    subtitle: "A private consultation to help you manage stress and get better rest during the school-year rush.",
    image: "/images/health2.png",
    icon: "M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z",
    description:
      "A private, judgment-free consultation to help you manage stress and improve sleep quality during the busy school-year rush — with practical guidance tailored to your routine.",
    highlights: [
      "One-on-one private consultation",
      "Practical stress & sleep strategies",
      "Convenient online or at-home format",
      "Follow-up guidance included",
    ],
  },
  {
    slug: "physiotherapy-posture-consultation",
    title: "Physiotherapy & Posture Consultation",
    subtitle: "Ease the back-to-school load of school runs and desk work with a targeted physiotherapy session.",
    image: "/images/physiotherapy-2.png",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description:
      "A targeted physiotherapy and posture consultation to ease the aches that come with school runs, desk work and daily carrying — delivered at home by a licensed physiotherapist.",
    highlights: [
      "Assesses posture & common pain points",
      "Personalised exercise guidance",
      "Delivered at home by a licensed physiotherapist",
      "Great for back, neck & shoulder tension",
    ],
  },
  {
    slug: "parent-wellness-screening",
    title: "Parent Wellness Screening",
    subtitle: "A tailored wellness screening for mothers and fathers to start the school year feeling their best.",
    image: "/images/health.png",
    icon: "M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description:
      "A tailored wellness screening for mothers and fathers, covering the essentials so you can start the new school year feeling informed and at your best.",
    highlights: [
      "Tailored for busy mothers & fathers",
      "Covers core wellness essentials",
      "At-home appointment, no waiting room",
      "Clear next-step guidance included",
    ],
  },
];

export const getParentsWellnessService = (slug: string) =>
  PARENTS_WELLNESS_SERVICES.find((s) => s.slug === slug);
