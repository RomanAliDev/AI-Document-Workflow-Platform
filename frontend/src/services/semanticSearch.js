import api from "./api";

export const semanticSearch = async (question) => {
  const response = await api.post("/api/v1/chat/", null, {
    params: {
      question,
    },
  });

  return response.data;
};
