import api from "./api";

export const semanticSearch = async (question) => {
  const response = await api.post("/api/v1/semantic-search/", null, {
    params: {
      question,
    },
  });

  return response.data;
};
