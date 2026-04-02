import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			await signup({ username, email, password });

			alert("Signup successful");
            setEmail("");
            setPassword("");
            navigate("/dashboard");
		} catch {
			alert("Signup failed");
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<input
				className="bg-white p-3 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
				placeholder="Email"
				onChange={(e) => setUsername(e.target.value)}
			/>
			
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
