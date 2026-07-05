import React, { useState, useContext, useEffect } from "react";
import POSContext from "../Context/POSContext";

function AdminMenuManager() {
	const context = useContext(POSContext);
	const { menuItem, fetchMenuItems, addMenuItem, toggleAvailability } =
		context;
	const [form, setForm] = useState({
		name: "",
		description: "",
		price: "",
		category: "Mains",
	});
	const [imageFile, setImageFile] = useState(null);

	useEffect(() => {
		fetchMenuItems();
		//eslint-disable-next-line
	}, []);

	const handleInputChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleFileChnage = (e) => {
		setImageFile(e.target.files[0]);
	};

	const handleOnSubmi = async (e) => {
		e.preventDefault();
		const response = await addMenuItem(form, imageFile);
		if (response.success) {
			setForm({
				name: "",
				description: "",
				price: "",
				category: "Mains",
			});
			setImageFile(null);

			const fileInput = document.getElementById("menu-img-input");
			if (fileInput) fileInput.value = "";
		} else {
			alert(response.error);
		}
	};

	return (
		<div className="p-6  bg-stone-50 text-stone-900 flex flex-col md:flex-row gap-6">
			<div className="w-full md:w-1/3 border border-gray-500 rounded-md shadow-lg bg-gray-100 p-4	">
				<h2 className="text-stone-800 text-2xl font-bold">Add New Dish</h2>
				<div className="border-t border-gray-400 mt-2 mb-4"></div>
				<form className="space-y-4" onSubmit={handleOnSubmi}>
					<div>
						<label className="block mb-1 text-amber-600">Name</label>
						<input
							required
							type="text"
							name="name"
							value={form.name}
							onChange={handleInputChange}
							className="w-full px-2 h-9 bg-slate-200 text-stone-700 rounded-sm border border-gray-400"
						/>
					</div>
					<div>
						<label className="text-amber-600">Description</label>
						<textarea
							required
							name="description"
							value={form.description}
							onChange={handleInputChange}
							className="w-full px-2 py-1 h-30 bg-slate-200 text-stone-700 rounded-sm border border-gray-400"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block mb-1 text-amber-600">
								Price ($)
							</label>
							<input
								required
								type="number"
								name="price"
								value={form.price}
								onChange={handleInputChange}
								className="w-full h-9 px-2	 bg-slate-200 text-stone-700 rounded-sm border border-gray-400 no-spinner"
							/>
						</div>
						<div>
							<label className="block mb-1 text-amber-600">
								Category
							</label>
							<select
								required
								name="category"
								value={form.category}
								onChange={handleInputChange}
								className="w-full h-9 px-2 bg-slate-200 text-stone-700 rounded-sm border border-gray-400"
							>
								<option value="Appetizers">Appetizers</option>
								<option value="Mains">Mains</option>
								<option value="Drinks">Drinks</option>
							</select>
						</div>
					</div>
					<div>
						<label className="block mb-1 text-amber-600">
							Upload Dish Image
						</label>
						<input
							required
							id="menu-img-input"
							type="file"
							accept="image/*"
							onChange={handleFileChnage}
							className="pl-1 w-full h-9 bg-slate-200 text-stone-700 rounded-sm border border-gray-400 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-500 file:text-white hover:file:bg-gray-600 cursor-pointer"
						/>
					</div>
					<button
						type="submit"
						className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-lg text-sm transition-all duration-300 text-center shadow-lg shadow-amber-600/10 active:scale-98 mx-auto w-full cursor-pointer"
					>
						Add to Menu
					</button>
				</form>
			</div>
			{/* menu items */}
			<div className="w-full md:w-2/3 rounded-md border border-gray-500 shadow-lg bg-gray-100 p-4">
				<h2 className="text-stone-800 text-2xl font-bold ">Menu Items</h2>
				<div className="border-t border-gray-400 mt-2 mb-4 space-y-4 overflow-y-auto shadow-lg shadow-gray-400/30">
					{" "}
				</div>
				{menuItem.map((item, index) => (
					<div
						key={item._id || index}
						className="mt-5 p-4 min-h-35 border border-gray-400 rounded-lg flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white"
					>
						<div className="flex items-start gap-3 sm:gap-4">
							{item.imageUrl && (
								<img
									src={item.imageUrl}
									alt={item.name}
									className="w-16 h-16 sm:w-25 sm:h-25 object-cover rounded-lg shrink-0"
								/>
							)}
							<div className="flex-1 min-w-0">
								<h3 className="text-md lg:text-lg font-bold flex flex-wrap items-center gap-1.5">
									<span className="truncate">{item.name}</span>
									<span className="text-[9px] lg:text-xs text-stone-800 bg-amber-400 px-1.5 py-0.5 rounded font-mono">
										{item.category}
									</span>
								</h3>
								<p className="max-w-lg text-xs lg:text-sm text-slate-600 line-clamp-3 sm:line-clamp-none">
									{item.description}
								</p>
								<span className="font-semibold lg:font-bold text-emerald-700 block mt-1">
									$ {item.price.toFixed(2)}
								</span>
							</div>
						</div>
						<button
							onClick={() =>
								toggleAvailability(item._id, item.isAvailable)
							}
							className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm text-white transition shrink-0 text-center ${item.isAvailable ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/40 cursor-pointer" : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/40 cursor-pointer"}`}
						>
							{item.isAvailable ? "Available" : "Currently Unavailable"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default AdminMenuManager;
