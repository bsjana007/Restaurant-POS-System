import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import MenuItem from "../models/MenuModel.js";

const router = express.Router();

// Configure Cloudinary Credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

//// Configure Multer Storage for Cloudinary integration
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "menu-items",
		allowed_formats: ["jpg", "png", "jpeg", "webp"],
	},
});

const upload = multer({ storage: storage });

//all menu items
router.get("/", async (req, res) => {
	try {
		const items = await MenuItem.find().sort({ category: 1, name: 1 });
		res.status(200).json(items);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//fetch all available menu item
router.get("/available", async (req, res) => {
	try {
		const items = await MenuItem.find({ isAvailable: true }).sort({
			category: 1,
			name: 1,
		});
		res.status(200).json(items);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// add new mwnu itm
router.post("/add", upload.single("image"), async (req, res) => {
	try {
		const { name, description, price, category } = req.body;

		// req.file.path contains the secure HTTPS url returned by Cloudinary CDN
		const imageUrl = req.file ? req.file.path : "";

		const newItem = new MenuItem({
			name,
			description,
			price,
			category,
			imageUrl,
			isAvailable: true,
		});

		const savedItem = await newItem.save();
		res.status(201).json(savedItem);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//Toggle Menu Item Availability (Enable/Disable in Kitchen)
router.patch("/:id/availability", async (req, res) => {
	try {
		const { id } = req.params;
		const { isAvailable } = req.body;

		const updatedItem = await MenuItem.findByIdAndUpdate(
			id,
			{ isAvailable },
			{ returnDocument: "after" },
		);

		res.status(200).json(updatedItem);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
