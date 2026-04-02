import { useState } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const navigate = useNavigate();

	const { authCheck } = useAuth();

	const handleSubmit = async () => {
		try {
			await loginApi({ email, password }); // sets cookie

			await authCheck();

			navigate("/dashboard"); // ✅ navigate to dashboard
		} catch {
			alert("Login failed");
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<input
				className="bg-white p-3 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				className="bg-white p-3 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
				placeholder="Password"
				type="password"
				onChange={(e) => setPassword(e.target.value)}
			/>

			<button
				className="bg-gray-900 text-white px-3 py-2.5 rounded-md hover:bg-gray-900/92 transition font-medium focus:outline-none"
				onClick={handleSubmit}
			>
				Login
			</button>
		</div>
	);
}
