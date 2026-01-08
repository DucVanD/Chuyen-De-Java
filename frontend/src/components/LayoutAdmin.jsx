

import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "./HeadAdmin";
import FooterAdmin from "./FooterAdmin";
import SidebarAdmin from "./SidebarAdmin";

function LayoutAdmin() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <SidebarAdmin isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
                    }`}
            >
                {/* Header */}
                <HeaderAdmin toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <FooterAdmin />
            </div>
        </div>
    );
}

export default LayoutAdmin;