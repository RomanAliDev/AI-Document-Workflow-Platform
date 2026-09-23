import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";

import { getAnalytics } from "../services/analytics";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalytics();

        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics.", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-red-600">Failed to load analytics data.</p>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Documents",
      value: analytics.summary.total_documents,
      icon: FileText,
    },
    {
      title: "Processed",
      value: analytics.summary.processed_documents,
      icon: CheckCircle,
    },
    {
      title: "Pending",
      value: analytics.summary.pending_documents,
      icon: Clock,
    },
    {
      title: "Failed",
      value: analytics.summary.failed_documents,
      icon: XCircle,
    },
  ];

  const documentTypes = analytics.documents_by_type;
  const departments = analytics.documents_by_department;
  const successRate = analytics.success_rate;

  const totalDocuments = analytics.summary.total_documents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of document processing and system activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>

                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                    {card.value}
                  </h2>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <Icon size={20} className="text-blue-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing Overview */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />

          <h2 className="font-semibold text-gray-900">Processing Overview</h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Processing Success Rate</span>

            <span className="font-semibold text-gray-900">{successRate}%</span>
          </div>

          <div className="mt-2 h-4 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-400"
              style={{
                width: `${Math.min(successRate, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Document Types + Departments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Documents by Type */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Documents by Type</h2>

          {documentTypes.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">
              No document type data available.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {documentTypes.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>

                    <span className="font-medium text-gray-900">
                      {item.count}
                    </span>
                  </div>

                  <div className="mt-2 h-4 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-400"
                      style={{
                        width:
                          totalDocuments > 0
                            ? `${(item.count / totalDocuments) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents by Department */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Documents by Department
          </h2>

          {departments.length === 0 ? (
            <p className="mt-5 text-sm text-gray-500">
              No department data available.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {departments.map((department) => (
                <div
                  key={department.name}
                  className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    {department.name}
                  </span>

                  <span className="font-semibold text-blue-600">
                    {department.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
