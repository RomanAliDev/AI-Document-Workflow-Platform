import { useState } from "react";

const DocumentFilters = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  return (
    <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
          />
        </div>

        {/* Document Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Document Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500">
            <option value="All">All Types</option>
            <option value="Invoice">Invoice</option>
            <option value="Purchase Order">Purchase Order</option>
            <option value="Goods Receipt">Goods Receipt</option>
            <option value="Contract">Contract</option>
            <option value="Financial Report">Financial Report</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500">
            <option value="All">All Status</option>
            <option value="Uploaded">Uploaded</option>
            <option value="Processing">Processing</option>
            <option value="Processed">Processed</option>
            <option value="Manual Review">Manual Review</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilters;
