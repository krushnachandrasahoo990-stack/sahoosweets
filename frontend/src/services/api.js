const API_URL = 'http://localhost:5000/api';

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
    console.error("Login Error:", error);
    return { success: false, message: "Network error. Please check if backend is running." };
  }
};

// Sweets Menu API Call
export const getSweetsMenu = async () => {
  try {
    const response = await fetch(`${API_URL}/sweets`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Menu Fetch Error:", error);
    return [];
  }
};

// Send OTP API Call
export const sendOtpApi = async (identifier, type = 'Login') => {
  try {
    const response = await fetch(`${API_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, type }),
    });
    return await response.json();
  } catch (error) {
    console.error("Send OTP Error:", error);
    return { success: false, message: "Network error connecting to OTP gateway." };
  }
};

// Verify OTP API Call
export const verifyOtpApi = async (identifier, otp) => {
  try {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp }),
    });
    return await response.json();
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return { success: false, message: "Network error connecting to OTP gateway." };
  }
};