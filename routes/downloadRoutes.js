const express = require('express');
const router = express.Router();
const { downloadFinalPDF } = require('../controllers/downloadController');

// 📥 Download a finalized PDF by filename
router.get('/:filename', downloadFinalPDF);

module.exports = router;
