import React, { useState, useEffect } from 'react';
import { 
  Search, LayoutGrid, MapPin, Wallet, RotateCcw, Coins, Heart, 
  FileText, Crown, Star, Settings, HelpCircle, LogOut, ChevronDown, 
  ChevronLeft, ArrowRight, ShoppingBag, X, Plus, CheckCircle2, PhoneCall, Home, CreditCard, Banknote, Download 
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

  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('sahooSweetsFavorites') || '[]'));
  const [cartData, setCartData] = useState<any[]>(() => JSON.parse(localStorage.getItem('sahooSweetsCart') || '[]'));
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: number}>(() => {
    const init: {[key: string]: number} = {};
    allProducts.forEach(p => init[p.id] = 0);
    return init;
  });

  const [activePanel, setActivePanel] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  const [rating, setRating] = useState(4);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sahooSweetsFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('sahooSweetsCart', JSON.stringify(cartData));
  }, [cartData]);

  const handleVariantChange = (id: string, index: number) => {
    setSelectedVariants(prev => ({ ...prev, [id]: index }));
  };

  const addToCart = (item: any) => {
    const vIndex = selectedVariants[item.id] || 0;
    const variant = item.variants[vIndex];
    const key = `${item.name} (${variant.label})`;

    setCartData(prev => {
      const existing = prev.find(c => c.name === key);
      if (existing) {
        return prev.map(c => c.name === key ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { name: key, price: variant.price, qty: 1, img: item.img }];
    });
  };

  const updateCartQty = (item: any, delta: number) => {
    const vIndex = selectedVariants[item.id] || 0;
    const variant = item.variants[vIndex];
    const key = `${item.name} (${variant.label})`;

    setCartData(prev => {
      return prev.map(c => {
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
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredProducts = allProducts.filter(item => {
    if (currentFilter === 'favorites' && !favorites.includes(item.id)) return false;
    if (currentFilter !== 'all' && currentFilter !== 'favorites') {
      if (item.category !== currentFilter) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term);
    }
    return true;
  });

  const totalCartCount = cartData.reduce((sum, item) => sum + item.qty, 0);
  const totalCartAmount = cartData.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="font-sans h-screen flex overflow-hidden selection:bg-orange-500 selection:text-white" style={{ backgroundColor: '#f2c983' }}>

      {/* LEFT SIDEBAR */}
      <aside id="astraSidebar" className={`bg-[#0f1319] text-gray-300 flex flex-col justify-between relative z-40 shrink-0 select-none shadow-2xl border-r border-gray-800 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          className="absolute -right-3.5 top-7 z-50 w-7 h-7 rounded-full bg-[#232936] text-gray-200 border border-gray-700 flex items-center justify-center shadow-lg transition cursor-pointer"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="p-3.5 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-3 px-2 pt-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md shrink-0" style={{ backgroundColor: '#BE6B59' }}>SS</div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-black text-base tracking-tight text-white leading-none truncate">SAHOO SWEETS</span>
                <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5" style={{ color: '#f2c983' }}>Puri, Odisha</span>
              </div>
            )}
          </div>

          <div onClick={() => setActivePanel('dashboard')} className="flex items-center bg-[#191f28] border border-gray-800 rounded-xl px-3 py-2 cursor-pointer transition">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            {!isSidebarCollapsed && <input type="text" placeholder="Search for anything..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent text-xs text-gray-200 placeholder-gray-500 focus:outline-none ml-2.5 w-full" />}
          </div>

          <div className="space-y-1">
            {!isSidebarCollapsed && <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2.5 mb-1.5">Main</p>}
            {[
              { id: 'dashboard', label: 'Dashboard (Menu)', icon: LayoutGrid, color: 'text-amber-500' },
              { id: 'address', label: 'Saved Address', icon: MapPin },
              { id: 'payments', label: 'Payment Modes', icon: Wallet },
              { id: 'refunds', label: 'My Refunds', icon: RotateCcw },
              { id: 'money', label: 'Sahoo Money', icon: Coins },
              { id: 'favorites', label: 'Favourites', icon: Heart, color: 'text-rose-500' },
              { id: 'statements', label: 'Account Statements', icon: FileText },
              { id: 'rewards', label: 'Partner Rewards', icon: Crown, color: 'text-amber-400' },
              { id: 'orders', label: 'Past Orders & Ratings', icon: Star, color: 'text-amber-400' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActivePanel(item.id); if (item.id === 'favorites') setCurrentFilter('favorites'); else if(item.id === 'dashboard') setCurrentFilter('all'); }} 
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${activePanel === item.id ? 'bg-[#232936] text-white font-bold' : 'text-gray-400'}`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${item.color || ''}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-white">
        
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b px-4 sm:px-8 h-20 flex items-center justify-between gap-3 shrink-0" style={{ borderColor: '#BBAB47' }}>
          <div onClick={() => setIsLocationOpen(true)} className="flex flex-col cursor-pointer group">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase leading-none" style={{ color: '#BE6B59' }}>SAHOO SWEETS</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider" style={{ backgroundColor: '#f2c983', color: '#BE6B59' }}>Sweets & Snacks Hub</span>
            </div>
            <div className="flex items-center text-xs font-semibold text-gray-600 transition mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" style={{ color: '#BE6B59' }} />
              <span className="font-bold text-gray-900">Nagapur</span>
              <span className="text-gray-500 ml-1 truncate max-w-[160px] sm:max-w-xs">, Near Punjab National Bank, Gop, Puri</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1 shrink-0" style={{ color: '#BE6B59' }} />
            </div>
          </div>

          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input type="text" placeholder="Search Rosgola, Dalma, Cheese Cake, Bara, Bundi..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-100 text-xs font-medium focus:outline-none focus:bg-white border border-transparent transition" />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <nav className="flex items-center space-x-3 text-sm font-semibold text-gray-600">
            <button onClick={() => { setActivePanel('dashboard'); setCurrentFilter('favorites'); }} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 transition cursor-pointer">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="text-xs font-bold hidden md:inline">Favorites ({favorites.length})</span>
            </button>
            <button onClick={() => setActivePanel('help')} className="px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer" style={{ borderColor: '#BBAB47', color: '#BE6B59', backgroundColor: '#f2c98320' }}>Help</button>
            <div className="relative flex items-center space-x-2 cursor-pointer transition" onClick={() => window.location.href='cart.html'}>
              <div className="relative p-2 rounded-xl" style={{ backgroundColor: '#f2c98340' }}>
                <ShoppingBag className="w-5 h-5" style={{ color: '#BE6B59' }} />
                <span className="absolute -top-1 -right-1 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow" style={{ backgroundColor: '#BE6B59' }}>{totalCartCount}</span>
              </div>
              <span className="hidden sm:inline font-bold">Cart</span>
            </div>
            <button onClick={() => setActivePanel('settings')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition cursor-pointer"><Settings className="w-5 h-5" /></button>
          </nav>
        </header>

        {/* CONTENT PANELS */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full pb-28">

          {activePanel === 'dashboard' && (
            <div className="space-y-10">
              
              {/* TOP BANNER */}
              <section className="rounded-3xl p-6 sm:p-10 border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8" style={{ backgroundColor: '#f2c98330', borderColor: '#BBAB47' }}>
                <div className="space-y-4 max-w-xl text-center lg:text-left">
                  <span className="px-3 py-1 text-xs font-black rounded-xl uppercase tracking-wider border" style={{ backgroundColor: '#f2c983', color: '#BE6B59', borderColor: '#BBAB47' }}>Puri’s Finest Sweet & Snack Hub</span>
                  <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">
                    Taste the <br /><span style={{ color: '#BE6B59' }}>Tradition...</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                    Freshly made Rosogolla, Chhena Podo, Bara & Traditional Snacks delivered fresh to your doorstep in Puri.
                  </p>
                  <div>
                    <button onClick={() => { const el = document.getElementById('menuItemsSection'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="px-6 py-3 text-white font-black text-xs rounded-2xl shadow-lg transition active:scale-95 cursor-pointer" style={{ backgroundColor: '#BE6B59' }}>
                      Order Now
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80" alt="Odisha Sweets & Thali" className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition duration-500" />
                </div>
              </section>

              {/* Special Categories */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Our Special Categories</h2>
                    <p className="text-xs font-medium" style={{ color: '#BBAB47' }}>Select category to explore pure traditional items</p>
                  </div>
                  <button onClick={() => setCurrentFilter('all')} className="text-xs font-extrabold px-3 py-1.5 rounded-xl border transition cursor-pointer" style={{ color: '#BE6B59', backgroundColor: '#f2c98330', borderColor: '#BBAB47' }}>View All Items</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Sweets Category Card */}
                  <div onClick={() => { setCurrentFilter('sweets'); document.getElementById('menuItemsSection')?.scrollIntoView({ behavior: 'smooth' }); }} className="p-5 sm:p-6 rounded-3xl bg-white border-2 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between group" style={{ borderColor: '#f2c983' }}>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 text-[10px] font-black rounded-lg uppercase tracking-wide" style={{ backgroundColor: '#f2c983', color: '#BE6B59' }}>Pure Desi Ghee</span>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-orange-600 transition">Sweets (ମିଠା)</h3>
                      <p className="text-xs text-gray-500 font-medium">Rosgola, Cheese Cake, Jilapi, Malpua, Ladu & more</p>
                      <span className="inline-flex items-center text-xs font-bold pt-2 group-hover:translate-x-1 transition-transform" style={{ color: '#BE6B59' }}>Show Sweets <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
                    </div>
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 border" style={{ borderColor: '#BBAB47' }}>
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtwZakNUCDCTGm30bOrOk45IbALQwlXluQBXtq3uCQ-w&s=10" alt="Sweets" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Breakfast / Snacks Category Card */}
                  <div onClick={() => { setCurrentFilter('breakfast'); document.getElementById('menuItemsSection')?.scrollIntoView({ behavior: 'smooth' }); }} className="p-5 sm:p-6 rounded-3xl bg-white border-2 hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between group" style={{ borderColor: '#f2c983' }}>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg uppercase tracking-wide">Morning & Evening</span>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-orange-600 transition">Breakfast / Evening Hub</h3>
                      <p className="text-xs font-bold" style={{ color: '#BE6B59' }}>(Snacks Item)</p>
                      <p className="text-xs text-gray-500 font-medium">Dalma, Bara, Gulugula, Dahi Bara, Puri, Ghuguni & more</p>
                      <span className="inline-flex items-center text-xs font-bold pt-2 group-hover:translate-x-1 transition-transform" style={{ color: '#BE6B59' }}>Show Breakfast <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
                    </div>
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 border" style={{ borderColor: '#BBAB47' }}>
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKmTSG3K7RgZQuGVNi3fjnhC8GiA84PsYpyNFKNKHfyEWN_t8QbTDTeqK&s=10" alt="Breakfast" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </section>

              <section id="menuItemsSection">
                <div className="flex items-center justify-between mb-6 border-b pb-3" style={{ borderColor: '#BBAB47' }}>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {currentFilter === 'favorites' ? 'My Favorite Items ❤️' : currentFilter === 'sweets' ? 'Sweets Menu (ମିଠା)' : currentFilter === 'breakfast' ? 'Breakfast & Snacks Hub' : 'All Special Menu Items'}
                  </h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-xl border" style={{ color: '#BE6B59', backgroundColor: '#f2c98330', borderColor: '#BBAB47' }}>{filteredProducts.length} Items Available</span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center">
                    <h4 className="text-base font-bold text-gray-700">Koi item nahi mila!</h4>
                    <button onClick={() => { setCurrentFilter('all'); setSearchTerm(''); }} className="mt-4 px-4 py-2 text-white rounded-xl text-xs font-bold cursor-pointer" style={{ backgroundColor: '#BE6B59' }}>Show All Menu</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(item => {
                      const vIndex = selectedVariants[item.id] || 0;
                      const variant = item.variants[vIndex];
                      const key = `${item.name} (${variant.label})`;
                      const inCart = cartData.find(c => c.name === key);
                      const qty = inCart ? inCart.qty : 0;
                      const isFav = favorites.includes(item.id);

                      return (
                        <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col justify-between group relative" style={{ borderColor: '#f2c983' }}>
                          <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                            <div className="w-4 h-4 border-2 border-emerald-600 p-0.5 rounded-sm bg-white/95 shadow-sm flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-emerald-600"></div></div>
                            <span className="text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow" style={{ backgroundColor: '#BE6B59' }}>{item.badge}</span>
                          </div>

                          <button onClick={(e) => toggleFavorite(e, item.id)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition cursor-pointer">
                            <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                          </button>

                          <div onClick={() => setModalProduct(item)} className="relative h-48 overflow-hidden cursor-pointer">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-xl shadow flex items-center space-x-1">
                              <span className="text-amber-500">★</span><span>{item.rating}</span><span className="text-[9px] text-gray-500">({item.reviews})</span>
                            </span>
                            <span className="absolute bottom-3 right-3 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow" style={{ backgroundColor: '#BE6B59' }}>₹{variant.price}</span>
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
                                  {item.variants.map((v: any, idx: number) => <option key={idx} value={idx}>{v.label} - ₹{v.price}</option>)}
                                </select>
                              </div>
                            </div>

                            <div className="mt-4">
                              {qty === 0 ? (
                                <button onClick={() => addToCart(item)} className="w-full py-2.5 font-extrabold text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-center space-x-1" style={{ backgroundColor: '#f2c98330', borderColor: '#BBAB47', color: '#BE6B59' }}>
                                  <span>ADD</span><Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <div className="w-full py-1.5 text-white font-black text-xs rounded-xl flex items-center justify-between px-3 shadow-md" style={{ backgroundColor: '#BE6B59' }}>
                                  <button onClick={() => updateCartQty(item, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer">-</button>
                                  <span>{qty}</span>
                                  <button onClick={() => updateCartQty(item, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer">+</button>
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

          {activePanel === 'address' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border max-w-2xl" style={{ borderColor: '#BBAB47' }}>
              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: '#BBAB47' }}>
                <div><h2 className="text-xl font-black text-gray-900">Saved Delivery Addresses</h2><p className="text-xs text-gray-500">Manage your delivery locations</p></div>
                <a href="address.html" className="px-4 py-2 text-white font-bold text-xs rounded-xl shadow transition" style={{ backgroundColor: '#BE6B59' }}>+ Add / Edit with GPS</a>
              </div>
              <div className="p-4 rounded-2xl border-2 bg-amber-50/40 flex items-start justify-between" style={{ borderColor: '#BE6B59' }}>
                <div className="flex items-start space-x-3">
                  <Home className="w-5 h-5 mt-0.5" style={{ color: '#BE6B59' }} />
                  <div>
                    <span className="text-[10px] font-black uppercase text-white px-2 py-0.5 rounded" style={{ backgroundColor: '#BE6B59' }}>HOME (DEFAULT)</span>
                    <h4 className="text-sm font-extrabold text-gray-900 mt-1">Nagapur, Near Punjab National Bank, Gop, Puri</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'help' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border max-w-2xl space-y-4" style={{ borderColor: '#BBAB47' }}>
              <h2 className="text-xl font-black text-gray-900 border-b pb-3" style={{ borderColor: '#BBAB47' }}>Help & Customer Support</h2>
              <p className="text-xs text-gray-600">Contact Sahoo Sweets customer support:</p>
              <div className="space-y-2 text-xs font-bold">
                <p className="p-3 rounded-xl border" style={{ backgroundColor: '#f2c98330', borderColor: '#BBAB47', color: '#BE6B59' }}>📞 Delivery Helpline: +91 8763332962</p>
                <p className="p-3 rounded-xl border" style={{ backgroundColor: '#f2c98330', borderColor: '#BBAB47', color: '#BE6B59' }}>📧 Email: noreply@sahoosweets.in</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FLOATING CART BAR */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-lg text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between z-40" style={{ backgroundColor: '#BE6B59' }}>
          <div>
            <p className="text-[11px] font-black uppercase text-amber-100">{totalCartCount} ITEM{totalCartCount > 1 ? 'S' : ''} ADDED</p>
            <p className="text-base font-black">₹{totalCartAmount} TOTAL</p>
          </div>
          <button onClick={() => window.location.href='cart.html'} className="bg-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg hover:bg-orange-50 transition cursor-pointer" style={{ color: '#BE6B59' }}>VIEW CART</button>
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
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-black uppercase text-white shadow" style={{ backgroundColor: '#BE6B59' }}>{modalProduct.badge}</span>
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
                  {modalProduct.variants.map((v: any, idx: number) => <option key={idx} value={idx}>{v.label} - ₹{v.price}</option>)}
                </select>
              </div>
              <div className="border-t border-dashed pt-4 flex items-center justify-between" style={{ borderColor: '#BBAB47' }}>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase">Price</p>
                  <p className="text-2xl font-black" style={{ color: '#BE6B59' }}>₹{modalProduct.variants[selectedVariants[modalProduct.id] || 0].price}</p>
                </div>
                <button onClick={() => { addToCart(modalProduct); setModalProduct(null); }} className="px-6 py-3 text-white font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center space-x-2" style={{ backgroundColor: '#BE6B59' }}>
                  <ShoppingBag className="w-4 h-4" /><span>ADD TO CART</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCATION MODAL */}
      {isLocationOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl p-6 text-center">
            <h3 className="text-lg font-extrabold text-gray-900">Select Your Location</h3>
            <div className="mt-6 space-y-2">
              <button onClick={() => setIsLocationOpen(false)} className="w-full py-3 text-white rounded-2xl text-xs font-black shadow cursor-pointer" style={{ backgroundColor: '#c2b767' }}>Use Precise GPS Location</button>
              <button onClick={() => setIsLocationOpen(false)} className="w-full py-2.5 text-gray-600 text-xs font-bold hover:bg-gray-100 rounded-2xl cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}