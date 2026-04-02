import api from "./axios";

export const signup = (data: { username: string, email: string; password: string }) =>
	api.post("/auth/signup", data);

export const login = (data: { email: string; password: string }) =>
	api.post("/auth/login", data);

export const logout = () => api.post("/auth/logout"); 