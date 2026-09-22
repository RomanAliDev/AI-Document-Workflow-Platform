import { useState } from "react";

import UploadDocument from "../../components/documents/UploadDocument";
import DocumentTable from "../../components/documents/DocumentTable";

const Documents = () => {
  const [refresh, setRefresh] = useState(0);

  const handleUploadSuccess = () => {
    setRefresh((previous) => previous + 1);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and process your documents
          </p>
        </div>

        <UploadDocument onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* <DocumentFilters /> */}

      <DocumentTable refresh={refresh} />
    </div>
  );
};

export default Documents;
