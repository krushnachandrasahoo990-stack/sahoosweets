// =============================================================================
// SAHOO SWEETS - PRODUCTION BACKEND SERVER (Express + Node.js)
// =============================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('[Server] nodemailer not loaded, fallback mode active.');
}

const app = express();
app.use(cors());
app.use(express.json());

// Sample Users Database (Mock)
const users = [
  { identifier: 'admin@sahoosweets.com', password: 'adminpassword', role: 'admin', name: 'Owner' },
  { identifier: '9876543210', password: 'password123', role: 'customer', name: 'Customer' }
];

// Active OTP Memory Store:
// Map<normalizedIdentifier, { otp: string, expiresAt: number, attempts: number, lastSentAt: number, role: string, type: string }>
const activeOtps = new Map();

// Rate Limiting Map: Map<normalizedIdentifier, number[]> (timestamps of recent requests)
const otpRateLimits = new Map();

// Authorized Admin Security PIN
const ADMIN_ACCESS_PIN = process.env.ADMIN_ACCESS_PIN || '9900';

// =============================================================================
// HELPER FUNCTIONS: NORMALIZATION & VALIDATION
// =============================================================================

/**
 * Normalizes and validates whether input is an Indian Mobile or Email.
 * Returns { type: 'phone'|'email'|null, normalized: string, display: string }
 */
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

/**
 * Rate limit check: Maximum 5 OTP requests in 10 minutes per identifier
 */
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
// REAL DELIVERY DISPATCHERS (EMAIL & INDIAN SMS)
// =============================================================================

/**
 * Sends Email OTP via Nodemailer SMTP or Resend API
 */
async function sendEmailOtp(email, otp, type = 'Login') {
  const subject = `Your Sahoo Sweets Verification Code: ${otp}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Sahoo Sweets Verification Code</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f6f0; margin: 0; padding: 24px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 2px solid #BBAB47; border-radius: 18px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="text-align: center; border-bottom: 2px dashed #f2c983; padding-bottom: 18px; margin-bottom: 24px;">
          <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">SAHOO SWEETS PURI</h1>
          <p style="color: #8c7625; margin: 4px 0 0; font-size: 13px; font-weight: 700;">Traditional Sweets & Snacks Delivery</p>
        </div>

        <p style="font-size: 15px; color: #333333; line-height: 1.5; margin-bottom: 16px;">
          Hello,
        </p>
        <p style="font-size: 14px; color: #555555; line-height: 1.5; margin-bottom: 20px;">
          Use the following 6-digit One Time Password (OTP) to complete your <strong>${type}</strong> verification. This code is valid for <strong>5 minutes</strong>.
        </p>

        <div style="background-color: #fcf9eb; border: 2px solid #BBAB47; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #1a1a1a; font-family: monospace;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 12px; color: #777777; margin-bottom: 8px;">
          <strong>Security Notice:</strong> Never share this OTP with anyone, including Sahoo Sweets staff. Our team will never ask for your code.
        </p>
        <p style="font-size: 12px; color: #999999; margin: 0; border-top: 1px solid #eeeeee; padding-top: 16px; text-align: center;">
          Grand Road, Puri, Odisha • Delivery Helpline: +91 9078699528
        </p>
      </div>
    </body>
    </html>
  `;

  // Option 1: Resend API (HTTP API)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Sahoo Sweets <onboarding@resend.dev>',
          to: email,
          subject,
          html: htmlContent
        })
      });
      const data = await res.json();
      console.log(`[Email Gateway - Resend] Sent to ${email}. ID:`, data.id || 'ok');
      return { success: true, provider: 'resend', id: data.id };
    } catch (err) {
      console.error('[Email Gateway Error - Resend]:', err);
    }
  }

  // Option 2: Nodemailer (SMTP / Gmail App Password)
  if (nodemailer && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Sahoo Sweets" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: htmlContent
      });

      console.log(`[Email Gateway - Nodemailer] Sent to ${email}. MessageId:`, info.messageId);
      return { success: true, provider: 'nodemailer', id: info.messageId };
    } catch (err) {
      console.error('[Email Gateway Error - Nodemailer]:', err);
    }
  }

  // Option 3: Development / Fallback Console Logging
  console.log(`\n======================================================`);
  console.log(`📧 [EMAIL OTP SIMULATOR - DEV MODE]`);
  console.log(`To:       ${email}`);
  console.log(`Subject:  ${subject}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Validity: 5 Minutes`);
  console.log(`Note:     Configure EMAIL_USER / EMAIL_PASS or RESEND_API_KEY in .env for live email`);
  console.log(`======================================================\n`);
  return { success: true, provider: 'dev-console', simulated: true };
}

/**
 * Sends Phone OTP to Indian Mobile via Fast2SMS / MSG91 API
 */
async function sendSmsOtp(phoneNumber, otp) {
  const smsApiKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;

  // Option 1: Fast2SMS (Indian SMS Gateway)
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
      console.log(`[SMS Gateway - Fast2SMS] Dispatched to +91 ${phoneNumber}:`, data);
      return { success: true, provider: 'fast2sms', data };
    } catch (err) {
      console.error('[SMS Gateway Error - Fast2SMS]:', err);
    }
  }

  // Option 2: MSG91 Gateway (Optional Alternative)
  if (process.env.MSG91_AUTH_KEY) {
    try {
      const templateId = process.env.MSG91_TEMPLATE_ID;
      const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${phoneNumber}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`;
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();
      console.log(`[SMS Gateway - MSG91] Dispatched to +91 ${phoneNumber}:`, data);
      return { success: true, provider: 'msg91', data };
    } catch (err) {
      console.error('[SMS Gateway Error - MSG91]:', err);
    }
  }

  // Option 3: Development / Fallback Console Logging
  console.log(`\n======================================================`);
  console.log(`📱 [INDIAN SMS OTP SIMULATOR - DEV MODE]`);
  console.log(`Recipient: +91 ${phoneNumber}`);
  console.log(`Message:   Your Sahoo Sweets verification code is ${otp}. Valid for 5 minutes.`);
  console.log(`OTP Code:  ${otp}`);
  console.log(`Note:      Configure FAST2SMS_API_KEY in .env for live SMS delivery`);
  console.log(`======================================================\n`);
  return { success: true, provider: 'dev-console', simulated: true };
}

// =============================================================================
// ROUTE: 1. SEND OTP (/api/auth/send-otp & alias /api/send-otp)
// =============================================================================
const handleSendOtp = async (req, res) => {
  try {
    const { identifier, type, role, adminPin } = req.body;

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

    // 30-Second Cooldown Check
    const existing = activeOtps.get(normalized);
    const now = Date.now();
    if (existing && existing.lastSentAt && (now - existing.lastSentAt < 30000)) {
      const remainingSecs = Math.ceil((30000 - (now - existing.lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingSecs}s before requesting a new OTP code.`,
        cooldown: remainingSecs
      });
    }

    // Invalidate previous OTP and generate a secure 6-digit numeric code
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5-minute expiry

    // Store in activeOtps map
    activeOtps.set(normalized, {
      otp,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
      role: role || 'customer',
      type: type || 'Login'
    });

    // Real Delivery Trigger (Email vs Indian SMS)
    let deliveryResult;
    if (identifierType === 'email') {
      deliveryResult = await sendEmailOtp(normalized, otp, type);
    } else {
      deliveryResult = await sendSmsOtp(normalized, otp);
    }

    const isDev = process.env.NODE_ENV !== 'production';

    return res.status(200).json({
      success: true,
      message: identifierType === 'email'
        ? `OTP code sent successfully to email: ${display}`
        : `OTP code sent via SMS to mobile: ${display}`,
      target: display,
      identifierType,
      expiresIn: 300,
      cooldown: 30,
      provider: deliveryResult?.provider || 'default',
      // In development mode, provide demoOtp for easy UI testing/auto-fill banner
      demoOtp: isDev ? otp : undefined
    });
  } catch (error) {
    console.error('[Send OTP Server Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch OTP. Please check your network and try again.'
    });
  }
};

app.post('/api/auth/send-otp', handleSendOtp);
app.post('/api/send-otp', handleSendOtp);

// =============================================================================
// ROUTE: 2. VERIFY OTP (/api/auth/verify-otp & alias /api/verify-otp)
// =============================================================================
const handleVerifyOtp = (req, res) => {
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

    // Master test bypass code in non-production
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev && (cleanOtp === '123456' || cleanOtp === '1234')) {
      const record = activeOtps.get(normalized);
      const verifiedRole = record?.role || 'customer';
      activeOtps.delete(normalized);

      const token = `ss_session_${Buffer.from(`${normalized}:${Date.now()}`).toString('base64')}`;
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully (Development Master Code)!',
        token,
        user: {
          identifier: display,
          role: verifiedRole,
          name: verifiedRole === 'admin' ? 'Sahoo Sweets Admin' : 'Sahoo Customer'
        }
      });
    }

    const record = activeOtps.get(normalized);

    // Check if record exists
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not requested for this contact. Please click "Resend OTP".'
      });
    }

    // Check 5-minute validity window
    if (Date.now() > record.expiresAt) {
      activeOtps.delete(normalized);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired after 5 minutes! Please request a new OTP.'
      });
    }

    // Attempt Limit Check (Max 3 wrong attempts)
    if (record.otp !== cleanOtp) {
      record.attempts = (record.attempts || 0) + 1;

      if (record.attempts >= 3) {
        activeOtps.delete(normalized);
        return res.status(400).json({
          success: false,
          message: 'Too many incorrect attempts (3/3). This OTP has been invalidated for security. Please request a new OTP.'
        });
      }

      const attemptsLeft = 3 - record.attempts;
      return res.status(400).json({
        success: false,
        message: `Incorrect 6-digit OTP. You have ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining.`
      });
    }

    // OTP Verified Successfully!
    const verifiedRole = record.role || 'customer';
    activeOtps.delete(normalized);

    const token = `ss_session_${Buffer.from(`${normalized}:${Date.now()}`).toString('base64')}`;

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      token,
      user: {
        identifier: display,
        role: verifiedRole,
        name: verifiedRole === 'admin' ? 'Sahoo Sweets Admin' : 'Sahoo Customer'
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
    res.status(403).json({ success: false, message: 'Invalid Admin Access PIN!' });
  }
});

// Standard Login API Endpoint
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
  console.log(`\n======================================================`);
  console.log(`🚀 Sahoo Sweets Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Admin PIN:    ${ADMIN_ACCESS_PIN}`);
  console.log(`======================================================\n`);
});
