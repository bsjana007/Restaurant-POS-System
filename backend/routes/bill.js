import express from "express";
import BillModel from "../models/BillModel.js";
import OrderModel from "../models/OrderModel.js";
import TableModel from "../models/TableModel.js";

const router = express.Router();

//generate bill for table
router.post("/generate", async (req, res) => {
	try {
		const { tableId, discount = 0, paymentMethod } = req.body;
		const io = req.app.get("io");

		const order = await OrderModel.findOne({
			tableId,
			status: { $in: "SERVED" },
		});

		if (!order)
			return res
				.status(404)
				.json({ message: "No Active orders found for this table" });

		const subTotal = order.totalAmount;
		const taxRate = 0.05; //5% VAT/GST
		const tax = Number((subTotal * taxRate).toFixed(2));
		const grandTotal = Number((subTotal + tax - discount).toFixed(2));

		const newBill = new BillModel({
			orderId: order._id,
			tableId,
			subTotal,
			tax,
			discount,
			grandTotal,
			paymentMethod,
			isPaid: false,
		});

		const savedBill = await newBill.save();

		//mark table status as BILLING
		await TableModel.findByIdAndUpdate(tableId, { status: "BILLING" });

		//notify cashier and customer devices
		io.to("cashier").emit("bill-generated", savedBill);
		io.to(`Table: ${tableId}`).emit("bill-recieved", savedBill);

		res.status(200).json(savedBill);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

//process bill payment
router.post("/:id/pay", async (req, res) => {
	try {
		const { id } = req.params;
		const io = router.app.get("io");

		const bill = await BillModel.findByIdAndUpdate(
			id,
			{ isPaid: true, paidAt: new Date() },
			{ new: true },
		);

		//update order status to complete
		await OrderModel.findByIdAndUpdate(bill.orderId, { status: "COMPLETED" });

		//// Update table status to DIRTY (requiring cleaning before next guest)
		await TableModel.findByIdAndUpdate(bill.tableId, { status: "DIRTY" });

		//notify cahier and table devices
		io.to("cashier").emit("bill-paid", { billId: id, tableId: bill.tableId });
		io.to(`Table: ${bill.tableId}`).emit("checkout-complete");

		res.status1(200).json({
			message: "Payment finalized successfully",
			bill,
		});
	} catch (error) {
		res.status(404).josn({ error: error.message });
	}
});

export default router;
