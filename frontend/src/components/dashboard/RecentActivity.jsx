const RecentActivity = () => {
  const activities = [
    {
      action: "Document processed",
      document: "Invoice_001.pdf",
      time: "10 minutes ago",
    },
    {
      action: "Document uploaded",
      document: "Financial_Report.xlsx",
      time: "30 minutes ago",
    },
    {
      action: "Manual review required",
      document: "Contract_ABC.pdf",
      time: "1 hour ago",
    },
    {
      action: "Document processed",
      document: "Purchase_Order_12.pdf",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="mt-6 rounded-xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest document workflow activities
        </p>
      </div>

      <div className="divide-y">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {activity.action}
              </p>

              <p className="mt-1 text-sm text-gray-500">{activity.document}</p>
            </div>

            <span className="text-xs text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
