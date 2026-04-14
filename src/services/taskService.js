import apiClient from "./apiClient";

export const getTasks = async () => {
  const response = await apiClient.get("/tasks");
  return response.data;
};

export const createTask = async (payload) => {
  const response = await apiClient.post("/tasks", payload);
  return response.data;
};

export const updateTask = async (id, payload) => {
  const response = await apiClient.put(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};
