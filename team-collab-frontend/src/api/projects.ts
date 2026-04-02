import api from "./axios";

// ✅ Get all projects (user-specific)
export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const getProjectById = async (id: number) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

// ✅ Create project
export const createProject = async (name: string) => {
  const res = await api.post("/projects", { name });
  return res.data;
};

// ✅ Delete project (optional for later)
export const deleteProject = async (id: number) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};