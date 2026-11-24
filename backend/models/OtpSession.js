const mongoose = require('mongoose');

const otpSessionSchema = new mongoose.Schema({
  identifier: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // MongoDB TTL auto-cleanup
  attempts: { type: Number, default: 0 },
  role: { type: String, default: 'customer' },
  type: { type: String, default: 'Login' },
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  password: { type: String },
  lastSentAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.OtpSession || mongoose.model('OtpSession', otpSessionSchema);
