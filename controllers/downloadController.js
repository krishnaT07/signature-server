const path = require('path');
const fs = require('fs');

exports.downloadFinalPDF = (req, res) => {
  const { filename } = req.params;

  // ⚠️ Prevent directory traversal (e.g., ../../../etc/passwd)
  if (!/^[a-zA-Z0-9_\-\.]+\.pdf$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename format.' });
  }

  const filePath = path.join(__dirname, '..', 'signed', filename);

  // ✅ Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // ✅ Send file
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'File download failed' });
    }
  });
};
