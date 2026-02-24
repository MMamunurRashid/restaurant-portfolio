import { useState } from "react";

const galleryData = [
  {
    id: 1,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&q=80&w=600",
    title: "Bridal Glow",
  },
  {
    id: 2,
    category: "Skin",
    image:
      "https://images.unsplash.com/photo-1570172619665-22879590858e?auto=format&fit=crop&q=80&w=600",
    title: "Organic Facial",
  },
  {
    id: 3,
    category: "Hair",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600",
    title: "Stylish Curls",
  },
  {
    id: 4,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    title: "Party Look",
  },
  {
    id: 5,
    category: "Hair",
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f8c2b1b1?auto=format&fit=crop&q=80&w=600",
    title: "Hair Coloring",
  },
  {
    id: 6,
    category: "Skin",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600",
    title: "Face Therapy",
  },
];

const categories = ["All", "Makeup", "Skin", "Hair"];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [selectedImg, setSelectedImg] = useState(null);

  const filteredImages =
    filter === "All"
      ? galleryData
      : galleryData.filter((img) => img.category === filter);

  return (
    <section className="py-10 bg-[#fff5f7ba]">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h4 className="text-secondary font-bold tracking-[5px] uppercase text-sm mb-3">
            Our Work
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            The <span className="text-secondary italic">Beauty Canvas</span>{" "}
            Gallery
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-2 rounded-full font-bold transition-all duration-300 border-2 ${
                filter === cat
                  ? "bg-secondary border-secondary text-white shadow-lg"
                  : "border-gray-100 text-gray-500 hover:border-secondary hover:text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImg(item.image)} // Click to Zoom
              className="relative group overflow-hidden rounded-[30px] h-[400px] cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white bg-secondary p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all duration-300"
          onClick={() => setSelectedImg(null)}
        >
          {/* Close Button */}
          <button className="absolute top-10 right-10 text-white hover:text-secondary transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Full Screen Image */}
          <img
            src={selectedImg}
            alt="Zoomed"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-in zoom-in duration-300"
          />
        </div>
      )}
    </section>
  );
}
