const RecentDocuments = () => {
  const documents = [
    {
      name: "Invoice_001.pdf",
      type: "Invoice",
      status: "Processed",
      date: "Sep 18, 2026",
    },
    {
      name: "Purchase_Order_12.pdf",
      type: "Purchase Order",
      status: "Processed",
      date: "Sep 17, 2026",
    },
    {
      name: "Financial_Report.xlsx",
      type: "Financial Report",
      status: "Pending",
      date: "Sep 17, 2026",
    },
    {
      name: "Contract_ABC.pdf",
      type: "Contract",
      status: "Manual Review",
      date: "Sep 16, 2026",
    },
  ];

  return (
    <div className="mt-6 rounded-xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Documents
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Recently uploaded documents
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 font-medium">Document</th>

              <th className="px-5 py-3 font-medium">Type</th>

              <th className="px-5 py-3 font-medium">Status</th>

              <th className="px-5 py-3 font-medium">Uploaded</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => (
              <tr
                key={document.name}
                className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">
                  {document.name}
                </td>

                <td className="px-5 py-4 text-gray-600">{document.type}</td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      document.status === "Processed"
                        ? "bg-green-100 text-green-700"
                        : document.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                    {document.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">{document.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDocuments;
