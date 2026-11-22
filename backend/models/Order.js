const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  img: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userIdentifier: { type: String, required: true, index: true },
  customerName: { type: String, default: 'Customer' },
  customerPhone: { type: String, default: '9078699528' },
  date: { type: String, default: () => new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) },
  items: { type: String, required: true },
  itemsList: { type: [orderItemSchema], default: [] },
  itemTotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 35 },
  discount: { type: Number, default: 0 },
  tip: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'Order Confirmed' },
  statusIndex: { type: Number, default: 0 }, // 0 to 4 (-1 if cancelled)
  steps: { type: [String], default: ["Order Confirmed", "Placed", "Shipped/Preparing", "Out for Delivery", "Delivered"] },
  payment: { type: String, default: 'COD' },
  address: { type: String, required: true },
  deliveryInstructions: { type: String, default: '' },
  cookingInstruction: { type: String, default: '' },
  partner: {
    name: { type: String, default: 'Ramesh Kumar' },
    phone: { type: String, default: '+91 98612 34567' },
    rating: { type: Number, default: 4.9 },
    deliveries: { type: String, default: '1,420+' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    badge: { type: String, default: 'Top Rated Valet' }
  },
  estimatedMinutes: { type: Number, default: 24 },
  rating: { type: Number },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
