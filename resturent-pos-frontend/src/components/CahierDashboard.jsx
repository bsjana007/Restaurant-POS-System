import React, { useEffect, useContext, useState } from "react";
import POSContext from "../Context/POSContext";

function CahierDashboard() {
	const { tables, fetchTables, activeBill, generateBill, payBill, joinRoom } =
		useContext(POSContext);
	const [selectedTable, setSelectedTable] = useState(null);

	useEffect(() => {
		joinRoom("cashier");
		fetchTables();
		//eslint-disable-next-line
	}, []);

	const getStatusColor = (status) => {
		if (status === "VACANT") return "bg-emerald-600";
		if (status === "OCCUPIED") return "bg-red-600";
		if (status === "BILLING") return "bg-amber-500 text-black";
		return "bg-blue-600";
	};

	return (
		<div className="p-6 bg-slate-900 min-h-screen text-white flex gap-6">
			<div className="w-2/3">
				<h1 className="text-3xl font-bold text-emerald-400 mb-6">
					Cashier Floor Map
				</h1>
				<div className="grid grid-cols-4 gap-4">
					{tables.map((t) => (
						<button
							key={t._id}
							onClick={() => setSelectedTable(t)}
							className={`p-6 rounded-lg font-bold ${getStatusColor(t.status)}`}
						>
							Table {t.number}
							<div className="text-xs font-normal mt-1">{t.status}</div>
						</button>
					))}
				</div>
			</div>

			<div className="w-1/3 bg-slate-800 p-4 rounded-lg border border-slate-700">
				{selectedTable ? (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">
							Table #{selectedTable.number} Actions
						</h2>
						{selectedTable.status === "OCCUPIED" && (
							<button
								onClick={() => generateBill(selectedTable._id)}
								className="w-full bg-amber-500 text-black py-2 rounded font-bold"
							>
								Generate Invoice
							</button>
						)}
						{activeBill && (
							<div className="bg-slate-900 p-3 rounded space-y-2">
								<p>Subtotal: ${activeBill.subtotal}</p>
								<p>Tax (5%): ${activeBill.tax}</p>
								<p className="font-bold">
									Total: ${activeBill.grandTotal}
								</p>
								<button
									onClick={() =>
										payBill(activeBill._id, selectedTable._id)
									}
									className="w-full bg-emerald-600 py-2 rounded font-bold"
								>
									Finalize Payment
								</button>
							</div>
						)}
					</div>
				) : (
					<p className="text-slate-400 italic text-center mt-20">
						Select a table from the floor map
					</p>
				)}
			</div>
		</div>
	);
}

export default CahierDashboard;
