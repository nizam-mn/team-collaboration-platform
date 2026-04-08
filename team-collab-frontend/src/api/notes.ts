import api from "./axios";

export const getNotes = (projectId: string) =>
  api.get(`/notes/${projectId}`);

export const createNote = (projectId: string, content: string) =>
  api.post(`/notes/${projectId}`, { content });

export const updateNote = (id: string, content: string) =>
  api.patch(`/notes/${id}`, { content });

export const deleteNote = (id: string) =>
  api.delete(`/notes/${id}`);