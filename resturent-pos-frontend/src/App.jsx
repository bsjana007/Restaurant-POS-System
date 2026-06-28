// import { useState } from 'react'

import "./App.css";
import POSState from "./Context/POSState";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminQRPanel from "./components/AdminQRPanel";
import AdminMenuManager from "./components/AdminMenuManager";

function App() {
	return (
		<>
			<POSState>
				<Router>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/admin/tables" element={<AdminQRPanel />} />
						<Route path="/admin/menu" element={<AdminMenuManager />} />
					</Routes>
					<Footer />
				</Router>
			</POSState>
		</>
	);
}

export default App;
