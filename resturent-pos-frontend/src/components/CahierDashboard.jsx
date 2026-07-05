import React, { useEffect, useContext, useState } from "react";
import POSContext from "../Context/POSContext";

function CahierDashboard() {
	const {
		tables,
		fetchTables,
		activeBill,
		generateBill,
		payBill,
		fetchActiveBill,
		setActiveBill,
		updateTableStatus,
		joinRoom,
	} = useContext(POSContext);
	const [selectedTable, setSelectedTable] = useState(null);

	useEffect(() => {
		joinRoom("cashier");
		fetchTables();
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (selectedTable) {
			if (selectedTable.status === "BILLING") {
				fetchActiveBill(selectedTable._id);
			} else {
				setActiveBill(null);
			}
		} else {
			setActiveBill(null);
		}
		//eslint-disable-next-line
	}, [selectedTable]);

	const getStatusColor = (status) => {
		if (status === "VACANT") return "bg-green-500";
		if (status === "OCCUPIED") return "bg-red-600";
		if (status === "BILLING") return "bg-amber-500 text-black";
		return "bg-blue-600";
	};

	return (
		<div className="p-6 bg-slate-50 min-h-screen text-stone-800 flex gap-6">
			<div className="w-2/3">
				<h1 className="text-3xl font-bold text-stone-800 mb-6">
					Cashier Floor Map
				</h1>
				<div className="grid grid-cols-4 gap-4 ">
					{tables.map((t) => (
						<button
							key={t._id}
							onClick={() => setSelectedTable(t)}
							className={`p-6 rounded-lg font-bold cursor-pointer ${getStatusColor(t.status)}`}
						>
							Table {t.number}
							<div className="text-xs font-normal mt-1">{t.status}</div>
						</button>
					))}
				</div>
			</div>

			<div className="w-1/3 bg-slate-100 p-4 rounded-lg border border-slate-200">
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
							<div className="bg-slate-100 p-3 rounded space-y-2">
								<p>Subtotal: ${activeBill.subTotal}</p>
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
						{selectedTable.status === "DIRTY" && (
							<button
								onClick={async () => {
									await updateTableStatus(selectedTable._id, "VACANT");
									setSelectedTable(null);
								}}
								className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded font-bold transition cursor-pointer"
							>
								Mark Clean & Vacant
							</button>
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
