import AboutCom from "@/components/modules/home/AboutCom";
import OurTeam from "@/components/modules/home/OurTeam";

export default function AboutPage() {
    window.scrollTo(0, 0);

    return (
        <div className="py-20">
            <AboutCom />
            <OurTeam />
        </div>
    );
};