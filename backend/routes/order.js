import express from "express";
import TableModel from "../models/TableModel.js";
import OrderModel from "../models/OrderModel.js";

const router = express.Router();

//create new order (From QR Table Ordering Screen)
router.post("/", async (req, res) => {
	try {
		const { tableId, items } = req.body;
		const io = req.app.get("io");

		const totalAmount = items.reduce((acc, item) => {
			return acc + item.price * item.quantity;
		}, 0);

		const newOrder = new OrderModel({
			tableId,
			items,
			totalAmount,
			status: "PENDING",
		});

		const savedOrder = await newOrder.save();

		//undate table  status to OCCUpied
		await TableModel.findByIdAndUpdate(tableId, { status: "OCCUPIED" });

		//populate table info
		const populatedOrder = await savedOrder.populate("tableId");

		// Broadcast to KDS and Cashiers in real-time
		io.to("kitchen").emit("order-recieved", populatedOrder);
		io.to("cashier").emit("order-recieved", populatedOrder);

		// Notify all devices active on this specific table
		io.to(`table: ${tableId}`).emit("order-status-updated", populatedOrder);

		res.status(201).json(populatedOrder);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error creating order", error);
	}
});

// update order status
router.patch("/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const io = req.app.get("io");

		const updatedOrder = await OrderModel.findByIdAndUpdate(
			id,
			{ status },
			{ new: true },
		).populate("tableId");

		if (!updatedOrder)
			return res.status(400).json({ message: "Order not found" });

		io.to("kitchen").emit("status-changed", updatedOrder);
		io.to("cashier").emit("status-changed", updatedOrder);
		io.to(`table:${updatedOrder.tableId._id}`).emit(
			"status-changed",
			updatedOrder,
		);

		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//fetch all active orders
router.get("/active", async (req, res) => {
	try {
		const activeOrders = await OrderModel.find({
			status: {
				$in: ["PENDING", "CONFIRMED", "PREPARING", "READY", "SERVED"],
			},
		})
			.populate("tableId")
			.sort({ createdAt: 1 }); //oldert first : FIFO

		res.status(200).json(activeOrders);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log(error);
	}
});

export default router;
