import { useEffect, useState } from "react";
import { getDocuments } from "../../services/documentService";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const documents = await getDocuments();

        const recentActivities = [...documents]
          .filter((document) => document.uploaded_at)
          .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
          .slice(0, 5)
          .map((document) => {
            let action = "Document uploaded";

            switch (document.status) {
              case "processed":
                action = "Document processed";
                break;

              case "processing":
                action = "Document processing";
                break;

              case "manual_review":
                action = "Manual review required";
                break;

              case "failed":
                action = "Document processing failed";
                break;

              case "pending":
                action = "Document pending";
                break;

              case "uploaded":
                action = "Document uploaded";
                break;

              default:
                action = "Document activity";
            }

            return {
              id: document.id,
              action,
              document: document.filename,
              type: document.file_type,
              status: document.status,
              time: formatTimeAgo(document.uploaded_at),
            };
          });

        setActivities(recentActivities);
      } catch (error) {
        console.error("Failed to load recent activities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const formatTimeAgo = (date) => {
    if (!date) {
      return "-";
    }

    const uploadedTime = new Date(date);

    if (Number.isNaN(uploadedTime.getTime())) {
      return "-";
    }

    const currentTime = new Date();

    const difference = currentTime.getTime() - uploadedTime.getTime();

    const minutes = Math.floor(difference / (1000 * 60));

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    return uploadedTime.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="mt-6 rounded-xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest document workflow activities
        </p>
      </div>

      <div className="divide-y">
        {loading ? (
          <div className="px-5 py-6 text-center text-sm text-gray-500">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-gray-500">
            No recent activity.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {activity.document}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {activity.type ? activity.type.toUpperCase() : "-"} •{" "}
                  {formatStatus(activity.status)}
                </p>
              </div>

              <span className="shrink-0 text-xs text-gray-400">
                {activity.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
