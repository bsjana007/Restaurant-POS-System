import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffLogin({ onLoginSuccess, isModal }) {
	const [form, setForm] = useState({ username: "", password: "" });
	const [err, setErr] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(form),
				},
			);
			const data = await res.json();

			if (res.ok) {
				localStorage.setItem("token", data.token);
				localStorage.setItem("role", data.role);
				if (isModal && onLoginSuccess) {
					onLoginSuccess();
				} else {
					if (data.role === "ADMIN") navigate("/admin/tables");
					else if (data.role === "KITCHEN") navigate("/kitchen");
					else if (data.role === "CASHIER") navigate("/cashier");
				}
			} else {
				setErr(data.error);
			}
		} catch {
			setErr("Connection error");
		}
	};

	const formContent = (
		<div
			className={`${isModal ? "" : "bg-slate-100 p-8 rounded-xl border h-100 w-150 border-slate-300 hover:border-emerald-600/50 transition duration-200 shadow-xl "} space-y-5`}
		>
			<h2 className="text-2xl font-bold text-center text-amber-600">
				POS Login
			</h2>
			<p className="text-md text-zinc-600 mb-8 text-center font-semibold">
				Our Staffs are most precious to us.
			</p>
			{err && (
				<p className="text-red-500 text-sm text-center flex flex-col justify-center">
					{err}
				</p>
			)}
			<form onSubmit={handleLogin}>
				<div className="space-y-2 py-3">
					<label
						htmlFor="username"
						className="text-zinc-500 font-medium text-sm tracking-wider block"
					>
						Username
					</label>
					<input
						id="username"
						required
						type="text"
						placeholder="Enter Username"
						onChange={(e) =>
							setForm({ ...form, username: e.target.value })
						}
						className="w-full px-4 py-3 bg-zinc-200/50 border border-zinc-400 rounded-xl text-stone-800 font-medium placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="password"
						className="text-zinc-500 font-medium text-sm tracking-wider block"
					>
						Password
					</label>
					<input
						id="password"
						required
						type="password"
						placeholder="Enter Password"
						onChange={(e) =>
							setForm({ ...form, password: e.target.value })
						}
						className="w-full px-4 py-3 bg-zinc-200/50 border border-zinc-400 rounded-xl focus:text-stone-800 font-medium placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
					/>
				</div>

				<button
					type="submit"
					className="mt-6 w-full bg-amber-600 py-2 rounded font-bold hover:bg-amber-300 transition text-white cursor-pointer"
				>
					Login
				</button>
			</form>
		</div>
	);

	if (isModal) {
		return formContent;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-50 text-white">
			{formContent}
		</div>
	);
}

export default StaffLogin;
