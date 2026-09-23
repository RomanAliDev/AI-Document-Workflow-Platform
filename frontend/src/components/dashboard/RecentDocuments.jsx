import { useEffect, useState } from "react";
import { getDocuments } from "../../services/documentService";

const RecentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await getDocuments();

        // Show only the 5 most recent documents
        setDocuments(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to load recent documents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB", {
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
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

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
            {loading ? (
              <tr>
                <td colSpan="4" className="px-5 py-6 text-center text-gray-500">
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-5 py-6 text-center text-gray-500">
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((document) => (
                <tr
                  key={document.id}
                  className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {document.filename}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {document.file_type || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        document.status === "processed"
                          ? "bg-green-100 text-green-700"
                          : document.status === "pending" ||
                              document.status === "processing" ||
                              document.status === "uploaded"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}>
                      {formatStatus(document.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(document.uploaded_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDocuments;
