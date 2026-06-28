import { verifyTableSignature } from "../utils/qr";

function verifyQRRequest(req, res, next) {
	const { tableId, signature } = req.body;

	if (!tableId || !signature) {
		res.status(400).json({
			error: "Access Denied: Missing Table ID or Signature.",
		});
	}

	const isValid = verifyTableSignature(tableId, signature);
	if (!isValid) {
		res.status(403).json({
			error: "Access Denied: Invalid QR Code Signature.",
		});
	}

	next();
}

export default verifyQRRequest;
