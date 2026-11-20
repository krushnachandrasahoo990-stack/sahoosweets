import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Home, Briefcase, Plus, Minus, Trash2, Tag, Percent, 
  Heart, ShieldCheck, CheckCircle2, ChevronRight, ChevronDown, 
  CreditCard, Wallet, QrCode, Timer, Clock, ArrowRight, Sparkles,
  AlertCircle, Check
} from 'lucide-react';
import SwiggyVegBadge from './SwiggyVegBadge';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  isDefault?: boolean;
}

interface CartItem {
  id?: string;
  name: string;
  price: number;
  qty: number;
  img?: string;
  variants?: any[];
  category?: string;
}

interface SwiggyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: CartItem[];
  onUpdateQty: (key: string, delta: number) => void;
  onClearCart: () => void;
  addressList: Address[];
  currentAddress: Address;
  onSelectAddress: (addrId: number) => void;
  onAddNewAddressModal: () => void;
  onOrderSuccess: (order: any) => void;
  sahooMoneyBalance?: number;
  rewardPoints?: number;
  onDeductSahooMoney?: (amt: number) => void;
  onEarnRewardPoints?: (pts: number) => void;
}

export const SwiggyCheckoutModal: React.FC<SwiggyCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartData,
  onUpdateQty,
  onClearCart,
  addressList,
  currentAddress,
  onSelectAddress,
  onAddNewAddressModal,
  onOrderSuccess,
  sahooMoneyBalance = 250,
  rewardPoints = 350,
  onDeductSahooMoney,
  onEarnRewardPoints,
}) => {
  // Navigation tabs in checkout
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [showAddressPicker, setShowAddressPicker] = useState<boolean>(false);
  const [useSahooMoney, setUseSahooMoney] = useState<boolean>(false);

  // Delivery instructions
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);
  const [customDeliveryNote, setCustomDeliveryNote] = useState<string>('');

  // Cooking / packaging instructions
  const [cookingInstruction, setCookingInstruction] = useState<string>('');

  // Tip to delivery partner
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTipInput, setCustomTipInput] = useState<string>('');
  const [showCustomTip, setShowCustomTip] = useState<boolean>(false);

  // Coupons
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState<string>('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI'); // 'UPI', 'CARD', 'WALLET', 'NETBANKING', 'COD'
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('Google Pay');
  const [customUpiId, setCustomUpiId] = useState<string>('');
  const [isUpiVerified, setIsUpiVerified] = useState<boolean>(false);
  const [showQrBox, setShowQrBox] = useState<boolean>(false);
  const [qrTimer, setQrTimer] = useState<number>(300); // 5 mins

  // Card details mock
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');

  // Wallet option
  const [selectedWallet, setSelectedWallet] = useState<string>('Paytm');

  // Net banking
  const [selectedBank, setSelectedBank] = useState<string>('State Bank of India');

  // Order processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccessScreen, setIsSuccessScreen] = useState<boolean>(false);

  // QR Timer Countdown
  useEffect(() => {
    let timerId: any;
    if (showQrBox && qrTimer > 0) {
      timerId = setInterval(() => setQrTimer(prev => prev - 1), 1000);
    } else if (qrTimer === 0 && showQrBox) {
      setShowQrBox(false);
      setQrTimer(300);
    }
    return () => clearInterval(timerId);
  }, [showQrBox, qrTimer]);

  if (!isOpen) return null;

  // Calculate pricing
  const itemTotal = cartData.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalCount = cartData.reduce((sum, item) => sum + item.qty, 0);

  // Delivery fee logic (Free delivery if items >= 399)
  const isFreeDelivery = itemTotal >= 399;
  const deliveryFee = isFreeDelivery ? 0 : 35;
  const platformFee = 5;
  const packagingFee = 0; // Free from Sahoo Sweets

  // Coupon discount
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  
  // High order automatic discount (if no coupon)
  const autoDiscount = (!appliedCoupon && itemTotal >= 500) ? 50 : 0;
  const totalDiscount = couponDiscount || autoDiscount;

  // Price-wise Partner Reward Points earnable (1 Point for every ₹10)
  const earnableRewardPoints = Math.max(1, Math.floor(itemTotal / 10));

  // Subtotal before Sahoo Money deduction
  const subtotalBeforeWallet = Math.max(0, itemTotal + deliveryFee + platformFee + packagingFee + selectedTip - totalDiscount);
  const sahooMoneyApplied = (useSahooMoney && sahooMoneyBalance > 0) ? Math.min(sahooMoneyBalance, subtotalBeforeWallet) : 0;
  const finalPayable = Math.max(0, subtotalBeforeWallet - sahooMoneyApplied);
  const totalSavings = totalDiscount + (isFreeDelivery ? 35 : 0) + 10 + sahooMoneyApplied;

  // Delivery instructions tags
  const deliveryTags = [
    { id: 'door', label: 'Leave at the door', icon: '🚪' },
    { id: 'nocall', label: 'Avoid calling', icon: '🔕' },
    { id: 'security', label: 'Leave with security', icon: '🛡️' },
    { id: 'bell', label: 'Ring the bell', icon: '🔔' },
    { id: 'pet', label: 'Beware of pets', icon: '🐕' }
  ];

  const toggleDeliveryTag = (tagLabel: string) => {
    setSelectedInstructions(prev => 
      prev.includes(tagLabel) ? prev.filter(t => t !== tagLabel) : [...prev, tagLabel]
    );
  };

  // Coupons application
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setCouponError('');
    setCouponSuccessMsg('');

    if (cleanCode === 'SWIGGY50' || cleanCode === 'SWIGGY') {
      if (itemTotal < 250) {
        setCouponError('Minimum order amount for SWIGGY50 is ₹250');
        return;
      }
      setAppliedCoupon({ code: 'SWIGGY50', discount: 50, label: 'Flat ₹50 OFF with Swiggy Welcome' });
      setCouponSuccessMsg('🎉 "SWIGGY50" applied! You saved ₹50');
    } else if (cleanCode === 'SWEET100' || cleanCode === 'FESTIVE100') {
      if (itemTotal < 599) {
        setCouponError('Minimum order amount for SWEET100 is ₹599');
        return;
      }
      setAppliedCoupon({ code: 'SWEET100', discount: 100, label: 'Festive ₹100 OFF on Sweets' });
      setCouponSuccessMsg('🎉 "SWEET100" applied! You saved ₹100');
    } else if (cleanCode === 'FREEDEL') {
      setAppliedCoupon({ code: 'FREEDEL', discount: 35, label: 'Free Delivery on your order' });
      setCouponSuccessMsg('🎉 "FREEDEL" applied! ₹35 delivery fee waived');
    } else {
      setCouponError('Invalid coupon code. Try SWIGGY50 or FREEDEL');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccessMsg('');
    setCouponError('');
  };

  // Tip handler
  const handleSelectTip = (amount: number) => {
    if (selectedTip === amount) {
      setSelectedTip(0);
    } else {
      setSelectedTip(amount);
      setShowCustomTip(false);
    }
  };

  const handleCustomTipApply = () => {
    const val = parseInt(customTipInput);
    if (!isNaN(val) && val > 0) {
      setSelectedTip(val);
      setShowCustomTip(false);
    }
  };

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Place order
  const handlePlaceOrder = () => {
    if (cartData.length === 0) return;

    setIsProcessing(true);

    const paymentLabel = 
      sahooMoneyApplied > 0 && finalPayable === 0 ? `Sahoo Money (₹${sahooMoneyApplied})` :
      sahooMoneyApplied > 0 ? `Sahoo Money (₹${sahooMoneyApplied}) + ${paymentMethod}` :
      paymentMethod === 'UPI' ? `UPI (${selectedUpiApp}${customUpiId ? ' - ' + customUpiId : ''})` :
      paymentMethod === 'CARD' ? `Credit/Debit Card (${cardNumber ? 'Ending ' + cardNumber.slice(-4) : 'Visa'})` :
      paymentMethod === 'WALLET' ? `Wallet (${selectedWallet})` :
      paymentMethod === 'NETBANKING' ? `Net Banking (${selectedBank})` :
      'Cash on Delivery (COD)';

    const orderId = `SW-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      date: `Today, ${currentTime}`,
      rawDate: new Date().toISOString(),
      itemsList: cartData.map(c => ({
        name: c.name,
        qty: c.qty,
        price: c.price,
        img: c.img
      })),
      items: cartData.map(c => `${c.name} (x${c.qty})`).join(', '),
      itemTotal,
      deliveryFee,
      tip: selectedTip,
      platformFee,
      discount: totalDiscount,
      total: finalPayable,
      sahooMoneyUsed: sahooMoneyApplied,
      pointsEarned: earnableRewardPoints,
      statusIndex: 0, // 0: Order Confirmed, 1: Placed, 2: Shipped/Preparing, 3: Out for Delivery, 4: Delivered
      steps: [
        "Order Confirmed",
        "Placed",
        "Shipped/Preparing",
        "Out for Delivery",
        "Delivered"
      ],
      payment: paymentLabel,
      paymentMethod,
      address: `${currentAddress.address}, ${currentAddress.city} - ${currentAddress.pin}`,
      deliveryInstructions: selectedInstructions.join(', ') + (customDeliveryNote ? ` (${customDeliveryNote})` : ''),
      cookingInstruction: cookingInstruction || 'Pack securely in traditional sweet box',
      partner: {
        name: "Ramesh Kumar",
        phone: "+91 98612 34567",
        rating: 4.9,
        deliveries: "1,420+",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        badge: "Vaccinated • Mask & Sanitizer Checked"
      },
      estimatedMinutes: 28
    };

    if (sahooMoneyApplied > 0 && onDeductSahooMoney) {
      onDeductSahooMoney(sahooMoneyApplied);
    }
    if (onEarnRewardPoints) {
      onEarnRewardPoints(earnableRewardPoints);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessScreen(true);
      
      setTimeout(() => {
        onOrderSuccess(newOrder);
        onClearCart();
        setIsSuccessScreen(false);
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-end sm:justify-center p-0 sm:p-4 transition-all">
      <div className="bg-white w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* SUCCESS OVERLAY */}
        {isSuccessScreen && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                SWIGGY ORDER CONFIRMED
              </span>
              <h3 className="text-2xl font-black text-gray-900 pt-2">Order Placed Successfully!</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Sahoo Sweets kitchen has accepted your order. Launching live GPS delivery tracking...
              </p>
            </div>
            <div className="w-48 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-orange-500 h-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {/* SWIGGY TOP HEADER */}
        <div className="bg-white border-b px-5 py-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/30">
              🛵
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-gray-900">SAHOO SWEETS</h2>
                <span className="bg-orange-50 text-orange-600 border border-orange-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-orange-500" /> 25-30 MINS
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium truncate max-w-[220px] sm:max-w-xs">
                Brahmagiri Road, Puri • Fresh Sweets & Odia Snacks
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP TABS: 1. CART & DETAILS | 2. PAYMENT */}
        <div className="bg-gray-50 border-b flex px-5 py-2.5 space-x-3 text-xs font-black shrink-0">
          <button
            onClick={() => setCheckoutStep('cart')}
            className={`flex-1 py-2 rounded-xl text-center transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              checkoutStep === 'cart'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>1. Review Order & Address</span>
            <span className="bg-orange-100 text-orange-800 text-[10px] px-1.5 py-0.2 rounded-full">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => {
              if (cartData.length > 0) setCheckoutStep('payment');
            }}
            disabled={cartData.length === 0}
            className={`flex-1 py-2 rounded-xl text-center transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              checkoutStep === 'payment'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-gray-500 hover:text-gray-800 disabled:opacity-40'
            }`}
          >
            <span>2. Payment Options</span>
            <span className="text-[10px] text-emerald-600 font-extrabold">₹{finalPayable}</span>
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-[#f6f7f9]">

          {/* STEP 1: CART & DELIVERY DETAILS */}
          {checkoutStep === 'cart' && (
            <>
              {/* DELIVERY ADDRESS SWIGGY CARD */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                          Deliver To: {currentAddress?.name || 'Customer'}
                        </h4>
                        <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Home
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-600 mt-1 leading-snug">
                        {currentAddress?.address}, {currentAddress?.city} - {currentAddress?.pin}
                      </p>
                      <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                        📞 {currentAddress?.phone || '9078699528'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddressPicker(!showAddressPicker)}
                    className="text-xs font-black text-orange-600 hover:text-orange-700 uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-orange-50 transition cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* ADDRESS PICKER DROPDOWN */}
                {showAddressPicker && (
                  <div className="border-t pt-3 space-y-2 mt-2">
                    <p className="text-[10px] font-black uppercase text-gray-400">Select Saved Address:</p>
                    {addressList.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          onSelectAddress(addr.id);
                          setShowAddressPicker(false);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                          addr.id === currentAddress.id
                            ? 'bg-orange-50/60 border-orange-400 text-orange-900 font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div>
                          <p className="font-extrabold">{addr.name} ({addr.city})</p>
                          <p className="text-[11px] text-gray-500">{addr.address} - {addr.pin}</p>
                        </div>
                        {addr.id === currentAddress.id && (
                          <span className="text-[9px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full">
                            SELECTED
                          </span>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setShowAddressPicker(false);
                        onAddNewAddressModal();
                      }}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      + Add New Delivery Address
                    </button>
                  </div>
                )}

                {/* SWIGGY DELIVERY INSTRUCTIONS TILES */}
                <div className="border-t pt-3 space-y-2">
                  <p className="text-[11px] font-extrabold text-gray-700 flex items-center">
                    <span>Delivery Instructions for Valet</span>
                    <span className="text-[10px] text-gray-400 ml-1.5 font-normal">(Optional)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {deliveryTags.map(tag => {
                      const isSelected = selectedInstructions.includes(tag.label);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleDeliveryTag(tag.label)}
                          className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center space-x-1.5 transition cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500 border-orange-500 text-white font-bold shadow-xs'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>{tag.icon}</span>
                          <span>{tag.label}</span>
                          {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={customDeliveryNote}
                    onChange={e => setCustomDeliveryNote(e.target.value)}
                    placeholder="e.g. Near Jagannath temple, 2nd floor, call before reaching..."
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 bg-gray-50/50"
                  />
                </div>
              </div>

              {/* CART ITEMS LIST WITH VEG BADGE */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                    Order Items ({totalCount})
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <SwiggyVegBadge size="sm" />
                    <span>100% Pure Desi Ghee & Fresh</span>
                  </span>
                </div>

                {cartData.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 space-y-2">
                    <p className="text-xs font-bold">Your cart is empty.</p>
                    <p className="text-[11px]">Add delicious sweets or snacks from the menu</p>
                  </div>
                ) : (
                  <div className="space-y-3 divide-y divide-gray-100">
                    {cartData.map((item, idx) => (
                      <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <SwiggyVegBadge size="md" />
                          <div className="overflow-hidden">
                            <h5 className="text-xs font-black text-gray-900 truncate">
                              {item.name}
                            </h5>
                            <p className="text-xs font-extrabold text-orange-600 mt-0.5">
                              ₹{item.price * item.qty}
                              <span className="text-[10px] text-gray-400 font-normal ml-1.5">
                                (₹{item.price} each)
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Swiggy Style Quantity Box */}
                        <div className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-xs shrink-0">
                          <button
                            onClick={() => onUpdateQty(item.name, -1)}
                            className="w-5 h-5 flex items-center justify-center font-black text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded cursor-pointer transition"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-orange-600 min-w-[16px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.name, 1)}
                            className="w-5 h-5 flex items-center justify-center font-black text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded cursor-pointer transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Packaging / Chef note */}
                <div className="border-t pt-2.5">
                  <input
                    type="text"
                    value={cookingInstruction}
                    onChange={e => setCookingInstruction(e.target.value)}
                    placeholder="📝 Any packaging note? (e.g. Extra sweet box packing, spoons...)"
                    className="w-full text-xs p-2.5 border border-dashed border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
                  />
                </div>
              </div>

              {/* OFFERS & COUPONS SECTION */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Percent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black uppercase text-gray-800 tracking-wider">
                      Apply Coupon / Offer
                    </span>
                  </div>
                  {appliedCoupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-extrabold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-emerald-800">{appliedCoupon.code} APPLIED</p>
                        <p className="text-[10px] text-emerald-600">{appliedCoupon.label}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700">-₹{appliedCoupon.discount}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code (e.g. SWIGGY50)"
                        className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 uppercase font-bold"
                      />
                      <button
                        onClick={() => applyCoupon(couponCode)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] font-bold text-rose-600 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" /> {couponError}
                      </p>
                    )}

                    {/* Popular Coupon Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        onClick={() => applyCoupon('SWIGGY50')}
                        className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg hover:bg-amber-100 transition cursor-pointer"
                      >
                        🏷️ SWIGGY50 (₹50 OFF on ₹250+)
                      </button>
                      <button
                        onClick={() => applyCoupon('FREEDEL')}
                        className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                      >
                        🛵 FREEDEL (Free Delivery)
                      </button>
                      <button
                        onClick={() => applyCoupon('SWEET100')}
                        className="text-[10px] font-bold px-2 py-1 bg-orange-50 text-orange-900 border border-orange-200 rounded-lg hover:bg-orange-100 transition cursor-pointer"
                      >
                        🎉 SWEET100 (₹100 OFF on ₹599+)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* TIP DELIVERY PARTNER (SWIGGY ICONIC) */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h4 className="text-xs font-black uppercase text-gray-800 tracking-wider">
                    Tip Your Delivery Partner
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Thank your delivery partner for bringing fresh sweets safely to your doorstep. 100% of the tip goes to them.
                </p>

                <div className="flex items-center space-x-2 pt-1">
                  {[10, 20, 30, 50].map(amt => (
                    <button
                      key={amt}
                      onClick={() => handleSelectTip(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                        selectedTip === amt
                          ? 'bg-orange-500 border-orange-500 text-white shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomTip(!showCustomTip)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      showCustomTip ? 'bg-orange-50 border-orange-400 text-orange-600' : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {showCustomTip && (
                  <div className="flex space-x-2 pt-1">
                    <input
                      type="number"
                      value={customTipInput}
                      onChange={e => setCustomTipInput(e.target.value)}
                      placeholder="Enter tip amount (₹)"
                      className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={handleCustomTipApply}
                      className="px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Set Tip
                    </button>
                  </div>
                )}
                {selectedTip > 0 && (
                  <p className="text-[11px] font-extrabold text-orange-600">
                    ❤️ ₹{selectedTip} added to support your delivery partner!
                  </p>
                )}
              </div>

              {/* SAHOO MONEY 1-CLICK WALLET CHECKOUT TOGGLE */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 shadow-xs border border-orange-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    👛
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                        Use Sahoo Money
                      </h4>
                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        ₹{sahooMoneyBalance} Available
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      {sahooMoneyBalance > 0 
                        ? `Apply up to ₹${Math.min(sahooMoneyBalance, subtotalBeforeWallet)} instant wallet cash` 
                        : 'Recharge your wallet or convert partner rewards for 1-click checkout'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSahooMoney && sahooMoneyBalance > 0}
                    disabled={sahooMoneyBalance <= 0}
                    onChange={e => setUseSahooMoney(e.target.checked)}
                    className="w-5 h-5 accent-orange-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* PARTNER REWARDS POINTS EARNABLE BADGE */}
              <div className="bg-amber-50 border border-amber-200 text-amber-950 p-3 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🪙</span>
                  <div>
                    <p className="text-xs font-black">Partner Rewards You'll Earn</p>
                    <p className="text-[10px] text-amber-800">Earn 1 Point for every ₹10 spent (Price-wise)</p>
                  </div>
                </div>
                <span className="bg-amber-200/90 text-amber-900 font-black text-xs px-2.5 py-1 rounded-xl">
                  +{earnableRewardPoints} Points (Worth ₹{earnableRewardPoints})
                </span>
              </div>

              {/* DETAILED BILL BREAKDOWN */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 border-b pb-2">
                  Bill Details
                </h4>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between font-semibold">
                    <span>Item Total ({totalCount} items)</span>
                    <span className="font-extrabold text-gray-900">₹{itemTotal}</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Delivery Fee (Puri Express)</span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 font-extrabold flex items-center">
                        <span className="line-through text-gray-400 mr-1.5 font-normal">₹35</span> FREE
                      </span>
                    ) : (
                      <span className="font-bold text-gray-900">₹{deliveryFee}</span>
                    )}
                  </div>

                  {selectedTip > 0 && (
                    <div className="flex justify-between font-semibold text-orange-600">
                      <span>Delivery Partner Tip</span>
                      <span className="font-extrabold">₹{selectedTip}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold">
                    <span>Platform Fee</span>
                    <span className="font-extrabold text-gray-900">₹{platformFee}</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Packaging Charges</span>
                    <span className="text-emerald-600 font-extrabold flex items-center">
                      <span className="line-through text-gray-400 mr-1.5 font-normal">₹10</span> FREE
                    </span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span>Discount Savings</span>
                      <span>-₹{totalDiscount}</span>
                    </div>
                  )}

                  {sahooMoneyApplied > 0 && (
                    <div className="flex justify-between font-extrabold text-orange-600">
                      <span>Sahoo Money Applied (Wallet)</span>
                      <span>-₹{sahooMoneyApplied}</span>
                    </div>
                  )}

                  <div className="border-t border-dashed pt-2.5 flex justify-between items-center text-sm font-black text-gray-900">
                    <span className="text-base">TO PAY</span>
                    <span className="text-lg font-black text-orange-600">₹{finalPayable}</span>
                  </div>
                </div>

                {/* Savings Banner */}
                {totalSavings > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black p-2.5 rounded-xl flex items-center justify-between">
                    <span className="flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Total Savings on this order
                    </span>
                    <span>₹{totalSavings}</span>
                  </div>
                )}

                {/* Cancellation Policy Note */}
                <div className="pt-1 flex items-start space-x-1.5 text-[10px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Cancellation Policy:</strong> 100% refund available if order is cancelled before kitchen prepares your sweets.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: SWIGGY PAYMENT OPTIONS */}
          {checkoutStep === 'payment' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400">Total Amount to Pay</p>
                  <h3 className="text-2xl font-black text-orange-600">₹{finalPayable}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    🛡️ 100% Secure Checkout
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{totalCount} items to {currentAddress.city}</p>
                </div>
              </div>

              {/* PAYMENT CATEGORY TABS */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                  Choose Payment Method
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI (Instant)', icon: '⚡' },
                    { id: 'WALLET', label: 'Sahoo Wallet & Apps', icon: '👛' },
                    { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
                    { id: 'NETBANKING', label: 'Net Banking', icon: '🏛️' },
                    { id: 'COD', label: 'Cash on Delivery', icon: '💵' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setPaymentMethod(m.id);
                        setShowQrBox(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        paymentMethod === m.id
                          ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <p className={`text-xs font-black mt-1 ${paymentMethod === m.id ? 'text-orange-600' : 'text-gray-800'}`}>
                        {m.label}
                      </p>
                    </button>
                  ))}
                </div>

                {/* --- 1. UPI SECTION --- */}
                {paymentMethod === 'UPI' && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <p className="text-xs font-extrabold text-gray-700 mb-2">Select Preferred UPI App:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['Google Pay (GPay)', 'PhonePe', 'Paytm', 'Amazon Pay'].map(app => (
                          <button
                            key={app}
                            onClick={() => {
                              setSelectedUpiApp(app);
                              setShowQrBox(false);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-black text-center transition cursor-pointer ${
                              selectedUpiApp === app && !showQrBox
                                ? 'bg-orange-500 border-orange-500 text-white shadow-xs'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>

                      {/* Pay via selected app button */}
                      {!showQrBox && (
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pay ₹{finalPayable} via {selectedUpiApp} & Confirm Order</span>
                        </button>
                      )}
                    </div>

                    {/* Or Dynamic QR Code */}
                    <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <QrCode className="w-5 h-5 text-amber-700" />
                        <div>
                          <p className="text-xs font-black text-gray-900">Scan Dynamic UPI QR Code</p>
                          <p className="text-[10px] text-gray-600">Scan using GPay, PhonePe, Paytm or any UPI app</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowQrBox(!showQrBox)}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
                          showQrBox ? 'bg-amber-700 text-white' : 'bg-white border border-amber-300 text-amber-800'
                        }`}
                      >
                        {showQrBox ? 'Hide QR' : 'Show Live QR'}
                      </button>
                    </div>

                    {showQrBox && (
                      <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-amber-400 text-center space-y-3">
                        <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
                          <Timer className="w-3.5 h-3.5 animate-spin" />
                          <span>Expires in: {formatTimer(qrTimer)}</span>
                        </div>
                        <div className="w-44 h-44 bg-gray-50 p-3 mx-auto rounded-2xl border shadow-inner flex flex-col items-center justify-center">
                          <QrCode className="w-36 h-36 text-gray-900" />
                        </div>
                        <p className="text-[11px] font-extrabold text-gray-700">
                          Scan & Pay ₹{finalPayable} to <span className="text-orange-600 font-black">sahoosweets@upi</span>
                        </p>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Simulate Payment Success (Testing)</span>
                        </button>
                      </div>
                    )}

                    {/* Custom UPI ID */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 uppercase">Or Enter UPI ID (VPA):</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={customUpiId}
                          onChange={e => {
                            setCustomUpiId(e.target.value);
                            setIsUpiVerified(false);
                          }}
                          placeholder="e.g. mobile@oksbi, user@paytm"
                          className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-bold"
                        />
                        <button
                          onClick={() => {
                            if (customUpiId.includes('@')) {
                              setIsUpiVerified(true);
                            } else {
                              alert('Please enter a valid UPI ID (e.g. yourname@okhdfcbank)');
                            }
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                            isUpiVerified ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isUpiVerified ? 'Verified ✓' : 'Verify'}
                        </button>
                      </div>
                      {isUpiVerified && (
                        <p className="text-[11px] text-emerald-600 font-bold">✓ UPI ID is valid & ready for 1-click checkout</p>
                      )}
                    </div>
                  </div>
                )}

                {/* --- 2. CARDS SECTION --- */}
                {paymentMethod === 'CARD' && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>Credit / Debit Card</span>
                      <div className="flex space-x-1.5 text-[10px] font-black text-gray-400">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">VISA</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">Mastercard</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">RuPay</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="CVV (3 or 4 digits)"
                        className="text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      placeholder="Name on Card"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
                    />

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pay ₹{finalPayable} via Card & Confirm Order</span>
                    </button>
                  </div>
                )}

                {/* --- 3. WALLETS --- */}
                {paymentMethod === 'WALLET' && (
                  <div className="border-t pt-4 space-y-3">
                    {/* Sahoo Money Wallet direct pay card */}
                    <div className="p-3.5 rounded-2xl border-2 bg-orange-50/70 border-orange-300 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl">👛</span>
                        <div>
                          <p className="text-xs font-black text-gray-900">Sahoo Money Wallet</p>
                          <p className="text-[10px] text-gray-600">Available Balance: ₹{sahooMoneyBalance.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUseSahooMoney(true);
                          handlePlaceOrder();
                        }}
                        disabled={isProcessing || sahooMoneyBalance <= 0}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-40"
                      >
                        1-Click Pay
                      </button>
                    </div>

                    <p className="text-xs font-bold text-gray-700">Or Select Wallet Partner:</p>
                    {['Amazon Pay Balance', 'Paytm Wallet', 'PhonePe Wallet', 'MobiKwik'].map(w => (
                      <div
                        key={w}
                        onClick={() => setSelectedWallet(w)}
                        className={`p-3 rounded-xl border text-xs font-black cursor-pointer transition flex items-center justify-between ${
                          selectedWallet === w
                            ? 'bg-orange-50 border-orange-400 text-orange-900'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{w}</span>
                        {selectedWallet === w && <Check className="w-4 h-4 text-orange-600" />}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pay ₹{finalPayable} via {selectedWallet} & Confirm Order</span>
                    </button>
                  </div>
                )}

                {/* --- 4. NET BANKING --- */}
                {paymentMethod === 'NETBANKING' && (
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-xs font-bold text-gray-700">Popular Banks:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map(b => (
                        <button
                          key={b}
                          onClick={() => setSelectedBank(b)}
                          className={`p-2.5 rounded-xl border text-xs font-black text-left transition cursor-pointer truncate ${
                            selectedBank === b
                              ? 'bg-orange-50 border-orange-500 text-orange-900'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pay ₹{finalPayable} via {selectedBank}</span>
                    </button>
                  </div>
                )}

                {/* --- 5. CASH ON DELIVERY --- */}
                {paymentMethod === 'COD' && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                      <p className="text-xs font-black text-amber-900">💵 Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        Keep exact cash of ₹{finalPayable} ready or scan the delivery partner's QR code at your door.
                      </p>
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Cash on Delivery Order (Instant)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SWIGGY STICKY BOTTOM CHECKOUT ACTION BAR */}
        <div className="bg-white border-t px-5 py-3.5 shrink-0 shadow-lg flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              {checkoutStep === 'cart' ? 'Total Payable' : `Paying via ${paymentMethod}`}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-gray-900">₹{finalPayable}</span>
              {totalSavings > 0 && (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Saved ₹{totalSavings}
                </span>
              )}
            </div>
          </div>

          {checkoutStep === 'cart' ? (
            <button
              onClick={() => {
                if (cartData.length > 0) setCheckoutStep('payment');
              }}
              disabled={cartData.length === 0}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center space-x-2 disabled:opacity-40"
            >
              <span>PROCEED TO PAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition cursor-pointer flex items-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming Order...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PAY ₹{finalPayable} & PLACE ORDER</span>
                </span>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SwiggyCheckoutModal;
