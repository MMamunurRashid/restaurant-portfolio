import { CONFIG } from "@/config";
import type { IContact } from "@/interface/contactInterface";
import type { IPackage } from "@/interface/packageInterface";
import type { IService } from "@/interface/serviceInterface";
import type { ITestimonial } from "@/interface/testimonialInterface";

export const cafeImages = {
  hero: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=85",
  dining: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=85",
  espresso: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
  brunch: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=85",
  dinner: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=85",
  dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85",
  interior: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
  barista: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
  plated: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
  drinks: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85",
};

export function getCafeImageUrl(path?: string) {
  if (!path) return "";
  if (/^https?:\/\//.test(path) || path.startsWith("/images/")) return path;
  return `${CONFIG.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
}

export const fallbackBanners = [
  {
    _id: "prestige-hero-1",
    title: "Prestige Cafe & Restaurant",
    description:
      "Specialty coffee, fresh plates, family dinners, and slow evenings in the city.",
    image: cafeImages.hero,
  },
  {
    _id: "prestige-hero-2",
    title: "Coffee, Brunch & Dinner",
    description:
      "Start with hand-pulled espresso, stay for fresh plates, and finish with desserts made for the table.",
    image: cafeImages.dining,
  },
];

export const heroHighlights = [
  "Specialty coffee",
  "Chef's seasonal menu",
  "Private dining",
];

export const fallbackAbout = {
  title: "Where Coffee, Comfort and Modern Dining Meet",
  subtitle: "About Prestige",
  description:
    "Prestige Cafe and Restaurant brings together the warmth of a neighborhood cafe with the polish of a modern dining room. Our kitchen focuses on fresh ingredients, balanced flavors, and plates that work for quick lunches, date nights, family gatherings, and private celebrations.",
  image: cafeImages.interior,
  stats: [
    { count: "35", title: "Menu Items" },
    { count: "12", title: "Signature Drinks" },
    { count: "80", title: "Dining Seats" },
  ],
};

export const fallbackServices: IService[] = [
  {
    _id: "menu-coffee",
    title: "Artisan Coffee Bar",
    slug: "artisan-coffee-bar",
    description:
      "Single-origin espresso, creamy cappuccino, cold brew, and house lattes prepared by trained baristas.",
    thumbnail: cafeImages.espresso,
    icon: "",
    isActive: true,
  },
  {
    _id: "menu-brunch",
    title: "All-Day Brunch",
    slug: "all-day-brunch",
    description:
      "Fresh bowls, toasts, eggs, sandwiches, and sweet plates designed for relaxed mornings and late starts.",
    thumbnail: cafeImages.brunch,
    icon: "",
    isActive: true,
  },
  {
    _id: "menu-dinner",
    title: "Signature Dining",
    slug: "signature-dining",
    description:
      "Comforting mains, grilled favorites, pasta, rice plates, and shareable sides for lunch and dinner.",
    thumbnail: cafeImages.dinner,
    icon: "",
    isActive: true,
  },
  {
    _id: "menu-dessert",
    title: "Dessert Counter",
    slug: "dessert-counter",
    description:
      "Cakes, pastries, house desserts, and after-dinner drinks that make every table linger longer.",
    thumbnail: cafeImages.dessert,
    icon: "",
    isActive: true,
  },
];

export const fallbackCampaign = {
  title: "Chef's Table Weekend Experience",
  subTitle: "Weekend Special",
  description:
    "A limited tasting set with coffee, starters, signature mains, dessert, and reserved seating for two.",
  image: cafeImages.plated,
};

export const fallbackPackages: IPackage[] = [
  {
    _id: "package-brunch",
    title: "Brunch for Two",
    slug: "brunch-for-two",
    price: 1490,
    services: ["Two signature coffees", "Two brunch plates", "Shared dessert", "Reserved window table"],
    isPopular: false,
    isFeatured: true,
    thumbnail: cafeImages.brunch,
    description: "A relaxed morning set for two guests.",
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "package-dinner",
    title: "Prestige Dinner Set",
    slug: "prestige-dinner-set",
    price: 2490,
    services: ["Two starters", "Two signature mains", "Dessert platter", "Priority evening seating"],
    isPopular: true,
    isFeatured: true,
    thumbnail: cafeImages.dinner,
    description: "Our most requested dinner experience.",
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "package-event",
    title: "Private Table",
    slug: "private-table",
    price: 3990,
    services: ["Reserved group table", "Custom food board", "Mocktail pitcher", "Celebration plating"],
    isPopular: false,
    isFeatured: true,
    thumbnail: cafeImages.interior,
    description: "For birthdays, family dinners, and small gatherings.",
    createdAt: "",
    updatedAt: "",
  },
];

export const fallbackGalleries = [
  {
    _id: "gallery-interior",
    title: "Interior",
    images: [
      { title: "Warm Dining Room", image: cafeImages.interior },
      { title: "Evening Tables", image: cafeImages.dining },
    ],
  },
  {
    _id: "gallery-menu",
    title: "Cuisine",
    images: [
      { title: "Chef's Plate", image: cafeImages.plated },
      { title: "Brunch Favorites", image: cafeImages.brunch },
    ],
  },
  {
    _id: "gallery-drinks",
    title: "Drinks",
    images: [
      { title: "Espresso Bar", image: cafeImages.espresso },
      { title: "House Refreshers", image: cafeImages.drinks },
    ],
  },
];

export const fallbackTestimonials: ITestimonial[] = [
  {
    _id: "testimonial-1",
    name: "Nusrat Jahan",
    designation: "Weekend Guest",
    image: "https://ui-avatars.com/api/?name=Nusrat+Jahan&background=1f4f46&color=fff",
    review:
      "The coffee was excellent, the dinner set felt premium, and the team handled our table with real care.",
  },
  {
    _id: "testimonial-2",
    name: "Arif Rahman",
    designation: "Private Dinner Host",
    image: "https://ui-avatars.com/api/?name=Arif+Rahman&background=d75a3f&color=fff",
    review:
      "Prestige is now my first choice for small celebrations. The food arrived beautifully and the room felt calm.",
  },
  {
    _id: "testimonial-3",
    name: "Maliha Chowdhury",
    designation: "Cafe Regular",
    image: "https://ui-avatars.com/api/?name=Maliha+Chowdhury&background=111827&color=fff",
    review:
      "Great place for meetings and slow evenings. Their latte, pasta, and dessert counter are consistently good.",
  },
];

export const fallbackContact: IContact = {
  title: "Visit Us",
  subTitle: "Reserve Your Table Today",
  email: "hello@prestigecafeandrestaurant.com",
  phone: "+880 1700 000000",
  address: "Prestige Cafe and Restaurant, Dhaka, Bangladesh",
  googleMapLink: "https://maps.google.com",
  whatsappLink: "https://wa.me/8801700000000",
  socials: [
    { icon: "facebook", url: "https://facebook.com" },
    { icon: "instagram", url: "https://instagram.com" },
    { icon: "tiktok", url: "https://tiktok.com" },
  ],
  officeHours: [
    { day: "Sunday - Thursday", hours: "10:00 AM - 11:00 PM" },
    { day: "Friday - Saturday", hours: "9:00 AM - 12:00 AM" },
  ],
};
