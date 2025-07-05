const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  saveSignature,
  getSignatures,
  finalizeSignature,
  getAuditTrail,
} = require("../controllers/signatureController");

// Save a new signature (protected)
router.post("/", protect, saveSignature);

// Get all signatures for a document (protected)
router.get("/:docId", protect, getSignatures);

// Finalize PDF with signatures (protected)
router.post("/finalize", protect, finalizeSignature);
router.get('/audit/:docId', protect, getAuditTrail);


module.exports = router;

module.exports = router;
