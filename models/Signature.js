const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for anonymous/external signers
    },
    email: {
      type: String,
      required: false, // Useful for external signers (from shared link)
    },

    // Coordinates
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    page: { type: Number, required: true },

    // Signature content
    imageData: { type: String }, // base64-encoded image (optional)
    text: { type: String },      // textual signature
    fontSize: { type: Number },
    fontWeight: { type: String },
    fontStyle: { type: String },
    fontFamily: { type: String },
    underline: { type: Boolean },
    color: { type: String },

    // Status tracking
    status: {
      type: String,
      enum: ['pending', 'signed', 'rejected'],
      default: 'signed',
    },
    signedAt: { type: Date, default: Date.now },

    // Audit info
    ipAddress: { type: String },
    userAgent: { type: String }, // browser/device info
  },
  { timestamps: true }
);

module.exports = mongoose.model('Signature', signatureSchema);
