import api from "./api";

export const sendChatMessage = async (question, chatId) => {
  const response = await api.post("/api/v1/chat/", null, {
    params: {
      question,
      session_id: chatId,
    },
  });

  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get("/api/v1/chat/history");

  return response.data;
};

export const createChat = async () => {
  const response = await api.post("/api/v1/chat/sessions");

  return response.data;
};

export const getChats = async () => {
  const response = await api.get("/api/v1/chat/sessions");

  return response.data;
};

export const getChatMessages = async (chatId) => {
  const response = await api.get(`/api/v1/chat/sessions/${chatId}`);

  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/api/v1/chat/sessions/${chatId}`);

  return response.data;
};
