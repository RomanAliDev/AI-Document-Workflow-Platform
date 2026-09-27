import { Send } from "lucide-react";

const ChatInput = ({ question, setQuestion, handleSend, loading }) => {
  return (
    <div className="border-t bg-white p-2 sm:p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 p-1.5 sm:gap-3 sm:p-2">
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
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none sm:px-3"
        />

        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10">
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
