
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
// import FeaturedCourses from "@/components/home/FeaturedCourses";
import BenefitsSection from "@/components/home/BenefitsSection";
import HowItWorks from "@/components/home/HowItWorks";
import ImageCarousel from "@/components/home/ImageCarousel";
import FeaturedCourses from "@/components/home/FeaturedCourses";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ImageCarousel />
        <FeaturedCourses />
        <HowItWorks />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
