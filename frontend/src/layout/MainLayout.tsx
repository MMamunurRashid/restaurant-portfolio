import Header from "../components/shared/MainHeader/Header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import MainFooter from "../components/shared/MainFooter";

export default function MainLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <motion.main
                className="min-h-[90vh] bg-base-100"
                animate={{ x: mobileMenuOpen ? "-30%" : "0%" }}
                transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
            >
                <Outlet />
            </motion.main>
            <MainFooter />
        </>
    )
}
