import React, { useContext, useEffect, useState } from "react";
import POSContext from "../Context/POSContext";

export default function StaffRegister() {
	const host = import.meta.env.VITE_BACKEND_URL;
	const context = useContext(POSContext);
	const { staffList, fetchStaff } = context;
	useEffect(() => {
		fetchStaff();
		//eslint-disable-next-line
	}, []);
	const [form, setForm] = useState({
		username: "",
		password: "",
		role: "CASHIER",
	});
	const [message, setMessage] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.password !== confirmPassword) {
			setMessage("Passwords do not match!");
			return;
		}
		const token = localStorage.getItem("token"); // Retrieve admin token

		const response = await fetch(`${host}/api/auth/register-staff`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`, // Send admin token in request headers
			},
			body: JSON.stringify({
				username: form.username,
				password: form.password,
				role: form.role,
			}),
		});

		const data = await response.json();
		if (response.ok) {
			setMessage("Staff registered successfully!");
			setForm({
				username: "",
				password: "",
				role: "CASHIER",
			});
			setConfirmPassword("");
		} else {
			setMessage(data.error || "Failed to register staff");
		}
	};

	return (
		<div className="flex flex-col lg:flex-row items-stretch  justify-center min-h-screen bg-slate-50 text-stone-850 p-6 lg:p-12 gap-8 maxw-7xl mx-auto">
			<form
				onSubmit={handleSubmit}
				className={
					"w-full lg:w-1/2 bg-slate-100 p-8 rounded-xl border border-slate-300 hover:border-emerald-600/50 transition duration-200 shadow-xl space-y-4 flex flex-col justify-between"
				}
			>
				<h2 className="text-2xl font-bold text-center text-amber-600">
					Register Staff
				</h2>
				{message && (
					<div
						className={`${message.includes("successfully") ? "w-full mb-6 p-4 bg-green-500/40 border border-green-700/20 rounded-2xl  text-[13px] flex items-center gap-3 text-stone-700" : "w-full mb-6 p-4 bg-red-500/40 border border-red-700/20 rounded-2xl  text-[13px] flex items-center gap-3 text-stone-700"} text-md font-semibold text-center`}
					>
						{message}
					</div>
				)}
				<div className="space-y-2">
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
						value={form.username}
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
						value={form.password}
						placeholder="Enter Password"
						onChange={(e) =>
							setForm({ ...form, password: e.target.value })
						}
						className="w-full px-4 py-3 bg-zinc-200/50 border border-zinc-400 rounded-xl text-stone-800 font-medium placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="confirmPassword"
						className="text-zinc-500 font-medium text-sm tracking-wider block"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						required
						type="password"
						value={confirmPassword}
						placeholder="Confirm Password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full px-4 py-3 bg-zinc-200/50 border border-zinc-400 rounded-xl text-stone-800 font-medium placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="role"
						className="text-zinc-500 font-medium text-sm tracking-wider block"
					>
						Select Role
					</label>
					<select
						id="role"
						className="w-full px-4 py-3 bg-zinc-200/50 border border-zinc-400 rounded-xl text-stone-800 font-medium placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition duration-200 text-sm"
						value={form.role}
						onChange={(e) =>
							setForm({ ...form, role: e.target.value })
						}
					>
						<option
							className="w-full text-stone-800 bg-gray-100 border border-slate-400 p-2 rounded"
							value="CASHIER"
						>
							Cashier
						</option>
						<option
							className="w-full text-stone-800 bg-gray-100 border border-slate-400 p-2 rounded"
							value="KITCHEN"
						>
							Kitchen Staff
						</option>
						<option
							className="w-full text-stone-800 bg-gray-100 border border-slate-400 p-2 rounded"
							value="ADMIN"
						>
							Admin
						</option>
					</select>
				</div>

				<button
					type="submit"
					className="w-full bg-amber-600 py-2 rounded font-bold hover:bg-amber-300 transition text-white cursor-pointer"
				>
					Register
				</button>
			</form>
			<div className="w-full lg:w-1/2 bg-slate-100 p-8 rounded-xl border border-slate-300 shadow-xl flex flex-col justify-between">
				<h2 className="text-2xl font-bold text-stone-800 mb-6 border-b pb-3">
					Active Staff List
				</h2>
				<div className="overflow-y-auto space-y-4 max-h-[60vh] pr-2">
					{staffList.length === 0 ? (
						<p className="ext-zinc-550 italic">No regis staff found...</p>
					) : (
						staffList.map((Staff) => (
							<div
								key={Staff._id}
								className="flex justify-between items-center p-4 bg-zinc-50 border border-zinc-200 rounded-xl"
							>
								<div>
									<h4 className="font-bold text-stone-800">
										{Staff.username}
									</h4>
									<p className="text-xs text-zinc-500 uppercase tracking-wider">
										{Staff.role}
									</p>
								</div>
								<span
									className={`px-3 py-1 rounded-full text-xs font-bold ${
										Staff.role === "ADMIN"
											? "bg-amber-100 text-amber-800"
											: Staff.role === "KITCHEN"
												? "bg-emerald-100 text-emerald-800"
												: "bg-blue-100 text-blue-800"
									}`}
								>
									{Staff.role}
								</span>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
