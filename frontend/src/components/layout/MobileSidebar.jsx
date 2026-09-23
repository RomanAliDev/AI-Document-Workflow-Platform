import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiFileText,
  FiMessageSquare,
  FiSearch,
  FiBarChart2,
  FiUsers,
  FiLayers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const MobileSidebar = () => {
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: FiFileText,
    },
    {
      name: "AI Assistant",
      path: "/ai",
      icon: FiMessageSquare,
    },
    {
      name: "Semantic Search",
      path: "/semantic-search",
      icon: FiSearch,
    },
  ];

  if (user?.role === "SUPERADMIN") {
    menuItems.push(
      {
        name: "Analytics",
        path: "/analytics",
        icon: FiBarChart2,
      },
      {
        name: "Users Management",
        path: "/user-management",
        icon: FiUsers,
      },
      {
        name: "Departments",
        path: "/department-management",
        icon: FiLayers,
      },
    );
  }

  menuItems.push({
    name: "Settings",
    path: "/setting",
    icon: FiSettings,
  });

  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div>
          <h1 className="text-base font-bold text-slate-900">
            AI Document Platform
          </h1>

          <p className="text-[10px] text-slate-500">Workflow Automation</p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-slate-200 cursor-pointer p-2 text-slate-700 transition hover:bg-slate-100"
          aria-label="Open menu">
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-700 bg-slate-900 transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              AI Document Platform
            </h1>

            <p className="mt-1 text-xs text-slate-400">Workflow Automation</p>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-400 cursor-pointer transition hover:bg-slate-800 hover:text-white"
            aria-label="Close menu">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1  p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }>
                <Icon className="h-5 w-5 shrink-0" />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 cursor-pointer rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
            <FiLogOut className="h-5 w-5" />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
