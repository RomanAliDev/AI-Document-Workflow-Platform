import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/api/v1/users");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/api/v1/users", userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/v1/users/${userId}`);
  return response.data;
};
