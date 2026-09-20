import api from "./api";

export const loginUser = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", {
    email,
    password,
  });

  return response.data;
};
