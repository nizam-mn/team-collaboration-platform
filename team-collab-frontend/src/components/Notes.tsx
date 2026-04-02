import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote, updateNote } from "../api/notes";

export default function Notes({ projectId }: any) {
	const [notes, setNotes] = useState<any[]>([]);
	const [content, setContent] = useState("");

	const [showCreateCard, setShowCreateCard] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editContent, setEditContent] = useState("");

	const fetchNotes = async () => {
		const res = await getNotes(projectId);
		setNotes(res.data);
	};

	const handleCreate = async () => {
		if (!content.trim()) return;

		await createNote(projectId, content);
		setContent("");
		fetchNotes();
	};

	const handleDelete = async (id: number) => {
		await deleteNote(id);
		fetchNotes();
	};

	const startEdit = (note: any) => {
		setEditingId(note.id);
		setEditContent(note.content);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditContent("");
	};

	const handleUpdate = async (id: number) => {
		if (!editContent.trim()) return;

		await updateNote(id, editContent);
		setEditingId(null);
		setEditContent("");
		fetchNotes();
	};

	useEffect(() => {
		fetchNotes();
	}, []);

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between mb-4" >
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                <button
                onClick={() => setShowCreateCard((prev) => !prev)}
                    className="bg-gray-900 w-fit text-white px-5 self-end py-2 rounded"
                >
                    {showCreateCard ? "Close" : "Add Notes"}
                </button>
            </div>

			{/* Create */}
			{showCreateCard &&  <div className="flex items-start gap-3 mb-5">
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Write a new note..."
					className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
				/>
				<button
					onClick={handleCreate}
					className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium"
				>
					Add
				</button>
			</div>}

			{/* Empty State */}
			{notes.length === 0 && (
				<div className="text-center text-gray-500 py-6 border border-dashed rounded-lg">
					No notes yet.
				</div>
			)}

			{/* List */}
			<div className="space-y-3">
				{notes.map((n) => (
					<div
						key={n.id}
						className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
					>
						{editingId === n.id ? (
							// ✏️ EDIT MODE
							<div className="flex gap-2">
								<input
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
								/>

								<button
									onClick={() => handleUpdate(n.id)}
									className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm"
								>
									Save
								</button>

								<button
									onClick={cancelEdit}
									className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
								>
									Cancel
								</button>
							</div>
						) : (
							<>
								{/* Content */}
								<p className="text-gray-900 font-medium">{n.content}</p>

								{/* Meta */}
								<p className="text-xs text-gray-500 mt-1">
									{new Date(n.createdAt).toLocaleDateString("en-IN", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</p>

								{/* Actions */}
								<div className="flex gap-2 mt-3">
									<button
										onClick={() => startEdit(n)}
										className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition"
									>
										Edit
									</button>

									<button
										onClick={() => handleDelete(n.id)}
										className="text-sm px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
									>
										Delete
									</button>
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
