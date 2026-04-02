import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../api/projects";
import Tasks from "../components/Tasks";
import Notes from "../components/Notes";

export default function Project() {
	const { id } = useParams();
	const [project, setProject] = useState<any>(null);

	const fetchProject = async () => {
		const data = await getProjectById(Number(id));
		setProject(data);
	};

	useEffect(() => {
		fetchProject();
	}, []);

	if (!project) return <div>Loading...</div>;

	return (
		<div className="min-h-screen px-6 py-8">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-gray-900">
						{project.name}
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Created: {new Date(project.createdAt).toLocaleString()}
					</p>
				</div>

				{/* Tasks */}
				<div className="mb-10">
					<Tasks projectId={project.id} />
				</div>

				{/* Notes */}
				<div>
					<Notes projectId={project.id} />
				</div>
			</div>
		</div>
	);
}
