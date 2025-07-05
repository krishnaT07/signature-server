const express = require("express");
const router = express.Router();
const { uploadDocument, getDocuments, getDocumentById } = require('../controllers/documentController');


// 🔐 Middleware
const protect = require("../middleware/authMiddleware");

// 📦 Controller functions + Multer setup
const {
  upload,
  getUserDocuments,
  deleteDocument,
} = require("../controllers/documentController");

// 🆕 Upload a PDF (Authenticated, with multer file handling)
router.post("/upload", protect, upload.single("file"), uploadDocument);

// 📥 Fetch all uploaded documents for a user
router.get("/", protect, getUserDocuments);

// 🔍 Fetch specific document by ID
router.get("/:id", protect, getDocumentById);
// DELETE /api/docs/:id
router.delete('/:id', protect, deleteDocument);


module.exports = router;

