import api from "./api";

export const loginUser = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/api/v1/auth/me");

  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/api/v1/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });

  return response.data;
};
