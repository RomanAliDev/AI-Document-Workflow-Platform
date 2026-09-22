import api from "./api";

export const getAnalytics = async () => {
  const response = await api.get("/api/v1/analytics/");

  return response.data;
};
