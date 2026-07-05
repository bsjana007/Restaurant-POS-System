import React, { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import POSContext from "../Context/POSContext";
import { socket } from "../Context/POSState";

export default function QRMenuPage() {
	const context = useContext(POSContext);
	const { tableId } = useParams();
	const {
		tables,
		fetchTables,
		verifyCustomerSession,
		fetchAvailableMenuItems,
		verified,
		availableMenuItem,
		placeOrder,
		generateBill,
	} = context;
	const [searchParams] = useSearchParams();
	const signature = searchParams.get("sig");

	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [activeOrder, setActiveOrder] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState("CASH");
	const [billRequested, setBillRequested] = useState(false);
	const [customerBill, setCustomerBill] = useState(null);

	const updateQuantity = (id, type) => {
		setCartItems((prev) =>
			prev
				.map((item) =>
					item._id === id
						? {
								...item,
								quantity:
									type === "inc"
										? item.quantity + 1
										: item.quantity - 1,
							}
						: item,
				)
				.filter((item) => item.quantity > 0),
		);
	};

	useEffect(() => {
		const verify = async () => {
			const result = await verifyCustomerSession(tableId, signature);
			if (result.success) {
				fetchAvailableMenuItems();
				setLoading(false);
			}
		};
		verify();
		fetchTables();

		// Join the WebSocket room for this table
		socket.emit("join-room", `table:${tableId}`);

		//eslint-disable-next-line
	}, [tableId, signature]);

	useEffect(() => {
		// Listen for real-time status updates of the order
		socket.on("status-changed", (updatedOrder) => {
			setActiveOrder((currentOrder) => {
				if (currentOrder && updatedOrder._id === currentOrder._id) {
					return updatedOrder;
				}
				return currentOrder;
			});
		});

		// Listen for real-time bill generation
		socket.on("bill-received", (bill) => {
			setCustomerBill(bill);
			setBillRequested(true);
		});

		// Listen for checkout complete to clear the session/activeOrder
		socket.on("checkout-complete", () => {
			setActiveOrder(null);
			setCustomerBill(null);
			setBillRequested(false);
			setShowModal(false);
		});

		return () => {
			socket.off("status-changed");
			socket.off("bill-received");
			socket.off("checkout-complete");
		};
	}, []);

	const currTable = tables.find((t) => t._id === tableId);

	const handleOrder = async () => {
		const result = await placeOrder(cartItems);
		if (result.success) {
			setActiveOrder(result.data);
			setCartItems([]);
		} else {
			alert(result.message || "Please try again later");
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
		<div className="p-4 max-w-4xl mx-auto bg-slate-50 text-stone-800 min-h-screen pb-24">
			<h1 className="text-2xl font-bold text-center mb-6">
				Table {currTable ? currTable.number : "Loading"} Menu
			</h1>

			{categories.map((cat) => (
				<div key={cat} className="mb-6">
					<h2 className="text-lg font-bold text-amber-600 border-b border-slate-800 pb-1 mb-3">
						{cat}
					</h2>
					<div className="space-y-3">
						{availableMenuItem
							.filter((item) => item.category === cat)
							.map((dish) => {
								const cartItem = cartItems.find(
									(item) => item._id === dish._id,
								);
								const quantity = cartItem ? cartItem.quantity : 0;
								return (
									<div
										key={dish._id}
										className="mt-5 p-4 min-h-35 border border-gray-400 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white"
									>
										<div className="flex gap-3 items-start sm:gap-4 flex-1">
											{dish.imageUrl && (
												<img
													src={dish.imageUrl}
													alt={dish.name}
													className="w-16 h-16 sm:w-25 sm:h-25 object-cover rounded-lg shrink-0"
												/>
											)}
											<div className="flex-1 min-w-0">
												<h3 className="text-md lg:text-lg font-bold">
													{dish.name}
												</h3>
												<p className="max-w-lg text-xs lg:text-sm text-slate-600 line-clamp-1 sm:line-clamp-none">
													{dish.description}
												</p>
												<span className="font-semibold lg:font-bold text-emerald-700 block mt-1">
													$ {dish.price.toFixed(2)}
												</span>
											</div>
										</div>
										<div className="flex items-center text-center justify-end">
											{quantity === 0 ? (
												<button
													onClick={() =>
														setCartItems([
															...cartItems,
															{
																...dish,
																quantity: 1,
															},
														])
													}
													className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm text-white transition shrink-0 text-center bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/40  cursor-pointer"
												>
													Add to Cart
												</button>
											) : (
												<div className="flex items-center bg-emerald-600 rounded-lg">
													<button
														onClick={() =>
															updateQuantity(dish._id, "desc")
														}
														className="items-center w-full sm:w-10 px-4 py-2 rounded-lg font-bold text-md text-white transition shrink-0 text-center bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/40  cursor-pointer"
													>
														-
													</button>
													<p className="text-md text-gray-100 mx-2">
														{quantity}
													</p>
													<button
														onClick={() =>
															updateQuantity(dish._id, "inc")
														}
														className="items-center w-full sm:w-10 px-4 py-2 rounded-lg font-bold text-md text-white transition shrink-0 text-center bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/40  cursor-pointer"
													>
														+
													</button>
												</div>
											)}
										</div>
									</div>
								);
							})}
					</div>
				</div>
			))}

			{/* Review Cart Button */}
			{cartItems.length > 0 && (
				<button
					onClick={() => setShowModal(true)}
					className="w-full mt-6 bg-emerald-600 py-3 rounded font-bold cursor-pointer hover:bg-emerald-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg text-gray-200"
				>
					Review Order ({cartItems.length} items)
				</button>
			)}

			{/* Track Active Order Button */}
			{activeOrder && (
				<button
					onClick={() => setShowModal(true)}
					className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-amber-500 py-4 rounded-xl font-bold cursor-pointer hover:bg-amber-400 transition shadow-xl text-stone-950 text-center text-lg z-30 animate-pulse"
				>
					Track Order ({activeOrder.status})
				</button>
			)}

			{/* Review / Status Modal Overlay */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
					<div className="bg-white text-stone-900 border border-gray-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto relative flex flex-col justify-between">
						<button
							onClick={() => setShowModal(false)}
							className="absolute top-4 right-4 text-gray-450 hover:text-gray-800 text-xl font-bold transition cursor-pointer"
						>
							✕
						</button>

						{!activeOrder ? (
							/* Case A: Review Items & Place Order */
							<div className="space-y-4 pt-4">
								<h2 className="text-2xl font-black text-stone-800 border-b pb-2">
									Review Your Order
								</h2>
								<div className="divide-y divide-gray-150 max-h-[40vh] overflow-y-auto pr-2">
									{cartItems.map((item) => (
										<div
											key={item._id}
											className="py-3 flex justify-between items-center"
										>
											<div>
												<h4 className="font-bold text-stone-800">
													{item.name}
												</h4>
												<p className="text-xs text-gray-500">
													${item.price.toFixed(2)} each
												</p>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-lg">
													{item.quantity}x
												</span>
												<span className="font-bold text-stone-800">
													$
													{(item.price * item.quantity).toFixed(2)}
												</span>
											</div>
										</div>
									))}
								</div>

								<div className="border-t pt-4 flex justify-between items-center">
									<span className="text-md font-bold text-gray-600">
										Total Amount:
									</span>
									<span className="text-2xl font-black text-emerald-700">
										$
										{cartItems
											.reduce(
												(acc, item) =>
													acc + item.price * item.quantity,
												0,
											)
											.toFixed(2)}
									</span>
								</div>

								<button
									onClick={handleOrder}
									className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl transition duration-200 shadow-lg cursor-pointer text-center"
								>
									Place Order
								</button>
							</div>
						) : (
							/* Case B: Track Order Status & Request Bill */
							<div className="space-y-6 pt-4">
								<h2 className="text-2xl font-black text-stone-800 border-b pb-2">
									Order Status
								</h2>

								{/* Visual Order Progress Bar */}
								<div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-gray-400">
									<div className="flex flex-col items-center gap-1">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${activeOrder.status === "PENDING" ? "border-amber-500 bg-amber-50 text-amber-500" : "border-emerald-500 bg-emerald-50 text-emerald-500"}`}
										>
											📝
										</div>
										<span>Pending</span>
									</div>
									<div className="h-0.5 bg-gray-200 grow mx-1 sm:mx-2"></div>
									<div className="flex flex-col items-center gap-1">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${["CONFIRMED", "PREPARING", "READY", "SERVED"].includes(activeOrder.status) ? "border-emerald-500 bg-emerald-50 text-emerald-500" : "border-gray-200 text-gray-300"}`}
										>
											🍳
										</div>
										<span>Preparing</span>
									</div>
									<div className="h-0.5 bg-gray-200 grow mx-1 sm:mx-2"></div>
									<div className="flex flex-col items-center gap-1">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${["READY", "SERVED"].includes(activeOrder.status) ? "border-emerald-500 bg-emerald-50 text-emerald-500" : "border-gray-200 text-gray-300"}`}
										>
											🛎️
										</div>
										<span>Ready</span>
									</div>
									<div className="h-0.5 bg-gray-200 grow mx-1 sm:mx-2"></div>
									<div className="flex flex-col items-center gap-1">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${activeOrder.status === "SERVED" ? "border-emerald-500 bg-emerald-50 text-emerald-500" : "border-gray-200 text-gray-300"}`}
										>
											🍽️
										</div>
										<span>Served</span>
									</div>
								</div>

								<div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
									<div className="flex justify-between items-center text-sm font-semibold text-slate-500">
										<span>Status:</span>
										<span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider text-xs font-black">
											{activeOrder.status}
										</span>
									</div>
									<div className="divide-y divide-slate-100 text-sm max-h-[25vh] overflow-y-auto">
										{activeOrder.items?.map((item, idx) => (
											<div
												key={idx}
												className="py-2 flex justify-between"
											>
												<span>{item.name}</span>
												<span className="font-bold">
													{item.quantity}x
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Current Order Invoice Preview */}
								{(() => {
									const activeOrderSubTotal = activeOrder.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
									const activeOrderTax = Number((activeOrderSubTotal * 0.05).toFixed(2));
									const activeOrderTotal = Number((activeOrderSubTotal + activeOrderTax).toFixed(2));
									return (
										<div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1 text-sm font-semibold text-slate-700">
											<h3 className="font-bold text-stone-850 mb-2">Order Bill Preview</h3>
											<div className="flex justify-between">
												<span>Subtotal:</span>
												<span>${activeOrderSubTotal.toFixed(2)}</span>
											</div>
											<div className="flex justify-between">
												<span>Tax (5%):</span>
												<span>${activeOrderTax.toFixed(2)}</span>
											</div>
											<div className="flex justify-between border-t pt-1 font-bold text-stone-900">
												<span>Total Amount:</span>
												<span>${activeOrderTotal.toFixed(2)}</span>
											</div>
										</div>
									);
								})()}

								{/* Payment section if order status is SERVED */}
								{activeOrder.status === "SERVED" && (
									<div className="space-y-4 pt-4 border-t">
										{!billRequested ? (
											<>
												<h3 className="text-lg font-bold text-stone-850">
													Select Payment Method
												</h3>
												<div className="grid grid-cols-3 gap-3">
													{["CASH", "CARD", "UPI"].map(
														(method) => (
															<button
																key={method}
																onClick={() =>
																	setPaymentMethod(method)
																}
																className={`py-3 rounded-xl border text-sm font-bold transition cursor-pointer ${paymentMethod === method ? "border-amber-600 bg-amber-50 text-amber-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
															>
																{method === "CASH"
																	? "💵 Cash"
																	: method === "CARD"
																		? "💳 Card"
																		: "📱 UPI"}
															</button>
														),
													)}
												</div>
												<button
													onClick={async () => {
														const bill = await generateBill(
															tableId,
															paymentMethod,
														);
														setCustomerBill(bill);
														setBillRequested(true);
													}}
													className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold rounded-xl transition duration-200 shadow-md cursor-pointer text-center"
												>
													Pay the Bill
												</button>
											</>
										) : (
											<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-4 text-stone-850">
												<div className="text-2xl animate-bounce">
													⏳
												</div>
												<h4 className="font-bold text-amber-800">
													Bill Requested
												</h4>
												<p className="text-xs text-amber-700 leading-relaxed font-semibold">
													You chose to pay by{" "}
													<span className="font-bold">
														{paymentMethod}
													</span>
													. Please go to the reception counter to pay your bill. The cashier has been notified.
												</p>
												{customerBill && (
													<div className="bg-white border rounded-lg p-3 text-left space-y-1 text-sm font-semibold text-stone-800">
														<div className="flex justify-between">
															<span>Subtotal:</span>
															<span>
																$
																{customerBill.subTotal?.toFixed(
																	2,
																)}
															</span>
														</div>
														<div className="flex justify-between">
															<span>Tax (5%):</span>
															<span>
																${customerBill.tax?.toFixed(2)}
															</span>
														</div>
														<div className="flex justify-between border-t pt-1 font-bold text-base text-stone-900">
															<span>Total Amount:</span>
															<span>
																$
																{customerBill.grandTotal?.toFixed(
																	2,
																)}
															</span>
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
