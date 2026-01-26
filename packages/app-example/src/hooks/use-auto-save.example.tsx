// Example implementation of auto-save functionality
// This demonstrates how the auto-save hook works with forms

import { useState } from "react";
import { useAutoSave } from "./use-auto-save";

export function AutoSaveExample() {
	const [formData, setFormData] = useState({ name: "", email: "" });
	const [originalData] = useState({ name: "", email: "" });
	const [isSaving, setIsSaving] = useState(false);

	// Check if data has changed
	const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

	// Simulate save function
	const saveData = async (data: typeof formData) => {
		setIsSaving(true);
		console.log("Auto-saving data:", data);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setIsSaving(false);
		console.log("Auto-save complete!");
	};

	// Use auto-save hook
	useAutoSave({
		data: formData,
		hasChanges,
		onSave: saveData,
		isPending: isSaving,
		debounceMs: 2000, // Save after 2 seconds of no changes
		enabled: true,
	});

	return (
		<div>
			<h2>Auto-Save Example</h2>
			<p>Changes will auto-save after 2 seconds of inactivity</p>

			<input
				type="text"
				placeholder="Name"
				value={formData.name}
				onChange={(e) =>
					setFormData((prev) => ({ ...prev, name: e.target.value }))
				}
			/>

			<input
				type="email"
				placeholder="Email"
				value={formData.email}
				onChange={(e) =>
					setFormData((prev) => ({ ...prev, email: e.target.value }))
				}
			/>

			<div>
				Status:{" "}
				{isSaving
					? "Saving..."
					: hasChanges
						? "Has unsaved changes"
						: "All changes saved"}
			</div>
		</div>
	);
}
