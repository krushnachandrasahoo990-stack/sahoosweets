import React, { useState, useEffect } from 'react';
import { 
  Search, LayoutGrid, MapPin, Wallet, RotateCcw, Coins, Heart, 
  FileText, Crown, Star, Settings, HelpCircle, ChevronDown, 
  ChevronLeft, ArrowRight, ShoppingBag, X, Plus, Home, BookOpen, LogOut, Trash2, PhoneCall, CheckCircle2, User, Edit3, Truck, XCircle, Eye 
} from 'lucide-react';

export default function Dashboard() {
  const allProducts = [
    { id: "sw1", name: "Pahala Style Rosgola", category: "sweets", badge: "BESTSELLER", rating: 4.9, reviews: "260+", desc: "Super spongy, melt-in-mouth cottage cheese balls soaked in authentic warm sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtwZakNUCDCTGm30bOrOk45IbALQwlXluQBXtq3uCQ-w&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw2", name: "Shahi Gulab Jamun", category: "sweets", badge: "HOT SWEET", rating: 4.8, reviews: "190+", desc: "Deep-fried golden khoya dumplings simmered in fragrant cardamom sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZI8sJv8_Go96Hn3rFD6JiVIElf8mCd1i2bg2uu2E2CA&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw3", name: "Authentic Cheese Cake", category: "sweets", badge: "NAYAGARH PRIDE", rating: 5.0, reviews: "340+", desc: "Traditional Chhena Podo slow-baked with caramelized crust, cashews & raisins.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3N0k9IvzdjBRP3o_1KtoEo8HXx-LZkLdxDxy5Nauvng&s=10", variants: [{ label: "100g", price: 40 }, { label: "250g", price: 100 }, { label: "500g", price: 200 }, { label: "1 Kg", price: 400 }] },
    { id: "sw4", name: "Nimapada Famous Jhili", category: "sweets", badge: "NIMAPADA SPECIAL", rating: 4.8, reviews: "150+", desc: "Crispy yet juicy chhena spirals fried in pure desi ghee and glazed with cardamom syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRET8Sh2_Dmr3osEYtZa58tQmjstHy_D5NrH9BCSCoK_A&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw5", name: "Crispy Chhena Gaja", category: "sweets", badge: "AUTHENTIC", rating: 4.7, reviews: "130+", desc: "Pure cottage cheese rectangles deep-fried to crunchy brown perfection and glazed with syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwAgCTQFNTmRQcUlFzArMkJBB9v6rbkjfDCOGFnO5xOg&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw6", name: "Traditional Tadia", category: "sweets", badge: "HERITAGE", rating: 4.6, reviews: "110+", desc: "Rich traditional crunchy fried sweet snack prepared with cottage cheese dough and sugar.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdzjvg3HnAeOP2CKXvUQ7fIDLSpKBL8MCxNzwqQtrIkw&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw7", name: "Pheni Gaja", category: "sweets", badge: "PURI SPECIAL", rating: 4.9, reviews: "210+", desc: "Crispy layered Odia flaky sweet gaja coated with light cardamom sugar glaze.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStyf-JcWV1_8L48vANR9Hqto2ZA1zTKeJ_7NTOI1pKPg&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw8", name: "Khira Gaja", category: "sweets", badge: "SWEET DELIGHT", rating: 4.8, reviews: "175+", desc: "Authentic milk cream and chhena infused soft layered gaja soaked in delicious chasni.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAz4v8xFgf9OpZrUPjlCA9YOGBJQLKIuJ3gZfMhtOFFg&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw9", name: "Crispy Jilapi", category: "sweets", badge: "HOT CRISPY", rating: 4.9, reviews: "280+", desc: "Freshly fried hot spiral jilapis dipped in fragrant saffron and cardamom sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ErlGVeIRBOe_cE7cXsHjBlwwc06Sdx-PMlxQoDs6GQ&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw10", name: "Traditional Malpua", category: "sweets", badge: "TEMPLE TASTE", rating: 4.9, reviews: "190+", desc: "Mouth-watering soft and juicy fried sweet pancakes soaked in rich fennel seed scented syrup.", img: "https://cdn.indiaphile.info/wp-content/uploads/2023/08/stp-malpua-4458.jpg?width=1200&format=webp", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw11", name: "Besan Bundi Ladu", category: "sweets", badge: "DESI GHEE", rating: 4.8, reviews: "160+", desc: "Traditional desi ghee bundi laddus flavored with crushed green cardamom, cloves and melon seeds.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1tv0iWsCoAbcPSnCxw565K2Z2ngQYPiJGC-N8i954RA&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },
    { id: "sw12", name: "Sweet Bundi", category: "sweets", badge: "FRESH", rating: 4.7, reviews: "140+", desc: "Golden crispy sweet tiny gram flour pearls soaked in aromatic cardamom sugar syrup.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb6FAkJVxg_lkdhxbz4nNbVL7lBLXxD5fQuomNazLusg&s=10", variants: [{ label: "100g", price: 25 }, { label: "250g", price: 50 }, { label: "500g", price: 100 }, { label: "1 Kg", price: 200 }] },
    { id: "sw13", name: "Labang Lata", category: "sweets", badge: "ROYAL SWEET", rating: 4.9, reviews: "170+", desc: "Crispy pastry stuffed with sweet khoya and coconut filling, sealed with a fragrant clove.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStaehqGYkhc6PC82iQ-TIuK-626uM58VQMj5QabE0BRw&s=10", variants: [{ label: "1 Pc", price: 10 }, { label: "250g", price: 90 }, { label: "500g", price: 175 }, { label: "1 Kg", price: 350 }] },

    { id: "bf1", name: "Bara", category: "breakfast", badge: "HOT CRISPY", rating: 4.9, reviews: "410+", desc: "Crispy fried fermented urad dal vada tempered with curry leaves and green chilies.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5LxB18dY-XyKVABOKnU3sTHww-zcUEj5QS9n3ZSZ6KA&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }] },
    { id: "bf2", name: "Singada/Samosa", category: "breakfast", badge: "CRUNCHY", rating: 4.8, reviews: "320+", desc: "Golden flaky pastry filled with spiced potato cubes, roasted peanuts and cumin masala.", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }] },
    { id: "bf3", name: "Crispy Alu Chop", category: "breakfast", badge: "STREET SPECIAL", rating: 4.7, reviews: "210+", desc: "Spiced mashed potato patty dipped in seasoned gram flour batter and fried crisp.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7x_hf9PxJ01aj0vwdEw0FyvezBE6xu2tY_-ZVeAe6Ow&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }] },
    { id: "bf4", name: "Mottor Curry (Ghuguni)", category: "breakfast", badge: "POPULAR", rating: 4.8, reviews: "290+", desc: "Slow-cooked yellow peas curry simmered with onion, ginger, garlic, tomatoes and garam masala.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLYKYa3vJcWok1_1ItfryFdk7DdRpEWInZ65jz4OZk3A&s=10", variants: [{ label: "1 Plate", price: 20 }, { label: "2 Plates", price: 40 }] },
    { id: "bf5", name: "Garam Puri & Aloo Kasa", category: "breakfast", badge: "MORNING SPECIAL", rating: 4.9, reviews: "350+", desc: "4 golden fluffy wheat puris served with homestyle spicy potato kasa and tangy pickle.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85hPuRAlOGjBTX_4pRLG1qUUezjwbDz1s5-Fede0x7w&s=10", variants: [{ label: "4 Puris (1 Plate)", price: 20 }, { label: "8 Puris (2 Plates)", price: 40 }] },
    { id: "bf6", name: "Suji Kakara Pitha", category: "breakfast", badge: "ODIA PITHA", rating: 4.9, reviews: "180+", desc: "Crispy golden semolina pitha stuffed with freshly grated coconut, jaggery and black pepper.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSouqPkKoh6-I5ZczUc24FFPrzZ_JlpgeYbC9JcT0NX2Q&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }] },
    { id: "bf7", name: "Steamed Soft Idli", category: "breakfast", badge: "HEALTHY", rating: 4.8, reviews: "220+", desc: "Cloud-soft steamed rice & lentil cake served with coconut chutney and hot curry.", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }] },
    { id: "bf8", name: "Masala Suji Upma", category: "breakfast", badge: "HOMESTYLE", rating: 4.7, reviews: "160+", desc: "Roasted semolina tempered with mustard seeds, curry leaves, peanuts and served with curry.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUjcEV6zo1hjEGCgADJRudflhZF3eX4uYk9bvnhU1pdg&s=10", variants: [{ label: "1 Plate", price: 20 }, { label: "2 Plates", price: 40 }] },
    { id: "bf9", name: "Garam Piaji / Pakodi", category: "breakfast", badge: "CRUNCHY", rating: 4.8, reviews: "240+", desc: "Crunchy onion and gram flour fritters tossed with green chilies, served with chutney.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbBwZHxR9t9l3i2DxMkiwGoMNMMGArxa3LuSP1C2j41A&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "4 Pcs", price: 20 }, { label: "10 Pcs", price: 50 }] },
    { id: "bf10", name: "Special Mitha Khata Dahi Bara", category: "breakfast", badge: "ODISHA SPECIAL", rating: 5.0, reviews: "510+", desc: "Soft urad dal baras soaked in sweet-tangy dahi pani, topped with roasted cumin & tamarind.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7OMQeUOAImoCzZA1OBdQ7Eluwd1nUBF2U0XD3HmgjA&s=10", variants: [{ label: "1 Pc", price: 15 }, { label: "2 Pcs", price: 30 }, { label: "4 Pcs", price: 60 }] },
    { id: "bf11", name: "Authentic Odia Dalma", category: "breakfast", badge: "PURI PRIDE", rating: 4.9, reviews: "320+", desc: "Nutritious toor dal cooked with raw papaya, pumpkin, brinjal, tempered with pure ghee & roasted cumin.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKmTSG3K7RgZQuGVNi3fjnhC8GiA84PsYpyNFKNKHfyEWN_t8QbTDTeqK&s=10", variants: [{ label: "1 Plate", price: 20 }, { label: "2 Plates", price: 40 }] },
    { id: "bf12", name: "Odia Special Gulugula", category: "breakfast", badge: "HOT MORNING", rating: 4.8, reviews: "190+", desc: "Fluffy and sweet deep-fried whole wheat fritters infused with fennel seeds and jaggery.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFVq7GcPq4_03kCtWyfe3vMla8ffXunRs1PJKmNSruEQ&s=10", variants: [{ label: "1 Pc", price: 5 }, { label: "2 Pcs", price: 10 }, { label: "4 Pcs", price: 20 }] }
  ];

  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('sahooSweetsFavorites') || '[]'); } catch { return []; }
  });
  const [cartData, setCartData] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('sahooSweetsCart') || '[]'); } catch { return []; }
  });
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Account profile state
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sahooUserProfile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: "Krushna Chandra Sahoo", phone: "9078699528", email: "krushnachandrasahoo990@gmail.com", role: "Customer" };
  });
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [editEmail, setEditEmail] = useState(userProfile.email);

  // Address list state
  const [addressList, setAddressList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('sahooAddressList');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, name: "Krushna Sahoo", phone: "9078699528", address: "At/Po - Nagapur, Brahmagiri Road", city: "Puri", state: "Odisha", pin: "752001", isDefault: true }
    ];
  });

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddr, setNewAddr] = useState('');
  const [newCity, setNewCity] = useState('Puri');
  const [newState, setNewState] = useState('Odisha');
  const [newPin, setNewPin] = useState('752001');

  // Past orders with interactive timeline tracker & detail modal state
  const [pastOrders, setPastOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('sahooPastOrders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { 
        id: "SS-1084", 
        date: "Nov 13, 2026", 
        items: "Pahala Style Rosgola (1 Kg), Bara (4 Pcs)", 
        total: 370, 
        statusIndex: 3, 
        steps: ["Order Confirmed", "Placed", "Shipped", "Out for Delivery", "Delivered"],
        payment: "Cash on Delivery",
        address: "At/Po - Nagapur, Brahmagiri Road, Puri, Odisha - 752001"
      }
    ];
  });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  const defaultAddrObj = addressList.find((a: any) => a?.isDefault) || addressList[0];
  const currentHeaderAddressString = defaultAddrObj ? `${defaultAddrObj.address}, ${defaultAddrObj.city} - ${defaultAddrObj.pin}` : "At/Po - Nagapur, Puri - 752001";

  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: number}>(() => {
    const init: {[key: string]: number} = {};
    allProducts.forEach(p => init[p.id] = 0);
    return init;
  });

  const [activePanel, setActivePanel] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('sahooSweetsFavorites', JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  useEffect(() => {
    try { localStorage.setItem('sahooSweetsCart', JSON.stringify(cartData)); } catch {}
  }, [cartData]);

  useEffect(() => {
    try { localStorage.setItem('sahooAddressList', JSON.stringify(addressList)); } catch {}
  }, [addressList]);

  useEffect(() => {
    try { localStorage.setItem('sahooUserProfile', JSON.stringify(userProfile)); } catch {}
  }, [userProfile]);

  useEffect(() => {
    try { localStorage.setItem('sahooPastOrders', JSON.stringify(pastOrders)); } catch {}
  }, [pastOrders]);

  const handleVariantChange = (id: string, index: number) => {
    setSelectedVariants((prev: {[key: string]: number}) => ({ ...prev, [id]: index }));
  };

  const addToCartFromItem = (item: any) => {
    const vIndex = selectedVariants[item.id] || 0;
    const variant = item.variants && item.variants[vIndex] ? item.variants[vIndex] : { label: 'Standard', price: 10 };
    const key = `${item.name} (${variant.label})`;

    setCartData((prev: any[]) => {
      const existing = prev.find((c: any) => c.name === key);
      if (existing) {
        return prev.map((c: any) => c.name === key ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { id: item.id, name: key, price: variant.price, qty: 1, img: item.img }];
    });
  };

  const updateCartQtyByKey = (key: string, delta: number) => {
    setCartData((prev: any[]) => {
      return prev.map((c: any) => {
        if (c.name === key) {
          const newQty = c.qty + delta;
          return newQty > 0 ? { ...c, qty: newQty } : null;
        }
        return c;
      }).filter(Boolean);
    });
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev: string[]) => prev.includes(id) ? prev.filter((f: string) => f !== id) : [...prev, id]);
  };

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newAddr || !newPin) {
      alert('Please fill all required address fields.');
      return;
    }
    const newObj = {
      id: Date.now(),
      name: newName,
      phone: newPhone,
      address: newAddr,
      city: newCity,
      state: newState,
      pin: newPin,
      isDefault: addressList.length === 0
    };
    setAddressList((prev: any[]) => [...prev, newObj]);
    setNewName(''); setNewPhone(''); setNewAddr('');
    setShowAddAddressModal(false);
    alert('Address added successfully!');
  };

  const setDefaultAddress = (id: number) => {
    setAddressList((prev: any[]) => prev.map((item: any) => ({
      ...item,
      isDefault: item.id === id
    })));
  };

  const deleteAddress = (id: number) => {
    if (addressList.length <= 1) {
      alert('You must keep at least one delivery address.');
      return;
    }
    const filtered = addressList.filter((a: any) => a.id !== id);
    if (!filtered.some((a: any) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    setAddressList(filtered);
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev: any) => ({ ...prev, name: editName, phone: editPhone, email: editEmail }));
    setIsEditingAccount(false);
    alert('Account details updated successfully!');
  };

  const cancelOrder = (orderId: string) => {
    setPastOrders((prev: any[]) => prev.map((o: any) => o.id === orderId ? { ...o, statusIndex: -1 } : o));
  };

  const filteredProducts = allProducts.filter(item => {
    if (currentFilter === 'favorites' && !favorites.includes(item.id)) return false;
    if (currentFilter !== 'all' && currentFilter !== 'favorites') {
      if (item.category !== currentFilter) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      if (term === 'sweets' || term === 'sweet' || term === 'mitha') {
        return item.category === 'sweets';
      }
      return item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term);
    }
    return true;
  });

  const totalCartCount = cartData.reduce((sum: number, item: any) => sum + item.qty, 0);
  const totalCartAmount = cartData.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
  
  const discountAmount = totalCartAmount >= 5000 ? 50 : 0;
  const finalPayable = Math.max(0, totalCartAmount - discountAmount);

  const handleCheckout = () => {
    if (cartData.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const newOrder = {
      id: `SS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: "Today, 2026",
      items: cartData.map((c: any) => `${c.name} (x${c.qty})`).join(', '),
      total: finalPayable,
      statusIndex: 1, 
      steps: ["Order Confirmed", "Placed", "Shipped", "Out for Delivery", "Delivered"],
      payment: paymentMethod,
      address: currentHeaderAddressString
    };
    
    setPastOrders((prev: any[]) => [newOrder, ...(Array.isArray(prev) ? prev : [])]);
    setCartData([]);
    setOrderPlacedSuccess(true);
    
    setTimeout(() => {
      setOrderPlacedSuccess(false);
      setIsCartOpen(false);
      setActivePanel('orders'); 
    }, 2000);
  };

  return (
    <div className="font-sans h-screen flex flex-col justify-between overflow-hidden selection:bg-orange-500 selection:text-white" style={{ backgroundColor: '#f2c983' }}>

      <div className="flex flex-1 overflow-hidden relative">

        <aside id="astraSidebar" className={`bg-[#0f1319] text-gray-300 flex flex-col justify-between relative z-40 shrink-0 select-none shadow-2xl border-r border-gray-800 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="absolute -right-3.5 top-7 z-50 w-7 h-7 rounded-full bg-[#232936] text-gray-200 border border-gray-700 flex items-center justify-center shadow-lg transition cursor-pointer"
            title="Collapse / Expand Sidebar"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <div className="p-3.5 space-y-4 flex-1 overflow-y-auto">
            <div className="flex items-center space-x-3 px-2 pt-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md shrink-0" style={{ backgroundColor: '#c2b767' }}>SS</div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="font-black text-base tracking-tight text-white leading-none truncate" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.5px' }}>SAHOO SWEETS</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5" style={{ color: '#f2c983' }}>Puri, Odisha</span>
                </div>
              )}
            </div>

            <div className="flex items-center bg-[#191f28] border border-gray-800 rounded-xl px-3 py-2 cursor-pointer transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              {!isSidebarCollapsed && <input type="text" placeholder="Search Samosa, Rosgola..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setActivePanel('dashboard'); }} className="bg-transparent text-xs text-gray-200 placeholder-gray-500 focus:outline-none ml-2.5 w-full" />}
            </div>

            <div className="space-y-1">
              {!isSidebarCollapsed && <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2.5 mb-1.5">Main Menu</p>}
              {[
                { id: 'dashboard', label: 'Dashboard (Menu)', icon: LayoutGrid, color: 'text-amber-500' },
                { id: 'orders', label: 'Past Orders & Track', icon: Truck, color: 'text-emerald-400' },
                { id: 'payments', label: 'Payment Modes', icon: Wallet },
                { id: 'refunds', label: 'My Refunds', icon: RotateCcw },
                { id: 'money', label: 'Sahoo Money', icon: Coins },
                { id: 'statements', label: 'Account Statements', icon: FileText },
                { id: 'rewards', label: 'Partner Rewards', icon: Crown, color: 'text-amber-400' }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setActivePanel(item.id); if(item.id === 'dashboard') setCurrentFilter('all'); }} 
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activePanel === item.id ? 'bg-[#232936] text-white font-bold' : 'text-gray-400'}`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${item.color || ''}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-800 bg-[#0b0e13] space-y-1">
            <button 
              onClick={() => setActivePanel('account')} 
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activePanel === 'account' ? 'bg-[#232936] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <User className="w-4 h-4 shrink-0 text-amber-400" />
              {!isSidebarCollapsed && <span className="truncate">My Account</span>}
            </button>

            <button 
              onClick={() => setActivePanel('address')} 
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activePanel === 'address' ? 'bg-[#232936] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
              {!isSidebarCollapsed && <span className="truncate">Saved Addresses</span>}
            </button>

            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }} 
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-full overflow-y-auto relative bg-white">
          
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b px-4 sm:px-8 h-20 flex items-center justify-between gap-3 shrink-0" style={{ borderColor: '#BBAB47' }}>
            <div onClick={() => setIsLocationOpen(true)} className="flex flex-col cursor-pointer group">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase leading-none" style={{ color: '#c2b767', fontFamily: 'Georgia, serif', textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.1)' }}>SAHOO SWEETS</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider" style={{ backgroundColor: '#f2c983', color: '#c2b767' }}>Sweets & Snacks Hub</span>
              </div>
              <div className="flex items-center text-xs font-semibold text-gray-600 transition mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" style={{ color: '#c2b767' }} />
                <span className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{currentHeaderAddressString}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1 shrink-0" style={{ color: '#c2b767' }} />
              </div>
            </div>

            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <input type="text" placeholder="Search Samosa, Rosgola, Sweets..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setActivePanel('dashboard'); }} className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-100 text-xs font-medium focus:outline-none focus:bg-white border border-transparent transition" />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <nav className="flex items-center space-x-3 text-sm font-semibold text-gray-600">
              <button onClick={() => { setActivePanel('dashboard'); setCurrentFilter('favorites'); }} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 transition cursor-pointer">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span className="text-xs font-bold hidden md:inline">Favorites ({favorites.length})</span>
              </button>

              <button onClick={() => setIsCartOpen(true)} className="relative flex items-center space-x-2 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm hover:opacity-90" style={{ backgroundColor: '#c2b767', color: '#fff' }}>
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-black">Cart</span>
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </nav>
          </header>

          <main className="flex-1 px-4 sm:px-8 py-6 overflow-y-auto">

            {activePanel === 'dashboard' && (
              <div className="space-y-10 pb-16">
                
                {currentFilter !== 'favorites' && (
                  <section className="rounded-3xl p-6 sm:p-10 border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8" style={{ backgroundColor: '#f2c98330', borderColor: '#BBAB47' }}>
                    <div className="space-y-4 max-w-xl text-center lg:text-left">
                      <span className="px-3 py-1 text-xs font-black rounded-xl uppercase tracking-wider border" style={{ backgroundColor: '#f2c983', color: '#c2b767', borderColor: '#BBAB47' }}>Puri’s Finest Sweet & Snack Hub</span>
                      <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        Taste the <br /><span style={{ color: '#c2b767' }}>Tradition...</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                        Freshly made Rosogolla, Chhena Podo, Bara & Traditional Snacks delivered fresh to your doorstep in Puri.
                      </p>
                      <div className="flex items-center justify-center lg:justify-start space-x-3">
                        <button onClick={() => { const el = document.getElementById('menuItemsSection'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="px-6 py-3 text-white font-black text-xs rounded-2xl shadow-lg transition active:scale-95 cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
                          Order Now
                        </button>
                        <button onClick={() => setActivePanel('orders')} className="px-5 py-3 font-black text-xs rounded-2xl border transition cursor-pointer" style={{ borderColor: '#c2b767', color: '#c2b767' }}>
                          Track Past Orders
                        </button>
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                      <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" alt="Odisha Sweets & Thali" className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition duration-500" />
                    </div>
                  </section>
                )}

                {currentFilter !== 'favorites' && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Our Special Categories</h2>
                        <p className="text-xs font-medium" style={{ color: '#BBAB47' }}>Select category to explore pure traditional items</p>
                      </div>
                      <button onClick={() => setCurrentFilter('all')} className="text-xs font-extrabold px-3 py-1.5 rounded-xl border transition cursor-pointer" style={{ color: '#c2b767', backgroundColor: '#f2c98330', borderColor: '#BBAB47' }}>View All Items</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div onClick={() => { setCurrentFilter('sweets'); document.getElementById('menuItemsSection')?.scrollIntoView({ behavior: 'smooth' }); }} className="p-5 sm:p-6 rounded-3xl bg-white border-2 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between group" style={{ borderColor: '#f2c983' }}>
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 text-[10px] font-black rounded-lg uppercase tracking-wide" style={{ backgroundColor: '#f2c983', color: '#c2b767' }}>Pure Desi Ghee</span>
                          <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-amber-600 transition">Sweets (ମିଠା)</h3>
                          <p className="text-xs text-gray-500 font-medium">Rosgola, Cheese Cake, Jilapi, Malpua, Ladu & more</p>
                          <span className="inline-flex items-center text-xs font-bold pt-2 group-hover:translate-x-1 transition-transform" style={{ color: '#c2b767' }}>Show Sweets <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
                        </div>
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 border" style={{ borderColor: '#BBAB47' }}>
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtwZakNUCDCTGm30bOrOk45IbALQwlXluQBXtq3uCQ-w&s=10" alt="Sweets" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div onClick={() => { setCurrentFilter('breakfast'); document.getElementById('menuItemsSection')?.scrollIntoView({ behavior: 'smooth' }); }} className="p-5 sm:p-6 rounded-3xl bg-white border-2 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between group" style={{ borderColor: '#f2c983' }}>
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg uppercase tracking-wide">Morning & Evening</span>
                          <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-amber-600 transition">Breakfast / Evening Hub</h3>
                          <p className="text-xs font-bold" style={{ color: '#c2b767' }}>(Snacks Item)</p>
                          <p className="text-xs text-gray-500 font-medium">Dalma, Bara, Gulugula, Dahi Bara, Puri, Ghuguni & more</p>
                          <span className="inline-flex items-center text-xs font-bold pt-2 group-hover:translate-x-1 transition-transform" style={{ color: '#c2b767' }}>Show Breakfast <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
                        </div>
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 border" style={{ borderColor: '#BBAB47' }}>
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKmTSG3K7RgZQuGVNi3fjnhC8GiA84PsYpyNFKNKHfyEWN_t8QbTDTeqK&s=10" alt="Breakfast" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                <section id="menuItemsSection">
                  <div className="flex items-center justify-between mb-6 border-b pb-3" style={{ borderColor: '#BBAB47' }}>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {currentFilter === 'favorites' ? 'My Favorite Items ❤️' : currentFilter === 'sweets' ? 'Sweets Menu (ମିଠା)' : currentFilter === 'breakfast' ? 'Breakfast & Snacks Hub' : searchTerm ? `Search Results for "${searchTerm}"` : 'All Special Menu Items'}
                    </h2>
                    <button onClick={() => { setCurrentFilter('all'); setSearchTerm(''); }} className="text-xs font-bold px-3 py-1 rounded-xl border cursor-pointer" style={{ color: '#c2b767', backgroundColor: '#f2c98330', borderColor: '#BBAB47' }}>
                      View All Items ({allProducts.length})
                    </button>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-3xl border border-orange-100 shadow-sm">
                      <h4 className="text-base font-black text-gray-800">No items found!</h4>
                      <p className="text-xs text-gray-500 mt-1">Try checking your spelling or clearing filters</p>
                      <button onClick={() => { setCurrentFilter('all'); setSearchTerm(''); }} className="mt-4 px-5 py-2.5 text-white rounded-xl text-xs font-black cursor-pointer shadow" style={{ backgroundColor: '#c2b767' }}>Show Full Menu</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map(item => {
                        const vIndex = selectedVariants[item.id] || 0;
                        const variant = item.variants && item.variants[vIndex] ? item.variants[vIndex] : { label: 'Standard', price: 10 };
                        const key = `${item.name} (${variant.label})`;
                        const inCart = cartData.find(c => c.name === key);
                        const qty = inCart ? inCart.qty : 0;
                        const isFav = favorites.includes(item.id);

                        return (
                          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col justify-between group relative" style={{ borderColor: '#f2c983' }}>
                            <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                              <div className="w-4 h-4 border-2 border-emerald-600 p-0.5 rounded-sm bg-white/95 shadow-sm flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-emerald-600"></div></div>
                              <span className="text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow" style={{ backgroundColor: '#c2b767' }}>{item.badge}</span>
                            </div>

                            <button onClick={(e) => toggleFavorite(e, item.id)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition cursor-pointer">
                              <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                            </button>

                            <div onClick={() => setModalProduct(item)} className="relative h-48 overflow-hidden cursor-pointer">
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-xl shadow flex items-center space-x-1">
                                <span className="text-amber-500">★</span><span>{item.rating}</span><span className="text-[9px] text-gray-500">({item.reviews})</span>
                              </span>
                              <span className="absolute bottom-3 right-3 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow" style={{ backgroundColor: '#c2b767' }}>₹{variant.price}</span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div onClick={() => setModalProduct(item)} className="cursor-pointer">
                                  <h3 className="font-extrabold text-gray-900 text-base transition truncate" style={{ color: '#232936' }}>{item.name}</h3>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.desc}</p>
                                </div>
                                <div className="mt-3">
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Portion / Weight:</label>
                                  <select value={vIndex} onChange={e => handleVariantChange(item.id, parseInt(e.target.value))} className="w-full px-2.5 py-1.5 border rounded-xl text-xs font-bold text-gray-800 focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }}>
                                    {item.variants && item.variants.map((v: any, idx: number) => <option key={idx} value={idx}>{v.label} - ₹{v.price}</option>)}
                                  </select>
                                </div>
                              </div>

                              <div className="mt-4">
                                {qty === 0 ? (
                                  <button onClick={() => addToCartFromItem(item)} className="w-full py-2.5 font-extrabold text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-center space-x-1" style={{ backgroundColor: '#f2c98330', borderColor: '#BBAB47', color: '#c2b767' }}>
                                    <span>ADD TO CART</span><Plus className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <div className="w-full py-1.5 text-white font-black text-xs rounded-xl flex items-center justify-between px-3 shadow-md" style={{ backgroundColor: '#c2b767' }}>
                                    <button onClick={() => updateCartQtyByKey(key, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer">-</button>
                                    <span>{qty}</span>
                                    <button onClick={() => updateCartQtyByKey(key, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer">+</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* PAST ORDERS & LIVE TIMELINE TRACKER PANEL */}
            {activePanel === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border max-w-2xl mx-auto space-y-6 my-6" style={{ borderColor: '#BBAB47' }}>
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#BBAB47' }}>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Live Order Tracking</h2>
                    <p className="text-xs text-gray-500">Track your order progress step-by-step from confirmation to doorstep delivery</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {Array.isArray(pastOrders) && pastOrders.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <p className="text-xs font-bold">No past orders found.</p>
                    </div>
                  ) : (
                    Array.isArray(pastOrders) && pastOrders.map((order: any) => {
                      if (!order) return null;
                      const stepsList = Array.isArray(order.steps) ? order.steps : ["Order Confirmed", "Placed", "Shipped", "Out for Delivery", "Delivered"];
                      const currentIdx = typeof order.statusIndex === 'number' ? order.statusIndex : 1;

                      return (
                        <div key={order.id || Math.random()} className="p-5 rounded-2xl border-2 bg-amber-50/20 space-y-4" style={{ borderColor: '#BBAB47' }}>
                          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: '#BBAB47' }}>
                            <div>
                              <h4 className="text-xs font-black text-gray-900">Order ID: {order.id || "SS-1000"}</h4>
                              <p className="text-[10px] text-gray-500">{order.date || "Today"}</p>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${currentIdx === 4 ? 'bg-emerald-100 text-emerald-800' : currentIdx === -1 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                              {currentIdx === -1 ? 'Cancelled' : (stepsList[currentIdx] || 'Processing')}
                            </span>
                          </div>

                          <p className="text-xs font-extrabold text-gray-800">{order.items || "Sahoo Sweets Items"}</p>

                          {currentIdx !== -1 && (
                            <div className="py-3 px-2 bg-white rounded-xl border border-amber-200">
                              <div className="flex items-center justify-between relative px-2">
                                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
                                {stepsList.map((stepName: string, sIdx: number) => {
                                  const isCompleted = sIdx <= currentIdx;
                                  const isCurrent = sIdx === currentIdx;
                                  return (
                                    <div key={sIdx} className="relative z-10 flex flex-col items-center">
                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shadow transition-all duration-300 ${isCompleted ? 'text-white' : 'bg-gray-200 text-gray-500'} ${isCurrent ? 'ring-4 ring-amber-200 scale-110' : ''}`} style={{ backgroundColor: isCompleted ? '#c2b767' : undefined }}>
                                        {isCompleted ? '✓' : sIdx + 1}
                                      </div>
                                      <span className={`text-[9px] font-black mt-1.5 text-center max-w-[65px] ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{stepName}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-dashed" style={{ borderColor: '#BBAB47' }}>
                            <span className="font-bold text-gray-600">Total Paid: ₹{order.total || 0}</span>
                            <div className="flex items-center space-x-2">
                              <button onClick={() => setSelectedOrderDetails(order)} className="px-3 py-1.5 text-white font-bold text-[11px] rounded-xl transition cursor-pointer flex items-center space-x-1" style={{ backgroundColor: '#c2b767' }}>
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Details</span>
                              </button>
                              {currentIdx < 4 && currentIdx !== -1 && (
                                <button onClick={() => cancelOrder(order.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 font-bold text-[11px] rounded-xl hover:bg-rose-100 transition cursor-pointer flex items-center space-x-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Cancel</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* MY ACCOUNT PANEL */}
            {activePanel === 'account' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border max-w-xl mx-auto space-y-6 my-6" style={{ borderColor: '#BBAB47' }}>
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#BBAB47' }}>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">My Account Profile</h2>
                    <p className="text-xs text-gray-500">View and update your personal information and mobile number</p>
                  </div>
                </div>

                {!isEditingAccount ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50/50 rounded-2xl border space-y-2" style={{ borderColor: '#BBAB47' }}>
                      <p className="text-xs font-bold text-gray-500 uppercase">Full Name</p>
                      <p className="text-sm font-black text-gray-900">{userProfile.name}</p>
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-2xl border space-y-2" style={{ borderColor: '#BBAB47' }}>
                      <p className="text-xs font-bold text-gray-500 uppercase">Phone Number</p>
                      <p className="text-sm font-black text-gray-900">+91 {userProfile.phone}</p>
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-2xl border space-y-2" style={{ borderColor: '#BBAB47' }}>
                      <p className="text-xs font-bold text-gray-500 uppercase">Email ID</p>
                      <p className="text-sm font-black text-gray-900">{userProfile.email}</p>
                    </div>
                    <button onClick={() => setIsEditingAccount(true)} className="w-full py-3 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center justify-center space-x-1.5" style={{ backgroundColor: '#c2b767' }}>
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Account & Phone Number</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateAccount} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase mb-1">Full Name</label>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold bg-white" style={{ borderColor: '#BBAB47' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase mb-1">Mobile Number (10 Digits)</label>
                      <input type="tel" maxLength={10} value={editPhone} onChange={e => setEditPhone(e.target.value)} required className="w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold bg-white" style={{ borderColor: '#BBAB47' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase mb-1">Email ID</label>
                      <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required className="w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold bg-white" style={{ borderColor: '#BBAB47' }} />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button type="submit" className="flex-1 py-3 text-white font-black text-xs rounded-xl shadow cursor-pointer" style={{ backgroundColor: '#c2b767' }}>Save Changes</button>
                      <button type="button" onClick={() => setIsEditingAccount(false)} className="px-5 py-3 border font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ADDRESS MANAGEMENT PANEL */}
            {activePanel === 'address' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border max-w-2xl mx-auto space-y-6 my-6" style={{ borderColor: '#BBAB47' }}>
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#BBAB47' }}>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Manage Delivery Addresses</h2>
                    <p className="text-xs text-gray-500">Add multiple addresses and set your default delivery location</p>
                  </div>
                  <button onClick={() => setShowAddAddressModal(true)} className="px-4 py-2 text-white font-black text-xs rounded-xl shadow cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
                    + Add New Address
                  </button>
                </div>

                {showAddAddressModal && (
                  <form onSubmit={handleAddNewAddressSubmit} className="space-y-3 bg-amber-50/60 p-5 rounded-2xl border border-amber-300">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-gray-900 uppercase">Add New Delivery Address</h4>
                      <button type="button" onClick={() => setShowAddAddressModal(false)} className="text-gray-500 font-bold hover:text-black">✕</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} required className="px-3 py-2 border rounded-xl text-xs bg-white" style={{ borderColor: '#BBAB47' }} />
                      <input type="tel" maxLength={10} placeholder="Mobile Number" value={newPhone} onChange={e => setNewPhone(e.target.value)} required className="px-3 py-2 border rounded-xl text-xs bg-white" style={{ borderColor: '#BBAB47' }} />
                    </div>
                    <input type="text" placeholder="Street Address / House No / Landmark" value={newAddr} onChange={e => setNewAddr(e.target.value)} required className="w-full px-3 py-2 border rounded-xl text-xs bg-white" style={{ borderColor: '#BBAB47' }} />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" placeholder="City" value={newCity} onChange={e => setNewCity(e.target.value)} required className="px-3 py-2 border rounded-xl text-xs bg-white" style={{ borderColor: '#BBAB47' }} />
                      <input type="text" placeholder="State" value={newState} onChange={e => setNewState(e.target.value)} required className="px-3 py-2 border rounded-xl text-xs bg-white" style={{ borderColor: '#BBAB47' }} />
                      <input type="text" maxLength={6} placeholder="PIN Code" value={newPin} onChange={e => setNewPin(e.target.value)} required className="px-3 py-2 border rounded-xl text-xs bg-white" style={{ borderColor: '#BBAB47' }} />
                    </div>
                    <button type="submit" className="w-full py-2.5 text-white font-black text-xs rounded-xl shadow cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
                      Save & Deliver Here
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-gray-500">Saved Addresses ({addressList.length})</h4>
                  {addressList.map((addr: any) => (
                    <div key={addr.id} className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${addr.isDefault ? 'bg-amber-50/50 border-orange-500 shadow-sm' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start space-x-3">
                        <Home className="w-5 h-5 mt-0.5 shrink-0 text-amber-700" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-black text-gray-900">{addr.name}</h4>
                            <span className="text-[10px] font-bold text-gray-500">({addr.phone})</span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-black uppercase text-white px-2 py-0.5 rounded shadow-sm" style={{ backgroundColor: '#c2b767' }}>DEFAULT</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pin}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        {!addr.isDefault && (
                          <button onClick={() => setDefaultAddress(addr.id)} className="px-3 py-1.5 rounded-lg border text-[11px] font-bold text-gray-700 hover:bg-gray-100 cursor-pointer" style={{ borderColor: '#BBAB47' }}>
                            Set as Default
                          </button>
                        )}
                        <button onClick={() => deleteAddress(addr.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer" title="Delete Address">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABOUT US PANEL */}
            {activePanel === 'about' && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border max-w-3xl mx-auto space-y-8 my-6" style={{ borderColor: '#BBAB47' }}>
                <div className="flex items-center space-x-3 border-b pb-4" style={{ borderColor: '#BBAB47' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow" style={{ backgroundColor: '#c2b767' }}>
                    <BookOpen className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>About Sahoo Sweets & Help</h2>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c2b767' }}>Our Heritage, History & Customer Support</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  <p>
                    Founded decades ago in the sacred land of Puri, **Sahoo Sweets** (At/Po - Nagapur) has been a beloved destination for authentic traditional sweets, pure desi ghee delicacies, and morning breakfast favorites.
                  </p>
                  <p>
                    Our founder, Krushna Chandra Sahoo, envisioned a place where every sweet carries the warmth of traditional Odia culture. From our world-famous *Pahala Style Rosgolas* slow-boiled in aromatic chasni to our authentic *Chhena Podo* (Cheese Cake) baked with caramelized crusts, every item is crafted with uncompromising quality and purity.
                  </p>
                </div>

                <div className="border-t pt-6 space-y-3" style={{ borderColor: '#BBAB47' }}>
                  <h3 className="text-lg font-black text-gray-900 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-amber-600" /> Need Help with your Order?
                  </h3>
                  <p className="text-xs text-gray-600">Contact Krushna Chandra Sahoo directly through our support channels:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    <div className="p-3.5 rounded-xl border bg-amber-50/30 flex items-center space-x-2.5" style={{ borderColor: '#BBAB47' }}>
                      <PhoneCall className="w-4 h-4 shrink-0 text-black" />
                      <span className="text-black">+91 9078699528 (Phone/WhatsApp)</span>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-amber-50/30 flex items-center space-x-2.5" style={{ borderColor: '#BBAB47' }}>
                      <FileText className="w-4 h-4 shrink-0 text-black" />
                      <span className="text-black">krushnachandrasahoo990@gmail.com</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => setActivePanel('dashboard')} className="px-6 py-3 text-white font-black text-xs rounded-xl shadow cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
                  Explore Our Menu
                </button>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ORDER DETAILS POPUP MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border p-6 space-y-5 relative" style={{ borderColor: '#BBAB47' }}>
            <button onClick={() => setSelectedOrderDetails(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#BBAB47' }}>
              <div>
                <h3 className="text-lg font-black text-gray-900">Order Details - {selectedOrderDetails.id}</h3>
                <p className="text-[10px] text-gray-500">Placed on {selectedOrderDetails.date}</p>
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${selectedOrderDetails.statusIndex === 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {selectedOrderDetails.statusIndex === -1 ? 'Cancelled' : selectedOrderDetails.steps[selectedOrderDetails.statusIndex]}
              </span>
            </div>

            <div className="space-y-4 text-xs font-semibold text-gray-700">
              <div className="p-3 bg-amber-50/50 rounded-2xl border" style={{ borderColor: '#BBAB47' }}>
                <p className="font-black text-gray-900 uppercase text-[10px] mb-1">Ordered Items</p>
                <p className="font-extrabold text-orange-700">{selectedOrderDetails.items}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <p className="font-black text-gray-500 uppercase text-[9px]">Payment Method</p>
                  <p className="font-extrabold text-gray-900">💳 {selectedOrderDetails.payment || 'Cash on Delivery'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <p className="font-black text-gray-500 uppercase text-[9px]">Total Amount Paid</p>
                  <p className="font-black text-emerald-700 text-sm">₹{selectedOrderDetails.total}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                <p className="font-black text-gray-500 uppercase text-[9px]">Delivery Address</p>
                <p className="font-extrabold text-gray-900">📍 {selectedOrderDetails.address || currentHeaderAddressString}</p>
              </div>
            </div>

            <button onClick={() => setSelectedOrderDetails(null)} className="w-full py-3 text-white font-black text-xs rounded-xl shadow transition cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* POPUP CART MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border p-6 space-y-5 relative" style={{ borderColor: '#BBAB47' }}>
            <button onClick={() => setIsCartOpen(false)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#BBAB47' }}>
              <h3 className="text-lg font-black text-gray-900">My Order (Cart)</h3>
              <span className="text-xs font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">{totalCartCount} Items</span>
            </div>

            {orderPlacedSuccess ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-black text-gray-900">Order Placed Successfully!</h4>
                <p className="text-xs text-gray-500">Redirecting to Live Order Tracking...</p>
              </div>
            ) : cartData.length === 0 ? (
              <div className="py-16 text-center text-gray-400 space-y-2">
                <ShoppingBag className="w-12 h-12 mx-auto opacity-30 text-amber-700" />
                <p className="text-xs font-bold text-gray-500">Your cart is empty</p>
                <p className="text-[11px] text-gray-400">Add delicious sweets & snacks to start your order</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cartData.map((cItem: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-amber-50/40 p-3 rounded-2xl border border-amber-200">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <img src={cItem.img} alt={cItem.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-extrabold text-gray-900 truncate">{cItem.name}</h4>
                        <p className="text-xs font-black text-orange-600 mt-0.5">₹{cItem.price * cItem.qty}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-xl border border-gray-200 shrink-0">
                      <button onClick={() => updateCartQtyByKey(cItem.name, -1)} className="w-5 h-5 flex items-center justify-center font-black text-xs hover:bg-gray-100 rounded cursor-pointer">-</button>
                      <span className="text-xs font-black">{cItem.qty}</span>
                      <button onClick={() => updateCartQtyByKey(cItem.name, 1)} className="w-5 h-5 flex items-center justify-center font-black text-xs hover:bg-gray-100 rounded cursor-pointer">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!orderPlacedSuccess && cartData.length > 0 && (
              <div className="border-t pt-4 space-y-3" style={{ borderColor: '#BBAB47' }}>
                <div className="space-y-1.5 text-xs font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-bold text-gray-900">₹{totalCartAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Purchase Discount {totalCartAmount < 5000 ? '(Shop for ₹5000+ for ₹50 OFF)' : 'Applied (-₹50)'}</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-2" style={{ borderColor: '#BBAB47' }}>
                    <span>Final Payable Amount</span>
                    <span style={{ color: '#c2b767' }}>₹{finalPayable}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1.5">Payment Method</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Cash', 'UPI', 'E-Wallet'].map((m) => (
                      <button 
                        key={m} 
                        onClick={() => setPaymentMethod(m)} 
                        className={`py-1.5 text-[11px] font-black rounded-xl border transition cursor-pointer ${paymentMethod === m ? 'text-white shadow' : 'bg-gray-50 text-gray-700'}`}
                        style={{ backgroundColor: paymentMethod === m ? '#c2b767' : undefined, borderColor: '#BBAB47' }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleCheckout} 
                  className="w-full py-3.5 text-white font-black text-xs rounded-2xl shadow-xl transition cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: '#c2b767' }}
                >
                  Checkout / Place Order (₹{finalPayable})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOCATION SELECTOR MODAL */}
      {isLocationOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl p-6 text-center space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900">Select Delivery Address</h3>
            <p className="text-xs text-gray-500">Choose where you want your sweets & snacks delivered.</p>
            <div className="space-y-2 max-h-48 overflow-y-auto text-left">
              {addressList.map((addr: any) => (
                <div key={addr.id} onClick={() => { setDefaultAddress(addr.id); setIsLocationOpen(false); }} className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${addr.isDefault ? 'bg-amber-50 border-orange-500 text-orange-900' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'}`}>
                  <div className="flex justify-between">
                    <span>📍 {addr.address}, {addr.city} - {addr.pin}</span>
                    {addr.isDefault && <span className="text-[9px] font-black text-amber-800">DEFAULT</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button onClick={() => { setIsLocationOpen(false); setActivePanel('address'); }} className="w-full py-3 text-white rounded-2xl text-xs font-black shadow cursor-pointer" style={{ backgroundColor: '#c2b767' }}>
                + Add / Manage Addresses
              </button>
              <button onClick={() => setIsLocationOpen(false)} className="w-full py-2 text-gray-600 text-xs font-bold hover:bg-gray-100 rounded-2xl cursor-pointer mt-1">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border relative" style={{ borderColor: '#BBAB47' }}>
            <button onClick={() => setModalProduct(null)} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
              <img src={modalProduct.img} alt={modalProduct.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-black uppercase text-white shadow" style={{ backgroundColor: '#c2b767' }}>{modalProduct.badge}</span>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <h3 className="text-2xl font-black drop-shadow">{modalProduct.name}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About This Item</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed font-medium">{modalProduct.desc}</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Select Portion / Weight:</label>
                <select value={selectedVariants[modalProduct.id] || 0} onChange={e => handleVariantChange(modalProduct.id, parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-gray-800 focus:outline-none" style={{ backgroundColor: '#f2c98320', borderColor: '#BBAB47' }}>
                  {modalProduct.variants && modalProduct.variants.map((v: any, idx: number) => <option key={idx} value={idx}>{v.label} - ₹{v.price}</option>)}
                </select>
              </div>
              <div className="border-t border-dashed pt-4 flex items-center justify-between" style={{ borderColor: '#BBAB47' }}>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase">Price</p>
                  <p className="text-2xl font-black" style={{ color: '#c2b767' }}>₹{modalProduct.variants[selectedVariants[modalProduct.id] || 0].price}</p>
                </div>
                <button onClick={() => { addToCartFromItem(modalProduct); setModalProduct(null); }} className="px-6 py-3 text-white font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center space-x-2" style={{ backgroundColor: '#c2b767' }}>
                  <ShoppingBag className="w-4 h-4" /><span>ADD TO CART</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}