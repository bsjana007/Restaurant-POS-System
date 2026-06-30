import React, { useState } from "react";

export default function StaffRegister() {
	const [form, setForm] = useState({
		username: "",
		password: "",
		role: "CASHIER",
	});
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token"); // Retrieve admin token

		const response = await fetch(
			"http://localhost:3000/api/auth/register-staff",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Send admin token in request headers
				},
				body: JSON.stringify(form),
			},
		);

		const data = await response.json();
		if (response.ok) {
			setMessage("Staff registered successfully!");
		} else {
			setMessage(data.error || "Failed to register staff");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{message && <p>{message}</p>}
			<input
				type="text"
				placeholder="Username"
				onChange={(e) => setForm({ ...form, username: e.target.value })}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				onChange={(e) => setForm({ ...form, password: e.target.value })}
				required
			/>

			{/* Dropdown to define the role */}
			<select
				value={form.role}
				onChange={(e) => setForm({ ...form, role: e.target.value })}
			>
				<option value="CASHIER">Cashier</option>
				<option value="KITCHEN">Kitchen Staff</option>
				<option value="ADMIN">Admin</option>
			</select>

			<button type="submit">Register Staff</button>
		</form>
	);
}
