const ChatSidebar = ({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  return (
    <div className="flex w-60 flex-col border-r bg-gray-50">
      {/* New Chat */}
      <div className="border-b p-4">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full rounded-lg bg-blue-600  px-4 py-2 cursor-pointer text-sm font-medium text-white hover:bg-gray-800">
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">No conversations yet.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`group mb-1 bg-gray-200 flex items-center rounded-lg ${
                activeChatId === chat.id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}>
              {/* Chat Title */}
              <button
                type="button"
                onClick={() => onSelectChat(chat.id)}
                className="flex-1 truncate px-3 py-3 text-left text-sm text-gray-700 cursor-pointer">
                {chat.title}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDeleteChat(chat.id)}
                className="mr-2 hidden rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 cursor-pointer group-hover:block">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
