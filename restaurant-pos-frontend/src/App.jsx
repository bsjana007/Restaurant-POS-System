// import { useState } from 'react'

import "./App.css";
import POSState from "./Context/POSState";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminQRPanel from "./components/AdminQRPanel";
import AdminMenuManager from "./components/AdminMenuManager";
import AdminDashboard from "./components/AdminDashboard";
import QRMenuPage from "./components/QRMenuPage";
import StaffRegister from "./components/StaffRegister";
import StaffLogin from "./components/StaffLogin";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import KDSDashboard from "./components/KDSDashboard";
import CahierDashboard from "./components/CahierDashboard";

function App() {
	return (
		<>
			<POSState>
				<Router>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/table/:tableId" element={<QRMenuPage />} />

						{/* Protected Admin Routes */}
						<Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
							<Route
								path="/admin"
								element={<AdminDashboard blurred={false} />}
							/>
							<Route path="/admin/tables" element={<AdminQRPanel />} />
							<Route path="/admin/menu" element={<AdminMenuManager />} />
							<Route
								path="/admin/register-staff"
								element={<StaffRegister />}
							/>
						</Route>

						<Route element={<GuestRoute />}>
							<Route path="/staff-login" element={<StaffLogin />} />
						</Route>

						<Route
							element={
								<ProtectedRoute allowedRoles={["KITCHEN", "ADMIN"]} />
							}
						>
							<Route path="/kitchen" element={<KDSDashboard />} />
						</Route>

						<Route
							element={
								<ProtectedRoute allowedRoles={["CASHIER", "ADMIN"]} />
							}
						>
							<Route path="/cashier" element={<CahierDashboard />} />
						</Route>
					</Routes>
					<Footer />
				</Router>
			</POSState>
		</>
	);
}

export default App;
