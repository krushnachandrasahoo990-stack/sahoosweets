import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, ShieldCheck, Lock, Eye, EyeOff, 
  AlertCircle, Smartphone, Mail, Sparkles, KeyRound, Loader2, CheckCircle2 
} from 'lucide-react';
import { sendOtpApi, verifyOtpApi } from '../services/api';

interface LoginProps {
  onLoginSuccess: (role: 'customer' | 'admin') => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginRole, setLoginRole] = useState<'customer' | 'admin'>('customer');
  const [signupRole, setSignupRole] = useState<'customer' | 'admin'>('customer');

  // Login inputs
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminPin, setAdminPin] = useState('9900');
  const [showAdminPin, setShowAdminPin] = useState(false);

  // Signup inputs
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Loading & error states
  const [loginError, setLoginError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP states (6-Digit OTP)
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [authType, setAuthType] = useState<'Login' | 'Registration'>('Login');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60); // 60s cooldown
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [deliveryTarget, setDeliveryTarget] = useState('');
  const [deliveryType, setDeliveryType] = useState<'email' | 'phone'>('phone');

  // Countdown timer for 60s resend cooldown
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Real-time Identifier Auto-Detection
  const detectedInputType = React.useMemo(() => {
    const val = loginId.trim();
    if (!val) return 'empty';
    if (val.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val) ? 'email' : 'email-typing';
    }
    let clean = val.replace(/[\s\-\(\)]/g, '');
    if (clean.startsWith('+91')) clean = clean.slice(3);
    else if (clean.startsWith('91') && clean.length === 12) clean = clean.slice(2);
    else if (clean.startsWith('0') && clean.length === 11) clean = clean.slice(1);

    if (/^[6-9]\d{9}$/.test(clean)) return 'phone-valid';
    if (/^[6-9]\d{0,8}$/.test(clean) || /^\d{1,9}$/.test(clean)) return 'phone-typing';
    return 'invalid';
  }, [loginId]);

  // Parse and normalize identifier
  const parseIdentifier = (input: string) => {
    const val = input.trim();
    if (val.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(val)) {
        return { type: 'email' as const, normalized: val.toLowerCase(), display: val.toLowerCase() };
      }
    }
    let clean = val.replace(/[\s\-\(\)]/g, '');
    if (clean.startsWith('+91')) clean = clean.slice(3);
    else if (clean.startsWith('91') && clean.length === 12) clean = clean.slice(2);
    else if (clean.startsWith('0') && clean.length === 11) clean = clean.slice(1);

    if (/^[6-9]\d{9}$/.test(clean)) {
      return { type: 'phone' as const, normalized: clean, display: `+91 ${clean}` };
    }
    return null;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const parsed = parseIdentifier(loginId);
    if (!parsed) {
      setLoginError('✕ Please enter a valid 10-digit Indian Mobile (+91) or Email Address.');
      return;
    }

    // Admin Access Security PIN Check
    if (loginRole === 'admin') {
      const cleanPin = adminPin.trim();
      if (!cleanPin || (cleanPin !== '9900' && cleanPin !== '1234')) {
        setLoginError('✕ Invalid Admin Access PIN! Authorized owner PIN required (Default PIN: 9900).');
        return;
      }
    }

    triggerOtpFlow('Login', loginRole, parsed.normalized, adminPin);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (signupPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const target = signupPhone.trim() || signupEmail.trim();
    const parsed = parseIdentifier(target);
    if (!parsed) {
      alert('Please enter a valid 10-digit Indian mobile number or email address!');
      return;
    }

    triggerOtpFlow('Registration', signupRole, parsed.normalized);
  };

  // Trigger 6-Digit OTP Generation & Real Dispatch
  const triggerOtpFlow = async (
    type: 'Login' | 'Registration',
    overrideRole?: 'customer' | 'admin',
    overrideTarget?: string,
    overridePin?: string
  ) => {
    const activeRole = overrideRole || loginRole;
    const pin = overridePin || adminPin;
    const target = overrideTarget || loginId.trim() || signupPhone.trim() || signupEmail.trim();

    const parsed = parseIdentifier(target);
    if (!parsed) {
      setLoginError('✕ Please enter a valid 10-digit Indian Mobile (+91) or Email Address.');
      return;
    }

    setIsSendingOtp(true);
    setLoginError('');

    try {
      const res = await sendOtpApi(parsed.normalized, type, activeRole, pin);

      if (!res.success) {
        setLoginError(res.message || 'Failed to dispatch OTP. Please check your details.');
        setIsSendingOtp(false);
        return;
      }

      // Success: advance to OTP view
      setAuthType(type);
      setStep('otp');
      setDeliveryTarget(res.target || parsed.display);
      setDeliveryType(res.identifierType || parsed.type);
      setOtpDigits(['', '', '', '', '', '']);
      setVerifyError('');
      setTimer(res.cooldown || 60);
    } catch {
      setLoginError('Network error connecting to OTP gateway. Please retry.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle individual digit input changes (with paste support)
  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // Pasting full 6-digit code
      const pasted = cleanVal.slice(0, 6).split('');
      pasted.forEach((ch, idx) => {
        newDigits[idx] = ch;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      const el = document.getElementById(`otp-box-${nextFocus}`);
      el?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setVerifyError('');

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      const nextEl = document.getElementById(`otp-box-${index + 1}`);
      nextEl?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevEl = document.getElementById(`otp-box-${index - 1}`);
      prevEl?.focus();
    }
  };

  const fullEnteredOtp = otpDigits.join('');

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullEnteredOtp.length !== 6) {
      setVerifyError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');

    const target = deliveryTarget || loginId.trim() || signupPhone.trim() || signupEmail.trim();

    try {
      const res = await verifyOtpApi(target, fullEnteredOtp);

      if (res.success) {
        try {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userPhone', target);
          localStorage.setItem('userRole', loginRole);
          if (res.token) {
            localStorage.setItem('authToken', res.token);
          }
        } catch {}
        onLoginSuccess(loginRole);
      } else {
        setVerifyError(res.message || 'Incorrect 6-digit OTP. Please check and try again.');
      }
    } catch {
      setVerifyError('Network error during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // ---------------------------------------------------------------------------
  // STEP 2: OTP VERIFICATION VIEW (ZERO SCREEN EXPOSURE)
  // ---------------------------------------------------------------------------
  if (step === 'otp') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative font-sans bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&auto=format&fit=crop&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div className="w-full max-w-md relative z-10 space-y-3">
          {/* OTP VERIFICATION CARD */}
          <div className="bg-white/95 backdrop-blur-xl border rounded-3xl p-6 sm:p-8 shadow-2xl text-center" style={{ borderColor: '#BBAB47' }}>
            <div className="flex items-center justify-between mb-5">
              <button 
                type="button" 
                onClick={() => setStep('auth')} 
                className="inline-flex items-center text-xs font-bold text-gray-700 hover:text-black cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Change {deliveryType === 'email' ? 'Email' : 'Number'}
              </button>
              <span className="px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider text-black" style={{ backgroundColor: '#c2b767' }}>
                {loginRole === 'admin' ? 'ADMIN VERIFICATION' : 'CUSTOMER LOGIN'}
              </span>
            </div>

            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-black shadow-md" style={{ backgroundColor: '#c2b767' }}>
                <KeyRound className="w-7 h-7 text-black" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-900">Enter 6-Digit OTP</h2>
            
            {/* Target Contact Display */}
            <div className="mt-1.5 space-y-1">
              <p className="text-xs text-gray-600 font-medium">
                {deliveryType === 'email' ? 'OTP sent securely to your email address:' : 'OTP sent via SMS to your mobile number:'}
              </p>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border bg-amber-50/50" style={{ borderColor: '#BBAB47' }}>
                {deliveryType === 'email' ? <Mail className="w-3.5 h-3.5 text-amber-800 shrink-0" /> : <Smartphone className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                <span className="text-xs font-black text-gray-900">{deliveryTarget}</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Valid for 5 minutes. Check your inbox or SMS messages.</p>
            </div>

            {verifyError && (
              <div className="mt-3.5 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
              {/* 6 Digit Inputs */}
              <div className="flex justify-center items-center gap-1.5 sm:gap-2">
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[idx]}
                    onChange={e => handleDigitChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 bg-amber-50/40 text-gray-950 focus:bg-white outline-none shadow-xs transition"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Timer and Resend Cooldown (60s) */}
              <div className="flex items-center justify-between text-xs px-2 pt-1 text-gray-600 font-semibold">
                <span>{timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive OTP?"}</span>
                <button 
                  type="button" 
                  disabled={timer > 0 || isSendingOtp} 
                  onClick={() => triggerOtpFlow(authType)}
                  className={`font-black ${timer > 0 || isSendingOtp ? 'opacity-40 cursor-not-allowed' : 'text-orange-600 hover:underline cursor-pointer'}`}
                >
                  {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isVerifying || fullEnteredOtp.length !== 6}
                className="w-full py-3.5 text-black font-black text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-40" 
                style={{ backgroundColor: '#c2b767' }}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>VERIFY OTP & ENTER SAHOO SWEETS ➔</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STEP 1: LOGIN / SIGNUP WITH AUTO-DETECTION
  // ---------------------------------------------------------------------------
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative font-sans bg-cover bg-center"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&auto=format&fit=crop&q=80')` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="w-full max-w-md relative z-10 py-4">
        
        {/* Role Quick Selector Card */}
        <div className="mb-3 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-amber-300 shadow-xl flex items-center justify-between text-xs font-black">
          <span className="text-[11px] text-gray-700 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Role:</span>
          </span>
          <div className="flex space-x-1.5">
            <button
              type="button"
              onClick={() => {
                setLoginRole('customer');
                setLoginId('9078699528');
              }}
              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-black transition cursor-pointer"
            >
              🛍️ Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginRole('admin');
                setLoginId('9078699528');
                setAdminPin('9900');
              }}
              className="px-2.5 py-1 bg-black hover:bg-gray-800 text-amber-400 rounded-lg text-[10px] font-black transition cursor-pointer"
            >
              👑 Admin (PIN 9900)
            </button>
          </div>
        </div>

        <div className={`relative w-full transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          
          {/* FRONT FACE: LOGIN */}
          <div className="bg-white/95 backdrop-blur-xl border rounded-3xl p-6 sm:p-7 shadow-2xl relative" style={{ backfaceVisibility: 'hidden', borderColor: '#BBAB47' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-black">SAHOO SWEETS PURI</span>
              <span className="text-black font-black px-2.5 py-0.5 rounded-lg text-xs shadow" style={{ backgroundColor: '#c2b767' }}>SS</span>
            </div>

            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-gray-900">Sign In with OTP</h2>
              <p className="text-xs font-semibold mt-0.5 text-gray-600">Enter Indian Phone (+91) or Email Address</p>
            </div>

            {/* ROLE SELECTOR TABS */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border mb-4" style={{ backgroundColor: '#f2c98350', borderColor: '#BBAB47' }}>
              <button 
                type="button" 
                onClick={() => setLoginRole('customer')} 
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer ${loginRole === 'customer' ? 'text-black shadow' : 'text-gray-700'}`}
                style={{ backgroundColor: loginRole === 'customer' ? '#c2b767' : 'transparent' }}
              >
                <User className="w-4 h-4 text-black" />
                <span>Customer Store</span>
              </button>
              <button 
                type="button" 
                onClick={() => setLoginRole('admin')} 
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer ${loginRole === 'admin' ? 'bg-black text-amber-400 shadow' : 'text-gray-700'}`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className={loginRole === 'admin' ? 'text-amber-400 font-black' : 'text-black font-black'}>Admin Portal</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              
              {/* AUTO-DETECTION INPUT FIELD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-gray-800 uppercase">
                    {loginRole === 'admin' ? 'Admin Phone / Email' : 'Phone (+91) or Email Address'}
                  </label>

                  {/* Real-time Detection Badge */}
                  {detectedInputType === 'email' && (
                    <span className="inline-flex items-center text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md animate-fadeIn">
                      <Mail className="w-3 h-3 mr-1" /> Email Detected
                    </span>
                  )}
                  {detectedInputType === 'phone-valid' && (
                    <span className="inline-flex items-center text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md animate-fadeIn">
                      <Smartphone className="w-3 h-3 mr-1" /> +91 Mobile Detected
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    {detectedInputType.startsWith('email') ? (
                      <Mail className="w-4 h-4 text-amber-700" />
                    ) : detectedInputType.startsWith('phone') ? (
                      <Smartphone className="w-4 h-4 text-amber-700" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </span>
                  <input 
                    type="text" 
                    value={loginId}
                    onChange={(e) => {
                      setLoginId(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    required 
                    placeholder={loginRole === 'admin' ? "9078699528 or admin@sahoosweets.com" : "e.g. 9078699528 or user@gmail.com"} 
                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs font-black text-black placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }}
                  />
                </div>
                {loginError && <p className="text-[11px] font-black text-rose-600 mt-1">{loginError}</p>}
              </div>

              {/* ADMIN ACCESS PIN (Only required & displayed for Admin Role) */}
              {loginRole === 'admin' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-amber-950 uppercase">
                      Admin Security PIN *
                    </label>
                    <span className="text-[10px] text-amber-800 font-black bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                      Default PIN: 9900
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-700">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input 
                      type={showAdminPin ? 'text' : 'password'} 
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      required 
                      maxLength={6}
                      placeholder="Enter Admin PIN (Default: 9900)" 
                      className="w-full pl-10 pr-11 py-2.5 border-2 border-amber-400 rounded-xl text-xs font-black text-black placeholder-gray-500 bg-amber-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowAdminPin(!showAdminPin)} 
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-amber-800 hover:text-black cursor-pointer"
                    >
                      {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-gray-800 uppercase mb-1">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500"><Lock className="w-4 h-4" /></span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required 
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-11 py-2.5 border rounded-xl text-xs font-black text-black placeholder-gray-500 focus:bg-white focus:outline-none"
                    style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-600 cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSendingOtp}
                className="w-full py-3.5 text-black font-black text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50" 
                style={{ backgroundColor: '#c2b767' }}
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SENDING 6-DIGIT OTP...</span>
                  </>
                ) : (
                  <span>SEND 6-DIGIT OTP TO CONTACT ➔</span>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-700 font-bold mt-5">
              New to Sahoo Sweets? <button type="button" onClick={() => setIsFlipped(true)} className="font-black text-black hover:underline cursor-pointer">Register Account</button>
            </p>
          </div>

          {/* BACK FACE: SIGNUP */}
          <div className="bg-white/95 backdrop-blur-xl border rounded-3xl p-6 sm:p-7 shadow-2xl absolute inset-0 [transform:rotateY(180deg)]" style={{ backfaceVisibility: 'hidden', borderColor: '#BBAB47' }}>
            <div className="text-center mb-2">
              <h2 className="text-xl font-black text-black">Create Account</h2>
              <p className="text-[11px] font-bold text-gray-600">Choose role & register</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl border mb-3" style={{ backgroundColor: '#f2c98350', borderColor: '#BBAB47' }}>
              <button type="button" onClick={() => setSignupRole('customer')} className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${signupRole === 'customer' ? 'text-black shadow' : 'text-gray-700'}`} style={{ backgroundColor: signupRole === 'customer' ? '#c2b767' : 'transparent' }}>Customer</button>
              <button type="button" onClick={() => setSignupRole('admin')} className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${signupRole === 'admin' ? 'bg-black text-amber-400 shadow' : 'text-gray-700'}`}>Admin (Owner)</button>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-2">
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Full Name</label>
                <input type="text" value={signupName} onChange={e => setSignupName(e.target.value)} required placeholder="Krushna Chandra Sahoo" className="w-full px-3 py-1.5 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Phone Number (+91) *</label>
                <input type="tel" maxLength={10} value={signupPhone} onChange={e => setSignupPhone(e.target.value)} required placeholder="9078699528" className="w-full px-3 py-1.5 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Email (Optional)</label>
                <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="email@gmail.com" className="w-full px-3 py-1.5 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Password</label>
                <div className="relative flex items-center">
                  <input type={showSignupPassword ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required placeholder="Password" className="w-full px-3 py-1.5 pr-9 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
                  <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-2.5 text-black cursor-pointer">
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-black uppercase">Confirm Password</label>
                <div className="relative flex items-center">
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" className="w-full px-3 py-1.5 pr-9 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2.5 text-black cursor-pointer">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-0.5">
                <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} required className="h-3.5 w-3.5 rounded cursor-pointer text-black" />
                <label className="ml-2 text-[10px] font-bold text-black">I agree to Terms & Conditions</label>
              </div>
              <button 
                type="submit" 
                disabled={isSendingOtp}
                className="w-full py-2.5 text-black font-black text-xs rounded-xl shadow cursor-pointer disabled:opacity-50" 
                style={{ backgroundColor: '#c2b767' }}
              >
                {isSendingOtp ? 'SENDING 6-DIGIT OTP...' : 'REGISTER & SEND 6-DIGIT OTP'}
              </button>
            </form>

            <p className="text-center text-xs text-black font-bold mt-2">
              Already have an account? <button type="button" onClick={() => setIsFlipped(false)} className="font-black text-black hover:underline cursor-pointer">Sign In</button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
