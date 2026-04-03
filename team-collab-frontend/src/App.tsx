import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";

function App() {
	return (
		<div className="w-5xl mx-auto p-4">
			<AuthProvider>
                <Navbar />
				<Routes>
					<Route
						path="/"
						element={
							<PublicRoute>
								<Auth />
							</PublicRoute>
						}
					/>
					<Route
						path="/auth"
						element={
							<PublicRoute>
								<Auth />
							</PublicRoute>
						}
					/>

					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/project/:id"
						element={
							<ProtectedRoute>
								<Project />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</div>
	);
}
export default App;
