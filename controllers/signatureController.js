const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const Signature = require('../models/Signature');
const Document = require('../models/Document');

// 1️⃣ Save Signature Entry to DB
const saveSignature = async (req, res) => {
  try {
    const {
      documentId,
      x,
      y,
      page,
      imageData,
      text,
      fontSize,
      fontWeight,
      fontStyle,
      fontFamily,
      underline,
      color,
    } = req.body;

    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    const sig = await Signature.create({
      documentId,
      userId: req.user?.id || null,
      email: req.user?.email || null,
      x,
      y,
      page,
      status: 'signed',
      imageData,
      text,
      fontSize,
      fontWeight,
      fontStyle,
      fontFamily,
      underline,
      color,
      ipAddress,
      userAgent,
    });

    res.status(201).json({ msg: 'Signature saved', signature: sig });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save signature', error: err.message });
  }
};

// 2️⃣ Get All Signatures for a Document
const getSignatures = async (req, res) => {
  try {
    const { docId } = req.params;
    const signatures = await Signature.find({ documentId: docId }).sort({ signedAt: -1 });
    res.status(200).json(signatures);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch signatures', error: err.message });
  }
};

// 3️⃣ Finalize PDF with Embedded Signatures
const finalizeSignature = async (req, res) => {
  const { documentId } = req.body;

  try {
    const docMeta = await Document.findById(documentId);
    if (!docMeta) return res.status(404).json({ msg: 'Document not found' });

    const inputPath = path.join(__dirname, '..', docMeta.filePath.replace(/\\/g, '/'));
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    const signatures = await Signature.find({ documentId });

    for (const sig of signatures) {
      const page = pages[sig.page - 1];

      if (sig.imageData) {
        const imgBytes = Buffer.from(sig.imageData.split(',')[1], 'base64');
        const image = sig.imageData.includes('png')
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);

        page.drawImage(image, {
          x: sig.x,
          y: sig.y,
          width: 120,
          height: 50,
        });
      } else if (sig.text) {
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const rgbColor = hexToRgb(sig.color || '#000000');

        page.drawText(sig.text, {
          x: sig.x,
          y: sig.y,
          font,
          size: sig.fontSize || 14,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        });
      }
    }

    const finalizedPdf = await pdfDoc.save();

    const signedName = `signed_${docMeta.originalName || docMeta.name}`;
    const outputPath = path.join(__dirname, '..', 'signed', signedName);
    fs.writeFileSync(outputPath, finalizedPdf);

    docMeta.finalPath = `signed/${signedName}`;
    docMeta.status = 'signed';
    await docMeta.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${signedName}"`);
    res.send(finalizedPdf);
  } catch (error) {
    console.error('❌ Finalize PDF error:', error);
    res.status(500).json({ error: 'Failed to finalize PDF' });
  }
};

// 4️⃣ Get Audit Trail for a Document
const getAuditTrail = async (req, res) => {
  try {
    const { docId } = req.params;

    const signatures = await Signature.find({ documentId: docId })
      .select('-__v')
      .sort({ signedAt: -1 });

    res.status(200).json(signatures);
  } catch (err) {
    console.error('Audit trail error:', err);
    res.status(500).json({ msg: 'Failed to fetch audit trail', error: err.message });
  }
};

// 🔧 Utility
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

// ✅ Export All
module.exports = {
  saveSignature,
  getSignatures,
  finalizeSignature,
  getAuditTrail,
};
