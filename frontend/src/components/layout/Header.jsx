import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          AI Document Workflow Platform
        </h2>

        <p className="text-xs text-gray-500">
          Intelligent document processing and insights
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{user?.email}</p>

        <p className="text-xs text-gray-500">{user?.role}</p>
      </div>
    </header>
  );
};

export default Header;
