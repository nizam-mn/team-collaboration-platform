import api from "./axios";

export const getTasks = (projectId: string) =>
  api.get(`/tasks/${projectId}`);

export const createTask = (projectId: string, data: any) =>
  api.post(`/tasks/${projectId}`, data);

export const updateTaskStatus = (taskId: string, status: string) =>
  api.patch(`/tasks/${taskId}/status`, { status });

export const deleteTask = (taskId: string) =>
  api.delete(`/tasks/${taskId}`);