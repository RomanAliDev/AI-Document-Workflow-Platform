import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages, loading }) => {
  return (
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
        <div key={index}>
          <MessageBubble message={message} />
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
  );
};

export default ChatWindow;
