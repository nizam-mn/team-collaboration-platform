import api from "./axios";

export const getNotes = (projectId: number) =>
  api.get(`/notes/${projectId}`);

export const createNote = (projectId: number, content: string) =>
  api.post(`/notes/${projectId}`, { content });

export const updateNote = (id: number, content: string) =>
  api.patch(`/notes/${id}`, { content });

export const deleteNote = (id: number) =>
  api.delete(`/notes/${id}`);