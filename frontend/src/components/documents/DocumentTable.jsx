const DocumentTable = () => {
  const documents = [
    {
      id: 1,
      name: "Invoice_001.pdf",
      type: "Invoice",
      status: "Processed",
      uploadedBy: "Admin",
      date: "Sep 18, 2026",
    },
    {
      id: 2,
      name: "Purchase_Order_12.pdf",
      type: "Purchase Order",
      status: "Processed",
      uploadedBy: "Ali",
      date: "Sep 17, 2026",
    },
    {
      id: 3,
      name: "Financial_Report.xlsx",
      type: "Financial Report",
      status: "Processing",
      uploadedBy: "Admin",
      date: "Sep 17, 2026",
    },
    {
      id: 4,
      name: "Contract_ABC.pdf",
      type: "Contract",
      status: "Manual Review",
      uploadedBy: "Ali",
      date: "Sep 16, 2026",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>

        <p className="mt-1 text-sm text-gray-500">Manage uploaded documents</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-3 font-medium text-gray-600">Document</th>

              <th className="px-5 py-3 font-medium text-gray-600">Type</th>

              <th className="px-5 py-3 font-medium text-gray-600">Status</th>

              <th className="px-5 py-3 font-medium text-gray-600">
                Uploaded By
              </th>

              <th className="px-5 py-3 font-medium text-gray-600">Date</th>

              <th className="px-5 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => (
              <tr
                key={document.id}
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
                        : document.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {document.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {document.uploadedBy}
                </td>

                <td className="px-5 py-4 text-gray-600">{document.date}</td>

                <td className="px-5 py-4">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;
