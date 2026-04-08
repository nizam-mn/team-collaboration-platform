import { createContext, useContext, useEffect, useState } from "react";

import type { ReactNode } from "react";
import api from "../api/axios";

type AuthContextType = {
	isAuthenticated: boolean;
	loading: boolean;
	user: { sub: string; email: string; username: string } | null;
	authCheck: () => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<{ sub: string; email: string; username: string } | null>(null);

	const checkAuth = async () => {
		try {
			const res = await api.get("/auth/me");
			setIsAuthenticated(true);
			setUser(res.data);
		} catch {
			setIsAuthenticated(false);
			setUser(null);
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

	const logout = async () => {
		try {
			await api.post("/auth/logout");
		} catch {
			// ignore errors
		} finally {
			setIsAuthenticated(false);
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, loading, user, authCheck, logout }}>
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
