import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, deleteProject, getProjects } from "../api/projects";
import { FiTrash2 } from "react-icons/fi";

export default function Dashboard() {
	const [projects, setProjects] = useState<any[]>([]);
	const [name, setName] = useState("");
	const navigate = useNavigate();

	const [showCreateCard, setShowCreateCard] = useState(false);

	const fetchProjects = async () => {
		try {
			const res = await getProjects();
			setProjects(res);
		} catch {
			console.error("Failed to fetch projects");
		}
	};

	const handleCreate = async () => {
		if (!name.trim()) return;

		try {
			await createProject(name);
			setName("");
			fetchProjects();
		} catch {
			alert("Failed to create project");
		}
	};

	const handleDelete = async (id: number) => {
		await deleteProject(id);
		fetchProjects();
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<div className="min-h-scree px-6 py-10">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
						{/* <p className="text-gray-500 text-sm mt-1">
							Manage your projects and tasks
						</p> */}
					</div>
				</div>
				
				{/* Projects Section */}
				<div>
					<div className="flex items-center justify-between  mb-4" >
						<h2 className="text-lg font-semibold text-gray-800">
							Your Projects
						</h2>
						<button
							onClick={() => setShowCreateCard((prev) => !prev)}
							className="bg-gray-700 text-white px-5 py-1.5 rounded-md hover:bg-gray-800 transition font-medium"
						>
							{showCreateCard ? "Close" : "Create Project"}
						</button>
					</div>

                    {showCreateCard && (
					<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-8">
                        <h2 className="text-base mb-4 font-semibold text-gray-800">
							Create Project
						</h2>
						<div className="flex gap-3">
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter project name..."
								className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
							/>
							<button
								onClick={handleCreate}
								className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition font-medium"
							>
								Create
							</button>
						</div>
					</div>
				)}

					{projects.length === 0 ? (
						<div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
							No projects yet. Create your first project
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{projects.map((p) => (
								<div
									key={p.id}
									onClick={() => navigate(`/project/${p.id}`)}
									className="flex justify-between bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
								>
									<div>
										<h3 className="text-lg font-medium text-gray-900">
											{p.name}
										</h3>

										<p className="text-sm text-gray-500 mt-2">
											Created:{" "}
											{new Date(p.createdAt).toLocaleDateString("en-IN", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</p>
									</div>
									<div>
										<button onClick={() => handleDelete(p.id)}>
											<FiTrash2 color="red" />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
