import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffLogin from "./StaffLogin";
import AdminDashboard from "./AdminDashboard";

export default function ProtectedRoute({ allowedRoles }) {
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [role, setRole] = useState(localStorage.getItem("role"));

	// Listen for login success from modal (updating local state)
	const handleLoginSuccess = () => {
		setToken(localStorage.getItem("token"));
		setRole(localStorage.getItem("role"));
		setShowLoginModal(false);
	};

	const isAuthorized = token && allowedRoles.includes(role);

	if (!isAuthorized) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-white overflow-hidden">
				{/* Left Side: Blurred Admin Dashboard Home */}
				<div className="w-full md:w-3/5 flex items-center justify-center relative border-r border-slate-900">
					<AdminDashboard blurred={true} />
				</div>

				{/* Right Side: Session Expired Panel */}
				<div className="w-full md:w-2/5 flex items-center justify-center p-8 bg-slate-50/30 backdrop-blur-md relative">
					{/* Ambient Decorative Light */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl"></div>

					<div className="z-10 bg-slate-100 border border-slate-300 hover:border-emerald-600/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl space-y-6">
						<div className="mx-auto w-16 h-16 bg-amber-500/30 rounded-full flex items-center justify-center border border-amber-500/20 text-amber-500 text-3xl">
							🔒
						</div>
						<div className="space-y-2">
							<h2 className="text-2xl text-stone-800 font-bold tracking-tight">
								Session Expired
							</h2>
							<p className="text-slate-500 text-sm leading-relaxed">
								Your admin session has expired or you do not have
								permission to view this page. Please log in again to
								access the admin tools.
							</p>
						</div>

						<button
							onClick={() => setShowLoginModal(true)}
							className="w-full py-3 bg-amber-600 hover:bg-amber-400 active:bg-amber-500 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-amber-900/20 cursor-pointer	"
						>
							Login Now
						</button>
					</div>
				</div>

				{/* Modal Overlay */}
				{showLoginModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
						<div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
							<button
								onClick={() => setShowLoginModal(false)}
								className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl transition"
							>
								✕
							</button>
							<StaffLogin
								onLoginSuccess={handleLoginSuccess}
								isModal={true}
							/>
						</div>
					</div>
				)}
			</div>
		);
	}

	return <Outlet />;
}
