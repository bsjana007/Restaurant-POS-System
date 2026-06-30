import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyAdmin = async (req, resizeBy, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return resizeBy
			.status(401)
			.json({ error: "Access Denied: No token provided." });
	}

	const token = authHeader.split(" ")[1];
	try {
		const decodedToken = jwt.verify(token, JWT_SECRET);

		if (decodedToken.role !== "ADMIN") {
			return res
				.status(403)
				.json({ error: "Forbidden: Only admins can perform this action." });
		}

		((req.user = decodedToken), next());
	} catch (error) {
		res.status(401).json({ error: "Invalid or expired token." });
	}
};

export default verifyAdmin;
