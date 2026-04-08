import { useEffect, useState } from "react";
import {
	getTasks,
	createTask,
	updateTaskStatus,
	deleteTask,
} from "../api/tasks";

export default function Tasks({ projectId }: any) {
	const getTodayDate = () => new Date().toISOString().split("T")[0];

	const [tasks, setTasks] = useState<any[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState(getTodayDate());
	const [showCreateCard, setShowCreateCard] = useState(false);
	// const [draggedTask, setDraggedTask] = useState<any>(null);

	const fetchTasks = async () => {
		const res = await getTasks(projectId);
		setTasks(res.data);
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	const handleCreate = async () => {
		if (!title.trim()) return;

		await createTask(projectId, {
			title,
			description,
			status: "todo",
			dueDate,
		});

		setTitle("");
		setDescription("");
		setDueDate(getTodayDate());
		fetchTasks();
	};

	const handleStatus = async (id: string, status: string) => {
		await updateTaskStatus(id, status);
		fetchTasks();
	};

	const handleDelete = async (id: string) => {
		await deleteTask(id);
		fetchTasks();
	};

	// 🔥 group tasks
	const grouped = {
		todo: tasks.filter((t) => t.status === "todo"),
		in_progress: tasks.filter((t) => t.status === "in_progress"),
		done: tasks.filter((t) => t.status === "done"),
	};

	const Column = ({ title, items, status }: any) => {
		const [isOver, setIsOver] = useState(false);

		const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsOver(false);

			try {
				const raw = e.dataTransfer.getData("application/json");
				if (!raw) return;

				const data = JSON.parse(raw);

				if (!data?.id) return;

				// Avoid unnecessary API call
				if (data.status === status) return;

				// ✅ Optimistic UI update
				setTasks((prev) =>
					prev.map((task) =>
						task.id === data.id ? { ...task, status } : task,
					),
				);

				// ✅ Persist change
				await updateTaskStatus(data.id, status);
			} catch (err) {
				console.error("Drop error:", err);
			}
		};

		return (
			<div
				className={`flex-1 rounded-xl p-4 shadow-sm border transition ${
					isOver ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"
				}`}
				onDragOver={(e) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = "move";
					setIsOver(true);
				}}
				onDragLeave={() => setIsOver(false)}
				onDrop={handleDrop}
			>
				<h3 className="font-semibold text-gray-800 mb-4">{title}</h3>

				<div className="space-y-3">
					{items.map((t: any) => (
						<div
							key={t.id}
							draggable
							onDragStart={(e) => {
								e.dataTransfer.setData(
									"application/json",
									JSON.stringify({
										id: t.id,
										status: t.status,
									}),
								);
								e.dataTransfer.effectAllowed = "move";
							}}
							className="p-3 border rounded-lg hover:shadow-sm transition cursor-grab active:cursor-grabbing bg-white"
						>
							<p className="font-medium">{t.title}</p>

							<p className="text-sm text-gray-500">{t.description}</p>

							<p className="text-xs text-gray-400 mt-2">
								Due: {new Date(t.dueDate).toLocaleDateString("en-IN")}
							</p>

							<div className="flex gap-2 mt-3">
								{status !== "todo" && (
									<button
										onClick={() => handleStatus(t.id, "todo")}
										className="text-xs px-2 py-1 bg-gray-200 rounded"
									>
										Todo
									</button>
								)}

								{status !== "in_progress" && (
									<button
										onClick={() => handleStatus(t.id, "in_progress")}
										className="text-xs px-2 py-1 bg-blue-100 rounded"
									>
										Progress
									</button>
								)}

								{status !== "done" && (
									<button
										onClick={() => handleStatus(t.id, "done")}
										className="text-xs px-2 py-1 bg-green-100 rounded"
									>
										Done
									</button>
								)}

								<button
									onClick={() => handleDelete(t.id)}
									className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded ml-auto"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold mb-4">Tasks</h2>
				<button
					onClick={() => setShowCreateCard((prev) => !prev)}
					className="bg-gray-900 w-fit text-white px-5 self-end py-2 rounded"
				>
					{showCreateCard ? "Close" : "Add Tasks"}
				</button>
			</div>

			{/* Create Task */}
			{showCreateCard && (
				<div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 mb-6">
					<div className="flex justify-self-start gap-3">
						<div>
							<p>Title</p>
							<input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Task title"
								className="border w-min p-2 rounded"
							/>
						</div>

						<div>
							<p>Due date</p>
							<input
								type="date"
								value={dueDate}
								min={getTodayDate()}
								onChange={(e) => setDueDate(e.target.value)}
								className="border p-2 rounded"
								placeholder="Due date"
							/>
						</div>
					</div>

					<div>
						<p>Description</p>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Description"
							className="flex-1 w-full border p-2 rounded"
						/>
					</div>

					<button
						onClick={handleCreate}
						className="bg-gray-900 w-fit text-white px-10 self-end py-2 rounded"
					>
						Add
					</button>
				</div>
			)}

			{/* Kanban */}
			<div className="flex gap-4">
				<Column title="Todo" items={grouped.todo} status="todo" />
				<Column
					title="In Progress"
					items={grouped.in_progress}
					status="in_progress"
				/>
				<Column title="Done" items={grouped.done} status="done" />
			</div>
		</div>
	);
}
