import crypto from "crypto";

const getSecretKey = () => process.env.SECRET_KEY;
const getFrontendUrl = () =>
	process.env.FRONTEND_URL || "http://localhost:5173";

//generate secure url for table
function generateSecureTableUrl(tableId) {
	const hmac = crypto.createHmac("sha256", getSecretKey());
	hmac.update(tableId);
	const signature = hmac.digest("hex");

	return `${getFrontendUrl()}/table/${tableId}?sig=${signature}`;
}

// verify incoming qr request signature
function verifyTableSignature(tableId, signature) {
	const hmac = crypto.createHmac("sha256", getSecretKey());
	hmac.update(tableId);
	const expectedSignature = hmac.digest("hex");

	return signature === expectedSignature;
}

export { generateSecureTableUrl, verifyTableSignature };
