import mongoose from "mongoose";
const { Schema } = mongoose;

//MenuItem model schema
const MenuSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		price: { type: Number, required: true },
		imageUrl: { type: String },
		isAvailable: { type: Boolean, default: true },
		category: { type: String, required: true }, // e.g. 'Appetizers', 'Mains', 'Drinks'
	},
	{ timestamps: true },
);

const MenuItem = mongoose.model("MenuItem", MenuSchema);
export default MenuItem;
