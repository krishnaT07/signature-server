const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * Embeds signature text into a PDF at specified coordinates.
 *
 * @param {string} inputPath - Absolute path to the input PDF.
 * @param {Array} signatures - Signature array: [{ x, y, page, label, size, color }]
 * @param {string} outputPath - Absolute path to save the modified PDF.
 */
const embedSignatures = async (inputPath, signatures, outputPath) => {
  try {
    if (!fs.existsSync(inputPath)) throw new Error('Input PDF not found');

    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const sig of signatures) {
      const page = pages[sig.page - 1];
      if (!page) continue;

      const { x, y, label = '✔ Signed', size = 14, color = '#008000' } = sig;

      const rgbColor = hexToRgb(color);

      page.drawText(label, {
        x,
        y,
        size,
        font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
      });
    }

    const signedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, signedPdfBytes);
  } catch (err) {
    console.error('❌ Error embedding signatures:', err.message);
    throw err;
  }
};

// Helper: Convert HEX to RGB for pdf-lib
function hexToRgb(hex = '#000000') {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

module.exports = { embedSignatures };
