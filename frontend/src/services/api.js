// =============================================================================
// SAHOO SWEETS - FRONTEND API CLIENT & OFFLINE SAFETY GATEWAY
// =============================================================================
const API_URL = 'http://localhost:5000/api';

// In-memory local fallback store for offline development and testing
const localOtpStore = new Map();

// Helper to normalize input identifier
export const normalizeIdentifier = (input) => {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  // Strip non-digits
  let clean = trimmed.replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('+91')) clean = clean.slice(3);
  else if (clean.startsWith('91') && clean.length === 12) clean = clean.slice(2);
  else if (clean.startsWith('0') && clean.length === 11) clean = clean.slice(1);
  return clean;
};

// Auto-detection helper
export const detectIdentifierType = (input) => {
  if (!input) return 'unknown';
  const trimmed = input.trim();
  if (trimmed.includes('@')) return 'email';
  const clean = trimmed.replace(/[\s\-\(\)]/g, '');
  if (/^\+?91?[6-9]\d{0,9}$/.test(clean) || /^[6-9]\d{0,9}$/.test(clean)) {
    return 'phone';
  }
  return 'unknown';
};

// Login API Call
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  } catch (error) {
    console.warn('[API Client] Backend offline, using local response for login:', error);
    return { 
      success: true, 
      message: 'Offline test mode login active.', 
      user: { identifier: credentials.identifier, role: 'customer' } 
    };
  }
};

// Sweets Menu API Call
export const getSweetsMenu = async () => {
  try {
    const response = await fetch(`${API_URL}/menu`);
    const result = await response.json();
    return result.menu || [];
  } catch (error) {
    console.warn('[API Client] Menu Fetch Error (Using frontend fallback menu):', error);
    return [];
  }
};

// Send OTP API Call (/api/auth/send-otp with graceful offline fallback)
export const sendOtpApi = async (identifier, type = 'Login', role = 'customer', adminPin = '') => {
  const cleanId = (identifier || '').trim();

  try {
    // Primary auth endpoint
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanId, type, role, adminPin }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('[API Client] Backend offline. Running local OTP generator for testing...', error);

    const norm = normalizeIdentifier(cleanId);
    const isEmail = norm.includes('@');
    const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    localOtpStore.set(norm, {
      otp: fallbackOtp,
      expiresAt,
      attempts: 0,
      role: role || 'customer',
      type
    });

    return {
      success: true,
      isLocalFallback: true,
      message: isEmail
        ? `OTP code generated for email: ${norm}`
        : `SMS OTP code generated for: +91 ${norm}`,
      target: isEmail ? norm : `+91 ${norm}`,
      identifierType: isEmail ? 'email' : 'phone',
      expiresIn: 300,
      cooldown: 30,
      demoOtp: fallbackOtp
    };
  }
};

// Verify OTP API Call (/api/auth/verify-otp with graceful offline fallback)
export const verifyOtpApi = async (identifier, otp) => {
  const cleanId = (identifier || '').trim();
  const cleanOtp = (otp || '').trim();

  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanId, otp: cleanOtp }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('[API Client] Backend offline. Running local verification...', error);

    const norm = normalizeIdentifier(cleanId);

    // Master test code support
    if (cleanOtp === '123456' || cleanOtp === '1234') {
      return {
        success: true,
        message: 'OTP verified successfully (Offline Master Code)!',
        user: { identifier: norm, role: 'customer' }
      };
    }

    const cached = localOtpStore.get(norm);
    if (!cached) {
      return {
        success: false,
        message: 'OTP expired or not requested. Please request a new OTP.'
      };
    }

    if (Date.now() > cached.expiresAt) {
      localOtpStore.delete(norm);
      return {
        success: false,
        message: 'OTP has expired after 5 minutes! Please request a new OTP.'
      };
    }

    if (cached.otp !== cleanOtp) {
      cached.attempts = (cached.attempts || 0) + 1;
      if (cached.attempts >= 3) {
        localOtpStore.delete(norm);
        return {
          success: false,
          message: 'Too many incorrect attempts (3/3). This OTP is now invalid. Please request a new OTP.'
        };
      }
      return {
        success: false,
        message: `Incorrect 6-digit OTP code. ${3 - cached.attempts} attempts remaining.`
      };
    }

    localOtpStore.delete(norm);
    return {
      success: true,
      message: 'OTP verified successfully!',
      user: { identifier: norm, role: cached.role || 'customer' }
    };
  }
};
