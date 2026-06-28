import express from "express";
import QRCode from "qrcode";
import { generateSecureTableUrl } from "../utils/qr.js";
import TableModel from "../models/TableModel.js";

const router = express.Router();

//get all table (floor map view)
router.get("/", async (req, res) => {
	try {
		const tables = await TableModel.find().sort({ number: 1 });
		res.status(200).json(tables);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//create a new table
router.post("/add", async (req, res) => {
	try {
		const { number, capacity } = req.body;

		//check if the table is already available
		const existingTable = await TableModel.findOne({ number });

		if (existingTable)
			return res.status(400).josn({ error: "table already exist" });

		const newTable = new TableModel({
			number,
			capacity,
			status: "VACANT",
		});

		const savedTable = await newTable.save();
		res.status(201).json(savedTable);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// generate qr code for table
router.post("/:id/generate-qr", async (req, res) => {
	const { id } = req.params;
	const table = await TableModel.findById(id);
	if (!table) {
		return res.status(404).json({ error: "Table not found" });
	}

	const targetUrl = generateSecureTableUrl(table._id.toString());
	const qrCodeDataUrl = await QRCode.toDataURL(targetUrl, {
		errorCorrectionLevel: "H",
		margin: 2,
		color: {
			dark: "#0f172a",
			light: "#ffffff",
		},
	});

	table.qrCodeUrl = qrCodeDataUrl;
	await table.save();
	res.status(200).json({
		message: "QR Code generated successfully",
		qrCodeUrl: qrCodeDataUrl,
		targetUrl,
	});
});

//update table status manually
router.post("/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const status = req.body;
		const io = router.app.get("io");

		const updatedTable = await TableModel.findByIdAndUpdate(
			id,
			{ status },
			{ new: true },
		);

		if (!updatedTable)
			return res.status(404).json({ message: "Table not found" });

		io.to("cashier").emit("table-status-updated", updatedTable);

		res.status(200).json(updatedTable);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
