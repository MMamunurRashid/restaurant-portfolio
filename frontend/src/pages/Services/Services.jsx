import { Link, useParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../../Redux/category/categoryApi";
import { FiArrowRight, FiFilter } from "react-icons/fi";

export default function Services() {
  const { slug } = useParams();
  const { data: categoriesData, isLoading: catLoading } =
    useGetCategoriesQuery();
  const categories = categoriesData?.data;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- Page Header --- */}
      <div className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 italic">
            Our Services
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Indulge in our premium beauty treatments designed to make you glow.
            From bridal makeovers to skin care, we have it all.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Sidebar: Categories (Desktop) --- */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="text-secondary" />
                <h3 className="font-bold text-xl">Categories</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/services/all"
                    className={`block px-4 py-3 rounded-xl transition-all font-medium ${
                      !slug || slug === "all"
                        ? "bg-secondary text-white"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    All Services
                  </Link>
                </li>
                {categories?.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/services/${cat.slug}`}
                      className={`block px-4 py-3 rounded-xl transition-all font-medium ${
                        slug === cat.slug
                          ? "bg-secondary text-white"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* --- Main Content: Service Grid --- */}
          <main className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {slug ? slug.replace(/-/g, " ").toUpperCase() : "ALL SERVICES"}
              </h2>
              <span className="text-sm text-gray-500 font-medium">
                Showing {categories?.length || 0} Categories
              </span>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`/images/service-${item}.jpg`}
                      alt="Service"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-primary font-bold shadow-sm">
                      ৳ 1500
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">
                      Premium Facial Treatment
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                      Our signature facial treatment includes deep cleansing,
                      exfoliation, and a custom mask to leave your skin radiant.
                    </p>

                    <div className="flex items-center justify-between border-t pt-4">
                      <Link
                        to="/booking"
                        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-secondary transition-all flex items-center gap-2"
                      >
                        Book Now <FiArrowRight />
                      </Link>
                      <Link
                        to={`/service-details/${item}`}
                        className="text-gray-400 hover:text-primary text-sm font-medium underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State (If no services found) */}
            {/* <div className="text-center py-20">
                <img src="/images/no-service.svg" className="w-40 mx-auto opacity-20 mb-4" />
                <p className="text-gray-400">No services found in this category.</p>
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
}
