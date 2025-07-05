// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
    },
    finalPath: {
      type: String, // optional: for finalized/signed file
    },
    status: {
      type: String,
      enum: ['pending', 'signed'],
      default: 'pending',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // auto-generates createdAt and updatedAt
  }
);

module.exports = mongoose.model('Document', documentSchema);
