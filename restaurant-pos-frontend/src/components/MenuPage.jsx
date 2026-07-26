import React, { useContext, useEffect, useState } from "react";
import POSContext from "../Context/POSContext";

export default function MenuPage() {
	const { availableMenuItem, fetchAvailableMenuItems } = useContext(POSContext);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchAvailableMenuItems();
		// eslint-disable-next-line
	}, []);

	// Extract unique categories from menu items
	const categories = ["All", ...new Set(availableMenuItem.map((item) => item.category))];

	// Filter menu items based on selected category and search query
	const filteredItems = availableMenuItem.filter((item) => {
		const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
		const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
			(item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="min-h-screen bg-stone-50 text-stone-800 pb-16 transition-colors duration-300">
			{/* Decorative Hero Header */}
			<div className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 py-20 px-6 text-center text-white overflow-hidden shadow-xl mb-12">
				{/* Ambient Light Effects */}
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>

				<div className="max-w-3xl mx-auto space-y-4 relative z-10">
					<span className="text-amber-500 font-extrabold uppercase tracking-widest text-xs">
						Welcome to Aetheria
					</span>
					<h1 className="text-4xl md:text-5xl font-black tracking-tight font-serif text-stone-100">
						Explore Our Culinary Masterpieces
					</h1>
					<p className="text-stone-300 text-sm md:text-base max-w-xl mx-auto font-medium">
						Savor our curated dishes prepared with organic ingredients, exquisite spices, and absolute passion.
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 space-y-8">
				{/* Search and Filters Panel */}
				<div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-md space-y-6">
					<div className="flex flex-col md:flex-row gap-4 justify-between items-center">
						{/* Search Bar */}
						<div className="relative w-full md:max-w-md">
							<span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
								🔍
							</span>
							<input
								type="text"
								placeholder="Search dishes by name or ingredients..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition duration-200 text-sm font-medium"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery("")}
									className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-450 hover:text-stone-700 transition"
								>
									✕
								</button>
							)}
						</div>

						{/* Quick summary status */}
						<div className="text-sm font-semibold text-stone-500">
							Showing <span className="text-stone-800 font-bold">{filteredItems.length}</span> delectable options
						</div>
					</div>

					{/* Category Tabs */}
					<div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
						{categories.map((category) => {
							const count = category === "All" 
								? availableMenuItem.length 
								: availableMenuItem.filter((item) => item.category === category).length;

							return (
								<button
									key={category}
									onClick={() => setSelectedCategory(category)}
									className={`px-5 py-2.5 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
										selectedCategory === category
											? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
											: "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200"
									}`}
								>
									{category}
									<span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
										selectedCategory === category 
											? "bg-amber-700 text-amber-100" 
											: "bg-stone-200 text-stone-600"
									}`}>
										{count}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Menu Items Grid */}
				{filteredItems.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-2xl border border-stone-200/80 shadow-md max-w-lg mx-auto space-y-4">
						<div className="text-4xl">🍽️</div>
						<h3 className="text-xl font-bold text-stone-750">No dishes match your query</h3>
						<p className="text-stone-550 text-sm max-w-xs mx-auto leading-relaxed">
							Try adjusting your search filters or check back later for exciting new menu arrivals.
						</p>
						<button 
							onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
							className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition duration-200 shadow-md cursor-pointer"
						>
							Reset Filters
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredItems.map((item) => (
							<div
								key={item._id}
								className="group bg-white rounded-2xl border border-stone-200/60 overflow-hidden hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 flex flex-col"
							>
								{/* Dish Image */}
								<div className="relative h-56 bg-stone-100 overflow-hidden">
									{item.imageUrl ? (
										<img
											src={item.imageUrl}
											alt={item.name}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
											<span className="text-5xl">🍲</span>
										</div>
									)}
									{/* Category Badge overlay */}
									<span className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-sm text-amber-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
										{item.category}
									</span>
								</div>

								{/* Card Content */}
								<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
									<div className="space-y-2">
										<div className="flex justify-between items-start gap-4">
											<h3 className="font-serif text-lg font-black text-stone-850 group-hover:text-amber-600 transition-colors duration-200">
												{item.name}
											</h3>
											<span className="text-lg font-black text-amber-600 shrink-0">
												${item.price.toFixed(2)}
											</span>
										</div>
										<p className="text-stone-550 text-sm font-medium leading-relaxed line-clamp-3">
											{item.description || "Freshly made dish crafted with premium ingredients chosen by our chef."}
										</p>
									</div>

									{/* Availability indicator */}
									<div className="flex justify-between items-center pt-3 border-t border-stone-100 text-xs font-semibold">
										<span className="text-stone-500">Preparation Time</span>
										<span className="text-amber-700">10-15 mins</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
