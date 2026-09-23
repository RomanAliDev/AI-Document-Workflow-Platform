import { NavLink } from "react-router-dom";
import {
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

const Sidebar = () => {
  const { user, logout } = useAuth();

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

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-700 bg-slate-900">
      {/* Logo */}
      <div className="border-b border-slate-700 px-6 py-4">
        <h1 className="text-xl font-bold text-white">AI Document Platform</h1>

        <p className="mt-1 text-xs text-slate-400">Workflow Automation</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1  p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
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
          className="flex w-full items-center cursor-pointer gap-3 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
          <FiLogOut className="h-5 w-5" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
