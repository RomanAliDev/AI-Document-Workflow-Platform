const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-xl px-4 py-3 text-sm ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        }`}>
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
