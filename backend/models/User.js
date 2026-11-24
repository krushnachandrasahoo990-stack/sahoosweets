const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, default: 'Puri' },
  state: { type: String, default: 'Odisha' },
  pin: { type: String, default: '752001' },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const walletTxSchema = new mongoose.Schema({
  id: { type: Number, default: () => Date.now() },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) }
}, { _id: false });

const rewardTxSchema = new mongoose.Schema({
  id: { type: Number, default: () => Date.now() },
  type: { type: String, enum: ['earned', 'converted'], required: true },
  title: { type: String, required: true },
  points: { type: Number, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) }
}, { _id: false });

const userSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  name: { type: String, default: 'Sahoo Sweets Customer' },
  phone: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  walletBalance: { type: Number, default: 250 },
  rewardPoints: { type: Number, default: 350 },
  addresses: { type: [addressSchema], default: [
    { id: 1, name: "Krushna Chandra Sahoo", phone: "8763332962", address: "Nagapur, Near Punjab National Bank", city: "Gop, Puri", state: "Odisha", pin: "752110", isDefault: true },
    { id: 2, name: "Sahoo Sweets Counter", phone: "8763332962", address: "Nagapur, Near Punjab National Bank, Gop", city: "Puri", state: "Odisha", pin: "752110", isDefault: false }
  ] },
  walletHistory: { type: [walletTxSchema], default: [
    { id: 1, type: 'credit', title: 'Welcome Cashback Reward', amount: 250, date: 'Nov 12, 2026' },
    { id: 2, type: 'credit', title: 'Converted from Partner Rewards', amount: 100, date: 'Nov 15, 2026' }
  ] },
  rewardsHistory: { type: [rewardTxSchema], default: [
    { id: 1, type: 'earned', title: 'Order #SS-1084 Purchase Points', points: 37, date: 'Nov 18, 2026' },
    { id: 2, type: 'converted', title: 'Converted to Sahoo Money', points: -100, date: 'Nov 15, 2026' },
    { id: 3, type: 'earned', title: 'Signup Bonus Points', points: 413, date: 'Nov 12, 2026' }
  ] },
  refunds: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
