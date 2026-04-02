import { createContext, useContext, useEffect, useState } from "react";

import type { ReactNode } from "react";
import api from "../api/axios";

type AuthContextType = {
	isAuthenticated: boolean;
	loading: boolean;
	authCheck: () => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	const checkAuth = async () => {
		try {
			await api.get("/projects");
			setIsAuthenticated(true);
		} catch {
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	// ✅ Run on app start
	useEffect(() => {
		checkAuth();
	}, []);

	
	const authCheck = async () => {
		await checkAuth(); // re-validate with backend
	};

	// ✅ Logout
	const logout = async () => {
		try {
			await api.post("/auth/logout");
		} catch {
			// ignore errors
		} finally {
			setIsAuthenticated(false);
		}
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, loading, authCheck, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

// ✅ Hook
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
}
