const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Document = require("../models/Document");

// ✅ Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 1️⃣ Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const sanitizedOriginal = file.originalname.replace(/\s+/g, "_");
    const uniqueName = Date.now() + "-" + sanitizedOriginal;
    cb(null, uniqueName);
  },
});

// 2️⃣ PDF File Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

// 3️⃣ Multer Upload Instance
const upload = multer({ storage, fileFilter });

// 4️⃣ Upload PDF Controller
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const cleanName = req.body.name?.trim();
    if (!cleanName) {
      return res.status(400).json({ msg: "Document name is required" });
    }

    const doc = await Document.create({
      name: cleanName,
      filePath: req.file.path.replace(/\\/g, "/"),
      uploadedBy: req.user.id,
      originalName: req.file.originalname,
    });

    res.status(201).json({
      msg: "File uploaded successfully",
      document: doc,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};

// 5️⃣ Get All Documents by Logged-in User
const getUserDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ msg: "Failed to fetch documents", error: err.message });
  }
};

// 6️⃣ Get Document by ID (Access Restricted)
const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    if (doc.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    res.status(200).json(doc);
  } catch (err) {
    console.error("Fetch by ID Error:", err);
    res.status(500).json({ msg: "Failed to retrieve document", error: err.message });
  }
};
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    res.status(200).json({ msg: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting document', error: err.message });
  }
};


// ✅ Export All
module.exports = {
  upload,
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
};
