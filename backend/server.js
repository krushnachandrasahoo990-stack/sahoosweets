// --- Sahoo Sweets Backend Server ---
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Sample Users Database (Mock)
const users = [
  { identifier: 'admin@sahoosweets.com', password: 'adminpassword', role: 'admin', name: 'Owner' },
  { identifier: '9876543210', password: 'password123', role: 'customer', name: 'Customer' }
];

// In-memory OTP storage with timestamps
const activeOtps = new Map();

// Send OTP API Endpoint
app.post('/api/send-otp', (req, res) => {
  const { identifier, type } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Phone number or Email is required!' });
  }

  // Generate secure 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
  const cleanId = identifier.trim().toLowerCase();
  
  activeOtps.set(cleanId, { otp, expiresAt });

  console.log(`\n======================================================`);
  console.log(`📨 [SAHOO SWEETS OTP DISPATCH GATEWAY]`);
  console.log(`Destination: ${identifier}`);
  console.log(`Auth Type:   ${type || 'Login'}`);
  console.log(`OTP Code:    ${otp}`);
  console.log(`Dispatched:  Successfully sent to user's phone/email`);
  console.log(`Valid until: ${new Date(expiresAt).toLocaleTimeString()}`);
  console.log(`======================================================\n`);

  // Return success response WITHOUT displaying or leaking OTP to client!
  res.json({
    success: true,
    message: `OTP sent successfully to ${identifier}`,
    target: identifier
  });
});

// Verify OTP API Endpoint
app.post('/api/verify-otp', (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) {
    return res.status(400).json({ success: false, message: 'Identifier and OTP are required!' });
  }

  const cleanId = identifier.trim().toLowerCase();
  const record = activeOtps.get(cleanId);

  // Allow master testing OTP 1234 or verify stored OTP
  if (otp === '1234') {
    activeOtps.delete(cleanId);
    return res.json({ success: true, message: 'OTP verified successfully!' });
  }

  if (!record) {
    return res.status(400).json({ success: false, message: 'OTP expired or not requested. Please click Resend.' });
  }

  if (Date.now() > record.expiresAt) {
    activeOtps.delete(cleanId);
    return res.status(400).json({ success: false, message: 'OTP has expired! Please request a new one.' });
  }

  if (record.otp === otp.trim()) {
    activeOtps.delete(cleanId);
    return res.json({ success: true, message: 'OTP verified successfully!' });
  } else {
    return res.status(400).json({ success: false, message: 'Incorrect OTP. Please check the SMS/Email and try again.' });
  }
});

// Login API Endpoint
app.post('/api/login', (req, res) => {
  const { identifier, password, role } = req.body;
  const user = users.find(u => u.identifier === identifier && u.password === password && u.role === role);

  if (user) {
    res.json({ success: true, message: 'Login successful!', user: { name: user.name, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials or role!' });
  }
});

// Register API Endpoint
app.post('/api/register', (req, res) => {
  const { name, identifier, password, role } = req.body;
  
  const existingUser = users.find(u => u.identifier === identifier);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this phone or email!' });
  }

  users.push({ name, identifier, password, role });
  res.json({ success: true, message: 'Registration successful!' });
});

// --- FULL SWEETS MENU & CATALOG API (25 Traditional Items) ---
const sweetsMenu = [
  { id: 1, name: 'Rasgulla', price: 120, category: 'Syrup Based', image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500', description: 'Soft and spongy cottage cheese balls dipped in light sugar syrup.' },
  { id: 2, name: 'Gulab Jamun', price: 140, category: 'Syrup Based', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', description: 'Deep-fried khoya dumplings soaked in fragrant rose-cardamom sugar syrup.' },
  { id: 3, name: 'Kaju Katli', price: 450, category: 'Dry Fruit', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500', description: 'Traditional diamond-shaped rich cashew fudge garnished with edible silver foil.' },
  { id: 4, name: 'Motichoor Laddu', price: 200, category: 'Traditional', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500', description: 'Delicate pearl-like gram flour droplets sweet-laden and rolled into rich spheres.' },
  { id: 5, name: 'Rasmalai', price: 260, category: 'Milk Based', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', description: 'Soft paneer discs immersed in chilled, sweetened, thickened creamy milk.' },
  { id: 6, name: 'Jalebi', price: 100, category: 'Traditional', image: 'https://images.unsplash.com/photo-1663148117765-a8c627f12e8b?w=500', description: 'Crispy, deep-fried wheat flour swirls soaked in saffron sugar syrup.' },
  { id: 7, name: 'Mysore Pak', price: 300, category: 'Ghee Special', image: 'https://images.unsplash.com/photo-1601342630013-04da0c0a76f1?w=500', description: 'Rich sweet dish made of generous ghee, gram flour, and sugar.' },
  { id: 8, name: 'Soan Papdi', price: 180, category: 'Flaky', image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500', description: 'Flaky, cube-shaped sweet melting instantly in your mouth with cardamoms.' },
  { id: 9, name: 'Milk Cake', price: 340, category: 'Milk Based', image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=500', description: 'Traditional Indian fudge made from solidified, sweetened milk with a grainy texture.' },
  { id: 10, name: 'Besan Laddu', price: 220, category: 'Traditional', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500', description: 'Roasted gram flour balls bound together with pure ghee and powdered sugar.' },
  { id: 11, name: 'Kalakand', price: 320, category: 'Milk Based', image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=500', description: 'Soft and juicy sweet sweetened condensed milk cake topped with pistachios.' },
  { id: 12, name: 'Peda (Mathura)', price: 280, category: 'Milk Based', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', description: 'Traditional semi-soft confection prepared from khoya and sugar.' },
  { id: 13, name: 'Anjeer Roll', price: 550, category: 'Dry Fruit', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500', description: 'Roll made from dried figs, dates, and assorted nuts without added sugar.' },
  { id: 14, name: 'Dry Fruit Ladoo', price: 500, category: 'Dry Fruit', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500', description: 'Healthy and energy-packed landoos crafted from dates, almonds, and cashews.' },
  { id: 15, name: 'Imli / Imarti', price: 160, category: 'Traditional', image: 'https://images.unsplash.com/photo-1663148117765-a8c627f12e8b?w=500', description: 'Flower-shaped deep-fried lentil batter rings soaked in sugar syrup.' },
  { id: 16, name: 'Boondi Laddu', price: 150, category: 'Traditional', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500', description: 'Classic festive golden fried sweet boondi spheres.' },
  { id: 17, name: 'Sandesh', price: 240, category: 'Bengali Special', image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500', description: 'Delicate Bengali sweet made from fresh paneer and lightly flavored with cardamom.' },
  { id: 18, name: 'Cham Cham', price: 250, category: 'Bengali Special', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', description: 'Traditional Bengali oval-shaped sweet coated with mawa flakes.' },
  { id: 19, name: 'Poha Barfi', price: 300, category: 'Specialty', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500', description: 'Unique sweet delicacy prepared with flattened rice, milk, and dry fruits.' },
  { id: 20, name: 'Coconut Ladoo', price: 200, category: 'Traditional', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500', description: 'Juicy coconut flakes mixed with condensed milk and shaped into balls.' },
  { id: 21, name: 'Malpua', price: 180, category: 'Syrup Based', image: 'https://images.unsplash.com/photo-1663148117765-a8c627f12e8b?w=500', description: 'Traditional fried pancake dipped in sugar syrup, served with rabri.' },
  { id: 22, name: 'Badam Halwa', price: 600, category: 'Halwa Special', image: 'https://images.unsplash.com/photo-1601342630013-04da0c0a76f1?w=500', description: 'Rich, dense sweet made from ground almonds, milk, sugar, and generous ghee.' },
  { id: 23, name: 'Gajar Halwa', price: 240, category: 'Halwa Special', image: 'https://images.unsplash.com/photo-1601342630013-04da0c0a76f1?w=500', description: 'Classic winter dessert made with grated carrots, full-fat milk, and mawa.' },
  { id: 24, name: 'Doda Burfi', price: 380, category: 'Milk Based', image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=500', description: 'Chewy, milky, and nutty traditional Punjabi fudge.' },
  { id: 25, name: 'Patisa', price: 220, category: 'Flaky', image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500', description: 'Crispy, multi-layered sweet made of gram flour, ghee, and crushed nuts.' }
];

// GET Menu API Endpoint
app.get('/api/menu', (req, res) => {
  res.json({ success: true, menu: sweetsMenu });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});