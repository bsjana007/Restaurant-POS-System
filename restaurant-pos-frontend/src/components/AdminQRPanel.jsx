import React, { useState, useEffect } from "react";
import { useContext } from "react";
import POSContext from "../Context/POSContext";

export default function AdminQRPanel() {
	const [newTable, setNewTable] = useState({ number: "", capacity: "" });
	// const [, setLoadingId] = useState(null);

	const {
		tables,
		//eslint-disable-next-line
		setTables,
		fetchTables,
		createTable,
		loadingId,
		generateQrForTable,
	} = useContext(POSContext);

	useEffect(() => {
		fetchTables();
		//eslint-disable-next-line
	}, []);

	const handleCreateTable = async (e) => {
		e.preventDefault();
		const response = await createTable(newTable);
		if (response.success) {
			setNewTable({ number: "", capacity: "" }); // Clear inputs
		} else {
			alert(response.error);
		}
	};

	const handleGenerateQR = async (tableId) => {
		generateQrForTable(tableId);
	};

	// Helper trigger to print the QR code card directly
	const handlePrint = (tableNumber, qrCodeUrl) => {
		const printWindow = window.open("", "_blank");
		printWindow.document.write(`
        <html>
            <head>
                <title>Print QR - Table ${tableNumber}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 40px; color: #1e293b; }
                    .card { border: 3px solid #10b981; border-radius: 16px; padding: 30px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                    h1 { font-size: 28px; margin-bottom: 5px; color: #0f172a; }
                    p { font-size: 16px; color: #64748b; margin-bottom: 25px; }
                    img { width: 250px; height: 250px; }
                    .footer { margin-top: 25px; font-weight: bold; color: #10b981; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Table ${tableNumber}</h1>
                    <p>Scan to view Menu & Order directly</p>
                    <img src="${qrCodeUrl}" alt="Table QR Code" />
                    <div class="footer">Welcome to Our Restaurant!</div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    }
                </script>
            </body>
        </html>
    `);
		printWindow.document.close();
	};

	return (
		<div className="p-6 bg-stone-50 min-h-screen text-stone-900">
			<h1 className="text-3xl font-extrabold mb-6 text-stone-900">
				Table & QR Code Manager
			</h1>

			{/* 1. Add New Table Form */}
			<div className="bg-gray-200 p-6 rounded-xl border border-gray-500 mb-8 shadow-xl max-w-full">
				<h2 className="text-xl font-bold mb-4 text-stone-800">
					Add New Table
				</h2>
				<form
					onSubmit={handleCreateTable}
					className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end"
				>
					<div className="w-full sm:flex-1">
						<label className="block text-sm font-bold text-amber-700 mb-1">
							Table Number
						</label>
						<input
							required
							type="text"
							placeholder="e.g. T-09"
							value={newTable.number}
							onChange={(e) =>
								setNewTable({ ...newTable, number: e.target.value })
							}
							className="w-full bg-gray-100 border border-gray-600 rounded p-2 text-stone-600"
						/>
					</div>
					<div className="w-full sm:flex-1">
						<label className="block text-sm font-bold text-amber-700 mb-1">
							Capacity
						</label>
						<input
							required
							type="number"
							min="1"
							placeholder="e.g. 4"
							value={newTable.capacity}
							onChange={(e) =>
								setNewTable({
									...newTable,
									capacity: Number(e.target.value),
								})
							}
							className="w-full bg-gray-100 border border-gray-600 rounded p-2 text-stone-600"
						/>
					</div>
					<button
						type="submit"
						className="w-full sm:w-auto px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-amber-600/10 hover:shadow-amber-600/25 active:scale-95 cursor-pointer"
					>
						Add
					</button>
				</form>
			</div>

			{/* 2. Table QR list */}
			<div className="bg-gray-200 rounded-xl border border-gray-500 overflow-hidden shadow-xl">
				<div className="overflow-x-auto">
					<table className="w-full min-w-150 text-left border-collapse">
						<thead>
							<tr className="bg-gray-300 border-b border-gray-500 text-gray-800">
								<th className="p-4">Table Number</th>
								<th className="p-4">Capacity</th>
								<th className="p-4">QR Status</th>
								<th className="p-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800">
							{tables.map((table) => (
								<tr key={table._id} className="hover:bg-stone-300">
									<td className="p-4 font-bold text-lg">
										Table {table.number}
									</td>
									<td className="p-4 text-slate-600">
										{table.capacity} Guests
									</td>
									<td className="p-4">
										{table.qrCodeUrl ? (
											<span className="text-green-600 text-sm font-semibold flex items-center gap-1">
												● Active
											</span>
										) : (
											<span className="text-slate-500 text-sm">
												Not Generated
											</span>
										)}
									</td>
									<td className="p-4 text-right flex justify-end gap-3">
										<button
											onClick={() => handleGenerateQR(table._id)}
											disabled={loadingId === table._id}
											className="px-4 py-2 cursor-pointer text-gray-200 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 font-semibold rounded-lg transition"
										>
											{loadingId === table._id
												? "Generating..."
												: table.qrCodeUrl
													? "Regenerate QR"
													: "Generate QR"}
										</button>
										{table.qrCodeUrl && (
											<button
												onClick={() =>
													handlePrint(
														table.number,
														table.qrCodeUrl,
													)
												}
												className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-amber-600/10 hover:shadow-amber-600/25 active:scale-95 cursor-pointer"
											>
												Print Card
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
