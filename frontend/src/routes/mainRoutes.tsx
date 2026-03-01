import { lazy, Suspense } from "react";
import MainLayoutSkeleton from "../components/shared/Skeleton/MainLayoutSkeleton";
import { Navigate } from "react-router-dom";
import ServiceDetails from "@/pages/main/ServiceDetails";
import AboutPage from "@/pages/main/About";
import Blogs from "@/pages/main/Blogs";
import BlogDetails from "@/pages/main/BlogDetails";

// Lazy imports
const MainLayout = lazy(() => import("../layout/MainLayout"));
const Home = lazy(() => import("../pages/main/Home"));
const Contact = lazy(() => import("../pages/main/Contact"));
const PrivacyPolicy = lazy(() => import("../pages/main/PrivacyPolicy"));
const Appointment = lazy(() => import("../pages/main/Appointment"));
const TermsConditions = lazy(() => import("../pages/main/TermsConditions"));
const ServicesPage = lazy(() => import("../pages/main/Services"));


export const mainRoutes = {
    path: "/",
    element: (
        <Suspense fallback={<MainLayoutSkeleton />}>
            <MainLayout />
        </Suspense>
    ),
    children: [
        { path: "/", element: <Home /> },
        { path: "/home", element: <Navigate to="/" replace /> },
        { path: "/about-us", element: <AboutPage /> },
        { path: "/services", element: <ServicesPage /> },
        { path: "/service/:slug", element: <ServiceDetails /> },
        { path: "/contact-us", element: <Contact /> },
        { path: "/privacy-policy", element: <PrivacyPolicy /> },
        { path: "/terms-condition", element: <TermsConditions /> },
        { path: "/appointment", element: <Appointment /> },
        { path: "/blogs", element: <Blogs /> },
        { path: "/blog/:slug", element: <BlogDetails /> },
    ]
}