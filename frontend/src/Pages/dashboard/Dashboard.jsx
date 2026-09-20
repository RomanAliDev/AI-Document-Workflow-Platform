import StatCard from "../../components/dashboard/StatCard";
import RecentDocuments from "../../components/dashboard/RecentDocuments";
import RecentActivity from "../../components/dashboard/RecentActivity";

const Dashboard = () => {
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
          value="124"
          description="Documents uploaded"
        />

        <StatCard
          title="Processed"
          value="98"
          description="Successfully processed"
        />

        <StatCard
          title="Pending"
          value="18"
          description="Waiting for processing"
        />

        <StatCard
          title="Manual Review"
          value="8"
          description="Requires attention"
        />
      </div>

      <RecentDocuments />
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
