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
			const res = await fetch("http://localhost:3000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
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
		<form
			onSubmit={handleLogin}
			className={`${isModal ? "" : "bg-slate-100 p-8 rounded-xl border w-80 border-slate-300 hover:border-emerald-600/50 transition duration-200 shadow-xl"} space-y-4`}
		>
			<h2 className="text-2xl font-bold text-center text-amber-600">
				POS Login
			</h2>
			{err && <p className="text-red-500 text-sm text-center">{err}</p>}
			<input
				required
				type="text"
				placeholder="Username"
				onChange={(e) => setForm({ ...form, username: e.target.value })}
				className="w-full text-stone-800 bg-gray-100 border border-slate-400 p-2 rounded "
			/>
			<input
				required
				type="password"
				placeholder="Password"
				onChange={(e) => setForm({ ...form, password: e.target.value })}
				className="w-full text-stone-800 bg-gray-100 border border-slate-400 p-2 rounded"
			/>
			<button
				type="submit"
				className="w-full bg-amber-600 py-2 rounded font-bold hover:bg-amber-300 transition text-white cursor-pointer"
			>
				Login
			</button>
		</form>
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
