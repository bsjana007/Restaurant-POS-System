import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register-staff", async (req, res) => {
	try {
		const { username, password, role } = req.body;
		const userExists = await User.findOne({ username });
		if (userExists0) {
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

		const token = jwt.sign(data, JWT_SECRET, { expiresIn: "12h" });

		res.status(200).json({ token, role: user.role, username: user.username });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
