import { useState } from "react";
import { semanticSearch } from "../../services/semanticSearch";

const SemanticSearch = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!question.trim()) {
      return;
    }
    setQuestion("");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await semanticSearch(question.trim());

      setResult(data);
    } catch (error) {
      setError(error.response?.data?.detail || "Semantic search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Semantic Search</h1>

        <p className="mt-1 text-sm text-gray-500">
          Search your documents using natural language.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Ask something about your documents..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Answer</h2>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {result.answer}
            </p>
          </div>

          {result.sources?.length > 0 && (
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Sources</h2>

              <div className="mt-3 space-y-3">
                {result.sources.map((source) => (
                  <div
                    key={source.chunk_id}
                    className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500">
                      Document {source.document_id}
                    </p>

                    <p className="mt-2 text-sm text-gray-700">
                      {source.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
