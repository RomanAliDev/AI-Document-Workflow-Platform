// import DocumentFilters from "../../components/documents/DocumentFilters";
import UploadDocument from "../../components/documents/UploadDocument";
import DocumentTable from "../../components/documents/DocumentTable";

const Documents = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and process your documents
          </p>
        </div>

        <UploadDocument />
      </div>

      {/* <DocumentFilters /> */}

      <DocumentTable />
    </div>
  );
};

export default Documents;
