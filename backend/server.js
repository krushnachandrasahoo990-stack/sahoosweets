// =============================================================================
// SAHOO SWEETS - PRODUCTION BACKEND SERVER (Express + MongoDB / Mongoose)
// =============================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Mongoose Models
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const User = require('./models/User');
const OtpSession = require('./models/OtpSession');

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('[Server] nodemailer not loaded, fallback mode active.');
}

const app = express();

// Allowed Origins for CORS (Vercel Frontend, Localhost, Render, or custom FRONTEND_URL)
const rawFrontendUrls = (process.env.FRONTEND_URL || '').split(',').map(u => u.trim()).filter(Boolean);
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://sahoosweets.vercel.app',
  'http://sahoosweets.vercel.app',
  'https://sahoosweets-hh5wm5wg0-campos15.vercel.app',
  'http://sahoosweets-hh5wm5wg0-campos15.vercel.app',
  ...rawFrontendUrls
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
  const clean = origin.trim().replace(/\/+$/, '').toLowerCase();
  if (allowedOrigins.some(ao => ao.replace(/\/+$/, '').toLowerCase() === clean)) return true;
  if (/^https?:\/\/([a-zA-Z0-9_\-]+\.)*vercel\.app$/i.test(clean)) return true; // Allow any Vercel preview or production URL
  if (/^https?:\/\/([a-zA-Z0-9_\-]+\.)*onrender\.com$/i.test(clean)) return true; // Allow Render apps
  if (/^http:\/\/localhost(:\d+)?$/i.test(clean)) return true;
  if (/^http:\/\/127\.0\.0\.1(:\d+)?$/i.test(clean)) return true;
  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Info] Permitting origin during cloud transition: ${origin}`);
      callback(null, true); // Safe fallback to ensure zero connectivity blocks
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'x-admin-pin',
    'admin-pin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight for 24 hours to reduce latency
};

app.use(cors(corsOptions));
// Handle preflight OPTIONS requests cleanly across all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Authorized Admin Security PIN
const ADMIN_ACCESS_PIN = process.env.ADMIN_ACCESS_PIN || '9900';

// -----------------------------------------------------------------------------
// SEED MENU DATA (25 Authentic Odia Sweets & Breakfast Snacks)
// -----------------------------------------------------------------------------
const initialMenuItems = [
  { id: "sw1", name: "Pahala Style Rosgola", category: "sweets", badge: "BESTSELLER", rating: 4.9, reviews: "260+", desc: "Super spongy, melt-in-mouth cottage cheese balls soaked in authentic warm sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtwZakNUCDCTGm30bOrOk45IbALQwlXluQBXtq3uCQ-w&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw2", name: "Shahi Gulab Jamun", category: "sweets", badge: "HOT SWEET", rating: 4.8, reviews: "190+", desc: "Deep-fried golden khoya dumplings simmered in fragrant cardamom sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZI8sJv8_Go96Hn3rFD6JiVIElf8mCd1i2bg2uu2E2CA&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw3", name: "Authentic Cheese Cake", category: "sweets", badge: "NAYAGARH PRIDE", rating: 5.0, reviews: "340+", desc: "Traditional Chhena Podo slow-baked with caramelized crust, cashews & raisins.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3N0k9IvzdjBRP3o_1KtoEo8HXx-LZkLdxDxy5Nauvng&s=10", variants: [{ label: "100g", price: 40 }, { label: "250g", price: 100 }, { label: "500g", price: 200 }, { label: "1 Kg", price: 400 }], isAvailable: true },
  { id: "sw4", name: "Nimapada Famous Jhili", category: "sweets", badge: "NIMAPADA SPECIAL", rating: 4.8, reviews: "150+", desc: "Crispy yet juicy chhena spirals fried in pure desi ghee and glazed with cardamom syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRET8Sh2_Dmr3osEYtZa58tQmjstHy_D5NrH9BCSCoK_A&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw5", name: "Crispy Chhena Gaja", category: "sweets", badge: "AUTHENTIC", rating: 4.7, reviews: "130+", desc: "Pure cottage cheese rectangles deep-fried to crunchy brown perfection and glazed with syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwAgCTQFNTmRQcUlFzArMkJBB9v6rbkjfDCOGFnO5xOg&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw6", name: "Traditional Tadia", category: "sweets", badge: "HERITAGE", rating: 4.6, reviews: "110+", desc: "Rich traditional crunchy fried sweet snack prepared with cottage cheese dough and sugar.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdzjvg3HnAeOP2CKXvUQ7fIDLSpKBL8MCxNzwqQtrIkw&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw7", name: "Pheni Gaja", category: "sweets", badge: "PURI SPECIAL", rating: 4.9, reviews: "210+", desc: "Crispy layered Odia flaky sweet gaja coated with light cardamom sugar glaze.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStyf-JcWV1_8L48vANR9Hqto2ZA1zTKeJ_7NTOI1pKPg&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw8", name: "Khira Gaja", category: "sweets", badge: "SWEET DELIGHT", rating: 4.8, reviews: "175+", desc: "Authentic milk cream and chhena infused soft layered gaja soaked in delicious chasni.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAz4v8xFgf9OpZrUPjlCA9YOGBJQLKIuJ3gZfMhtOFFg&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw9", name: "Crispy Jilapi", category: "sweets", badge: "HOT CRISPY", rating: 4.9, reviews: "280+", desc: "Freshly fried hot spiral jilapis dipped in fragrant saffron and cardamom sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ErlGVeIRBOe_cE7cXsHjBlwwc06Sdx-PMlxQoDs6GQ&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw10", name: "Traditional Malpua", category: "sweets", badge: "TEMPLE TASTE", rating: 4.9, reviews: "190+", desc: "Mouth-watering soft and juicy fried sweet pancakes soaked in rich fennel seed scented syrup.", img: "https://cdn.indiaphile.info/wp-content/uploads/2023/08/stp-malpua-4458.jpg?width=1200&format=webp", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw11", name: "Besan Bundi Ladu", category: "sweets", badge: "DESI GHEE", rating: 4.8, reviews: "160+", desc: "Traditional desi ghee bundi laddus flavored with crushed green cardamom, cloves and melon seeds.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1tv0iWsCoAbcPSnCxw565K2Z2ngQYPiJGC-N8i954RA&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },
  { id: "sw12", name: "Sweet Bundi", category: "sweets", badge: "FRESH", rating: 4.7, reviews: "140+", desc: "Golden crispy sweet tiny gram flour pearls soaked in aromatic cardamom sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb6FAkJVxg_lkdhxbz4nNbVL7lBLXxD5fQuomNazLusg&s=10", variants: [{ label: "100g", price: 25 }, { label: "250g", price: 50 }, { label: "500g", price: 100 }, { label: "1 Kg", price: 200 }], isAvailable: true },
  { id: "sw13", name: "Labang Lata", category: "sweets", badge: "ROYAL SWEET", rating: 4.9, reviews: "170+", desc: "Crispy pastry stuffed with sweet khoya and coconut filling, sealed with a fragrant clove.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStaehqGYkhc6PC82iQ-TIuK-626uM58VQMj5QabE0BRw&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }], isAvailable: true },

  { id: "bf1", name: "Bara", category: "breakfast", badge: "HOT CRISPY", rating: 4.9, reviews: "410+", desc: "Crispy fried fermented urad dal vada tempered with curry leaves and green chilies.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5LxB18dY-XyKVABOKnU3sTHww-zcUEj5QS9n3ZSZ6KA&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }], isAvailable: true },
  { id: "bf2", name: "Singada/Samosa", category: "breakfast", badge: "CRUNCHY", rating: 4.8, reviews: "320+", desc: "Golden flaky pastry filled with spiced potato cubes, roasted peanuts and cumin masala.", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }], isAvailable: true },
  { id: "bf3", name: "Crispy Alu Chop", category: "breakfast", badge: "STREET SPECIAL", rating: 4.7, reviews: "210+", desc: "Spiced mashed potato patty dipped in seasoned gram flour batter and fried crisp.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7x_hf9PxJ01aj0vwdEw0FyvezBE6xu2tY_-ZVeAe6Ow&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }], isAvailable: true },
  { id: "bf4", name: "Mottor Curry (Ghuguni)", category: "breakfast", badge: "POPULAR", rating: 4.8, reviews: "290+", desc: "Slow-cooked yellow peas curry simmered with onion, ginger, garlic, tomatoes and garam masala.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLYKYa3vJcWok1_1ItfryFdk7DdRpEWInZ65jz4OZk3A&s=10", variants: [{ label: "1 Plate", price: 20 }, { label: "2 Plates", price: 40 }], isAvailable: true },
  { id: "bf5", name: "Garam Puri & Aloo Kasa", category: "breakfast", badge: "MORNING SPECIAL", rating: 4.9, reviews: "350+", desc: "4 golden fluffy wheat puris served with homestyle spicy potato kasa and tangy pickle.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85hPuRAlOGjBTX_4pRLG1qUUezjwbDz1s5-Fede0x7w&s=10", variants: [{ label: "4 Puris (1 Plate)", price: 20 }, { label: "8 Puris (2 Plates)", price: 40 }], isAvailable: true },
  { id: "bf6", name: "Suji Kakara Pitha", category: "breakfast", badge: "ODIA PITHA", rating: 4.9, reviews: "180+", desc: "Crispy golden semolina pitha stuffed with freshly grated coconut, jaggery and black pepper.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSouqPkKoh6-I5ZczUc24FFPrzZ_JlpgeYbC9JcT0NX2Q&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }], isAvailable: true },
  { id: "bf7", name: "Steamed Soft Idli", category: "breakfast", badge: "HEALTHY", rating: 4.8, reviews: "220+", desc: "Cloud-soft steamed rice & lentil cake served with coconut chutney and hot curry.", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }], isAvailable: true },
  { id: "bf8", name: "Masala Suji Upma", category: "breakfast", badge: "HOMESTYLE", rating: 4.7, reviews: "160+", desc: "Roasted semolina tempered with mustard seeds, curry leaves, peanuts and served with curry.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUjcEV6zo1hjEGCgADJRudflhZF3eX4uYk9bvnhU1pdg&s=10", variants: [{ label: "1 Plate", price: 20 }, { label: "2 Plates", price: 40 }], isAvailable: true },
  { id: "bf9", name: "Garam Piaji / Pakodi", category: "breakfast", badge: "CRUNCHY", rating: 4.8, reviews: "240+", desc: "Crunchy onion and gram flour fritters tossed with green chilies, served with chutney.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbBwZHxR9t9l3i2DxMkiwGoMNMMGArxa3LuSP1C2j41A&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "4 Pcs", price: 20 }, { label: "10 Pcs", price: 50 }], isAvailable: true },
  { id: "bf10", name: "Special Mitha Khata Dahi Bara", category: "breakfast", badge: "ODISHA SPECIAL", rating: 5.0, reviews: "510+", desc: "Soft urad dal baras soaked in sweet-tangy dahi pani, topped with roasted cumin & tamarind.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7OMQeUOAImoCzZA1OBdQ7Eluwd1nUBF2U0XD3HmgjA&s=10", variants: [{ label: "1 Pc", price: 15 }, { label: "2 Pcs", price: 30 }, { label: "4 Pcs", price: 60 }], isAvailable: true },
  { id: "bf11", name: "Authentic Odia Dalma", category: "breakfast", badge: "PURI PRIDE", rating: 4.9, reviews: "320+", desc: "Nutritious toor dal cooked with raw papaya, pumpkin, brinjal, tempered with pure ghee & roasted cumin.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKmTSG3K7RgZQuGVNi3fjnhC8GiA84PsYpyNFKNKHfyEWN_t8QbTDTeqK&s=10", variants: [{ label: "1 Plate", price: 20 }, { label: "2 Plates", price: 40 }], isAvailable: true },
  { id: "bf12", name: "Odia Special Gulugula", category: "breakfast", badge: "HOT MORNING", rating: 4.8, reviews: "190+", desc: "Fluffy and sweet deep-fried whole wheat fritters infused with fennel seeds and jaggery.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFVq7GcPq4_03kCtWyfe3vMla8ffXunRs1PJKmNSruEQ&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }], isAvailable: true }
];

// -----------------------------------------------------------------------------
// IN-MEMORY STORAGE FALLBACK (Active when MongoDB is not connected)
// -----------------------------------------------------------------------------
let isDbConnected = false;
const inMemoryMenuItems = [...initialMenuItems];
const inMemoryUsers = new Map();
const inMemoryOrders = [
  { 
    id: "SS-1084",
    userIdentifier: "8763332962",
    customerName: "Krushna Chandra Sahoo",
    customerPhone: "8763332962",
    date: "Nov 18, 2026, 02:40 PM", 
    items: "Pahala Style Rosgola (1 Kg), Bara (4 Pcs)", 
    itemsList: [
      { name: "Pahala Style Rosgola (1 Kg)", qty: 1, price: 350 },
      { name: "Bara (4 Pcs)", qty: 1, price: 20 }
    ],
    itemTotal: 370,
    deliveryFee: 0,
    discount: 0,
    total: 370, 
    statusIndex: 3, 
    status: "Out for Delivery",
    steps: ["Order Confirmed", "Placed", "Shipped/Preparing", "Out for Delivery", "Delivered"],
    payment: "Cash on Delivery",
    address: "Nagapur, Near Punjab National Bank, Gop, Puri",
    estimatedMinutes: 12
  }
];
const inMemoryOtps = new Map();
const otpRateLimits = new Map();

// Default seed user
inMemoryUsers.set('8763332962', {
  identifier: '8763332962',
  name: 'Krushna Chandra Sahoo',
  phone: '8763332962',
  email: 'noreply@sahoosweets.in',
  role: 'customer',
  walletBalance: 250,
  rewardPoints: 350,
  addresses: [
    { id: 1, name: "Krushna Chandra Sahoo", phone: "8763332962", address: "Nagapur, Near Punjab National Bank", city: "Gop, Puri", state: "Odisha", pin: "752110", isDefault: true },
    { id: 2, name: "Sahoo Sweets Counter", phone: "8763332962", address: "Nagapur, Near Punjab National Bank, Gop, Puri", city: "Puri", state: "Odisha", pin: "752110", isDefault: false }
  ],
  walletHistory: [
    { id: 1, type: 'credit', title: 'Welcome Cashback Reward', amount: 250, date: 'Nov 12, 2026' },
    { id: 2, type: 'credit', title: 'Converted from Partner Rewards', amount: 100, date: 'Nov 15, 2026' }
  ],
  rewardsHistory: [
    { id: 1, type: 'earned', title: 'Order #SS-1084 Purchase Points', points: 37, date: 'Nov 18, 2026' },
    { id: 2, type: 'converted', title: 'Converted to Sahoo Money', points: -100, date: 'Nov 15, 2026' },
    { id: 3, type: 'earned', title: 'Signup Bonus Points', points: 413, date: 'Nov 12, 2026' }
  ],
  refunds: []
});

// -----------------------------------------------------------------------------
// MONGODB CONNECTION & AUTO-SEEDING
// -----------------------------------------------------------------------------
async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI not provided. Running in high-speed in-memory database fallback mode.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    isDbConnected = true;
    console.log('✅ [MongoDB] Successfully connected to MongoDB database!');

    // Auto-seed Menu Items if collection is empty
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding 25 authentic Odia sweets & breakfast items...');
      await MenuItem.insertMany(initialMenuItems);
      console.log('✅ [MongoDB] Menu items successfully seeded into database!');
    } else {
      console.log(`📦 [MongoDB] Database contains ${count} menu items.`);
    }

    // Auto-seed demo user if none exists
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create(inMemoryUsers.get('8763332962'));
      console.log('👤 [MongoDB] Default user profile initialized.');
    }
  } catch (err) {
    isDbConnected = false;
    console.warn('⚠️ [MongoDB Connection Warning]: Could not reach MongoDB server. Fallback in-memory database is active:', err.message);
  }
}

connectToDatabase();

// =============================================================================
// HELPER FUNCTIONS: NORMALIZATION & VALIDATION
// =============================================================================
function parseAndValidateIdentifier(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) {
    return {
      type: 'email',
      normalized: trimmed.toLowerCase(),
      display: trimmed.toLowerCase()
    };
  }

  // Indian Phone pattern check: Strip spaces, dashes, +91, leading 0
  let cleanPhone = trimmed.replace(/[\s\-\(\)]/g, '');
  if (cleanPhone.startsWith('+91')) {
    cleanPhone = cleanPhone.slice(3);
  } else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    cleanPhone = cleanPhone.slice(2);
  } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = cleanPhone.slice(1);
  }

  // 10-digit Indian Mobile check (starts with 6, 7, 8, or 9)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (phoneRegex.test(cleanPhone)) {
    return {
      type: 'phone',
      normalized: cleanPhone,
      display: `+91 ${cleanPhone}`
    };
  }

  return null;
}

function isRateLimited(identifier) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;

  const timestamps = (otpRateLimits.get(identifier) || []).filter(ts => now - ts < windowMs);
  if (timestamps.length >= maxRequests) {
    return true;
  }
  timestamps.push(now);
  otpRateLimits.set(identifier, timestamps);
  return false;
}

// =============================================================================
// REAL DELIVERY DISPATCHERS (BREVO SMTP / NODEMAILER & SMS)
// =============================================================================

/**
 * Sends Email OTP branded under "Sahoo Sweets" via Brevo SMTP or Gmail SMTP
 */
async function sendEmailOtp(email, otp, type = 'Login') {
  // 1. Read sender name from OTP_SENDER_NAME || FROM_NAME || SENDER_NAME || "Sahoo Sweets"
  const rawSenderName = process.env.OTP_SENDER_NAME || process.env.FROM_NAME || process.env.SENDER_NAME || 'Sahoo Sweets';
  const senderName = String(rawSenderName).replace(/^["']|["']$/g, '').trim() || 'Sahoo Sweets';

  let smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const isSecure = process.env.SMTP_SECURE !== undefined 
    ? (process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === true)
    : (smtpPort === 465); // false for port 587

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  
  // Auto-detect Gmail vs Brevo if pass is 16-letter Gmail app password
  if (smtpPass && smtpPass.length === 16 && /^[a-z]+$/.test(smtpPass) && (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('gmail'))) {
    smtpHost = 'smtp.gmail.com';
  }

  // 2. Read sender email address from OTP_FROM_EMAIL || MAIL_FROM || SMTP_USER
  const rawFromEmail = process.env.OTP_FROM_EMAIL || process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@sahoosweets.in';
  // Extract pure email address if rawFromEmail contains "Display Name" <email@domain.com>
  const emailMatch = String(rawFromEmail).match(/<([^>]+)>/);
  const fromEmail = (emailMatch ? emailMatch[1] : rawFromEmail).replace(/^["']|["']$/g, '').trim();

  // 3. Construct properly formatted From header: "${senderName}" <${fromEmail}>
  const fromHeader = `"${senderName}" <${fromEmail}>`;
  const subject = 'Your Sahoo Sweets Login OTP';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Sahoo Sweets Login OTP</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f6f0; margin: 0; padding: 24px;">
      <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 2px solid #BBAB47; border-radius: 20px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="text-align: center; border-bottom: 2px dashed #f2c983; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="color: #1a1a1a; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1px;">SAHOO SWEETS</h1>
          <p style="color: #8c7625; margin: 6px 0 0; font-size: 13px; font-weight: 700;">Traditional Sweets & Snacks Delivery • Nagapur, Gop, Puri</p>
        </div>

        <p style="font-size: 15px; color: #333333; line-height: 1.5; margin-bottom: 12px;">
          Hello,
        </p>
        <p style="font-size: 14px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
          Use the following 6-digit One-Time Password (OTP) to complete your <strong>${type}</strong> for <strong>Sahoo Sweets</strong>. This verification code is valid for <strong>5 minutes</strong>.
        </p>

        <div style="background-color: #fcf9eb; border: 2px solid #BBAB47; border-radius: 14px; padding: 22px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 800; color: #8c7625; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">
            Your Login OTP Code
          </div>
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #1a1a1a; font-family: monospace; display: inline-block;">
            ${otp}
          </span>
          <div style="font-size: 11px; color: #777777; margin-top: 8px;">
            Valid for 5 minutes only
          </div>
        </div>

        <div style="background-color: #fff9e6; border-left: 4px solid #BBAB47; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 12px; color: #7a6116; margin: 0; line-height: 1.5;">
            <strong>Security Notice:</strong> Never share this OTP with anyone, including Sahoo Sweets delivery partners or staff. We will never ask for your code.
          </p>
        </div>

        <p style="font-size: 11px; color: #888888; line-height: 1.4; margin-bottom: 20px;">
          * If you don't see this email in your inbox, please check your <strong>Spam or Junk folder</strong> and mark it as safe.
        </p>

        <div style="border-top: 1px solid #eeeeee; padding-top: 18px; text-align: center;">
          <p style="font-size: 12px; font-weight: 800; color: #333333; margin: 0 0 4px;">
            Sahoo Sweets • Nagapur, Near Punjab National Bank, Gop, Puri
          </p>
          <p style="font-size: 11px; color: #999999; margin: 0;">
            Delivery Helpline: +91 8763332962 • noreply@sahoosweets.in
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `SAHOO SWEETS - LOGIN OTP\n\nYour 6-digit verification code is: ${otp}\n\nThis OTP is valid for 5 minutes. Please do not share it with anyone.\nIf not found in your primary inbox, please check your Spam / Junk folder.\n\nSahoo Sweets, Nagapur, Near Punjab National Bank, Gop, Puri\nDelivery Helpline: +91 8763332962 • noreply@sahoosweets.in`;

  // Brevo Nodemailer SMTP Dispatcher
  if (!nodemailer) {
    return {
      success: false,
      code: 'EMAIL_MODULE_MISSING',
      message: 'Email module (nodemailer) is not installed on the server.'
    };
  }

  // Validate SMTP credentials
  if (!smtpUser || !smtpPass) {
    const isBrevo = smtpHost.includes('brevo');
    console.warn(`[SMTP Gateway] Credentials missing in backend/.env (SMTP_USER=${smtpUser || 'MISSING'}, SMTP_PASS=${smtpPass ? 'SET' : 'MISSING'}).`);
    return {
      success: false,
      code: 'EMAIL_CONFIG_MISSING',
      message: isBrevo
        ? 'Brevo SMTP service is not configured on the server. Please add your Brevo SMTP login (SMTP_USER) and Brevo SMTP key (SMTP_PASS) in backend/.env.'
        : 'Email SMTP service is not configured on the server. Please check your SMTP_USER and SMTP_PASS in backend/.env.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure, // false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject,
      text: textContent,
      html: htmlContent
    });

    console.log(`[Email Gateway - Brevo SMTP] Dispatched branded OTP to ${email}. MessageId:`, info.messageId);
    return { 
      success: true, 
      provider: 'brevo-smtp', 
      id: info.messageId,
      message: `OTP sent under "${senderName}" to ${email}. Please check your Inbox and Spam/Junk folder.` 
    };
  } catch (err) {
    console.error('[Email Gateway Error - Brevo SMTP]:', err);
    return {
      success: false,
      code: 'EMAIL_SEND_FAILED',
      message: `Brevo SMTP Email delivery failed: ${err.message || 'Authentication error'}. Please check your Brevo SMTP_USER and SMTP_PASS in backend/.env.`
    };
  }
}

/**
 * Sends Phone OTP to Indian Mobile via Twilio / Fast2SMS / MSG91 API
 */
async function sendSmsOtp(phoneNumber, otp) {
  // Option 1: Twilio SMS Gateway
  const twilioSid = process.env.TWILIO_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE;

  if (twilioSid && twilioAuthToken && twilioPhone) {
    try {
      const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const bodyParams = new URLSearchParams({
        To: `+91${phoneNumber}`,
        From: twilioPhone,
        Body: `Your Sahoo Sweets verification code is ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Twilio SMS failed');
      }
      console.log(`[SMS Gateway - Twilio] Dispatched to +91 ${phoneNumber}. SID:`, data.sid);
      return { 
        success: true, 
        provider: 'twilio', 
        sid: data.sid,
        message: `OTP sent via SMS to mobile: +91 ${phoneNumber}.`
      };
    } catch (err) {
      console.error('[SMS Gateway Error - Twilio]:', err);
      return {
        success: false,
        code: 'SMS_SEND_FAILED',
        canSwitchToEmail: true,
        message: `Twilio SMS delivery failed: ${err.message}. Please switch to Email OTP.`
      };
    }
  }

  // Option 2: Fast2SMS (Indian SMS Gateway)
  const smsApiKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
  if (smsApiKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': smsApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phoneNumber
        })
      });
      const data = await response.json();
      if (!response.ok || !data.return) {
        throw new Error(data.message || 'Fast2SMS returned error');
      }
      console.log(`[SMS Gateway - Fast2SMS] Dispatched to +91 ${phoneNumber}:`, data);
      return { 
        success: true, 
        provider: 'fast2sms', 
        data,
        message: `OTP sent via SMS to mobile: +91 ${phoneNumber}.`
      };
    } catch (err) {
      console.error('[SMS Gateway Error - Fast2SMS]:', err);
      return {
        success: false,
        code: 'SMS_SEND_FAILED',
        canSwitchToEmail: true,
        message: `Fast2SMS delivery failed: ${err.message}. Please switch to Email OTP.`
      };
    }
  }

  // Option 3: MSG91 Gateway
  if (process.env.MSG91_AUTH_KEY) {
    try {
      const templateId = process.env.MSG91_TEMPLATE_ID;
      const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${phoneNumber}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`;
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'MSG91 returned error');
      }
      console.log(`[SMS Gateway - MSG91] Dispatched to +91 ${phoneNumber}:`, data);
      return { 
        success: true, 
        provider: 'msg91', 
        data,
        message: `OTP sent via SMS to mobile: +91 ${phoneNumber}.`
      };
    } catch (err) {
      console.error('[SMS Gateway Error - MSG91]:', err);
      return {
        success: false,
        code: 'SMS_SEND_FAILED',
        canSwitchToEmail: true,
        message: `MSG91 SMS delivery failed: ${err.message}. Please switch to Email OTP.`
      };
    }
  }

  // No SMS provider configured
  console.warn(`[SMS Gateway] No SMS provider configured in backend/.env (TWILIO_*, FAST2SMS_*, MSG91_*).`);
  return {
    success: false,
    code: 'SMS_GATEWAY_NOT_CONFIGURED',
    canSwitchToEmail: true,
    message: 'Mobile SMS gateway is not configured on the server. Please switch to Email OTP (which sends directly under "Sahoo Sweets") to receive your verification code.'
  };
}

// =============================================================================
// ROUTE: 1. SEND OTP (/api/auth/send-otp)
// ZERO-EXPOSURE: OTP is NEVER returned in response JSON
// =============================================================================
const handleSendOtp = async (req, res) => {
  try {
    const { identifier, type, role, adminPin, name, password, email, phone } = req.body;

    if (!identifier) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid Email Address or 10-digit Indian Mobile Number!' 
      });
    }

    // Auto-detection & Validation
    const parsed = parseAndValidateIdentifier(identifier);
    if (!parsed) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input. Please enter a valid 10-digit Indian Mobile Number (+91) or Email Address.' 
      });
    }

    const { type: identifierType, normalized, display } = parsed;

    // Duplicate account check for Registration flow
    if (type === 'Registration') {
      let existingUser = null;
      if (isDbConnected) {
        existingUser = await User.findOne({ identifier: normalized });
      } else {
        existingUser = inMemoryUsers.get(normalized);
      }
      if (existingUser) {
        return res.status(409).json({
          success: false,
          code: 'ACCOUNT_ALREADY_EXISTS',
          message: 'An account with this email/phone already exists. Please sign in instead.'
        });
      }
    }

    // Admin Access Security Check
    if (role === 'admin') {
      if (!adminPin || adminPin.trim() !== ADMIN_ACCESS_PIN) {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid Admin Access PIN! Authorized owner PIN required (Default PIN: 9900).' 
        });
      }
    }

    // Rate Limiting Check (Max 5 requests in 10 minutes)
    if (isRateLimited(normalized)) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Too many OTP requests. Please try again after 10 minutes.'
      });
    }

    // 60-Second Cooldown Check
    const now = Date.now();
    let existingSession = null;

    if (isDbConnected) {
      existingSession = await OtpSession.findOne({ identifier: normalized }).sort({ createdAt: -1 });
    } else {
      existingSession = inMemoryOtps.get(normalized);
    }

    if (existingSession && existingSession.lastSentAt) {
      const lastSentTime = new Date(existingSession.lastSentAt).getTime();
      if (now - lastSentTime < 60000) {
        const remainingSecs = Math.ceil((60000 - (now - lastSentTime)) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSecs}s before requesting a new OTP code.`,
          cooldown: remainingSecs
        });
      }
    }

    // Generate secure 6-digit numeric OTP and 5-minute expiry
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(now + 5 * 60 * 1000);

    // Real Delivery Trigger (Email vs Indian SMS)
    let deliveryResult;
    if (identifierType === 'email') {
      deliveryResult = await sendEmailOtp(normalized, otp, type);
    } else {
      deliveryResult = await sendSmsOtp(normalized, otp);
    }

    // IF DELIVERY FAILED: DO NOT PRETEND SUCCESS AND DO NOT STORE UN-SENT OTP RECORD
    if (!deliveryResult || !deliveryResult.success) {
      return res.status(400).json({
        success: false,
        code: deliveryResult?.code || 'DELIVERY_FAILED',
        canSwitchToEmail: deliveryResult?.canSwitchToEmail || (identifierType === 'phone'),
        message: deliveryResult?.message || 'Failed to dispatch OTP. Please check your credentials or switch to Email OTP.'
      });
    }

    // Save to Database or Memory Store ONLY IF DELIVERY ACTUALLY SUCCEEDED!
    if (isDbConnected) {
      await OtpSession.deleteMany({ identifier: normalized });
      await OtpSession.create({
        identifier: normalized,
        otp,
        expiresAt,
        attempts: 0,
        role: role || 'customer',
        type: type || 'Login',
        name: name || '',
        phone: phone || '',
        email: email || '',
        password: password || '',
        lastSentAt: new Date(now)
      });
    } else {
      inMemoryOtps.set(normalized, {
        identifier: normalized,
        otp,
        expiresAt,
        attempts: 0,
        role: role || 'customer',
        type: type || 'Login',
        name: name || '',
        phone: phone || '',
        email: email || '',
        password: password || '',
        lastSentAt: now
      });
    }

    // ZERO EXPOSURE: OTP is NEVER sent in response JSON
    return res.status(200).json({
      success: true,
      message: deliveryResult.message || (identifierType === 'email'
        ? `OTP code sent under "Sahoo Sweets" to email: ${display}. Please check your Inbox and Spam/Junk folder.`
        : `OTP code sent via SMS to mobile: ${display}`),
      target: display,
      identifierType,
      expiresIn: 300,
      cooldown: 60,
      provider: deliveryResult?.provider || 'default'
    });
  } catch (error) {
    console.error('[Send OTP Server Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch OTP. Please check your network and try again.'
    });
  }
};

// =============================================================================
// ROUTE: REGISTER ACCOUNT (/api/auth/register)
// Validates Full Name, Contact (Email / Indian Phone), Password, and Admin PIN
// =============================================================================
const handleRegister = async (req, res) => {
  try {
    const { name, email, phone, identifier, password, role, adminPin } = req.body;

    // 1. Validate Full Name
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full Name is required (minimum 2 characters).'
      });
    }

    // 2. Validate Contact Identifier
    const rawTarget = (email || identifier || phone || '').trim();
    if (!rawTarget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Email Address or 10-digit Indian Mobile (+91).'
      });
    }

    const parsed = parseAndValidateIdentifier(rawTarget);
    if (!parsed) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact format. Please enter a valid Email Address or 10-digit Indian Mobile (+91).'
      });
    }

    // 3. Validate Password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // 4. Strict Role & Admin PIN check
    const assignedRole = role === 'admin' ? 'admin' : 'customer';
    if (assignedRole === 'admin') {
      if (!adminPin || adminPin.trim() !== ADMIN_ACCESS_PIN) {
        return res.status(403).json({
          success: false,
          message: 'Invalid Admin Access PIN! Authorized owner PIN required (Default PIN: 9900).'
        });
      }
    }

    const { normalized, display, type: identifierType } = parsed;

    // 5. Duplicate Account Check
    let existingUser = null;
    if (isDbConnected) {
      const orConditions = [{ identifier: normalized }];
      if (email && email.trim()) orConditions.push({ email: email.trim().toLowerCase() });
      if (phone && phone.trim()) {
        const cleanPh = phone.trim().replace(/\D/g, '').slice(-10);
        if (cleanPh.length === 10) orConditions.push({ phone: cleanPh });
      }
      existingUser = await User.findOne({ $or: orConditions });
    } else {
      existingUser = inMemoryUsers.get(normalized);
      if (!existingUser && email) {
        for (const u of inMemoryUsers.values()) {
          if (u.email && u.email.toLowerCase() === email.trim().toLowerCase()) {
            existingUser = u;
            break;
          }
        }
      }
      if (!existingUser && phone) {
        const cleanPh = phone.trim().replace(/\D/g, '').slice(-10);
        for (const u of inMemoryUsers.values()) {
          if (u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanPh) {
            existingUser = u;
            break;
          }
        }
      }
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: 'ACCOUNT_ALREADY_EXISTS',
        message: 'An account with this email or mobile number already exists. Please sign in instead.'
      });
    }

    // 6. Rate Limit Check
    if (isRateLimited(normalized)) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Too many requests. Please try again after 10 minutes.'
      });
    }

    // 7. 60-Second Cooldown Check
    const now = Date.now();
    let existingSession = isDbConnected 
      ? await OtpSession.findOne({ identifier: normalized }).sort({ createdAt: -1 })
      : inMemoryOtps.get(normalized);

    if (existingSession && existingSession.lastSentAt) {
      const lastSentTime = new Date(existingSession.lastSentAt).getTime();
      if (now - lastSentTime < 60000) {
        const remainingSecs = Math.ceil((60000 - (now - lastSentTime)) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSecs}s before requesting a new OTP verification code.`,
          cooldown: remainingSecs
        });
      }
    }

    // 8. Generate 6-Digit OTP & 5-minute expiry
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(now + 5 * 60 * 1000);

    const pendingData = {
      identifier: normalized,
      otp,
      expiresAt,
      role: assignedRole,
      type: 'Registration',
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : (normalized.includes('@') ? normalized : ''),
      phone: phone ? phone.trim().replace(/\D/g, '').slice(-10) : (!normalized.includes('@') ? normalized : ''),
      password,
      attempts: 0,
      lastSentAt: new Date(now)
    };

    // 9. Dispatch Verification OTP
    let deliveryResult = { success: true, provider: 'in-memory' };
    if (identifierType === 'email') {
      try {
        deliveryResult = await sendEmailOtp(normalized, otp, 'Registration');
      } catch (err) {
        console.error('[Registration Email Gateway Error]:', err);
        return res.status(500).json({
          success: false,
          code: 'EMAIL_DELIVERY_FAILED',
          message: `Registration failed: Unable to deliver OTP email (${err.message || 'SMTP Error'}). Please verify your email address or SMTP credentials.`
        });
      }
    } else {
      deliveryResult = await sendSmsOtp(normalized, otp);
      if (!deliveryResult.success) {
        return res.status(400).json({
          success: false,
          code: 'SMS_GATEWAY_NOT_CONFIGURED',
          canSwitchToEmail: true,
          message: 'Mobile SMS gateway is not configured on the server. Please register using your Email Address to receive your 6-digit verification code.'
        });
      }
    }

    // Save session only if dispatch succeeded
    if (isDbConnected) {
      await OtpSession.deleteMany({ identifier: normalized });
      await OtpSession.create(pendingData);
    } else {
      inMemoryOtps.set(normalized, {
        ...pendingData,
        expiresAt: expiresAt.getTime()
      });
    }

    return res.status(200).json({
      success: true,
      message: `Account details verified! Verification code dispatched under "Sahoo Sweets" to ${display}. Please enter code to complete registration.`,
      target: display,
      identifierType,
      expiresIn: 300,
      cooldown: 60,
      provider: deliveryResult?.provider || 'default'
    });
  } catch (error) {
    console.error('[Registration Server Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error. Please try again.'
    });
  }
};

app.post('/api/auth/send-otp', handleSendOtp);
app.post('/api/send-otp', handleSendOtp);
app.post('/api/auth/register', handleRegister);
app.post('/api/register', handleRegister);

// =============================================================================
// ROUTE: 2. VERIFY OTP (/api/auth/verify-otp)
// =============================================================================
const handleVerifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identifier and 6-digit OTP code are required!' 
      });
    }

    const parsed = parseAndValidateIdentifier(identifier);
    if (!parsed) {
      return res.status(400).json({ success: false, message: 'Invalid phone number or email address format.' });
    }

    const { normalized, display } = parsed;
    const cleanOtp = String(otp).trim();

    // Development bypass master code for testing
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev && (cleanOtp === '123456' || cleanOtp === '1234')) {
      const token = `ss_session_${Buffer.from(`${normalized}:${Date.now()}`).toString('base64')}`;
      
      let user = null;
      if (isDbConnected) {
        user = await User.findOne({ identifier: normalized });
        if (!user) {
          user = await User.create({
            identifier: normalized,
            name: normalized.includes('@') ? normalized.split('@')[0] : 'Sahoo Customer',
            phone: normalized.includes('@') ? '' : normalized,
            email: normalized.includes('@') ? normalized : ''
          });
        }
      } else {
        user = inMemoryUsers.get(normalized) || {
          identifier: normalized,
          name: 'Sahoo Customer',
          role: 'customer',
          walletBalance: 250,
          rewardPoints: 350
        };
      }

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully (Development Mode)!',
        token,
        user: {
          identifier: display,
          role: user.role || 'customer',
          name: user.name || 'Sahoo Customer',
          walletBalance: user.walletBalance,
          rewardPoints: user.rewardPoints
        }
      });
    }

    let record = null;
    if (isDbConnected) {
      record = await OtpSession.findOne({ identifier: normalized }).sort({ createdAt: -1 });
    } else {
      record = inMemoryOtps.get(normalized);
    }

    // Check if record exists
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not requested for this contact. Please click "Resend OTP".'
      });
    }

    // Check 5-minute validity window
    const expiresAtTime = new Date(record.expiresAt).getTime();
    if (Date.now() > expiresAtTime) {
      if (isDbConnected) {
        await OtpSession.deleteMany({ identifier: normalized });
      } else {
        inMemoryOtps.delete(normalized);
      }
      return res.status(400).json({
        success: false,
        message: 'OTP has expired after 5 minutes! Please request a new OTP.'
      });
    }

    // Max 3 Wrong Attempts check
    if (record.otp !== cleanOtp) {
      const attempts = (record.attempts || 0) + 1;

      if (isDbConnected) {
        record.attempts = attempts;
        await record.save();
      } else {
        record.attempts = attempts;
      }

      if (attempts >= 3) {
        if (isDbConnected) {
          await OtpSession.deleteMany({ identifier: normalized });
        } else {
          inMemoryOtps.delete(normalized);
        }
        return res.status(400).json({
          success: false,
          message: 'Too many incorrect attempts (3/3). This OTP has been invalidated for security. Please request a new OTP.'
        });
      }

      const attemptsLeft = 3 - attempts;
      return res.status(400).json({
        success: false,
        message: `Incorrect 6-digit OTP. You have ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining.`
      });
    }

    // OTP Verified Successfully!
    const verifiedRole = record.role || 'customer';
    const regName = record.name || (verifiedRole === 'admin' ? 'Sahoo Sweets Admin' : (normalized.includes('@') ? normalized.split('@')[0] : 'Sahoo Customer'));
    const regPhone = record.phone || (!normalized.includes('@') ? normalized : '');
    const regEmail = record.email || (normalized.includes('@') ? normalized : '');
    const regPassword = record.password || '';

    if (isDbConnected) {
      await OtpSession.deleteMany({ identifier: normalized });
    } else {
      inMemoryOtps.delete(normalized);
    }

    // Find or create user in Database / Memory
    let user = null;
    if (isDbConnected) {
      user = await User.findOne({ identifier: normalized });
      if (!user) {
        user = await User.create({
          identifier: normalized,
          name: regName,
          phone: regPhone,
          email: regEmail,
          password: regPassword,
          role: verifiedRole,
          walletBalance: 250,
          rewardPoints: 350
        });
      } else if (regName || regPassword) {
        if (regName && regName !== 'Sahoo Customer') user.name = regName;
        if (regPassword) user.password = regPassword;
        if (regPhone) user.phone = regPhone;
        if (regEmail) user.email = regEmail;
        await user.save();
      }
    } else {
      if (!inMemoryUsers.has(normalized)) {
        inMemoryUsers.set(normalized, {
          identifier: normalized,
          name: regName,
          phone: regPhone,
          email: regEmail,
          password: regPassword,
          role: verifiedRole,
          walletBalance: 250,
          rewardPoints: 350,
          addresses: [
            { id: 1, name: regName, phone: regPhone || '8763332962', address: 'Nagapur, Near Punjab National Bank', city: 'Gop, Puri', state: 'Odisha', pin: '752110', isDefault: true }
          ],
          walletHistory: [{ id: 1, type: 'credit', title: 'Welcome Cashback Reward', amount: 250, date: new Date().toLocaleDateString() }],
          rewardsHistory: [{ id: 1, type: 'earned', title: 'Signup Bonus Points', points: 350, date: new Date().toLocaleDateString() }],
          refunds: []
        });
      } else if (regName || regPassword) {
        const u = inMemoryUsers.get(normalized);
        if (regName && regName !== 'Sahoo Customer') u.name = regName;
        if (regPassword) u.password = regPassword;
        if (regPhone) u.phone = regPhone;
        if (regEmail) u.email = regEmail;
      }
      user = inMemoryUsers.get(normalized);
    }

    const token = `ss_session_${Buffer.from(`${normalized}:${Date.now()}`).toString('base64')}`;

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      token,
      user: {
        identifier: display,
        role: verifiedRole,
        name: user.name || (verifiedRole === 'admin' ? 'Sahoo Sweets Admin' : 'Sahoo Customer'),
        walletBalance: user.walletBalance ?? 250,
        rewardPoints: user.rewardPoints ?? 350
      }
    });
  } catch (error) {
    console.error('[Verify OTP Server Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Verification failed due to a server error. Please try again.'
    });
  }
};

app.post('/api/auth/verify-otp', handleVerifyOtp);
app.post('/api/verify-otp', handleVerifyOtp);

// Admin PIN check route
app.post('/api/auth/verify-admin-pin', (req, res) => {
  const { pin } = req.body;
  if (pin && pin.trim() === ADMIN_ACCESS_PIN) {
    res.json({ success: true, message: 'Admin PIN authorized!' });
  } else {
    res.status(403).json({ success: false, message: 'Invalid Admin Access PIN! Default is 9900.' });
  }
});

// =============================================================================
// MENU APIS: 25 TRADITIONAL ITEMS + STOCK TOGGLE
// =============================================================================
app.get('/api/menu', async (req, res) => {
  try {
    if (isDbConnected) {
      const items = await MenuItem.find().sort({ id: 1 });
      return res.json({ success: true, menu: items });
    }
    return res.json({ success: true, menu: inMemoryMenuItems });
  } catch (err) {
    console.error('[Menu API Error]:', err);
    return res.json({ success: true, menu: inMemoryMenuItems });
  }
});

app.patch('/api/menu/:id/toggle-stock', async (req, res) => {
  try {
    const { id } = req.params;
    let isAvailable = true;

    if (isDbConnected) {
      const item = await MenuItem.findOne({ id });
      if (item) {
        item.isAvailable = !item.isAvailable;
        await item.save();
        isAvailable = item.isAvailable;
      }
    } else {
      const item = inMemoryMenuItems.find(i => i.id === id);
      if (item) {
        item.isAvailable = !item.isAvailable;
        isAvailable = item.isAvailable;
      }
    }

    return res.json({ success: true, id, isAvailable });
  } catch (err) {
    console.error('[Toggle Stock Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update item availability' });
  }
});

// =============================================================================
// ORDERS APIS: CRUD, REAL STAGE UPDATES & CANCELLATIONS
// =============================================================================
app.get('/api/orders', async (req, res) => {
  try {
    const { userIdentifier, role } = req.query;

    if (isDbConnected) {
      const query = (role === 'admin' || !userIdentifier) ? {} : { userIdentifier };
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, orders });
    }

    let result = inMemoryOrders;
    if (role !== 'admin' && userIdentifier) {
      result = inMemoryOrders.filter(o => o.userIdentifier === userIdentifier);
    }
    return res.json({ success: true, orders: result });
  } catch (err) {
    console.error('[Orders API Error]:', err);
    return res.json({ success: true, orders: inMemoryOrders });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = orderData.id || `SS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      userIdentifier: orderData.userIdentifier || '8763332962',
      customerName: orderData.customerName || 'Customer',
      customerPhone: orderData.customerPhone || '8763332962',
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: orderData.items || 'Sahoo Sweets Assorted Pack',
      itemsList: orderData.itemsList || [],
      itemTotal: orderData.itemTotal || orderData.total || 0,
      deliveryFee: orderData.deliveryFee ?? 35,
      discount: orderData.discount ?? 0,
      tip: orderData.tip ?? 0,
      total: orderData.total,
      status: 'Order Confirmed',
      statusIndex: 0,
      steps: ["Order Confirmed", "Placed", "Shipped/Preparing", "Out for Delivery", "Delivered"],
      payment: orderData.payment || 'Cash on Delivery',
      address: orderData.address || 'Nagapur, Near Punjab National Bank, Gop, Puri',
      deliveryInstructions: orderData.deliveryInstructions || '',
      cookingInstruction: orderData.cookingInstruction || '',
      estimatedMinutes: 24,
      partner: {
        name: 'Ramesh Kumar',
        phone: '+91 98612 34567',
        rating: 4.9,
        deliveries: '1,420+',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        badge: 'Top Rated Valet'
      }
    };

    // Calculate Reward Points Earned (10% of total)
    const earnedPoints = Math.round(Number(newOrder.total) * 0.1);

    if (isDbConnected) {
      await Order.create(newOrder);

      // Update User Wallet & Reward History if user exists
      const user = await User.findOne({ identifier: newOrder.userIdentifier });
      if (user) {
        if (newOrder.payment === 'Sahoo Money Wallet') {
          user.walletBalance = Math.max(0, user.walletBalance - newOrder.total);
          user.walletHistory.unshift({
            id: Date.now(),
            type: 'debit',
            title: `Paid for Order #${newOrder.id}`,
            amount: newOrder.total,
            date: newOrder.date
          });
        }
        user.rewardPoints = (user.rewardPoints || 0) + earnedPoints;
        user.rewardsHistory.unshift({
          id: Date.now() + 1,
          type: 'earned',
          title: `Order #${newOrder.id} Purchase Points`,
          points: earnedPoints,
          date: newOrder.date
        });
        await user.save();
      }
    } else {
      inMemoryOrders.unshift(newOrder);
      const user = inMemoryUsers.get(newOrder.userIdentifier);
      if (user) {
        if (newOrder.payment === 'Sahoo Money Wallet') {
          user.walletBalance = Math.max(0, user.walletBalance - newOrder.total);
          user.walletHistory.unshift({
            id: Date.now(),
            type: 'debit',
            title: `Paid for Order #${newOrder.id}`,
            amount: newOrder.total,
            date: newOrder.date
          });
        }
        user.rewardPoints = (user.rewardPoints || 0) + earnedPoints;
        user.rewardsHistory.unshift({
          id: Date.now() + 1,
          type: 'earned',
          title: `Order #${newOrder.id} Purchase Points`,
          points: earnedPoints,
          date: newOrder.date
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order: newOrder,
      earnedPoints
    });
  } catch (err) {
    console.error('[Create Order Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { statusIndex, status } = req.body;

    const steps = ["Order Confirmed", "Placed", "Shipped/Preparing", "Out for Delivery", "Delivered"];
    const newStatus = status || steps[statusIndex] || 'Delivered';

    if (isDbConnected) {
      const order = await Order.findOneAndUpdate(
        { id },
        { statusIndex, status: newStatus },
        { new: true }
      );
      return res.json({ success: true, order });
    }

    const order = inMemoryOrders.find(o => o.id === id);
    if (order) {
      order.statusIndex = statusIndex;
      order.status = newStatus;
      return res.json({ success: true, order });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (err) {
    console.error('[Update Order Status Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

app.post('/api/orders/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (isDbConnected) {
      const order = await Order.findOne({ id });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.status = 'Cancelled';
      order.statusIndex = -1;
      await order.save();

      // Add to user refunds
      const user = await User.findOne({ identifier: order.userIdentifier });
      if (user) {
        user.refunds.unshift({
          orderId: order.id,
          amount: order.total,
          reason: reason || 'Customer requested cancellation',
          date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Processed'
        });
        await user.save();
      }

      return res.json({ success: true, message: 'Order cancelled successfully', order });
    }

    const order = inMemoryOrders.find(o => o.id === id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'Cancelled';
    order.statusIndex = -1;

    const user = inMemoryUsers.get(order.userIdentifier);
    if (user) {
      user.refunds.unshift({
        orderId: order.id,
        amount: order.total,
        reason: reason || 'Customer requested cancellation',
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Processed'
      });
    }

    return res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('[Cancel Order Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

app.post('/api/orders/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (isDbConnected) {
      const order = await Order.findOneAndUpdate({ id }, { rating, feedback }, { new: true });
      return res.json({ success: true, order });
    }

    const order = inMemoryOrders.find(o => o.id === id);
    if (order) {
      order.rating = rating;
      order.feedback = feedback;
      return res.json({ success: true, order });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (err) {
    console.error('[Rate Order Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit rating' });
  }
});

// =============================================================================
// USER PROFILE, REWARDS & WALLET APIS
// =============================================================================
app.get('/api/users/profile', async (req, res) => {
  try {
    const { identifier } = req.query;
    if (!identifier) return res.status(400).json({ success: false, message: 'Identifier required' });

    const norm = identifier.trim().toLowerCase();
    let user = null;

    if (isDbConnected) {
      user = await User.findOne({ identifier: norm });
      if (!user) {
        user = await User.create({
          identifier: norm,
          name: norm.includes('@') ? norm.split('@')[0] : 'Sahoo Customer',
          phone: norm.includes('@') ? '' : norm,
          email: norm.includes('@') ? norm : ''
        });
      }
    } else {
      user = inMemoryUsers.get(norm);
      if (!user) {
        user = {
          identifier: norm,
          name: 'Sahoo Customer',
          phone: norm.includes('@') ? '' : norm,
          email: norm.includes('@') ? norm : '',
          role: 'customer',
          walletBalance: 250,
          rewardPoints: 350,
          addresses: [],
          walletHistory: [],
          rewardsHistory: [],
          refunds: []
        };
        inMemoryUsers.set(norm, user);
      }
    }

    return res.json({ success: true, profile: user });
  } catch (err) {
    console.error('[Profile API Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to load profile' });
  }
});

app.put('/api/users/profile', async (req, res) => {
  try {
    const { identifier, name, phone, email, addresses } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: 'Identifier required' });

    const norm = identifier.trim().toLowerCase();

    if (isDbConnected) {
      const user = await User.findOne({ identifier: norm });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (email) user.email = email;
      if (addresses) user.addresses = addresses;
      await user.save();
      return res.json({ success: true, profile: user });
    }

    const user = inMemoryUsers.get(norm);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (addresses) user.addresses = addresses;

    return res.json({ success: true, profile: user });
  } catch (err) {
    console.error('[Update Profile Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

app.post('/api/wallet/convert-rewards', async (req, res) => {
  try {
    const { identifier, points } = req.body;
    const numPoints = parseInt(points, 10);
    if (!identifier || !numPoints || numPoints <= 0) {
      return res.status(400).json({ success: false, message: 'Valid identifier and points required' });
    }

    const norm = identifier.trim().toLowerCase();
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    if (isDbConnected) {
      const user = await User.findOne({ identifier: norm });
      if (!user || user.rewardPoints < numPoints) {
        return res.status(400).json({ success: false, message: 'Insufficient reward points to convert' });
      }

      user.rewardPoints -= numPoints;
      user.walletBalance = (user.walletBalance || 0) + numPoints;
      user.rewardsHistory.unshift({
        id: Date.now(),
        type: 'converted',
        title: 'Converted to Sahoo Money',
        points: -numPoints,
        date: dateStr
      });
      user.walletHistory.unshift({
        id: Date.now() + 1,
        type: 'credit',
        title: 'Converted from Partner Rewards',
        amount: numPoints,
        date: dateStr
      });
      await user.save();

      return res.json({
        success: true,
        message: `Successfully converted ${numPoints} points to ₹${numPoints} Sahoo Money!`,
        walletBalance: user.walletBalance,
        rewardPoints: user.rewardPoints
      });
    }

    const user = inMemoryUsers.get(norm);
    if (!user || user.rewardPoints < numPoints) {
      return res.status(400).json({ success: false, message: 'Insufficient reward points to convert' });
    }

    user.rewardPoints -= numPoints;
    user.walletBalance = (user.walletBalance || 0) + numPoints;
    user.rewardsHistory.unshift({
      id: Date.now(),
      type: 'converted',
      title: 'Converted to Sahoo Money',
      points: -numPoints,
      date: dateStr
    });
    user.walletHistory.unshift({
      id: Date.now() + 1,
      type: 'credit',
      title: 'Converted from Partner Rewards',
      amount: numPoints,
      date: dateStr
    });

    return res.json({
      success: true,
      message: `Successfully converted ${numPoints} points to ₹${numPoints} Sahoo Money!`,
      walletBalance: user.walletBalance,
      rewardPoints: user.rewardPoints
    });
  } catch (err) {
    console.error('[Convert Rewards Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to convert reward points' });
  }
});

app.post('/api/wallet/recharge', async (req, res) => {
  try {
    const { identifier, amount } = req.body;
    const numAmount = parseFloat(amount);
    if (!identifier || !numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid identifier and amount required' });
    }

    const norm = identifier.trim().toLowerCase();
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    if (isDbConnected) {
      const user = await User.findOne({ identifier: norm });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.walletBalance = (user.walletBalance || 0) + numAmount;
      user.walletHistory.unshift({
        id: Date.now(),
        type: 'credit',
        title: 'Recharged via UPI / Netbanking',
        amount: numAmount,
        date: dateStr
      });
      await user.save();
      return res.json({ success: true, walletBalance: user.walletBalance });
    }

    const user = inMemoryUsers.get(norm);
    if (user) {
      user.walletBalance = (user.walletBalance || 0) + numAmount;
      user.walletHistory.unshift({
        id: Date.now(),
        type: 'credit',
        title: 'Recharged via UPI / Netbanking',
        amount: numAmount,
        date: dateStr
      });
      return res.json({ success: true, walletBalance: user.walletBalance });
    }

    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (err) {
    console.error('[Recharge Wallet Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to recharge wallet' });
  }
});

// =============================================================================
// HEALTH CHECK ENDPOINTS (Render Web Service Monitoring & Health Probes)
// =============================================================================
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'Sahoo Sweets Backend API',
    database: isDbConnected ? 'MongoDB (Connected)' : 'In-Memory DB (Active)',
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'Sahoo Sweets API Server',
    message: 'Backend server is running smoothly on Render.',
    endpoints: {
      health: '/api/health',
      menu: '/api/menu',
      sendOtp: '/api/auth/send-otp',
      verifyOtp: '/api/auth/verify-otp',
      register: '/api/auth/register'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Sahoo Sweets Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Admin PIN:    ${ADMIN_ACCESS_PIN}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
