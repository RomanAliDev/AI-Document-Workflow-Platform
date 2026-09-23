import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        <main className="flex-1 overflow-auto p-6 pt-30 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
