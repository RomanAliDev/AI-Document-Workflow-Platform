import api from "./api";

export const getDepartments = async () => {
  const response = await api.get("/api/v1/departments/");
  return response.data;
};

export const createDepartment = async (departmentData) => {
  const response = await api.post("/api/v1/departments/", departmentData);

  return response.data;
};

export const deleteDepartment = async (departmentId) => {
  const response = await api.delete(`/api/v1/departments/${departmentId}`);

  return response.data;
};
