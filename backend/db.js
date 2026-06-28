import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectToMongo = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to mongoDB successfully");
	} catch (error) {
		console.error("Failed to connect mongoDB :", error);
	}
};

export default connectToMongo;
