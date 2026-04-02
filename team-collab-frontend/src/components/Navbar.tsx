import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const navigate = useNavigate();
	const { isAuthenticated, authCheck } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
            await authCheck();
		} catch (err) {
			console.error("Logout failed:", err);
		} finally {
			navigate("/");
		}
	};

	return (
		<nav className="flex items-center justify-between py-4">
			<div className="text-2xl font-bold text-gray-900">Kantion</div>

			<button
				onClick={isAuthenticated ? handleLogout : () => navigate("/auth")}
				className="bg-gray-700 text-white px-5 py-1.5 rounded-md hover:bg-gray-800 transition font-medium"
			>
				{isAuthenticated ? "Logout" : "Login"}
			</button>
		</nav>
	);
}
