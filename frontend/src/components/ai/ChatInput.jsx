import { Send } from "lucide-react";

const ChatInput = ({ question, setQuestion, handleSend, loading }) => {
  return (
    <div className="border-t bg-white p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 p-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask something..."
          className="flex-1 bg-transparent px-3 py-2 outline-none"
        />

        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? (
            <span className="text-xs">...</span>
          ) : (
            <Send size={18} className="rotate-45" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
