// server/routes/sharedSignRoutes.js
const express = require('express');
const router = express.Router();

const {
  getSharedDocument,
  finalizeSharedSignature,
} = require('../controllers/sharedSignController');

// GET: Retrieve shared document by token
router.get('/:token', getSharedDocument);

// POST: Finalize and sign the shared document
router.post('/finalize/:token', finalizeSharedSignature);

module.exports = router;
