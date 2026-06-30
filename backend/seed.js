import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// const { MenuItemModel, TableModel } = require("./models/db");
import User from "./models/User.js";

const MONGO_URI = process.env.MONGO_URI;

// const seedItems = [
// 	{
// 		name: "Veg Samosa",
// 		description: "Crispy pastry filled with potatoes and peas.",
// 		price: 4.99,
// 		category: "Starter",
// 	},
// 	{
// 		name: "Spring Rolls",
// 		description: "Fried vegetable wrap.",
// 		price: 5.99,
// 		category: "Starter",
// 	},
// 	{
// 		name: "Chicken Tikka Masala",
// 		description: "Grilled chicken in spicy tomato cream sauce.",
// 		price: 14.99,
// 		category: "Indian",
// 	},
// 	{
// 		name: "Margherita Pizza",
// 		description: "Tomatoes, mozzarella, fresh basil.",
// 		price: 12.99,
// 		category: "Western",
// 	},
// 	{
// 		name: "Fried Rice",
// 		description: "Stir-fried rice with mixed veggies.",
// 		price: 10.99,
// 		category: "Chinese",
// 	},
// ];

// const seedTables = [
// 	{ number: "T-01", capacity: 2 },
// 	{ number: "T-02", capacity: 4 },
// 	{ number: "T-03", capacity: 4 },
// 	{ number: "T-04", capacity: 6 },
// ];

const seedUsers = [
	{ username: "bsjana_07", password: "Bhabani@2006", role: "ADMIN" },
	// { username: "chef1", password: "chefpassword", role: "KITCHEN" },
	// { username: "cashier1", password: "cashierpassword", role: "CASHIER" },
];

async function seed() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to DB for seeding...");

		// await MenuItemModel.deleteMany({});
		// await MenuItemModel.insertMany(seedItems);

		// await TableModel.deleteMany({});
		// await TableModel.insertMany(seedTables);

		await User.deleteMany({});
		for (let u of seedUsers) {
			const salt = await bcrypt.genSalt(10);
			u.password = await bcrypt.hash(u.password, salt);
			const newUser = new User(u);
			await newUser.save();
		}

		console.log("Database seeded successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Seeding error:", error);
		process.exit(1);
	}
}

seed();
