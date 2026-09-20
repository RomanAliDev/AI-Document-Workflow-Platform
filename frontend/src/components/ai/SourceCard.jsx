const SourceCard = ({ source }) => {
  return (
    <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-1 text-xs font-semibold text-gray-500">
        Document {source.document_id}
      </div>

      <p className="text-sm text-gray-700">{source.content}</p>
    </div>
  );
};

export default SourceCard;
