import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import {
  createChat,
  getChats,
  getChatMessages,
  deleteChat,
  sendChatMessage,
} from "../../services/chat";

import ChatSidebar from "../../components/ai/ChatSidebar";
import ChatWindow from "../../components/ai/ChatWindow";
import ChatInput from "../../components/ai/ChatInput";

const AIAssistant = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Load chats for sidebar only
  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatList = await getChats();

        setChats(chatList);

        // Always start with a blank conversation
        setActiveChatId(null);
        setMessages([]);
        setQuestion("");
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    // Reset chat UI when page opens
    setActiveChatId(null);
    setMessages([]);
    setQuestion("");

    loadChats();
  }, []);

  // Format backend messages
  const formatMessages = (history) => {
    const formattedMessages = [];

    history.forEach((chat) => {
      formattedMessages.push({
        role: "user",
        content: chat.question,
      });

      formattedMessages.push({
        role: "assistant",
        content: chat.answer,
        route: chat.route,
        sources: chat.sources || [],
        results: chat.results || [],
      });
    });

    setMessages(formattedMessages);
  };

  // Start blank chat
  // Do NOT create database session here
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setQuestion("");
  };

  // Open existing chat
  const handleSelectChat = async (chatId) => {
    try {
      setLoading(true);

      setActiveChatId(chatId);
      setMessages([]);
      setQuestion("");

      const data = await getChatMessages(chatId);

      formatMessages(data.messages);
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete chat
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);

      setChats((previousChats) =>
        previousChats.filter((chat) => chat.id !== chatId),
      );

      // Clear main area if deleted chat was active
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
        setQuestion("");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!question.trim() || loading) {
      return;
    }

    const currentQuestion = question.trim();

    setQuestion("");
    setLoading(true);

    try {
      let chatId = activeChatId;

      /*
        If no chat is active, create the database session
        only when the user actually sends a question.
      */
      if (!chatId) {
        const newChat = await createChat();

        chatId = newChat.id;

        setActiveChatId(chatId);

        setChats((previousChats) => [newChat, ...previousChats]);
      }

      // Add user message immediately
      const userMessage = {
        role: "user",
        content: currentQuestion,
      };

      setMessages((previousMessages) => [...previousMessages, userMessage]);

      // Send question to backend
      const data = await sendChatMessage(currentQuestion, chatId);

      // Add assistant response
      const assistantMessage = {
        role: "assistant",
        content: data.answer,
        route: data.route,
        sources: data.sources || [],
        results: data.results || [],
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      // Refresh sidebar
      const updatedChats = await getChats();

      setChats(updatedChats);
    } catch (error) {
      console.error("Chat request failed:", error);

      const errorMessage = {
        role: "assistant",
        content:
          error.response?.data?.detail ||
          error.message ||
          "Something went wrong.",
      };

      setMessages((previousMessages) => [...previousMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-7rem)] overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        showSidebar={showSidebar}
        onCloseSidebar={() => setShowSidebar(false)}
      />

      {/* Main Chat */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden">
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
              AI Assistant
            </h1>

            <p className="mt-1 hidden text-sm text-gray-500 sm:block">
              Ask questions about your financial documents and data
            </p>
          </div>
        </div>

        {/* Messages */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Input */}
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          handleSend={handleSend}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AIAssistant;
