import { useState, useEffect } from "react";
import io from "socket.io-client";
import POSContext from "./POSContext";

const socket = io(import.meta.env.BACKEND_URL);

function POSState(props) {
	const [tables, setTables] = useState([]);
	const [loadingId, setLoadingId] = useState(null);
	const [menuItem, setMenuItem] = useState([]);
	const [verified, setVerified] = useState(false);
	const [loading, setLoading] = useState(false);
	const [availableMenuItem, setAvailableMenuItem] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [activeBill, setActiveBill] = useState(null);

	const host = "http://localhost:3000";

	const fetchTables = async () => {
		const res = await fetch("http://localhost:3000/api/tables");
		const data = await res.json();
		setTables(data);
	};

	useEffect(() => {
		// 1. WebSocket Listeners
		socket.on("table-status-updated", (updatedTable) => {
			setTables((prev) =>
				prev.map((t) => (t._id === updatedTable._id ? updatedTable : t)),
			);
		});

		socket.on("order-received", (newOrder) => {
			setTickets((prev) => [...prev, newOrder]);
			fetchTables();
		});

		socket.on("status-changed", (updatedOrder) => {
			setTickets((prev) => {
				if (
					["COMPLETED", "CANCELLED", "SERVED"].includes(
						updatedOrder.status,
					)
				) {
					return prev.filter((t) => t._id !== updatedOrder._id);
				}
				return prev.map((t) =>
					t._id === updatedOrder._id ? updatedOrder : t,
				);
			});
			fetchTables();
		});

		socket.on("bill-generated", (bill) => {
			setActiveBill(bill);
			fetchTables();
		});

		socket.on("payment-completed", () => {
			setActiveBill(null);
			fetchTables();
		});

		return () => {
			socket.off("table-status-updated");
			socket.off("order-received");
			socket.off("status-changed");
			socket.off("bill-generated");
			socket.off("payment-completed");
		};
	}, []);

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
		const response = await fetch(`${host}/api/menu`);
		const data = await response.json();
		setMenuItem(data);
	};

	const fetchAvailableMenuItems = async () => {
		const response = await fetch(`${host}/api/menu/available`);
		const data = await response.json();
		setAvailableMenuItem(data);
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
			const response = await fetch(`${host}/api/menu/add`, {
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
			const response = await fetch(`${host}/api/menu/${id}/availability`, {
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

	const verifyCustomerSession = async (tableId, signature) => {
		setLoading(false);
		try {
			const response = await fetch(`${host}/api/auth/customer-session`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tableId, signature }),
			});

			const data = await response.json();

			if (data.token) {
				localStorage.setItem("token", data.token);
				localStorage.setItem("role", "CUSTOMER");
				localStorage.setItem("tableId", tableId);
				setVerified(true);
				return {
					success: true,
					data: data,
				};
			}

			return {
				success: false,
				data: data.error || "Invalid QR signature",
			};
		} catch (error) {
			setLoading(false);
			return {
				success: false,
				message: error.message,
			};
		}
	};

	const placeOrder = async (cart) => {
		const token = localStorage.getItem("token");
		const tableId = localStorage.getItem("tableId");
		const orderItems = cart.map((item) => ({
			menuItemId: item._id,
			name: item.name,
			price: item.price,
			quantity: 1,
		}));

		try {
			const response = await fetch(`${host}/api/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ tableId, items: orderItems }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Failed to place order");
			}

			return {
				success: true,
				data,
			};
		} catch (error) {
			return {
				success: false,
				message: error.message,
			};
		}
	};

	const fetchActiveOrders = async () => {
		const response = await fetch(`${host}/api/orders/active`);
		const data = await response.json();
		setTickets(data);
	};

	const updateOrderStatus = async (orderid, currentStatus, tableId) => {
		let nextStatus = "PREPARING";
		if (currentStatus === "PENDING") nextStatus = "CONFIRMED";
		else if (currentStatus === "CONFIRMED") nextStatus = "PREPARING";
		else if (currentStatus === "PREPARING") nextStatus = "READY";
		else if (currentStatus === "READY") nextStatus = "SERVED";

		const response = await fetch(`${host}/api/orders/${orderid}/status`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status: nextStatus }),
		});

		if (response.ok) {
			socket.emit("update-order-status", {
				orderid,
				status: nextStatus,
				tableId,
			});
		}
	};

	const generateBill = async (tableId) => {
		const response = await fetch(`${host}/api/bills/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tableId, paymentMethod: "CASH" }),
		});
		const data = await response.json();
		console.log(data);

		setActiveBill(data);
	};

	//eslint-disable-next-line
	const payBill = async (billId, tableId) => {
		await fetch(`http://localhost:3000/api/bills/${billId}/pay`, {
			method: "POST",
		});
		setActiveBill(null);
		fetchTables();
	};

	const joinRoom = (roomName) => {
		socket.emit("join-room", roomName);
	};

	return (
		<POSContext.Provider
			value={{
				tables,
				menuItem,
				loadingId,
				loading,
				verified,
				availableMenuItem,
				tickets,
				activeBill,
				setTables,
				fetchTables,
				createTable,
				generateQrForTable,
				fetchMenuItems,
				addMenuItem,
				toggleAvailability,
				verifyCustomerSession,
				fetchAvailableMenuItems,
				placeOrder,
				fetchActiveOrders,
				updateOrderStatus,
				generateBill,
				payBill,
				joinRoom,
			}}
		>
			{props.children}
		</POSContext.Provider>
	);
}

export default POSState;
