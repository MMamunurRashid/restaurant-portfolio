import { useGetContactQuery } from "@/redux/features/contact/contactApi";
import usePageView from "@/utils/usePageView";
import ContactCom from "@/components/modules/home/ContactCom";

export default function Contact() {
    usePageView("Contact");
    window.scrollTo(0, 0);
    const { data } = useGetContactQuery({});
    const contact = data?.data || {};

    const responsiveIframe = contact?.googleMapLink?.replace(/width="\d+"/, 'width="100%"');

    return (
        <div className="">
            <ContactCom />


            {/* Map Section - Full Width */}
            <div className="w-full h-125 bg-gray-200 grayscale hover:grayscale-0 contrast-125 duration-300">
                <div
                    dangerouslySetInnerHTML={{ __html: responsiveIframe }}
                />
            </div>
        </div>
    );
}