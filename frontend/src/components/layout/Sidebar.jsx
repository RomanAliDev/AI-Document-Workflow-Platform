import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Documents",
      path: "/documents",
    },
    {
      name: "AI Assistant",
      path: "/ai",
    },
    {
      name: "Semantic Search",
      path: "/search",
    },
  ];

  if (user?.role === "SUPERADMIN") {
    menuItems.push(
      {
        name: "Analytics",
        path: "/analytics",
      },
      {
        name: "Users",
        path: "/users",
      },
      {
        name: "Departments",
        path: "/departments",
      },
    );
  }

  menuItems.push(
    {
      name: "Settings",
      path: "/settings",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  );

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold text-gray-900">
          AI Document Platform
        </h1>

        <p className="mt-1 text-xs text-gray-500">Workflow Automation</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="border-t p-4">
        <div className="mb-3">
          <p className="truncate text-sm font-medium text-gray-900">
            {user?.email}
          </p>

          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>

        <button
          onClick={logout}
          className="w-full rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
