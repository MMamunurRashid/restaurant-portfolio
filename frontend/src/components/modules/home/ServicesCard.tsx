import { CONFIG } from "@/config";
import type { IService } from "@/interface/serviceInterface";
import { useGetAllServiceQuery } from "@/redux/features/service/serviceApi";
import { Link } from "react-router-dom";


export default function ServicesCard() {
    const { data } = useGetAllServiceQuery({});
    const services = data?.data || [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services?.map((service: IService) => {
                const plainDescriptionSlice = service?.description && service?.description.replace(/<[^>]+>/g, "").slice(0, 50) + "..."

                return <Link to={`/service/${service?.slug}`}
                    key={service?._id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-pink-100 flex flex-col items-center text-center p-2"
                >
                    {/* Service Image */}
                    <div className="relative w-full h-64 overflow-hidden rounded-2xl">
                        <img
                            src={CONFIG.BASE_URL + service?.thumbnail}
                            alt={service?.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-full text-2xl shadow-md">
                            <img
                                src={CONFIG.BASE_URL + service?.icon}
                                alt={service?.title}
                                className="w-10 h-10 object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                            {service?.title}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            {plainDescriptionSlice}
                        </p>

                        <button className="text-primary font-bold text-xs uppercase tracking-widest border-b-2 border-pink-200 group-hover:border-primary transition-all pb-1">
                            Read More
                        </button>
                    </div>
                </Link>
            })}
        </div>
    )
}
