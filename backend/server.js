import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongo from "./db.js";
import orderRoutes from "./routes/order.js";
import tableRoutes from "./routes/table.js";
import billRoutes from "./routes/bill.js";
import menuRoutes from "./routes/menu.js";

dotenv.config();
connectToMongo();

const app = express();
const PORT = process.env.PORT;
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
		allowedHeaders: ["Content-type", "Authorization"],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	}),
);
app.use(express.json());

const httpServer = createServer(app);

//Initialize Socket.io
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PATCH"],
	},
});

//share io globally on app level
app.set("io", io);

//configure scoket.io room joins
io.on("connection", (socket) => {
	console.log(`connected client: ${socket.id}`);

	socket.on("join-room", (roomName) => {
		socket.join(roomName);
		console.log(`Socket ${socket.id} joined ${roomName}`);
	});

	socket.on("disconnect", () => {
		console.log(`client disconnected: ${socket.id}`);
	});
});

//register routes
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/menu", menuRoutes);

app.get("/", (req, res) => {
	res.send("API running");
});

httpServer.listen(PORT || 3000, () => {
	console.log(`server is running at : ${process.env.PORT}`);
});
