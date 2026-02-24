import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import AccountSidebar from "../components/AccountSidebar/AccountSidebar";
import { RiMenu2Line } from "react-icons/ri";
import MobileBottomHeader from "../components/Header/MobileBottomHeader/MobileBottomHeader";

export default function AccountLayout() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  let pathnameArray = location.pathname.split("/");
  pathnameArray.shift();
  const join = pathnameArray.join(" - ");

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (
        (!e.target.closest(".account_sidebar") &&
          !e.target.closest(".account_Sidebar_btn")) ||
        e.target.closest(".account_sidebar ul li a")
      ) {
        setSidebar(false);
      }
    });
  }, []);

  useEffect(() => {
    if (location?.pathname === "/account") {
      navigate("/account/profile");
    }
  }, [location?.pathname, navigate]);

  return (
    <>
      <Header />
      <section className="min-h-[70vh] container py-2 lg:py-5">
        <div className="lg:flex gap-5">
          <aside
            className={`account_sidebar ${sidebar && "account_sidebar_show"}`}
          >
            <AccountSidebar />
          </aside>
          <>
            <div className="lg:hidden pb-2 flex items-center gap-2 text-neutral">
              <button
                className="account_Sidebar_btn"
                onClick={() => setSidebar(true)}
              >
                <RiMenu2Line className="text-lg mt-px" />
              </button>
              <p>{join}</p>
            </div>
            <main className="account_content">
              <Outlet />
            </main>
          </>
        </div>
      </section>
      <Footer />
      <MobileBottomHeader />
    </>
  );
}
