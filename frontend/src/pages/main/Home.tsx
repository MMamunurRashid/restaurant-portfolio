import Services from "@/components/modules/home/Services";
import AboutCom from "../../components/modules/home/AboutCom";
import ContactCom from "../../components/modules/home/ContactCom";
import Hero from "../../components/modules/home/Hero";
import usePageView from "@/utils/usePageView";
import CampaignBanner from "@/components/modules/home/CampaignBanner";
import Gallery from "@/components/modules/home/Gallery";
import Testimonials from "@/components/modules/home/Testimonials";


export default function Home() {
    usePageView("Home");
    window.scrollTo(0, 0);

    return (
        <>
            <Hero />
            <Services />
            <AboutCom />
            <CampaignBanner />
            <Gallery />
            <Testimonials />
            <ContactCom />
        </>
    )
}
