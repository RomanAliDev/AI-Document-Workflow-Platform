import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      console.error(
        "Backend Error:",
        error.response.data?.detail ||
          error.response.data?.message ||
          "Unknown backend error",
      );
    } else if (error.request) {
      console.error("No response from backend:", error.message);
    } else {
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
