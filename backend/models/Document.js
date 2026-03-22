const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  fileUrl: String,
  category: String,
  expiryDate: Date,
  pin: String,
  tags: [String],
  reminderDate: Date,
  aiSummary: String,
  isPublic: { type: Boolean, default: false },
  size: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  lastViewedAt: Date,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  version: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);