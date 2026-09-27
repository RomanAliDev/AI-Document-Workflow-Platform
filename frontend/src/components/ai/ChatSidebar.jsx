const ChatSidebar = ({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  showSidebar,
  onCloseSidebar,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {showSidebar && (
        <button
          type="button"
          onClick={onCloseSidebar}
          className="absolute inset-0 z-20 bg-black/30 md:hidden cursor-pointer"
          aria-label="Close sidebar"
        />
      )}

      <div
        className={`absolute inset-y-0 left-0 z-30  flex w-60 flex-col border-r bg-gray-50 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        {/* New Chat */}
        <div className="border-b p-4">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
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
                className={`group mb-1 flex items-center rounded-lg bg-gray-200 ${
                  activeChatId === chat.id ? "bg-gray-200" : "hover:bg-gray-100"
                }`}>
                {/* Chat Title */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectChat(chat.id);
                    onCloseSidebar();
                  }}
                  className="flex-1 cursor-pointer truncate px-3 py-3 text-left text-sm text-gray-700">
                  {chat.title}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteChat(chat.id)}
                  className="mr-2 hidden cursor-pointer rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 group-hover:block md:block">
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
