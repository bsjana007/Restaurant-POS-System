import React from "react";
import { Link } from "react-router-dom";

const SIGNATURE_CREATIONS = [
	{
		id: 1,
		name: "Gourmet Truffle Burger",
		category: "Mains",
		price: "$14.99",
		image: "/gourmet_burger.png",
		tag: "Chef's Signature",
		description:
			"Prime dry-aged beef, melted gruyère, caramelized black truffle aioli, toasted brioche bun.",
	},
	{
		id: 2,
		name: "Margherita Basil Pizza",
		category: "Woodfired",
		price: "$12.99",
		image: "/margherita_pizza.png",
		tag: "Neapolitan Classic",
		description:
			"San Marzano tomatoes, buffalo mozzarella, fresh organic basil, estate olive oil drizzle.",
	},
	{
		id: 3,
		name: "Salmon Avocado Roll",
		category: "Sushi & Raw",
		price: "$15.99",
		image: "/salmon_sushi.png",
		tag: "Fresh Selection",
		description:
			"Sashimi-grade Atlantic salmon, Hass avocado, toasted sesame, house soy glaze.",
	},
	{
		id: 4,
		name: "Berry Chocolate Lava Cake",
		category: "Desserts",
		price: "$8.99",
		image: "/lava_cake.png",
		tag: "Hot Dessert",
		description:
			"Decadent dark chocolate shell, hot molten center, raspberry gastrique, vanilla sugar.",
	},
];

const TESTIMONIALS = [
	{
		quote: "The tomahawk changed how I think about steak. Nothing comes close.",
		name: "— Marcus T.",
		note: "Regular since 2021",
	},
	{
		quote: "Ember & Ash is our anniversary restaurant, every single year. The atmosphere alone is worth it.",
		name: "— Priya & Rohan S.",
		note: "Anniversary guests",
	},
	{
		quote: "I've eaten at Michelin-starred restaurants across three continents. This is where I bring family.",
		name: "— Chef David L.",
		note: "Industry guest",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white overflow-x-hidden">
			{/* Hero Section */}
			<section className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 overflow-hidden">
				{/* Background gradients */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.12),rgba(255,255,255,0))]"></div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_10%_80%,rgba(249,115,22,0.05),rgba(255,255,255,0))]"></div>

				<div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
					{/* Text Column */}
					<div className="lg:col-span-7 space-y-8 text-center lg:text-left">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold uppercase tracking-wider">
							<span></span> The Art of Fine Dining
						</div>
						<h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-stone-900">
							Where culinary craft meets{" "}
							<span className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
								modern alchemy
							</span>
						</h1>
						<p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
							At Aetheria Bistro, we compose symphonies of taste using
							locally-sourced, sustainable ingredients paired with
							avant-garde culinary techniques. Every plate tells an
							unforgettable story.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
							<a
								href="#signature"
								className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 text-center shadow-lg shadow-amber-600/10 active:scale-98"
							>
								Explore Our Creations
							</a>
							<Link
								to={"/about"}
								className="bg-stone-100 hover:bg-stone-200/80 border border-stone-250 text-stone-700 hover:text-stone-900 font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 text-center active:scale-98"
							>
								Our Story
							</Link>
						</div>
					</div>

					{/* Image Grid Column */}
					<div className="lg:col-span-5 relative flex justify-center items-center">
						<div className="relative w-80 h-80 sm:w-96 sm:h-96 group">
							{/* Outer Decorative Rings */}
							<div className="absolute inset-0 rounded-full border border-dashed border-amber-600/20 animate-[spin_60s_linear_infinite]"></div>
							<div className="absolute -inset-4 rounded-full border border-stone-300/40 animate-[spin_40s_linear_infinite_reverse]"></div>

							{/* Rotating Highlight dish */}
							<div className="absolute inset-2 rounded-full overflow-hidden shadow-2xl border-2 border-amber-600/30">
								<img
									src="/gourmet_burger.png"
									alt="Gourmet Showcase"
									className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
								/>
							</div>

							{/* Floating Card badges */}
							<div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md border border-stone-200 p-3 rounded-2xl shadow-xl flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-sm">
									★
								</div>
								<div>
									<h4 className="text-xs font-bold text-stone-900">
										Chef's Choice
									</h4>
									<p className="text-[10px] text-stone-550 font-semibold">
										Truffle Infused Burger
									</p>
								</div>
							</div>

							<div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md border border-stone-200 p-3 rounded-2xl shadow-xl flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-sm">
									✓
								</div>
								<div>
									<h4 className="text-xs font-bold text-stone-900">
										100% Organic
									</h4>
									<p className="text-[10px] text-stone-550 font-semibold">
										Locally Sourced Ingredients
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Restaurant Philosophy / About Section */}
			<section
				id="about"
				className="py-24 bg-stone-100/80 border-y border-stone-200/60 relative"
			>
				<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
					<div className="lg:col-span-6 relative">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-4">
								<img
									src="/margherita_pizza.png"
									alt="Kitchen Craft"
									className="rounded-2xl w-full h-48 object-cover border border-stone-200 shadow-md"
								/>
								<img
									src="/salmon_sushi.png"
									alt="Fresh ingredients"
									className="rounded-2xl w-full h-64 object-cover border border-stone-200 shadow-md"
								/>
							</div>
							<div className="space-y-4 pt-8">
								<img
									src="/lava_cake.png"
									alt="Dessert Presentation"
									className="rounded-2xl w-full h-64 object-cover border border-stone-200 shadow-md"
								/>
								<div className="bg-white p-6 rounded-2xl border border-stone-200 text-center h-48 flex flex-col justify-center items-center shadow-md">
									<span className="text-4xl font-black text-amber-600">
										12+
									</span>
									<span className="text-xs text-stone-550 uppercase tracking-widest mt-2 font-bold">
										Awards Won
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="lg:col-span-6 space-y-6">
						<span className="text-xs font-bold uppercase tracking-widest text-amber-600">
							Our Heritage
						</span>
						<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
							We believe food is the ultimate luxury of expression
						</h2>
						<p className="text-stone-600 leading-relaxed text-sm sm:text-base font-medium">
							For over a decade, Aetheria Bistro has redefined modern
							gastronomy. Our team of world-class chefs selects only the
							finest heirloom seeds, artisanal cheeses, and hand-selected
							marine catches to formulate dishes that inspire
							conversation.
						</p>
						<p className="text-stone-600 leading-relaxed text-sm sm:text-base font-medium">
							We coordinate directly with local micro-farms to ensure
							ingredients make their journey from soil to plate in under
							twenty-four hours. Experience fine dining in a relaxed,
							sophisticated atmosphere.
						</p>
						<div className="pt-4 flex gap-8">
							<div>
								<h4 className="text-xl font-bold text-stone-900">
									100%
								</h4>
								<p className="text-xs text-stone-500 font-semibold">
									Fresh Produce
								</p>
							</div>
							<div className="border-l border-stone-300 pl-8">
								<h4 className="text-xl font-bold text-stone-900">
									Zero
								</h4>
								<p className="text-xs text-stone-500 font-semibold">
									Artificial Preservatives
								</p>
							</div>
							<div className="border-l border-stone-300 pl-8">
								<h4 className="text-xl font-bold text-stone-900">
									200+
								</h4>
								<p className="text-xs text-stone-500 font-semibold">
									Premium Wine Pairings
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Signature Creations Section */}
			<section
				id="signature"
				className="py-24 px-6 max-w-7xl mx-auto w-full"
			>
				<div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
					<span className="text-xs font-bold uppercase tracking-widest text-amber-600">
						Menu Highlights
					</span>
					<h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900">
						Our Signature Creations
					</h2>
					<p className="text-stone-600 text-sm sm:text-base font-medium">
						A curated glimpse of our most acclaimed seasonal entries.
						Crafted by hand, presented with passion.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{SIGNATURE_CREATIONS.map((creation) => (
						<div
							key={creation.id}
							className="bg-white hover:bg-stone-50/50 border border-stone-200/80 hover:border-amber-600/30 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-stone-100"
						>
							<div>
								{/* Image wrapper */}
								<div className="relative h-56 overflow-hidden bg-stone-100">
									<img
										src={creation.image}
										alt={creation.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									<span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-700 border border-stone-200">
										{creation.tag}
									</span>
								</div>
								{/* Info */}
								<div className="p-5 space-y-2">
									<span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
										{creation.category}
									</span>
									<h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
										{creation.name}
									</h3>
									<p className="text-stone-550 text-xs leading-relaxed line-clamp-3 font-medium">
										{creation.description}
									</p>
								</div>
							</div>

							<div className="p-5 pt-0 mt-2 flex items-center justify-between border-t border-stone-100">
								<span className="text-lg font-extrabold text-amber-600">
									{creation.price}
								</span>
								<span className="text-stone-400 text-xs font-semibold">
									Exquisite Taste
								</span>
							</div>
						</div>
					))}
				</div>
			</section>
			{/* peoples voice */}
			<div className="bg-[#1A1714] py-24 px-12 w-full">
				<div className="max-w-5xl mx-auto my-0">
					<p className="text-amber-500 text-xs font-semibold uppercase tracking-widest mb-3">
						Voices
					</p>
					<h2 className=" font-serif text-3xl text-[#F0E6D3] font-bold mb-3 tracking-wider lg:text-4xl">
						What People Say
					</h2>
					<div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-6">
						{TESTIMONIALS.map((t, i) => (
							<div
								key={i}
								className="border border-stone-500 bg-[#f0e6d30d] p-6"
							>
								<p className="text-3xl text-[#C4622D] font-serif mb-2  ">
									"
								</p>
								<p className="text-[#E8C9A0] font-serif italic text-xl mb-6">
									{t.quote}
								</p>
								<p className="text-[#F0E6D3] text-sm font-medium">
									{t.name}
								</p>
								<p className="text-[#6B6560] text-xs tracking-wider">
									{t.note}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* quote */}
			<div className="py-24 px-12 w-full">
				<div className="max-w-2xl mx-auto my-0 text-center flex flex-col gap-6">
					<p className="text-4xl/12 lg:text-5xl/14 font-serif italic">
						Located in the heart of Calcutta’s ‘Little Ethiopia’, we
						strive to bring you the best of the vibrant, traditional
						cuisine of Ethiopia.{" "}
					</p>
					<p className="text-md font-['Lucida_Grande','Lucida_Sans_Unicode',Verdana,sans-serif] text-amber-700 tracking-wide">
						Our Resturant is open Monday - Sunday 11:30AM - 11PM
					</p>
					<Link
						to={"/"}
						className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-lg text-sm transition-all duration-300 text-center shadow-lg shadow-amber-600/10 active:scale-98 w-[70%] mx-auto lg:w-[40%]"
					>
						Explore Menu
					</Link>
				</div>
			</div>
		</div>
	);
}
