import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Spinner from "../components/Spinner/Spinner";

import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import AboutUsPage from "../pages/AboutUs/AboutUs";
import ContactUs from "../pages/Contactus/Contactus";
const FAQ = lazy(() => import("../pages/FAQ/FAQ"));

import Gallery from "../pages/Admin/Gallery/Gallery";
import AddGallery from "../pages/Admin/Gallery/AddGallery";
import ContactMsgList from "../pages/Admin/ContactMsg/ContactMsgList";
import ContactMsgDetail from "../pages/Admin/ContactMsg/ContactMsgDetail";
import AllReview from "../pages/Admin/AllReview/AllReview";

// Admin Pages
const AdminLayout = lazy(() => import("../Layout/AdminLayout/AdminLayout"));
const AdminRoute = lazy(() => import("../PrivateRoute/AdminRoute"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard/Dashboard"));

// Category Management
const AddCategory = lazy(
  () => import("../pages/Admin/Category/Categories/AddCategory"),
);
const AllCategories = lazy(
  () => import("../pages/Admin/Category/Categories/AllCategories"),
);
const EditCtg = lazy(
  () => import("../pages/Admin/Category/Categories/EditCtg"),
);

// Product Management
const AddProduct = lazy(() => import("../pages/Admin/Product/AddProduct"));
const ProductList = lazy(() => import("../pages/Admin/Product/ProductList"));
const EditProduct = lazy(() => import("../pages/Admin/Product/EditProduct"));

// Administrator Management
const AddAdministrator = lazy(
  () => import("../pages/Admin/Administrator/AddAdministrator"),
);
const Administrator = lazy(
  () => import("../pages/Admin/Administrator/Administrator"),
);
const EditAdministrator = lazy(
  () => import("../pages/Admin/Administrator/EditAdmin"),
);

// Ecommerce Settings
const CouponLists = lazy(
  () => import("../pages/Admin/EcommerceSetting/Coupon/CouponLists"),
);

// General Settings
const AdminProfile = lazy(
  () => import("../pages/Admin/GeneralSetting/AdminProfile/AdminProfile"),
);
const BusinessInfo = lazy(
  () => import("../pages/Admin/GeneralSetting/BusinessInfo/BusinessInfo"),
);

// Banner Management
const Banner = lazy(
  () => import("../pages/Admin/EcommerceSetting/Banner/Banner"),
);
const AddBanner = lazy(
  () => import("../pages/Admin/EcommerceSetting/Banner/AddBanner"),
);
const EditBanner = lazy(
  () => import("../pages/Admin/EcommerceSetting/Banner/EditBanner"),
);
const TopCampaignBanner = lazy(
  () =>
    import("../pages/Admin/EcommerceSetting/TopCampaignBanner/TopCampaignBanner"),
);

// Front-End Settings
const About = lazy(() => import("../pages/Admin/FrontEnd/About/About"));
const Contact = lazy(() => import("../pages/Admin/FrontEnd/Contact/Contact"));
const Logo = lazy(() => import("../pages/Admin/FrontEnd/Logo/Logo"));
const Favicon = lazy(() => import("../pages/Admin/FrontEnd/Favicon/Favicon"));

// SEO Settings
const SEOSetting = lazy(() => import("../pages/Admin/SEOSetting/SEOSetting"));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Spinner />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about-us",
        element: <AboutUsPage />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <Suspense fallback={<Spinner />}>
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      </Suspense>
    ),
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
      },
      {
        path: "/admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/services",
        element: <AllCategories />,
      },
      {
        path: "/admin/category/add-category",
        element: <AddCategory />,
      },
      {
        path: "/admin/category/edit/:id",
        element: <EditCtg />,
      },

      {
        path: "/admin/service/all-services",
        element: <ProductList />,
      },
      {
        path: "/admin/service/add-service",
        element: <AddProduct />,
      },
      {
        path: "/admin/service/edit-service/:id",
        element: <EditProduct />,
      },

      //--------------Review
      {
        path: "/admin/reviews",
        element: <AllReview />,
      },

      //--------------Gallery
      {
        path: "/admin/gallery",
        element: <Gallery />,
      },
      {
        path: "/admin/gallery/add",
        element: <AddGallery />,
      },

      //--------------Administrator
      {
        path: "/admin/administrator/all-administrator",
        element: <Administrator />,
      },
      {
        path: "/admin/administrator/add-administrator",
        element: <AddAdministrator />,
      },
      {
        path: "/admin/administrator/edit-administrator/:id",
        element: <EditAdministrator />,
      },

      //-------------Banner
      {
        path: "/admin/ecommerce-setting/banner",
        element: <Banner />,
      },
      {
        path: "/admin/ecommerce-setting/add-banner",
        element: <AddBanner />,
      },
      {
        path: "/admin/ecommerce-setting/edit-banner/:id",
        element: <EditBanner />,
      },

      //---------Contact msg
      {
        path: "/admin/contact-msg",
        element: <ContactMsgList />,
      },
      {
        path: "/admin/contact-msg/:id",
        element: <ContactMsgDetail />,
      },

      //---------Top Campaign Banner
      {
        path: "/admin/ecommerce-setting/top-campaign-banner",
        element: <TopCampaignBanner />,
      },

      //----------General Setting
      {
        path: "/admin/general-setting/profile",
        element: <AdminProfile />,
      },
      {
        path: "/admin/general-setting/business-info",
        element: <BusinessInfo />,
      },

      //--------------Front-End
      {
        path: "/admin/front-end/logo",
        element: <Logo />,
      },
      {
        path: "/admin/front-end/favicon",
        element: <Favicon />,
      },
      {
        path: "/admin/front-end/about-us",
        element: <About />,
      },
      {
        path: "/admin/front-end/contact-us",
        element: <Contact />,
      },

      //----------SEO Setting
      {
        path: "/admin/seo-setting",
        element: <SEOSetting />,
      },
    ],
  },
]);
