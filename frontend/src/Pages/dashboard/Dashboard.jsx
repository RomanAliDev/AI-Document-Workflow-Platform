import { useEffect, useState } from "react";

import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

import StatCard from "../../components/dashboard/StatCard";
import RecentDocuments from "../../components/dashboard/RecentDocuments";
import RecentActivity from "../../components/dashboard/RecentActivity";

import { getAnalytics } from "../../services/analytics";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load dashboard analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your document workflow
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Documents"
          value={loading ? "..." : (analytics?.summary?.total_documents ?? 0)}
          description="Documents uploaded"
          icon={FiFileText}
          cardColor="bg-blue-50 border-blue-200"
          iconColor="bg-blue-500 text-white"
        />

        <StatCard
          title="Processed"
          value={
            loading ? "..." : (analytics?.summary?.processed_documents ?? 0)
          }
          description="Successfully processed"
          icon={FiCheckCircle}
          cardColor="bg-green-100 border-green-200"
          iconColor="bg-green-500 text-white"
        />

        <StatCard
          title="Pending"
          value={loading ? "..." : (analytics?.summary?.pending_documents ?? 0)}
          description="Waiting for processing"
          icon={FiClock}
          cardColor="bg-yellow-100 border-yellow-200"
          iconColor="bg-amber-500 text-white"
        />

        <StatCard
          title="Manual Review"
          value={loading ? "..." : (analytics?.summary?.failed_documents ?? 0)}
          description="Requires attention"
          icon={FiAlertCircle}
          cardColor="bg-red-50 border-red-200"
          iconColor="bg-red-500 text-white"
        />
      </div>

      <RecentDocuments />
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
