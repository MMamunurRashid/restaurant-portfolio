import { useState } from "react";
import Sidebar from "../components/modules/admin/Sidebar";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/modules/admin/AdminHeader";


export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="lg:ml-70 transition-all duration-300">

                {/* Header */}
                <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />

                {/* Dashboard Content */}
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
