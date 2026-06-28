import { useState } from "react";
import POSContext from "./POSContext";

function POSState(props) {
	const [tables, setTables] = useState([]);
	const [loadingId, setLoadingId] = useState(null);
	const [menuItem, setMenuItem] = useState([]);

	const host = "http://localhost:3000/api";

	const fetchTables = async () => {
		const res = await fetch("http://localhost:3000/api/tables");
		const data = await res.json();
		setTables(data);
	};

	const createTable = async (newTable) => {
		try {
			const res = await fetch("http://localhost:3000/api/tables/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newTable),
			});

			if (res.ok) {
				const createdTable = await res.json();
				setTables((prev) =>
					[...prev, createdTable].sort((a, b) =>
						a.number.localeCompare(b.number),
					),
				);
				return { success: true };
			} else {
				const err = await res.json();
				return {
					success: false,
					error: err.error || "Failed to add table",
				};
			}
		} catch (err) {
			console.error(err);
			return {
				success: false,
				error: "Network error. Failed to add table.",
			};
		}
	};

	const generateQrForTable = async (tableId) => {
		setLoadingId(tableId);
		try {
			const response = await fetch(
				`http://localhost:3000/api/tables/${tableId}/generate-qr`,
				{
					method: "POST",
				},
			);
			const data = await response.json();

			// Update local state to show the new QR code
			setTables((prev) =>
				prev.map((t) =>
					t._id === tableId ? { ...t, qrCodeUrl: data.qrCodeUrl } : t,
				),
			);

			return { success: true };
		} catch (error) {
			console.error(error);
			return {
				success: false,
				error: "Network error. Failed to generate QR code.",
			};
		} finally {
			setLoadingId(null);
		}
	};

	const fetchMenuItems = async () => {
		const response = await fetch(`${host}/menu`);
		const data = await response.json();
		setMenuItem(data);
	};

	const addMenuItem = async (form, imageFile) => {
		const formData = new FormData();
		formData.append("name", form.name);
		formData.append("description", form.description);
		formData.append("price", form.price);
		formData.append("category", form.category);

		if (imageFile) {
			formData.append("image", imageFile);
		}

		try {
			const response = await fetch(`${host}/menu/add`, {
				method: "POST",
				body: formData,
			});
			if (response.ok) {
				const newItem = await response.json();
				setMenuItem((prev) =>
					[...prev, newItem].sort((a, b) =>
						a.category.localeCompare(b.category),
					),
				);
				return { success: true };
			} else {
				let errorMessage = "Failed to add menu item";
				try {
					const error = await response.json();
					errorMessage = error.error || errorMessage;
					//eslint-disable-next-line
				} catch (_) {
					errorMessage = `Server Error: ${response.status} ${response.statusText}`;
				}
				return { success: false, error: errorMessage };
			}
		} catch (err) {
			console.error("Upload Error:", err);
			return {
				success: false,
				error: "Network error. Failed to add menu item.",
			};
		}
	};

	const toggleAvailability = async (id, currStatus) => {
		try {
			const response = await fetch(`${host}/menu/${id}/availability`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isAvailable: !currStatus }),
			});

			const updatedItem = await response.json();
			setMenuItem((prev) =>
				prev.map((item) => (item._id === id ? updatedItem : item)),
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<POSContext.Provider
			value={{
				tables,
				menuItem,
				loadingId,
				setTables,
				fetchTables,
				createTable,
				generateQrForTable,
				fetchMenuItems,
				addMenuItem,
				toggleAvailability,
			}}
		>
			{props.children}
		</POSContext.Provider>
	);
}

export default POSState;
