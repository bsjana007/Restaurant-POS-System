import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import POSContext from "../Context/POSContext";

function Navbar() {
	const navigate = useNavigate();
	const context = useContext(POSContext);
	const { role } = context;
	const currRole = role || localStorage.getItem("role");
	return (
		<div>
			{/* Navbar */}
			<header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-stone-200/60 transition-all duration-300">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span
							className="text-2xl font-black tracking-widest bg-linear-to-r from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent cursor-pointer"
							onClick={() => navigate(`/`)}
						>
							AETHERIA
						</span>
					</div>
					{(currRole == "ADMIN" ||
						currRole == "KITCHEN" ||
						currRole == "CASHIER") && (
						<>
							<div>
								<div className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-600/10 hover:shadow-amber-600/25 active:scale-95">
									{currRole}
								</div>
							</div>
						</>
					)}
					{currRole == "CUSTOMER" && (
						<>
							<nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-600">
								<Link
									to={"/menu"}
									className="hover:text-amber-600 transition-colors"
								>
									Menu
								</Link>
								<Link
									to={"/about"}
									className="hover:text-amber-600 transition-colors"
								>
									Our Story
								</Link>
								<a
									href="/#signature"
									className="hover:text-amber-600 transition-colors"
								>
									Signature Dishes
								</a>
								<a
									href="/#contact"
									className="hover:text-amber-600 transition-colors"
								>
									Contact
								</a>
							</nav>
							<div>
								<Link
									to={"/reservations"}
									className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-600/10 hover:shadow-amber-600/25 active:scale-95"
								>
									Reservations
								</Link>
							</div>
						</>
					)}
				</div>
			</header>
		</div>
	);
}

export default Navbar;
