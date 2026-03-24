import { useContext, useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios'; // THÊM DÒNG NÀY ĐỂ GỌI API
import { AuthContext } from '../../features/auth/context/AuthContext'; 
import { useCartContext } from '../../features/cart/context/CartContext';

const API_BASE_URL = 'https://gundamstoreapi-gpd3fxemg8d3cpdt.eastasia-01.azurewebsites.net/';

const SimpleLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, totalItems, totalPrice, removeItem } = useCartContext();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // STATE MỚI ĐỂ LƯU DANH MỤC TỪ API
  const [categories, setCategories] = useState([]);
  
  const dropdownRef = useRef(null);

  // GỌI API LẤY DANH MỤC ĐỂ ĐỔ LÊN MENU
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        let fetchedData = res.data?.data || res.data;
        if (Array.isArray(fetchedData)) {
          setCategories(fetchedData);
        }
      } catch (error) {
        console.error("Không thể tải danh mục cho Menu:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isCartOpen || isNotifOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isCartOpen, isNotifOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 300);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans flex flex-col relative">
      
      {/* HEADER */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-gray-800 shadow-xl' : 'bg-black border-b border-gray-800'}`}>
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-2xl sm:text-[28px] font-black italic tracking-tighter text-white uppercase group-hover:text-blue-500 transition-colors duration-300">
              GUNDAM<span className="text-blue-500 border-b-[3px] border-blue-500 pb-[2px] ml-0.5">STORES</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-bold text-gray-300 uppercase tracking-widest h-full whitespace-nowrap flex-1 justify-center">
            <Link to="/" className="hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-blue-500">Trang chủ</Link>
            
            {/* SẢN PHẨM DROPDOWN MENU */}
            <div className="relative group h-full flex items-center cursor-pointer">
              <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-1 border-b-2 border-transparent group-hover:border-blue-500 h-full">
                Sản phẩm
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </Link>
              
              <div className="absolute top-full left-0 w-60 bg-[#141414] border border-gray-800 rounded-b-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <div className="py-2">
                  <Link to="/shop" className="block px-5 py-3 text-sm text-blue-400 hover:text-white hover:bg-blue-600/10 transition-all font-bold normal-case tracking-normal border-b border-gray-800">
                     Tất cả sản phẩm
                  </Link>
                  {/* MAP DANH MỤC TỪ DATABASE RA MENU */}
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <Link key={cat.id || cat.Id} to="/shop" className="block px-5 py-3 text-sm text-gray-400 hover:text-white hover:bg-blue-600/10 hover:border-l-2 hover:border-blue-500 transition-all font-semibold normal-case tracking-normal">
                        {cat.name || cat.Name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-5 py-3 text-sm text-gray-600 italic">Đang tải...</span>
                  )}
                </div>
              </div>
            </div>

            <Link to="/contact" className="hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-blue-500">Liên hệ</Link>

            <button onClick={() => toast.success('Tính năng mạng xã hội GunVerse đang được phát triển!', { icon: '🚀' })} className="hover:text-white transition-colors h-full flex items-center gap-1.5 group relative border-b-2 border-transparent hover:border-orange-500">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-black tracking-widest">GUNVERSE</span>
              <span className="absolute -top-3 -right-6 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">BETA</span>
            </button>
          </nav>

          <div className="flex items-center gap-4 xl:gap-5 flex-shrink-0">
            <form onSubmit={handleSearch} className="hidden md:flex relative group w-48 lg:w-64">
              <input type="text" placeholder="Tìm Gunpla..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#1a1a1a] border border-gray-700 text-sm text-white rounded-full pl-5 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-black transition-all shadow-inner"/>
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-500 transition-colors bg-[#1a1a1a] group-focus-within:bg-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </button>
            </form>

            <div className="h-5 w-px bg-gray-700 hidden lg:block"></div>

            <button onClick={() => setIsNotifOpen(true)} className="relative text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              <span className="absolute -top-1 -right-1 bg-blue-500 w-2 h-2 rounded-full border-2 border-black"></span>
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1 shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative z-50 ml-1" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-gray-600 hover:border-blue-400 transition-all">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#1f1f1f] border border-gray-700 rounded-xl shadow-2xl py-2 overflow-hidden animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-700 bg-[#141414]">
                      <p className="text-sm font-bold text-white line-clamp-1">{user.username}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-orange-400 hover:bg-gray-800 transition-colors border-b border-gray-700 flex-items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>Trang Quản Trị</Link>
                    )}
                    <button onClick={() => { setIsDropdownOpen(false); logout(); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <a href="https://hobbyjapan-social.vercel.app/auth/login" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full uppercase text-xs tracking-wider font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 ml-1 whitespace-nowrap">Đăng nhập</a>
            )}
          </div>
        </div>
      </header>

      {/* OVERLAY LÀM MỜ NỀN KHI MỞ DRAWER */}
      {(isCartOpen || isNotifOpen) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={() => { setIsCartOpen(false); setIsNotifOpen(false); }}></div>
      )}

      {/* DRAWER THÔNG BÁO */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-[#1a1a1a] shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-800 ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#141414]">
          <div className="flex items-center gap-2 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" /></svg>
            <h2 className="text-xl font-bold text-white">Thông báo</h2>
          </div>
          <button onClick={() => setIsNotifOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-start pt-20 bg-[#1f1f1f]">
          <p className="text-gray-300 text-[15px]">Chưa có thông báo nào.</p>
        </div>
      </div>

      {/* DRAWER GIỎ HÀNG */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#1a1a1a] shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-800 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#141414]">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500"><path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" /></svg>
            <h2 className="text-xl font-black">Giỏ Hàng</h2>
            <span className="bg-red-500 text-white text-[11px] px-2.5 py-1 rounded-full font-bold">{totalItems} món</span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#1f1f1f]">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-32 h-32 text-gray-700 mb-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5l6-6m0 6l-6-6" /></svg>
              <p className="text-xl font-black text-gray-300 mb-8">Giỏ hàng trống trơn!</p>
              <button onClick={() => { setIsCartOpen(false); navigate('/shop'); }} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-lg shadow-blue-500/20">Đi chọn món ngay</button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-[#141414] p-3 rounded-xl border border-gray-800 relative group">
                  <div className="w-20 h-20 bg-black rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-800 overflow-hidden">
                     {item.images && item.images.length > 0 ? (
                       <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain"/>
                     ) : (
                       <span className="text-[9px] text-gray-600">No Image</span>
                     )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-200 line-clamp-2 pr-6">{item.name}</h4>
                    <p className="text-red-400 font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                    <p className="text-gray-500 text-xs mt-1">SL: {item.quantity}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors bg-[#1a1a1a] p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-800 bg-[#141414]">
            <div className="flex justify-between items-center mb-5">
              <span className="text-gray-400 font-bold">Tổng tạm tính:</span>
              <span className="text-red-500 font-black text-xl">{formatPrice(totalPrice)}</span>
            </div>
            {user ? (
              <button onClick={() => { setIsCartOpen(false); navigate('/cart'); }} className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-lg active:scale-95">Xem chi tiết Giỏ hàng</button>
            ) : (
              <a href="https://hobbyjapan-social.vercel.app/auth/login" className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-lg active:scale-95">Đăng nhập để Thanh toán</a>
            )}
          </div>
        )}
      </div>

      <main className="flex-grow w-full animate-fade-in-up flex flex-col items-center">
        <div className="max-w-[1280px] w-full px-4 lg:px-8 py-8">
           <Outlet /> 
        </div>
      </main>
      
      {/* ================= FOOTER SECTION ================= */}
      <footer className="mt-auto border-t border-white/5 bg-[#080808] pt-16 pb-8 w-full">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-4">
            <Link to="/" className="inline-block group mb-2">
              <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white uppercase group-hover:text-blue-500 transition-colors duration-300">
                GUNDAM<span className="text-blue-500 border-b-[3px] border-blue-500 pb-[2px] ml-0.5">STORES</span>
              </span>
            </Link>
            
            <p className="text-gray-500 text-sm leading-relaxed">
              Hệ thống cung cấp mô hình Gunpla chính hãng lớn nhất khu vực. Nơi hiện thực hóa giấc mơ của mọi Pilot.
            </p>
            <div className="flex gap-4 pt-2">
              {/* FACEBOOK ICON */}
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              
              {/* TIKTOK ICON */}
              <a href="#" aria-label="TikTok" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/50 transition-all">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                   <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                 </svg>
              </a>
              
              {/* INSTAGRAM ICON */}
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/50 transition-all">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">New Arrivals</li>
              <li className="hover:text-white transition-colors cursor-pointer">Best Sellers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pre-order Kits</li>
              <li className="hover:text-white transition-colors cursor-pointer">Sale Events</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">Chính sách bảo hành</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vận chuyển & Giao nhận</li>
              <li className="hover:text-white transition-colors cursor-pointer">Hướng dẫn lắp ráp</li>
              <li className="hover:text-white transition-colors cursor-pointer">Câu hỏi thường gặp</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Newsletter</h4>
            <p className="text-gray-500 text-xs mb-4">Nhận thông báo sớm nhất về các mẫu Limited Edition.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
              />
              <button className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-500 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4 lg:px-8 max-w-[1280px] mx-auto">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            © 2026 Gundam Store Project - Built for STU Pilots
          </p>
          <div className="flex gap-6 grayscale opacity-30">
            <span className="text-[10px] font-black text-white italic">VISA</span>
            <span className="text-[10px] font-black text-white italic">MASTERCARD</span>
            <span className="text-[10px] font-black text-white italic">MOMO</span>
          </div>
        </div>
      </footer>

      {/* NÚT SCROLL TO TOP */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[45] p-3 bg-black text-white rounded-xl shadow-xl border border-gray-700 hover:bg-blue-600 hover:border-blue-500 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group ${
          showScrollTop ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
        }`}
        title="Lên đầu trang"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-white group-hover:text-white transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>

    </div>
  );
};

export default SimpleLayout;