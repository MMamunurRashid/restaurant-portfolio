import AboutUs from "../../components/HomeComponents/AboutUs";
import WhyChooseUs from "../../components/HomeComponents/WhyChooseUs";
import Testimonials from "../../components/HomeComponents/Testimonials";

export default function AboutUsPage() {
  window.scroll(0, 0);

  return (
    <>
      <AboutUs />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
