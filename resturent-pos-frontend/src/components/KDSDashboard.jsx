import React, { useEffect } from "react";
import { useContext } from "react";
import POSContext from "../Context/POSContext";

function KDSDashboard() {
	const context = useContext(POSContext);
	const { tickets, fetchActiveOrders, updateOrderStatus, joinRoom } = context;

	useEffect(() => {
		joinRoom("kitchen");
		fetchActiveOrders();
	});
	const getTimerColor = (time) => {
		const minutes = (new Date() - new Date(time)) / 60000;
		if (minutes > 15) return "border-red-500 bg-red-950";
		if (minutes > 10) return "border-amber-500 bg-amber-950";
		return "border-slate-800 bg-slate-900";
	};

	return (
		<div className="p-6 bg-slate-950 min-h-screen text-white">
			<h1 className="text-3xl font-bold text-emerald-400 mb-6">
				KDS Screen
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{tickets.map((ticket) => (
					<div
						key={ticket._id}
						className={`border rounded-lg p-4 flex flex-col justify-between ${getTimerColor(ticket.createdAt)}`}
					>
						<div>
							<div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
								<span className="font-bold">
									Table {ticket.tableId?.number}
								</span>
								<span className="text-xs uppercase">
									{ticket.status}
								</span>
							</div>
							<ul className="space-y-2">
								{ticket.items.map((item, idx) => (
									<li key={idx}>
										• {item.quantity}x {item.name}
									</li>
								))}
							</ul>
						</div>
						<button
							onClick={() =>
								updateOrderStatus(
									ticket._id,
									ticket.status,
									ticket.tableId?._id,
								)
							}
							className="w-full mt-4 bg-emerald-600 py-2 rounded font-bold hover:bg-emerald-500"
						>
							{ticket.status === "PENDING"
								? "Confirm"
								: ticket.status === "CONFIRMED"
									? "Cook"
									: "Complete"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default KDSDashboard;
