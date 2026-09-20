import { useState } from "react";
import { uploadDocument } from "../../services/documentService";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await uploadDocument(file);

      setMessage(data.message || "Document uploaded successfully.");

      setFile(null);
    } catch (error) {
      setError(error.response?.data?.detail || "Document upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="document-upload"
        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
        Select Document
      </label>

      <input
        id="document-upload"
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.png,.jpg,.jpeg,.tiff,.tif"
        className="hidden"
      />

      {file && (
        <div className="mt-4 rounded-lg border bg-white p-7">
          <p className="text-sm font-medium text-gray-900">Selected File</p>

          <p className="mt-1 text-sm text-gray-500">{file.name}</p>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-3 rounded-lg bg-green-600 px-4 py-2 cursor-pointer text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default UploadDocument;
