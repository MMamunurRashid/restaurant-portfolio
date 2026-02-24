import { Link } from "react-router-dom";
import {
  MdOutlineCategory,
  MdOutlineDashboard,
  MdMonitor,
  MdOutlineSettings,
} from "react-icons/md";
import { SiBrandfolder, SiFuturelearn } from "react-icons/si";
import { RiAdminFill } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import SidebarItems from "./SidebarItems";
import { useGetMainLogoQuery } from "../../../Redux/logo/logoApi";
import { VscPreview } from "react-icons/vsc";
import { IoMdSettings } from "react-icons/io";
import { MdFlashOn } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

import { useGetBusinessInfoQuery } from "../../../Redux/businessInfoApi/businessInfoApi";

const adminSidebarItems = [
  {
    icon: <MdOutlineDashboard />,
    title: "Dashbaord",
    path: "/admin/dashboard",
  },

  {
    icon: <FaRegMessage />,
    title: "Contact Message",
    path: "/admin/contact-msg",
  },
  {
    icon: <SiBrandfolder />,
    title: "Gallery",
    path: "/admin/gallery",
  },
  {
    icon: <MdOutlineCategory />,
    title: "Services Category",
    path: "/admin/services",
  },
  {
    icon: <BsCart4 />,
    title: "Services",
    subMenu: [
      {
        title: "Add New Service",
        path: "/admin/service/add-service",
      },
      {
        title: "All Services",
        path: "/admin/service/all-services",
      },
    ],
  },

  {
    icon: <SiFuturelearn />,
    title: "Academy",
    subMenu: [
      {
        title: "Add New Academy",
        path: "/admin/academy/add-academy",
      },
      {
        title: "All Academy",
        path: "/admin/academy/all-academy",
      },
    ],
  },
  {
    icon: <MdFlashOn />,
    title: "Offer",
    path: "/admin/flash-deal",
  },
  {
    icon: <VscPreview />,
    title: "Review",
    path: "/admin/reviews",
  },
  {
    icon: <FaUsers />,
    title: "Customer",
    subMenu: [
      {
        title: "All Customers",
        path: "/admin/customer/all-customers",
      },
    ],
  },
  {
    icon: <RiAdminFill />,
    title: "Administrator",
    subMenu: [
      {
        title: "All Administrator",
        path: "/admin/administrator/all-administrator",
      },
    ],
  },
  {
    icon: <MdOutlineSettings />,
    title: "Banner",
    subMenu: [
      {
        title: "Main Banner",
        path: "/admin/ecommerce-setting/banner",
      },
      {
        title: "Top Campaign Banner",
        path: "/admin/ecommerce-setting/top-campaign-banner",
      },
      {
        title: "Campaign Banner",
        path: "/admin/ecommerce-setting/campaign-banner",
      },
    ],
  },
  
  {
    icon: <IoMdSettings />,
    title: "General Setting",
    slug: "general-setting",
    subMenu: [
      {
        title: "Profile",
        path: "/admin/general-setting/profile",
      },
      {
        title: "Business Info",
        path: "/admin/general-setting/business-info",
      },
      {
        title: "Themes",
        path: "/admin/general-setting/themes",
      },
    ],
  },
  {
    icon: <MdMonitor />,
    title: "Front-End Setting",
    subMenu: [
      {
        title: "Logo",
        path: "/admin/front-end/logo",
      },
      {
        title: "Favicon",
        path: "/admin/front-end/favicon",
      },
      {
        title: "About Us",
        path: "/admin/front-end/about-us",
      },
      {
        title: "Contact Us",
        path: "/admin/front-end/contact-us",
      },
    ],
  },
  {
    icon: <CiSearch className="text-lg" />,
    title: "SEO Setting",
    path: "/admin/seo-setting",
  },
];

export default function AdminSidebar() {
  const { data } = useGetMainLogoQuery();
  const { data: businessInfo } = useGetBusinessInfoQuery();

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <Link to="/admin/dashboard" className="block border-b py-4">
          <img
            src={
              data?.data[0]?.logo === null
                ? "/images/logo/logo.png"
                : `${import.meta.env.VITE_BACKEND_URL}/logo/${
                    data?.data[0]?.logo
                  }`
            }
            alt=""
            className="w-28 mx-auto h-16"
          />
        </Link>

        <nav className="admin_siderbar">
          <ul>
            {adminSidebarItems?.map((item, i) => (
              <SidebarItems key={i} item={item} />
            ))}
          </ul>
        </nav>
      </div>

      <div className="bg-[#445360] p-2 flex justify-between items-center font-light">
        <p>Visit Front-End</p>
        <Link to="/" target="_blank" className="text-primary hover:underline">
          {businessInfo?.data[0]?.companyName}
        </Link>
      </div>
    </div>
  );
}
