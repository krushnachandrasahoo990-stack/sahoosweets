import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Phone, MessageSquare, Star, ShieldCheck, Clock, 
  ChevronRight, ChevronDown, CheckCircle2, AlertCircle, 
  Share2, ArrowLeft, Download, RotateCcw, Heart, Send, Check
} from 'lucide-react';
import SwiggyVegBadge from './SwiggyVegBadge';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  img?: string;
}

interface SwiggyOrder {
  id: string;
  date: string;
  items: string;
  itemsList?: OrderItem[];
  itemTotal?: number;
  deliveryFee?: number;
  tip?: number;
  platformFee?: number;
  discount?: number;
  total: number;
  statusIndex: number; // 0 to 4 (-1 if cancelled)
  steps: string[];
  payment: string;
  address: string;
  deliveryInstructions?: string;
  cookingInstruction?: string;
  partner?: {
    name: string;
    phone: string;
    rating: number;
    deliveries: string;
    avatar: string;
    badge: string;
  };
  estimatedMinutes?: number;
}

interface SwiggyLiveTrackingProps {
  order: SwiggyOrder;
  onClose: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatusIndex: number) => void;
  onOpenRatingModal?: (order: SwiggyOrder) => void;
}

export const SwiggyLiveTracking: React.FC<SwiggyLiveTrackingProps> = ({
  order,
  onClose,
  onUpdateOrderStatus,
  onOpenRatingModal,
}) => {
  // Current step state (synced with order.statusIndex)
  const [currentStep, setCurrentStep] = useState<number>(
    typeof order.statusIndex === 'number' && order.statusIndex >= 0 ? order.statusIndex : 1
  );

  // Live countdown timer (starts at 24 mins and ticks)
  const [etaSeconds, setEtaSeconds] = useState<number>(24 * 60);

  // Modals for Call, Chat, Tip & Help
  const [showCallModal, setShowCallModal] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showTipModal, setShowTipModal] = useState<boolean>(false);
  const [tipSuccess, setTipSuccess] = useState<number | null>(null);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'valet'; text: string; time: string }>>([
    { sender: 'valet', text: 'Namaste! I have accepted your Sahoo Sweets delivery order and heading to the shop.', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Call simulation state
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [callDuration, setCallDuration] = useState<number>(0);

  // Auto-progress simulation toggle
  const [isAutoProgress, setIsAutoProgress] = useState<boolean>(false);

  // Sync internal step if prop changes
  useEffect(() => {
    if (typeof order.statusIndex === 'number' && order.statusIndex >= 0) {
      setCurrentStep(order.statusIndex);
    }
  }, [order.statusIndex]);

  // ETA countdown
  useEffect(() => {
    if (currentStep === 4) return; // Delivered
    const timer = setInterval(() => {
      setEtaSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  // Auto progression simulation (if turned on)
  useEffect(() => {
    let autoTimer: any;
    if (isAutoProgress && currentStep < 4) {
      autoTimer = setInterval(() => {
        advanceStep();
      }, 8000); // Advances every 8 seconds
    }
    return () => clearInterval(autoTimer);
  }, [isAutoProgress, currentStep]);

  // Call duration counter
  useEffect(() => {
    let callTimer: any;
    if (showCallModal && callStatus === 'connected') {
      callTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(callTimer);
  }, [showCallModal, callStatus]);

  const advanceStep = () => {
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, 4);
      if (onUpdateOrderStatus) onUpdateOrderStatus(order.id, next);
      return next;
    });
  };

  const setManualStep = (stepIdx: number) => {
    setCurrentStep(stepIdx);
    if (onUpdateOrderStatus) onUpdateOrderStatus(order.id, stepIdx);
  };

  const handleStartCall = () => {
    setShowCallModal(true);
    setCallStatus('calling');
    setCallDuration(0);
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user' as const, text: chatInput.trim(), time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const replies = [
        "Sure, I'll take care of it!",
        "Understood, sweets are safely packed in thermal pouch.",
        "I am reaching your location in 5 minutes.",
        "Will leave at your doorstep as requested."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages(prev => [...prev, { sender: 'valet', text: randomReply, time: 'Just now' }]);
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Stage details mapping
  const stageHeadlines = [
    { title: "Order Confirmed!", desc: "Sahoo Sweets has accepted your order", color: "text-amber-600" },
    { title: "Kitchen is Preparing Sweets", desc: "Freshly boxing authentic Chhena & sweets", color: "text-orange-600" },
    { title: "Delivery Partner Assigned", desc: "Ramesh Kumar is picking up from Sahoo Sweets", color: "text-blue-600" },
    { title: "Out for Delivery!", desc: "Ramesh Kumar is on the way to your doorstep", color: "text-orange-600" },
    { title: "Order Delivered!", desc: "Delivered to your doorstep. Enjoy the sweetness!", color: "text-emerald-600" }
  ];

  const currentStage = stageHeadlines[currentStep] || stageHeadlines[1];

  // Map scooter position % based on step
  const scooterPositions = ['10%', '28%', '48%', '75%', '93%'];
  const scooterPos = scooterPositions[currentStep] || '50%';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[94vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">

        {/* TOP BAR */}
        <div className="bg-white border-b px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  LIVE SWIGGY TRACKING
                </span>
                <span className="text-xs font-black text-gray-900">Order #{order.id}</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Placed on {order.date}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHelpModal(true)}
              className="text-xs font-black text-gray-700 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            >
              Help & Support
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE TRACKING CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8f9fb]">

          {/* SIMULATION BAR (Allows demo testing of all delivery phases) */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase">
                Demo Simulator
              </span>
              <span className="text-xs font-extrabold text-orange-950">
                Test Real-Time Swiggy Stages:
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              {[0, 1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setManualStep(s)}
                  className={`w-6 h-6 rounded-lg text-xs font-black transition cursor-pointer ${
                    currentStep === s
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-orange-200 hover:bg-orange-100'
                  }`}
                  title={`Jump to step ${s + 1}`}
                >
                  {s + 1}
                </button>
              ))}

              <button
                onClick={advanceStep}
                disabled={currentStep >= 4}
                className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-black rounded-lg transition cursor-pointer disabled:opacity-40"
              >
                Next ▶
              </button>

              <button
                onClick={() => setIsAutoProgress(!isAutoProgress)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                  isAutoProgress ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                {isAutoProgress ? 'Auto: ON' : 'Auto'}
              </button>
            </div>
          </div>

          {/* LIVE ETA HEADER */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {currentStep === 4 ? 'DELIVERED AT DOORSTEP' : 'LIVE GPS TRACKING'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {currentStage.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {currentStage.desc}
                </p>
              </div>

              {/* ETA Display */}
              <div className="text-right bg-orange-50 border border-orange-200 px-4 py-2.5 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-orange-600">Estimated Delivery</span>
                <p className="text-lg sm:text-xl font-black text-orange-600 flex items-center justify-end">
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  {currentStep === 4 ? 'Arrived!' : formatTimer(etaSeconds)}
                </p>
              </div>
            </div>

            {/* LIVE ANIMATED ROUTE MAP SIMULATION */}
            <div className="relative h-48 sm:h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between p-4">
              {/* Stylized Map Grid Background */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              ></div>

              {/* Road / Route Line SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Background road */}
                <path
                  d="M 40,110 C 120,40 180,160 280,100 C 380,40 450,140 560,90"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Traveled active road in orange */}
                <path
                  d="M 40,110 C 120,40 180,160 280,100 C 380,40 450,140 560,90"
                  fill="none"
                  stroke="#fc8019"
                  strokeWidth="5"
                  strokeDasharray="8 4"
                  strokeLinecap="round"
                />
              </svg>

              {/* Top Landmarks on the map */}
              <div className="relative z-10 flex justify-between text-[10px] font-bold text-slate-400 px-2">
                <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-slate-300">
                  🏪 Sahoo Sweets Hub (Puri)
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-slate-300 hidden sm:inline">
                  🛣️ Brahmagiri High Road
                </span>
                <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 text-slate-300">
                  📍 {order.address.split(',')[0]}
                </span>
              </div>

              {/* Animated Scooter / Valet Position */}
              <div 
                className="relative z-20 transition-all duration-700 ease-out flex flex-col items-center"
                style={{
                  position: 'absolute',
                  left: scooterPos,
                  top: '42%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Pulsing GPS ring */}
                  <div className="absolute w-12 h-12 bg-orange-500/30 rounded-full animate-ping"></div>
                  <div className="w-10 h-10 bg-orange-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-lg text-white">
                    🛵
                  </div>
                </div>
                <span className="bg-white text-gray-900 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md mt-1 border border-gray-200 whitespace-nowrap">
                  {currentStep === 4 ? 'At Doorstep' : 'Ramesh Kumar (Valet)'}
                </span>
              </div>

              {/* Origin Store Pin */}
              <div className="absolute left-6 bottom-6 z-10 flex items-center space-x-1.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-lg">
                  SS
                </div>
                <div className="text-left text-white leading-tight">
                  <p className="text-[10px] font-black">Sahoo Sweets</p>
                  <p className="text-[8px] text-slate-400">Kitchen & Packing</p>
                </div>
              </div>

              {/* Destination Customer Pin */}
              <div className="absolute right-6 bottom-6 z-10 flex items-center space-x-1.5">
                <div className="text-right text-white leading-tight">
                  <p className="text-[10px] font-black">Your Home</p>
                  <p className="text-[8px] text-slate-400">Puri, Odisha</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 5-STEP SWIGGY PROGRESS BAR */}
            <div className="pt-2">
              <div className="flex items-center justify-between relative px-2">
                {/* Background line */}
                <div className="absolute left-5 right-5 top-3.5 h-1 bg-gray-200 z-0"></div>
                {/* Active filled line */}
                <div 
                  className="absolute left-5 top-3.5 h-1 bg-orange-500 z-0 transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 90}%` }}
                ></div>

                {order.steps.map((st, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-xs transition-all duration-300 ${
                          isDone 
                            ? 'bg-orange-500 text-white ring-2 ring-orange-200' 
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        } ${isCurrent ? 'scale-125 ring-4 ring-orange-300' : ''}`}
                      >
                        {isDone ? (idx === 4 ? '🎉' : '✓') : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 text-center max-w-[60px] leading-tight ${
                        isDone ? 'text-gray-900 font-extrabold' : 'text-gray-400'
                      }`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SWIGGY DELIVERY VALET PROFILE CARD */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Ramesh Kumar"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-400 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                    ✓
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-black text-gray-900">Ramesh Kumar</h4>
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md flex items-center">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" /> 4.9 (1,420+)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Swiggy Valet • Verified Pure Desi Ghee Sweets Courier
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-700 flex items-center mt-0.5">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                    Vaccinated • Mask & Sanitizer Checked (Temp: 98.4°F)
                  </p>
                </div>
              </div>

              {/* Action Buttons: Call & Chat */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleStartCall}
                  className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition cursor-pointer shadow-xs border border-emerald-200"
                  title="Call Delivery Partner"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowChatModal(true)}
                  className="w-10 h-10 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center transition cursor-pointer shadow-xs border border-orange-200"
                  title="Chat with Delivery Partner"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TIP OR RATE ACTIONS */}
            <div className="border-t pt-2.5 flex items-center justify-between">
              <span className="text-[11px] text-gray-600 font-medium">
                {tipSuccess ? `❤️ You tipped ₹${tipSuccess} to Ramesh` : 'Liked the service? Add a tip for Ramesh'}
              </span>

              <div className="flex items-center space-x-2">
                {!tipSuccess && (
                  <button
                    onClick={() => setShowTipModal(true)}
                    className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-extrabold text-[11px] rounded-xl transition cursor-pointer flex items-center space-x-1"
                  >
                    <Heart className="w-3 h-3 fill-orange-500 text-orange-500" />
                    <span>Add Tip</span>
                  </button>
                )}

                {currentStep === 4 && onOpenRatingModal && (
                  <button
                    onClick={() => onOpenRatingModal(order)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
                  >
                    <Star className="w-3 h-3 fill-white" />
                    <span>Rate Order</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* DELIVERY ADDRESS & INSTRUCTIONS CARD */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-2">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Delivering To Home
                </p>
                <p className="text-xs text-gray-600 font-medium leading-snug">
                  {order.address}
                </p>
                {order.deliveryInstructions && (
                  <div className="bg-orange-50/70 border border-orange-200 p-2 rounded-xl mt-2">
                    <p className="text-[11px] text-orange-950 font-bold">
                      <strong>Delivery Notes:</strong> {order.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ORDER ITEMS & PAYMENT SUMMARY ACCORDION */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 border-b pb-2">
              Order Summary • {order.id}
            </h4>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <SwiggyVegBadge size="md" />
                <span className="text-xs font-extrabold text-gray-900">{order.items}</span>
              </div>
              {order.cookingInstruction && (
                <p className="text-[11px] text-gray-500 italic pl-5">
                  Packaging note: "{order.cookingInstruction}"
                </p>
              )}
            </div>

            <div className="border-t pt-2.5 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-extrabold text-gray-900">{order.payment}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-2">
                <span>Total Amount Paid:</span>
                <span className="text-orange-600">₹{order.total}</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- SIMULATED IN-APP CHAT WITH VALET MODAL --- */}
        {showChatModal && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col">
            <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">
                  🛵
                </div>
                <div>
                  <h4 className="text-xs font-black">Chat with Ramesh Kumar</h4>
                  <p className="text-[10px] text-orange-100">Swiggy Valet • Online</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatModal(false)}
                className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((m, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs font-medium ${
                      m.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 shadow-xs border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="px-3 py-1.5 bg-gray-100 border-t flex space-x-1.5 overflow-x-auto text-[10px] font-bold text-gray-700">
              {["Please don't ring the bell", "Near the green gate", "Call when you reach"].map(qr => (
                <button
                  key={qr}
                  onClick={() => {
                    setChatInput(qr);
                  }}
                  className="px-2.5 py-1 bg-white rounded-full border border-gray-300 hover:bg-gray-50 shrink-0 cursor-pointer"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type instructions for Ramesh..."
                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- SIMULATED VALET PHONE CALL MODAL --- */}
        {showCallModal && (
          <div className="absolute inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-between p-8 text-center animate-in fade-in">
            <div className="space-y-2 pt-6">
              <p className="text-xs font-black uppercase tracking-widest text-orange-400">Swiggy Valet Direct Line</p>
              <h3 className="text-2xl font-black">Ramesh Kumar</h3>
              <p className="text-xs text-slate-400">+91 98612 34567 • Delivery Executive</p>
            </div>

            <div className="space-y-4">
              <div className="w-28 h-28 rounded-full border-4 border-orange-500/50 p-1 mx-auto flex items-center justify-center animate-pulse">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="Ramesh Kumar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-black text-emerald-400">
                  {callStatus === 'calling' ? 'Ringing...' : `Connected (${formatCallTime(callDuration)})`}
                </p>
                <p className="text-xs text-slate-300">
                  {callStatus === 'calling' 
                    ? 'Connecting to Ramesh Kumar via masked call proxy...' 
                    : 'Audio active: "Namaste sir! I am turning onto your lane near Nagapur chhak."'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCallStatus('ended');
                setTimeout(() => setShowCallModal(false), 500);
              }}
              className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black text-xs shadow-xl transition cursor-pointer flex items-center space-x-2"
            >
              <Phone className="w-4 h-4 rotate-135" />
              <span>End Call</span>
            </button>
          </div>
        )}

        {/* --- TIP MODAL --- */}
        {showTipModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-gray-100 shadow-2xl">
              <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <div>
                <h4 className="text-base font-black text-gray-900">Tip Ramesh Kumar</h4>
                <p className="text-xs text-gray-500">100% of your tip goes to support your valet.</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[20, 30, 50].map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setTipSuccess(t);
                      setShowTipModal(false);
                    }}
                    className="py-2.5 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-700 font-black text-xs rounded-xl border border-orange-200 transition cursor-pointer"
                  >
                    ₹{t}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowTipModal(false)}
                className="w-full py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* --- 24x7 SWIGGY SWEET CARE HELP MODAL --- */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-gray-100 shadow-2xl">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black text-gray-900">Swiggy Sweet Care (24x7 Support)</h4>
                <button onClick={() => setShowHelpModal(false)} className="cursor-pointer text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">What issue are you facing with Order #{order.id}?</p>
              <div className="space-y-2 text-xs font-bold text-gray-700">
                {[
                  "Where is my delivery valet right now?",
                  "I want to change delivery instructions",
                  "I want to add another sweet item",
                  "Report item missing or packaging issue",
                  "Cancel this order"
                ].map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      alert(`Support Executive connected: Regarding "${opt}". We are looking into your active order #${order.id}.`);
                      setShowHelpModal(false);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition cursor-pointer flex justify-between items-center"
                  >
                    <span>{opt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SwiggyLiveTracking;
