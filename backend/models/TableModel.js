import mongoose from "mongoose";

const { Schema } = mongoose;

//Table Model Schema
const TableSchema = new Schema(
	{
		number: { type: String, required: true, unique: true },
		capacity: { type: Number, require: true },
		status: {
			type: String,
			enum: ["VACANT", "OCCUPIED", "BILLING", "DIRTY"],
			default: "VACANT",
		},
		qrCodeUrl: { type: String },
	},
	{ timestamps: true },
);

const TableModel = mongoose.model("Table", TableSchema);
export default TableModel;
