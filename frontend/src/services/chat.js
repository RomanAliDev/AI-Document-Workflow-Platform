import api from "./api";

export const sendChatMessage = async (question) => {
  const response = await api.post("/api/v1/chat/", null, {
    params: {
      question,
    },
  });

  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get("/api/v1/chat/history");

  return response.data;
};
