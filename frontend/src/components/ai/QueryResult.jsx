const QueryResult = ({ result }) => {
  if (!result || result.length === 0) {
    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500">
        No results found.
      </div>
    );
  }

  const columns = Object.keys(result[0]);

  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 font-semibold text-gray-700">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {result.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {columns.map((column) => (
                <td key={column} className="px-4 py-3 text-gray-600">
                  {String(row[column] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueryResult;
