const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['sweets', 'breakfast'] },
  badge: { type: String, default: 'FRESH' },
  rating: { type: Number, default: 4.8 },
  reviews: { type: String, default: '150+' },
  desc: { type: String, default: '' },
  img: { type: String, required: true },
  variants: { type: [variantSchema], default: [] },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
