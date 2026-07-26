import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyTableSignature } from "../utils/qr.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET;

router.post("/register-staff", async (req, res) => {
	try {
		const { username, password, role } = req.body;

		const allowedRoles = ["ADMIN", "KITCHEN", "CASHIER"];
		if (!allowedRoles.includes(role)) {
			return res.status(400).json({ error: "Invalid role specified." });
		}

		const userExists = await User.findOne({ username });
		if (userExists) {
			return res.status(400).json({ message: "Username already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const securedPass = await bcrypt.hash(password, salt);

		const newUser = new User({
			username,
			password: securedPass,
			role,
		});

		const savedUser = await newUser.save();

		res.status(201).json({
			message: "staff user created successfully",
			user: {
				id: savedUser._id,
				username: savedUser.username,
				role: savedUser.role,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		if (!user) {
			return res
				.status(401)
				.json({ message: "Invalid Username or Password" });
		}

		const passwordCompare = await bcrypt.compare(password, user.password);
		if (!passwordCompare) {
			return res
				.status(401)
				.json({ message: "Invalid Username or Password" });
		}

		const data = {
			user: {
				userId: user._id,
				role: user.role,
			},
		};

		const token = jwt.sign(data, getJwtSecret(), { expiresIn: "12h" });

		res.status(200).json({ token, role: user.role, username: user.username });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//customer session
router.post("/customer-session", (req, res) => {
	try {
		const { tableId, signature } = req.body;
		// console.log("Customer Session request - tableId:", tableId, "signature:", signature);

		if (!verifyTableSignature(tableId, signature)) {
			// console.log("Verification failed for tableId:", tableId);
			return res
				.status(403)
				.json({ error: "Access Denied: Invalid QR signature." });
		}

		const token = jwt.sign({ tableId, role: "CUSTOMER" }, getJwtSecret(), {
			expiresIn: "3h",
		});

		res.status(200).json({ token, tableId });
	} catch (error) {
		// console.error("Error in customer-session route:", error);
		res.status(500).json({ error: error.message });
	}
});

router.get("/staff", async (req, res) => {
	try {
		const staff = await User.find({}, "username role");
		res.status(200).json(staff);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
