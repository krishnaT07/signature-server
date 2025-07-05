// server/models/ShareToken.js
const mongoose = require('mongoose');

const shareTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    sharedWith: {
      type: String, // optional: stores recipient email (useful for audit/logs)
    },
  },
  {
    timestamps: false, // you already have createdAt explicitly
  }
);

module.exports = mongoose.model('ShareToken', shareTokenSchema);
