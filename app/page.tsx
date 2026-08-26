import { getFeaturedServices, getBanners } from "./_common/api";
import { Service, Banner } from "@/app/_common/interfaces";
import HeroSlider from "@/app/_components/hero-slider";
import ExploreOurServices from "@/app/_components/explore-services";
import StatsSection from "@/app/_components/stats-section";
import WhyNordicSection from "@/app/_components/why-nordic-section";
import ReviewsSection from "@/app/_components/reviews-section";
import TeamSection from "@/app/_components/team-section";
import FaqSection from "@/app/_components/faq-section";
import AppDownloadSection from "@/app/_components/app-download-section";

export const revalidate = 60;

export default async function Home() {
  const [banners, featuredServices] = await Promise.all([
    getBanners().catch(() => [] as Banner[]),
    getFeaturedServices().catch(() => [] as Service[]),
  ]);

  const heroSlides = banners.length > 0 ? banners : featuredServices;

  return (
    <>
      <HeroSlider heroSlides={heroSlides} />

      <StatsSection />

      <ExploreOurServices />

      <WhyNordicSection />

      <ReviewsSection />

      <TeamSection />

      <FaqSection />

      <AppDownloadSection />
    </>
  );
}
