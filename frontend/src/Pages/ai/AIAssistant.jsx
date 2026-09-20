import { useEffect, useState } from "react";
import { sendChatMessage, getChatHistory } from "../../services/chat";
import { Send } from "lucide-react";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getChatHistory();

        const formattedHistory = [];

        history.reverse().forEach((chat) => {
          formattedHistory.push({
            role: "user",
            content: chat.question,
          });

          formattedHistory.push({
            role: "assistant",
            content: chat.answer,
          });
        });

        setMessages(formattedHistory);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    loadChatHistory();
  }, []);

  const handleSend = async () => {
    if (!question.trim() || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);

    const currentQuestion = question;

    setQuestion("");
    setLoading(true);

    try {
      const data = await sendChatMessage(currentQuestion);

      const assistantMessage = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chat request failed:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content:
            error.response?.data?.detail ||
            error.message ||
            "Something Went Wrong...",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>

        <p className="mt-1 text-sm text-gray-500">
          Ask questions about your financial documents and data
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                How can I help you?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Ask a question about your documents or financial data.
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}>
            <div
              className={`max-w-2xl rounded-xl px-4 py-3 text-sm ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}>
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-3">
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
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSend}
            disabled={loading || !question.trim()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <span className="text-sm">Sending...</span>
            ) : (
              <Send size={18} className="-rotate-45" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
