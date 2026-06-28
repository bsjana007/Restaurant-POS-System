import mongoose from "mongoose";
const { Schema } = mongoose;

//Bill model schema
const BillSchema = new Schema(
	{
		orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
		tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
		subTotal: { type: Number, required: true },
		tax: { type: Number, required: true },
		discount: { type: Number, default: 0 },
		grandTotal: { type: Number, required: true },
		paymentMethod: {
			type: String,
			enum: ["CASH", "CARD", "UPI", "ONLINE"],
			required: true,
		},
		isPaid: { type: Boolean, default: false },
		paidAt: { type: Date },
	},
	{ timestamps: true },
);

const BillModel = mongoose.model("Bill", BillSchema);
export default BillModel;
