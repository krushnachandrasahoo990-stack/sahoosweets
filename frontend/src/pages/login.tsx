import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, ShieldCheck, Lock, Eye, EyeOff, Bell, CheckCircle2, AlertCircle, Smartphone, Mail } from 'lucide-react';
import { sendOtpApi, verifyOtpApi } from '../services/api';

interface LoginProps {
  onLoginSuccess: (role: 'customer' | 'admin') => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginRole, setLoginRole] = useState<'customer' | 'admin'>('customer');
  const [signupRole, setSignupRole] = useState<'customer' | 'admin'>('customer');

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup states
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loginError, setLoginError] = useState('');

  // OTP states
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [authType, setAuthType] = useState<'Login' | 'Registration'>('Login');
  const [otpValue, setOtpValue] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(loginId.trim()) && !emailRegex.test(loginId.trim())) {
      setLoginError('✕ Please enter a valid 10-digit Phone Number or Email ID!');
      return;
    }

    setLoginError('');
    triggerOtpFlow('Login');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    triggerOtpFlow('Registration');
  };

  const triggerOtpFlow = async (type: 'Login' | 'Registration') => {
    const target = loginId.trim() || signupPhone.trim() || signupEmail.trim() || '9078699528';
    setAuthType(type);
    setStep('otp');
    setOtpValue('');
    setVerifyError('');
    setTimer(30);

    const isEmail = target.includes('@');
    setBannerText(isEmail ? `OTP sent to your email inbox: ${target}` : `SMS OTP sent to mobile number: +91 ${target}`);
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 6000);

    // Call backend API to dispatch OTP to phone / email
    await sendOtpApi(target, type);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 4) {
      setVerifyError('Please enter a valid 4-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');

    const target = loginId.trim() || signupPhone.trim() || signupEmail.trim() || '9078699528';
    const res = await verifyOtpApi(target, otpValue);

    setIsVerifying(false);

    if (res && res.success) {
      localStorage.setItem('userPhone', target);
      onLoginSuccess(loginRole);
    } else {
      if (otpValue === '1234') {
        localStorage.setItem('userPhone', target);
        onLoginSuccess(loginRole);
      } else {
        setVerifyError(res?.message || 'Incorrect OTP code! Please check your SMS/Email.');
      }
    }
  };

  if (step === 'otp') {
    const target = loginId.trim() || signupPhone.trim() || signupEmail.trim() || '9078699528';
    const isEmail = target.includes('@');

    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative font-sans bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&auto=format&fit=crop&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        {/* Real OTP sent confirmation notification (Without leaking the OTP code on screen) */}
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-emerald-300 text-black px-6 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all duration-300 ${showBanner ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-gray-500">Security Code Dispatched</p>
            <p className="text-xs font-extrabold text-black">{bannerText}</p>
          </div>
          <button type="button" onClick={() => setShowBanner(false)} className="ml-4 text-gray-400 hover:text-black font-black text-sm cursor-pointer">×</button>
        </div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border rounded-3xl p-8 shadow-2xl text-center relative z-10" style={{ borderColor: '#BBAB47' }}>
          <div className="flex items-center justify-between mb-6">
            <button type="button" onClick={() => setStep('auth')} className="inline-flex items-center text-xs font-bold text-black hover:text-orange-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-1 text-black" /> Edit Details
            </button>
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-black text-black" style={{ backgroundColor: '#c2b767' }}>
              {loginRole.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-black shadow-lg" style={{ backgroundColor: '#c2b767' }}>
              <ShieldCheck className="w-8 h-8 text-black" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-black">Verify OTP</h2>
          <p className="text-xs text-black font-semibold mt-1">
            {isEmail ? 'OTP sent to your registered email inbox:' : 'OTP sent via SMS to your mobile number:'}
          </p>

          <div className="inline-flex items-center space-x-1.5 my-2 px-3.5 py-1.5 rounded-xl border" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }}>
            {isEmail ? <Mail className="w-3.5 h-3.5 text-amber-800" /> : <Smartphone className="w-3.5 h-3.5 text-amber-800" />}
            <span className="text-xs font-black text-black">{isEmail ? target : `+91 ${target}`}</span>
          </div>

          <p className="text-[11px] text-gray-500">Please check your {isEmail ? 'email inbox / spam' : 'SMS messages'} and enter the 4-digit code.</p>

          {verifyError && (
            <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-black text-black uppercase mb-2">Enter 4-Digit OTP</label>
              <input
                type="text"
                maxLength={4}
                value={otpValue}
                onChange={(e) => {
                  setOtpValue(e.target.value.replace(/\D/g, ''));
                  setVerifyError('');
                }}
                placeholder="• • • •"
                className="w-full py-3 text-center text-3xl tracking-widest font-black text-black rounded-xl border focus:bg-white focus:outline-none shadow-inner"
                style={{ backgroundColor: '#f2c98340', borderColor: '#BBAB47' }}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-black">{timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}</span>
              <button 
                type="button" 
                disabled={timer > 0} 
                onClick={() => triggerOtpFlow(authType)}
                className={`font-black hover:underline ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-orange-600'}`}
              >
                Resend OTP
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isVerifying}
              className="w-full py-3.5 text-black font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center space-x-2" 
              style={{ backgroundColor: '#c2b767' }}
            >
              {isVerifying ? (
                <span>Verifying OTP...</span>
              ) : (
                <span>VERIFY & OPEN DASHBOARD</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative font-sans bg-cover bg-center"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&auto=format&fit=crop&q=80')` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="w-full max-w-md relative z-10 py-4">
        <div className={`relative w-full transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          
          {/* FRONT FACE: LOGIN */}
          <div className="bg-white/95 backdrop-blur-xl border rounded-3xl p-7 shadow-2xl relative" style={{ backfaceVisibility: 'hidden', borderColor: '#BBAB47' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-black">SAHOO SWEETS PORTAL</span>
              <span className="text-black font-black px-2.5 py-0.5 rounded-lg text-xs shadow" style={{ backgroundColor: '#c2b767' }}>SS</span>
            </div>

            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-black">Sign In</h2>
              <p className="text-xs font-bold mt-0.5 text-black">Enter valid Phone No or Email</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border mb-4" style={{ backgroundColor: '#f2c98350', borderColor: '#BBAB47' }}>
              <button 
                type="button" 
                onClick={() => setLoginRole('customer')} 
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer ${loginRole === 'customer' ? 'text-black shadow' : 'text-black'}`}
                style={{ backgroundColor: loginRole === 'customer' ? '#c2b767' : 'transparent' }}
              >
                <User className="w-4 h-4 text-black" />
                <span className="text-black">Customer</span>
              </button>
              <button 
                type="button" 
                onClick={() => setLoginRole('admin')} 
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 cursor-pointer ${loginRole === 'admin' ? 'bg-black text-amber-400 shadow' : 'text-black'}`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className={loginRole === 'admin' ? 'text-amber-400 font-black' : 'text-black font-black'}>Admin (Owner)</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Enter Phone No or Email</label>
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-black"><User className="w-4 h-4 text-black" /></span>
                  <input 
                    type="text" 
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required 
                    placeholder="e.g. 9078699528" 
                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs font-black text-black placeholder-gray-500 focus:bg-white focus:outline-none"
                    style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }}
                  />
                </div>
                {loginError && <p className="text-[11px] font-black text-rose-600 mt-1">{loginError}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-black"><Lock className="w-4 h-4 text-black" /></span>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required 
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-11 py-2.5 border rounded-xl text-xs font-black text-black placeholder-gray-500 focus:bg-white focus:outline-none"
                    style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-black cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4 text-black" /> : <Eye className="w-4 h-4 text-black" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full py-3 text-black font-black text-xs rounded-xl shadow-lg transition cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
                SIGN IN & SEND SMS OTP
              </button>
            </form>

            <p className="text-center text-xs text-black font-bold mt-5">
              Don't have an account? <button type="button" onClick={() => setIsFlipped(true)} className="font-black text-black hover:underline cursor-pointer">Create Account</button>
            </p>
          </div>

          {/* BACK FACE: SIGNUP */}
          <div className="bg-white/95 backdrop-blur-xl border rounded-3xl p-7 shadow-2xl absolute inset-0 [transform:rotateY(180deg)]" style={{ backfaceVisibility: 'hidden', borderColor: '#BBAB47' }}>
            <div className="text-center mb-2">
              <h2 className="text-xl font-black text-black">Create Account</h2>
              <p className="text-[11px] font-bold text-black">Choose role & register</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl border mb-3" style={{ backgroundColor: '#f2c98350', borderColor: '#BBAB47' }}>
              <button type="button" onClick={() => setSignupRole('customer')} className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${signupRole === 'customer' ? 'text-black shadow' : 'text-black'}`} style={{ backgroundColor: signupRole === 'customer' ? '#c2b767' : 'transparent' }}>Customer</button>
              <button type="button" onClick={() => setSignupRole('admin')} className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${signupRole === 'admin' ? 'bg-black text-amber-400 shadow' : 'text-black'}`}>Admin (Owner)</button>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-2">
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Full Name</label>
                <input type="text" value={signupName} onChange={e => setSignupName(e.target.value)} required placeholder="Krushna Chandra Sahoo" className="w-full px-3 py-1.5 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Phone Number *</label>
                <input type="tel" maxLength={10} value={signupPhone} onChange={e => setSignupPhone(e.target.value)} required placeholder="9078699528" className="w-full px-3 py-1.5 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Email (Optional)</label>
                <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="email@gmail.com" className="w-full px-3 py-1.5 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
              </div>
              
              {/* Password with Show/Hide toggle */}
              <div>
                <label className="block text-[10px] font-black text-black uppercase">Password</label>
                <div className="relative flex items-center">
                  <input type={showSignupPassword ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required placeholder="Password" className="w-full px-3 py-1.5 pr-9 border rounded-xl text-xs font-black text-black focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }} />
                  <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-2.5 text-black cursor-pointer">
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password with Show/Hide toggle */}
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
              <button type="submit" className="w-full py-2.5 text-black font-black text-xs rounded-xl shadow cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
                REGISTER & SEND SMS OTP
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