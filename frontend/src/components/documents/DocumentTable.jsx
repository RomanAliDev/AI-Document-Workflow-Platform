import { useEffect, useState } from "react";
import { getDocuments } from "../../services/documentService";
import api from "../../services/api";
import { getUsers } from "../../services/users";

const DocumentTable = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isSuperAdmin = currentUser?.role?.toLowerCase() === "superadmin";

  const loadData = async () => {
    try {
      const documentsData = await getDocuments();

      setDocuments(documentsData);

      if (isSuperAdmin) {
        const usersData = await getUsers();
        setUsers(usersData);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleView = async (documentId) => {
    try {
      const response = await api.get(`/api/v1/documents/${documentId}/view`, {
        responseType: "blob",
      });

      const fileUrl = window.URL.createObjectURL(response.data);

      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Failed to view document:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

              {isSuperAdmin && (
                <th className="px-5 py-3 font-medium text-gray-600">
                  Uploaded By
                </th>
              )}

              <th className="px-5 py-3 font-medium text-gray-600">Date</th>

              <th className="px-5 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={isSuperAdmin ? 6 : 5}
                  className="px-5 py-8 text-center text-gray-500">
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td
                  colSpan={isSuperAdmin ? 6 : 5}
                  className="px-5 py-8 text-center text-gray-500">
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
                    {document.file_type}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        document.status === "processed"
                          ? "bg-green-100 text-green-700"
                          : document.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {document.status}
                    </span>
                  </td>

                  {isSuperAdmin && (
                    <td className="px-5 py-4 text-gray-600">
                      {users.find((user) => user.id === document.uploaded_by)
                        ?.full_name || "-"}
                    </td>
                  )}

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(document.uploaded_at)}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleView(document.id)}
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                      View
                    </button>
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

export default DocumentTable;
