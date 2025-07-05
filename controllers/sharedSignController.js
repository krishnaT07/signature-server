const ShareToken = require('../models/ShareToken');
const Document = require('../models/Document');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

exports.getSharedDocument = async (req, res) => {
  try {
    const tokenDoc = await ShareToken.findOne({ token: req.params.token });

    if (!tokenDoc || tokenDoc.used || tokenDoc.expiresAt < Date.now()) {
      return res.status(403).json({ error: 'Link expired or invalid' });
    }

    const doc = await Document.findById(tokenDoc.documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    res.status(200).json({
      filePath: doc.filePath,
      documentId: doc._id,
    });
  } catch (error) {
    console.error('❌ Error fetching shared document:', error);
    res.status(500).json({ error: 'Failed to retrieve shared document' });
  }
};

exports.finalizeSharedSignature = async (req, res) => {
  try {
    const tokenDoc = await ShareToken.findOne({ token: req.params.token });

    if (!tokenDoc || tokenDoc.used || tokenDoc.expiresAt < Date.now()) {
      return res.status(403).json({ error: 'Token expired or already used' });
    }

    const { x, y, page, text, fontSize, color } = req.body;

    const doc = await Document.findById(tokenDoc.documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const inputPath = path.join(__dirname, '..', doc.filePath.replace(/\\/g, '/'));
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const targetPage = pdfDoc.getPages()[page - 1];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const rgbColor = hexToRgb(color || '#000000');

    targetPage.drawText(text || 'Signed', {
      x: x || 100,
      y: y || 100,
      font,
      size: fontSize || 16,
      color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
    });

    const finalPdf = await pdfDoc.save();
    const signedFileName = `shared_signed_${doc.originalName || doc.name || 'document'}`;
    const signedPath = path.join(__dirname, '..', 'signed', signedFileName);
    fs.writeFileSync(signedPath, finalPdf);

    // 🔐 Mark token used
    tokenDoc.used = true;
    await tokenDoc.save();

    // 📌 Update document
    doc.finalPath = `signed/${signedFileName}`;
    doc.status = 'signed';
    await doc.save();

    res.status(200).json({ message: '✅ PDF finalized and access closed' });
  } catch (error) {
    console.error('❌ Error finalizing shared PDF:', error);
    res.status(500).json({ error: 'Could not finalize shared document' });
  }
};

// Utility: Convert hex to RGB for pdf-lib
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}
