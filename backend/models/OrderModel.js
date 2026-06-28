import mongoose from "mongoose";
const { Schema } = mongoose;

//Order model schema
const OrderSchema = new Schema(
	{
		tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
		status: {
			type: String,
			enum: [
				"PENDING",
				"CONFIRMED",
				"PREPARING",
				"READY",
				"SERVED",
				"COMPLETED",
				"CANCELLED",
			],
			default: "PENDING",
		},
		items: [
			{
				menuItemId: {
					type: Schema.Types.ObjectId,
					ref: "MenuItem",
					required: true,
				},
				name: { type: String, required: true },
				price: { type: Number, required: true },
				quantity: { type: Number, required: true },
				notes: { type: String },
			},
		],
		totalAmount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;
