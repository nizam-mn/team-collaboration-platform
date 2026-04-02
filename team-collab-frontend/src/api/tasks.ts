import api from "./axios";

export const getTasks = (projectId: number) =>
  api.get(`/tasks/${projectId}`);

export const createTask = (projectId: number, data: any) =>
  api.post(`/tasks/${projectId}`, data);

export const updateTaskStatus = (taskId: number, status: string) =>
  api.patch(`/tasks/${taskId}/status`, { status });

export const deleteTask = (taskId: number) =>
  api.delete(`/tasks/${taskId}`);