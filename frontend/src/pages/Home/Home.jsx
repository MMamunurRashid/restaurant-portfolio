import { useEffect } from "react";
import Contact from "../../components/HomeComponents/Contact";
import Hero from "../../components/HomeComponents/Hero";
import Services from "../../components/HomeComponents/Services";
import AboutUs from "../../components/HomeComponents/AboutUs";
import CampaignBanner from "../../components/HomeComponents/CampaignBanner";
import Testimonials from "../../components/HomeComponents/Testimonials";
import Gallery from "../../components/HomeComponents/Gallery";
import WhyChooseUs from "../../components/HomeComponents/WhyChooseUs";

export default function Home() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <AboutUs />
      <CampaignBanner />
      <Testimonials />
      <Gallery />
      <WhyChooseUs />
      <Contact />
    </>
  );
}
