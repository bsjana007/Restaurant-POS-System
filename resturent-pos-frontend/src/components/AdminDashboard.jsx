import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard({ blurred }) {
	return (
		<div
			className={`p-8 bg-slate-50 text-white min-h-screen flex items-center justify-center transition duration-300 ${blurred ? "blur-[2px] select-none pointer-events-none opacity-40 w-full" : "w-full"}`}
		>
			<div className="max-w-4xl w-full space-y-8">
				<div className="space-y-2">
					<h1 className="text-4xl font-black tracking-tight text-amber-500">
						Welcome back, Admin 👋
					</h1>
					<p className="text-gray-600 text-sm">
						Select a module to manage your restaurant operations.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{/* Menu Card */}
					<div className="bg-slate-100 border border-slate-300 p-6 rounded-2xl flex flex-col justify-between  hover:border-emerald-600/50 transition duration-200 shadow-lg">
						<div>
							<div className="text-3xl  mb-2">🍽</div>
							<h2 className="text-xl font-bold text-stone-800">Menu</h2>
							<p className="text-slate-500 text-xs mt-1">
								Manage dishes, pricing, and availability.
							</p>
						</div>
						<Link
							to="/admin/menu"
							className="mt-6 inline-flex items-center text-amber-600 hover:text-amber-300 font-semibold text-sm"
						>
							Open →
						</Link>
					</div>

					{/* Tables Card */}
					<div className="bg-slate-100 border border-slate-300 p-6 rounded-2xl flex flex-col justify-between  hover:border-emerald-600/50 transition duration-200 shadow-lg">
						<div>
							<div className="text-3xl mb-2">🪑</div>
							<h2 className="text-xl font-bold text-stone-800">
								Tables
							</h2>
							<p className="text-slate-500 text-xs mt-1">
								Configure layout grid and print QR codes.
							</p>
						</div>
						<Link
							to="/admin/tables"
							className="mt-6 inline-flex items-center text-amber-600 hover:text-amber-300 font-semibold text-sm"
						>
							Open →
						</Link>
					</div>

					{/* Staff Card */}
					<div className="bg-slate-100 border border-slate-300 p-6 rounded-2xl flex flex-col justify-between  hover:border-emerald-600/50 transition duration-200 shadow-lg">
						<div>
							<div className="text-3xl mb-2">👥</div>
							<h2 className="text-xl font-bold text-stone-800">Staff</h2>
							<p className="text-slate-500 text-xs mt-1">
								Register new kitchen staff, cashiers, or admins.
							</p>
						</div>
						<Link
							to="/admin/register-staff"
							className="mt-6 inline-flex items-center text-amber-600 hover:text-amber-300 font-semibold text-sm"
						>
							Open →
						</Link>
					</div>

					{/* Analytics Card */}
					<div className="bg-slate-100 border border-slate-300 p-6 rounded-2xl flex flex-col justify-between  hover:border-emerald-600/50 transition duration-200 shadow-lg">
						<div>
							<div className="text-3xl mb-2">📊</div>
							<h2 className="text-xl font-bold text-stone-800">
								Analytics
							</h2>
							<p className="text-slate-500 text-xs mt-1">
								View restaurant sales, orders, and reports.
							</p>
						</div>
						<span className="mt-6 inline-flex items-center text-slate-600 font-semibold text-sm cursor-not-allowed">
							Coming Soon
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
