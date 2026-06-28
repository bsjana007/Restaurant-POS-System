import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["ADMIN", "KITCHEN", "CASHIER"] },
});

const User = mongoose.model("User", userSchema);
export default User;
