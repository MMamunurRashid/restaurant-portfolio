import { lazy, Suspense } from "react";
import DashboardLayoutSkeleton from "../components/shared/Skeleton/DashboardLayoutSkeleton";
import { PrivateRoute } from "./PrivateRoute";
import { Navigate } from "react-router-dom";
import Campaign from "@/pages/admin/Campaign/Campaign";
import AllTestimonial from "@/pages/admin/Testimonial/AllTestimonial";
import TestimonialForm from "@/pages/admin/Testimonial/TestimonialForm";
import AllBlogs from "@/pages/admin/blog/AllBlogs";
import BlogForm from "@/pages/admin/blog/BlogsForm";


const AdminLayout = lazy(() => import("../layout/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));

// setting lazy load
const GeneralSetting = lazy(() => import("../pages/admin/GeneralSetting"));
const ContactUs = lazy(() => import("../pages/admin/ContactUs"));

const Gallery = lazy(() => import("../pages/admin/Settings/Gallery/GalleryForm"));
const AllGallery = lazy(() => import("../pages/admin/Settings/Gallery/AllGallery"));
const SmtpSettings = lazy(() => import("../pages/admin/Settings/Smtp/SmtpSettings"));

// banner lazy load
const AllBanner = lazy(() => import("../pages/admin/Banner/AllBanner"));
const AddBanner = lazy(() => import("../pages/admin/Banner/AddBanner"));
const EditBanner = lazy(() => import("../pages/admin/Banner/EditBanner"));

const About = lazy(() => import("../pages/admin/About/About"));

// team lazy load
const AllTeam = lazy(() => import("../pages/admin/Team/AllTeam"));
const TeamForm = lazy(() => import("../pages/admin/Team/TeamForm"));



const MyProfile = lazy(() => import("../pages/admin/Profile/MyProfile"));
const UpdatePassword = lazy(() => import("../pages/admin/Profile/UpdatePassword"));
const SeoSettings = lazy(() => import("../pages/admin/Seo"));
const ContactMessage = lazy(() => import("../pages/admin/ContactMessage"));

const AllServices = lazy(() => import("../pages/admin/Service/AllService"));
const ServiceForm = lazy(() => import("../pages/admin/Service/ServiceForm"));

const AllPackages = lazy(() => import("../pages/admin/Package/AllPackage"));
const PackageForm = lazy(() => import("../pages/admin/Package/PackageForm"));

const AllUsers = lazy(() => import("../pages/admin/User/AllUsers"));

const TeamCategory = lazy(() => import("../pages/admin/Team/TeamCategory"));
const AllAppointment = lazy(() => import("../pages/admin/AllAppointment"));

const PrivacyPolicy = lazy(() => import("../pages/admin/PrivacyPolicy"));
const TermsCondition = lazy(() => import("../pages/admin/TermsCondition"));


export const adminRoutes = {
    path: "/admin",
    element: (
        <Suspense fallback={<DashboardLayoutSkeleton />}>
            <PrivateRoute>
                <AdminLayout />
            </PrivateRoute>
        </Suspense>
    ),
    children: [
        {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />
        },
        {
            path: "dashboard",
            element: <Dashboard />
        },
        // service
        {
            path: "services/all",
            element: <AllServices />
        },
        {
            path: "service/add",
            element: <ServiceForm />
        },
        {
            path: "service/edit/:id",
            element: <ServiceForm />
        },


        // package
        {
            path: "packages/all",
            element: <AllPackages />
        },
        {
            path: "package/add",
            element: <PackageForm />
        },
        {
            path: "package/edit/:id",
            element: <PackageForm />
        },



        {
            path: "contact-us",
            element: <ContactUs />
        },
        {
            path: "contact-message",
            element: <ContactMessage />
        },
        {
            path: "setting/general",
            element: <GeneralSetting />
        },
        {
            path: "setting/banner/all",
            element: <AllBanner />
        },
        {
            path: "setting/banner/add",
            element: <AddBanner />
        },
        {
            path: "setting/banner/edit/:id",
            element: <EditBanner />
        },
        {
            path: "setting/campaign-banner",
            element: <Campaign />
        },
        {
            path: "setting/testimonials/all",
            element: <AllTestimonial />
        },
        {
            path: "setting/testimonials/add",
            element: <TestimonialForm />
        },
        {
            path: "setting/testimonial/add",
            element: <TestimonialForm />
        },
        {
            path: "setting/testimonial/edit/:id",
            element: <TestimonialForm />
        },

        // gallery
        {
            path: "setting/gallery/all",
            element: <AllGallery />
        },
        {
            path: "setting/gallery/add",
            element: <Gallery />
        },
        {
            path: "setting/gallery/edit/:id",
            element: <Gallery />
        },
        {
            path: "setting/smtp",
            element: <SmtpSettings />
        },

        // about
        {
            path: "about",
            children: [
                {
                    path: "",
                    element: <About />
                },

                // team
                {
                    path: "team/category/all",
                    element: <TeamCategory />
                },
                {
                    path: "team/all",
                    element: <AllTeam />
                },
                {
                    path: "team/add",
                    element: <TeamForm />
                },
                {
                    path: "team/edit/:id",
                    element: <TeamForm />
                },


            ]
        },

        // appointments
        {
            path: "appointments/all",
            element: <AllAppointment />
        },

        // blogs
        {
            path: "blogs/all",
            element: <AllBlogs />
        },
        {
            path: "blogs/add",
            element: <BlogForm />
        },
        {
            path: "edit/:id",
            element: <BlogForm />
        },

        // profile
        {
            path: "profile/my-profile",
            element: <MyProfile />
        },
        {
            path: "profile/update-password",
            element: <UpdatePassword />
        },
        {
            path: "user/all",
            element: <AllUsers />
        },
        {
            path: "privacy-policy",
            element: <PrivacyPolicy />
        },
        {
            path: "terms-conditions",
            element: <TermsCondition />
        },
        {
            path: "seo",
            element: <SeoSettings />
        },
    ]
}
