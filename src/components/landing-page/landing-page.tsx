import React from "react";
import Header from "./header";
import HeroSection from "./hero-section";
import StatsSection from "./stats-section";
import FeaturesSection from "./features-section";
import ProcessSection from "./process-section";
import PricingSection from "./pricing-section";
import TestimonialsSection from "./testimonials";
import FAQSection from "./faq-section";
import Footer from "./footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection
        title="Website, CRM, Marketing, and Logistics"
        subtitle={{
          regular: "Build Your Website",
          gradient: "In 5 Minutes",
        }}
        description="Ecommerce or Service Website, you can build it in 5 minutes with our AI-powered platform."
        ctaText="Build Your Website Now"
        ctaHref="/signup"
        bottomImage={{
          light: "https://www.launchuicomponents.com/app-light.png",
          dark: "https://www.launchuicomponents.com/app-dark.png",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
        }}
      />
      <StatsSection />
      <FeaturesSection />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
