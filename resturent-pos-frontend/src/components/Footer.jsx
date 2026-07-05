import React from "react";
import { Link } from "react-router-dom";

function Footer() {
	return (
		<>
			{/* Footer */}
			<footer
				id="contact"
				className="bg-stone-100 border-t border-stone-200 py-16 px-6 mt-auto"
			>
				<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
					{/* Logo & Hours */}
					<div className="space-y-4">
						<h3 className="text-xl font-black tracking-widest bg-linear-to-r from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
							AETHERIA
						</h3>
						<p className="text-xs text-stone-550 leading-relaxed font-semibold">
							Crafting exquisite dining memories with local heritage and
							avant-garde technique.
						</p>
						<p className="text-xs text-amber-600 font-bold">
							Monday - Sunday: 11:30 AM - 11:00 PM
						</p>
					</div>

					{/* Navigation links */}
					<div className="space-y-4">
						<h4 className="text-xs font-bold uppercase tracking-widest text-stone-700">
							Navigation
						</h4>
						<ul className="space-y-2 text-xs text-stone-550 font-semibold">
							<li>
								<a
									href="#about"
									className="hover:text-amber-600 transition-colors"
								>
									Our Story
								</a>
							</li>
							<li>
								<a
									href="#signature"
									className="hover:text-amber-600 transition-colors"
								>
									Signature Dishes
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Details */}
					<div className="space-y-4">
						<h4 className="text-xs font-bold uppercase tracking-widest text-stone-700">
							Contact Us
						</h4>
						<ul className="space-y-2 text-xs text-stone-550 font-semibold">
							<li>📍 482 Culinary Ave, Suite 100</li>
							<li>📞 (555) 234-5678</li>
							<li>✉️ hello@aetheria.com</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className="space-y-4">
						<h4 className="text-xs font-bold uppercase tracking-widest text-stone-700">
							Newsletter
						</h4>
						<p className="text-xs text-stone-500 font-medium">
							Subscribe for early alerts to exclusive seasonal tastings
							and wine pairings.
						</p>
						<div className="flex gap-2">
							<input
								type="email"
								placeholder="Your email..."
								className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 w-full min-w-0 grow" //flex-grow can be written as grow
							/>
							<button className="bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-amber-500 transition-colors">
								Join
							</button>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto border-t border-stone-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-550 font-semibold">
					<p>© 2026 Aetheria Bistro. All rights reserved.</p>
					<div className="flex gap-4">
						<Link to="/staff-login" className="hover:text-amber-600">
							Staff Login
						</Link>
						<Link to="/admin/tables" className="hover:text-amber-600">
							Admin Home
						</Link>
						<a href="#" className="hover:text-amber-600">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-amber-600">
							Terms of Use
						</a>
					</div>
				</div>
			</footer>
		</>
	);
}

export default Footer;
