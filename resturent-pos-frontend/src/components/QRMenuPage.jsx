import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import POSContext from "../Context/POSContext";

export default function QRMenuPage() {
	const context = useContext(POSContext);
	const { tableId } = useParams();
	const {
		verifyCustomerSession,
		fetchAvailableMenuItems,
		verified,
		availableMenuItem,
		placeOrder,
	} = context;
	const [searchParams] = useSearchParams();
	const signature = searchParams.get("sig");

	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const verify = async () => {
			const result = await verifyCustomerSession(tableId, signature);
			if (result.success) {
				fetchAvailableMenuItems();
				setLoading(false);
			}
		};
		verify();
		//eslint-disable-next-line
	}, [tableId, signature]);

	const handleOrder = async () => {
		const result = await placeOrder(cart);
		if (result.success) {
			setCart([]);
			return "order placed successfulluy";
		} else {
			return "Please try again later";
		}
	};

	// Dynamically extract categories present in the database (e.g. Chinese, Indian, Western, Starter)
	const categories = [
		...new Set(availableMenuItem.map((item) => item.category)),
	];

	if (loading)
		return <div className="text-center p-8">Verifying table...</div>;
	if (!verified)
		return (
			<div className="text-center text-red-500 p-8">
				Invalid QR signature. Please ask the waiter.
			</div>
		);

	return (
		<div className="p-4 max-w-md mx-auto bg-slate-900 text-white min-h-screen">
			<h1 className="text-2xl font-bold text-center mb-6">
				Table #{tableId} Menu
			</h1>

			{categories.map((cat) => (
				<div key={cat} className="mb-6">
					<h2 className="text-lg font-bold text-emerald-400 border-b border-slate-800 pb-1 mb-3">
						{cat}
					</h2>
					<div className="space-y-3">
						{availableMenuItem
							.filter((item) => item.category === cat)
							.map((dish) => (
								<div
									key={dish._id}
									className="flex justify-between items-center bg-slate-800 p-3 rounded"
								>
									<div>
										<h3 className="font-bold">{dish.name}</h3>
										<p className="text-emerald-400">
											${dish.price.toFixed(2)}
										</p>
									</div>
									<button
										onClick={() => setCart([...cart, dish])}
										className="bg-emerald-600 px-3 py-1 rounded"
									>
										+
									</button>
								</div>
							))}
					</div>
				</div>
			))}

			{cart.length > 0 && (
				<button
					onClick={handleOrder}
					className="w-full mt-6 bg-emerald-600 py-3 rounded font-bold"
				>
					Submit Order ({cart.length} items)
				</button>
			)}
		</div>
	);
}
