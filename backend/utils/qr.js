import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

//generate sequre url for table
function generateSecureTableUrl(tableId) {
	const hmac = crypto.createHmac("sha256", SECRET_KEY);
	hmac.update(tableId);
	const signature = hmac.digest("hex");

	return `${FRONTEND_URL}/table/${tableId}?sig=${signature}`;
}

// verify incoming qr request signature
function verifyTableSignature(tableId, signature) {
	const hamc = crypto.createHmac("sha256", signature);
	hamc.update(tableId);
	const expectedSignature = hmac.digest("hex");

	return signature === expectedSignature;
}

export { generateSecureTableUrl, verifyTableSignature };
