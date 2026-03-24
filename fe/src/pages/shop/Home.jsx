import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import axios from 'axios';
import ProductCard from '../../features/products/components/ProductCard';
import { useCartContext } from '../../features/cart/context/CartContext';
import { AuthContext } from '../../features/auth/context/AuthContext';
import toast from 'react-hot-toast';
import imgBanner1 from '../../assets/Banner.png';
import imgBanner2 from '../../assets/Banner1.png';
import imgBanner3 from '../../assets/Banner2.png';

const API_BASE_URL = 'https://gundamstoreapi-gpd3fxemg8d3cpdt.eastasia-01.azurewebsites.net/';

const safeArray = (data) => Array.isArray(data) ? data : [];
const safeJSON = (data) => {
  if (!data) return [];
  if (typeof data !== 'string') return safeArray(data);
  try { return safeArray(JSON.parse(data)); } catch (e) { return []; }
};

const MAIN_BANNERS = [
 imgBanner1, 
  imgBanner2, 
  imgBanner3 
];

// ================= COMPONENT BĂNG CHUYỀN SẢN PHẨM =================
const ProductCarouselSection = ({ title, data, formatPrice, onQuickView }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      const scrollAmount = clientWidth / 2; 

      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 0) {
          carouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      scroll('right');
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
        <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">{title}</h2>
        <Link to="/shop" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1 uppercase tracking-widest whitespace-nowrap">
          Xem tất cả <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Link>
      </div>

      <div className="relative group">
         <button 
            onClick={() => scroll('left')} 
            className="absolute -left-3 md:-left-5 top-[40%] -translate-y-1/2 z-10 bg-[#1a1a1a]/90 hover:bg-blue-600 text-white p-3 rounded-full border border-gray-700 opacity-0 group-hover:opacity-100 transition-all shadow-2xl backdrop-blur-sm"
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
         </button>

         <button 
            onClick={() => scroll('right')} 
            className="absolute -right-3 md:-right-5 top-[40%] -translate-y-1/2 z-10 bg-[#1a1a1a]/90 hover:bg-blue-600 text-white p-3 rounded-full border border-gray-700 opacity-0 group-hover:opacity-100 transition-all shadow-2xl backdrop-blur-sm"
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
         </button>

         {data.length > 0 ? (
           <div 
             ref={carouselRef} 
             className="flex gap-4 lg:gap-6 overflow-x-auto scroll-smooth pb-4 pt-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
           >
             {data.map(p => (
               <div key={p.id || p.Id} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] flex-shrink-0 animate-fade-in-up">
                  <ProductCard product={p} formatPrice={formatPrice} onQuickView={onQuickView} />
               </div>
             ))}
           </div>
         ) : (
           <div className="py-10 text-center text-gray-600 bg-[#141414] rounded-xl border border-gray-800">Đang cập nhật sản phẩm...</div>
         )}
      </div>
    </div>
  );
};
// ======================================================================

const Home = () => {
  const { addToCart } = useCartContext();
  const { user } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalUserRating, setModalUserRating] = useState(5);
  const [modalUserComment, setModalUserComment] = useState("");
  const [currentGalleryImageIndex, setCurrentGalleryImageIndex] = useState(0);
  const relatedCarouselRef = useRef(null);
  
  const modalScrollRef = useRef(null);
  
  // 🔥 STATE BẮT SỰ KIỆN CUỘN 🔥
  const [isModalScrolled, setIsModalScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === MAIN_BANNERS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      setModalQuantity(1);
      setCurrentGalleryImageIndex(0);
      setModalUserComment("");
      setModalUserRating(5);
      setIsModalScrolled(false); // Reset trạng thái cuộn

      setTimeout(() => {
        if (modalScrollRef.current) {
          modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);

    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        const rawProducts = safeArray(res.data?.data || res.data);
        const formattedProducts = rawProducts.map(p => ({
          ...p,
          images: safeJSON(p.images || p.Images), 
          specs: safeJSON(p.specs || p.Specs),
          reviews: safeJSON(p.reviews || p.Reviews),
          rating: p.rating || p.Rating || 5.0,
          desc: p.desc || p.description || p.Description || 'Chưa có mô tả cho sản phẩm này.',
          stock: p.stock || p.Stock || 0,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Lỗi tải API:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ================= TÍNH NĂNG URL SYNC CHO MODAL (SEO & SHARE LINK) =================
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    const params = new URLSearchParams(location.search);
    params.set('pid', product.id || product.Id);
    navigate(`?${params.toString()}`, { replace: true }); 
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    const params = new URLSearchParams(location.search);
    params.delete('pid');
    navigate(`?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pid = params.get('pid');
    
    if (pid && products.length > 0) {
      const productToOpen = products.find(p => String(p.id || p.Id) === pid);
      if (productToOpen && (!selectedProduct || String(selectedProduct.id || selectedProduct.Id) !== pid)) {
        setSelectedProduct(productToOpen);
      }
    }
  }, [location.search, products]);
  // =================================================================

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleQuickBuy = (product, quantity) => {
    if (!user) {
      window.location.href = "https://hobbyjapan-social.vercel.app/auth/login";
      return;
    }
    const finalProduct = { ...product, quantity: quantity || 1 };
    addToCart(finalProduct);
    setSelectedProduct(null);
    const params = new URLSearchParams(location.search);
    params.delete('pid');
    navigate(`?${params.toString()}`, { replace: true });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const preOrderProducts = products.slice(0, 8);
  const newArrivalProducts = products.slice(8, 16);
  const hotProducts = products.slice(16, 24);
  const assembledProducts = products.slice(24, 32); 

  const getRelatedProducts = (currentProductId) => {
      return products.filter(p => p.id !== currentProductId).slice(0, 8);
  };

  const scrollRelatedCarousel = (direction) => {
      if (relatedCarouselRef.current) {
          const { scrollLeft, clientWidth, scrollWidth } = relatedCarouselRef.current;
          const scrollAmount = clientWidth / 2;
          if (direction === 'right') {
              if (scrollLeft + clientWidth >= scrollWidth - 10) {
                  relatedCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
              } else {
                  relatedCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
              }
          } else {
              if (scrollLeft <= 0) {
                  relatedCarouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
              } else {
                  relatedCarouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
              }
          }
      }
  };

  useEffect(() => {
    let timer;
    if (selectedProduct) {
      timer = setInterval(() => {
        scrollRelatedCarousel('right');
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [selectedProduct]);

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white w-full">
      
      {/* SLIDESHOW BANNER */}
      <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden bg-black mb-12 border-b border-gray-800">
        {MAIN_BANNERS.map((slide, index) => (
          <img 
            key={index} 
            src={slide} 
            alt={`Banner ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <button onClick={() => setCurrentSlide(prev => prev === 0 ? MAIN_BANNERS.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-blue-600 text-white p-3 rounded-full backdrop-blur-sm transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
        <button onClick={() => setCurrentSlide(prev => prev === MAIN_BANNERS.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-blue-600 text-white p-3 rounded-full backdrop-blur-sm transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">

        {/* KHU VỰC YÊN TÂM MUA HÀNG */}
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-8 mb-16 shadow-xl">
          <div className="border-b-2 border-gray-800 pb-4 mb-8 inline-block">
             <h3 className="text-xl md:text-2xl font-black uppercase text-white flex items-center gap-2">
                Yên tâm mua hàng tại 
                <span className="font-black italic tracking-tighter text-white uppercase ml-1">
                  GUNDAM<span className="text-blue-500 border-b-[3px] border-blue-500 pb-[2px]">STORES</span>
                </span>
             </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-gray-300">
            <div className="flex items-center gap-4 group"><svg className="w-10 h-10 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg><span className="text-[15px] font-medium">Gundam Shop Chính hãng <strong className="text-white">BANDAI</strong></span></div>
            <div className="flex items-center gap-4 group"><svg className="w-10 h-10 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg><span className="text-[15px] font-medium">Giao hàng Nhanh <strong className="text-white">Toàn Quốc</strong></span></div>
            <div className="flex items-center gap-4 group"><svg className="w-10 h-10 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg><span className="text-[15px] font-medium">Luôn có <strong className="text-white">Giá tốt nhất</strong></span></div>
            <div className="flex items-center gap-4 group"><svg className="w-10 h-10 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg><span className="text-[15px] font-medium"><strong className="text-white">Uy tín</strong>, Nhiệt tình, Thân thiện</span></div>
            <div className="flex items-center gap-4 group"><svg className="w-10 h-10 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg><span className="text-[15px] font-medium">Đặt hàng <strong className="text-white">Online 24/7</strong></span></div>
          </div>
        </div>

        {/* CÁC MỤC SẢN PHẨM DÙNG COMPONENT CAROUSEL */}
        {isLoading ? (
           <div className="flex justify-center items-center py-20"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <>
            <ProductCarouselSection title="Hàng Đặt Trước (Pre-order)" data={preOrderProducts} formatPrice={formatPrice} onQuickView={handleOpenModal} />
            <ProductCarouselSection title="Hàng Mới Về" data={newArrivalProducts} formatPrice={formatPrice} onQuickView={handleOpenModal} />
            <ProductCarouselSection title="Hàng Hot Trong Tháng" data={hotProducts} formatPrice={formatPrice} onQuickView={handleOpenModal} />
            <ProductCarouselSection title="Mô Hình Lắp Sẵn" data={assembledProducts} formatPrice={formatPrice} onQuickView={handleOpenModal} />
          </>
        )}
      </div>

      {/* ================= MODAL QUICK VIEW CHUẨN CYBERPUNK ================= */}
      {selectedProduct && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={handleCloseModal}></div>
          
          <div className="bg-[#121212] border border-gray-800 rounded-3xl shadow-2xl w-full max-w-[1400px] h-[95vh] relative z-10 overflow-hidden flex flex-col transition-all border-b-2 border-b-blue-950">
            
            {/* Nền lưới công nghệ */}
            <div className="absolute inset-0 z-0 opacity-15" style={{ backgroundImage: 'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
                
                {/* 🔥 HEADER MODAL THÔNG MINH 🔥 */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-800 bg-[#181818]/95 backdrop-blur-md sticky top-0 z-30 flex-shrink-0 shadow-md transition-all">
                  
                  <div className="flex items-center gap-4 flex-1 overflow-hidden pr-4">
                    <h2 className={`text-lg md:text-xl font-black text-white uppercase tracking-widest flex items-center gap-2.5 transition-all ${isModalScrolled ? 'hidden sm:flex' : 'flex'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                      <span className="whitespace-nowrap">CHI TIẾT</span>
                    </h2>

                    {/* HIỂN THỊ TÊN & GIÁ KHI CUỘN */}
                    <div className={`flex items-center gap-3 transition-all duration-300 origin-left ${isModalScrolled ? 'opacity-100 scale-100 sm:pl-4 sm:border-l border-gray-700' : 'opacity-0 scale-95 hidden'}`}>
                      {selectedProduct.images && selectedProduct.images.length > 0 && (
                         <img src={selectedProduct.images[0]} alt="thumb" className="w-9 h-9 rounded-md bg-black object-contain border border-gray-700 flex-shrink-0"/>
                      )}
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-[300px] lg:max-w-[500px]">{selectedProduct.name || selectedProduct.Name}</p>
                        <p className="text-[11px] font-black text-red-500 tracking-wider">{formatPrice(selectedProduct.price || selectedProduct.Price)}</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleCloseModal} className="text-gray-500 hover:text-white hover:bg-red-600 p-2.5 rounded-full transition-colors bg-black/50 border border-gray-800 shadow-lg flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* 🔥 BẮT SỰ KIỆN CUỘN Ở ĐÂY 🔥 */}
                <div 
                  ref={modalScrollRef} 
                  onScroll={(e) => setIsModalScrolled(e.target.scrollTop > 250)}
                  className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                >
                  
                  {/* PHẦN 1: GALLERY & THÔNG TIN */}
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-16 border-b border-gray-800 pb-16">
                    
                    <div className="w-full md:w-2/5 flex-shrink-0 relative group bg-black/50 p-6 rounded-3xl border border-gray-800 shadow-inner">
                      {selectedProduct.images && selectedProduct.images.length > 0 ? (
                        <>
                          <img src={selectedProduct.images[currentGalleryImageIndex]} alt={selectedProduct.name} className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] object-contain mx-auto" />
                          {selectedProduct.images.length > 1 && (
                            <>
                            <button onClick={() => setCurrentGalleryImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/70 p-3 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100 shadow-xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                            <button onClick={() => setCurrentGalleryImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/70 p-3 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100 shadow-xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
                            </>
                          )}
                          <div className="flex justify-center gap-3 mt-6">
                            {selectedProduct.images.slice(0, 5).map((img, i) => (
                                <img key={i} src={img} alt="thumb" onClick={() => setCurrentGalleryImageIndex(i)} className={`w-16 h-16 object-cover rounded-xl border-2 cursor-pointer transition-all ${i === currentGalleryImageIndex ? 'border-blue-500 scale-105' : 'border-gray-800 hover:border-gray-600'}`} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="h-[400px] flex items-center justify-center bg-gray-900 rounded-2xl border border-gray-800 text-gray-600 font-bold">No Image</div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col pt-2">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-600/20 text-blue-400 text-[11px] font-black uppercase px-3 py-1.5 rounded-full border border-blue-500/30 tracking-wider">Gunpla Model</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full border border-gray-800 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                            <span className="text-sm font-black text-white">{selectedProduct.rating}</span>
                            <span className="text-gray-500 text-xs font-bold">({selectedProduct.reviews ? selectedProduct.reviews.length : 0} đánh giá)</span>
                        </div>
                      </div>
                      
                      {/* TÊN SẢN PHẨM BỰ */}
                      <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase italic tracking-tight leading-tight">
                        {selectedProduct.name || selectedProduct.Name}
                      </h1>

                      {/* GIÁ SẢN PHẨM */}
                      <p className="text-4xl md:text-5xl font-black text-red-500 mb-8 tracking-tighter shadow-sm bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                        {formatPrice(selectedProduct.price || selectedProduct.Price)}
                      </p>

                      <div className="space-y-4 border-t border-gray-800 pt-8 mb-8">
                         <div className="flex justify-between items-center bg-[#181818] p-4 rounded-xl border border-gray-800">
                            <span className="text-gray-400 font-bold">Tình trạng kho:</span>
                            {selectedProduct.stock > 0 ? (
                              <span className="text-green-400 font-bold flex items-center gap-1.5 bg-green-950/50 px-3 py-1.5 rounded-full border border-green-500/30 text-sm"><span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span> Còn hàng ({selectedProduct.stock} sản phẩm)</span>
                            ) : (
                              <span className="text-red-500 font-bold bg-red-950/50 px-3 py-1.5 rounded-full border border-red-500/30 text-sm">Tạm hết hàng</span>
                            )}
                         </div>

                         {/* BỘ CHỌN SỐ LƯỢNG */}
                         <div className="flex justify-between items-center bg-[#181818] p-4 rounded-xl border border-gray-800">
                            <span className="text-gray-400 font-bold">Số lượng muốn mua:</span>
                            <div className="flex items-center bg-[#0d0d0d] border border-gray-700 rounded-full p-1 shadow-inner h-11">
                                <button 
                                  onClick={() => setModalQuantity(prev => Math.max(1, Number(prev) - 1))} 
                                  className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-blue-600 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                                </button>
                                
                                <input 
                                  type="number" 
                                  min="1" 
                                  max={selectedProduct.stock || 99} 
                                  value={modalQuantity} 
                                  onChange={(e) => setModalQuantity(Math.max(1, Math.min(Number(selectedProduct.stock) || 99, parseInt(e.target.value) || 1)))} 
                                  className="w-12 text-center bg-transparent text-lg font-black text-white outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                                
                                <button 
                                  onClick={() => setModalQuantity(prev => Math.max(1, Math.min(Number(selectedProduct.stock) || 99, Number(prev) + 1)))} 
                                  className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-blue-600 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                </button>
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={() => handleQuickBuy(selectedProduct, modalQuantity)}
                        disabled={selectedProduct.stock === 0}
                        className={`w-full py-5 rounded-2xl font-black uppercase text-base tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] flex justify-center items-center gap-3 mb-10 ${
                          selectedProduct.stock === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.5)]'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                        {selectedProduct.stock === 0 ? 'Đã bán hết' : `Thêm vào giỏ hàng ngay • SL: ${modalQuantity}`}
                      </button>

                      {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                        <div className="bg-[#181818] p-6 rounded-2xl border border-gray-800 mt-auto shadow-inner">
                            <h4 className="text-sm font-black uppercase text-gray-300 mb-5 tracking-widest flex items-center gap-2.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> Thông số chi tiết máy</h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
                                {selectedProduct.specs.map((spec, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-2 last:border-0 last:pb-0">
                                        <span className="text-gray-500 font-medium tracking-wide text-xs uppercase">{spec.key || spec.Key}</span>
                                        <span className="text-gray-200 font-bold">{spec.value || spec.Value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PHẦN 2: MÔ TẢ */}
                  <div className="border-t border-gray-800 pt-16 mb-16 pb-16">
                    <h3 className="text-2xl font-black uppercase text-white mb-8 tracking-tight flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> Mô tả chi tiết</h3>
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="prose prose-invert prose-sm flex-1 text-gray-300 leading-relaxed bg-[#181818] p-8 rounded-2xl border border-gray-800 shadow-inner max-w-none">
                            <p>{selectedProduct.desc}</p>
                        </div>
                        {selectedProduct.images && selectedProduct.images.length > 1 && (
                            <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4 flex-shrink-0">
                                {selectedProduct.images.slice(1, 6).map((img, i) => (
                                    <img key={i} src={img} alt={`ilust-${i}`} className={`object-cover w-full h-full rounded-xl border border-gray-800 aspect-square ${i===0 ? 'col-span-2' : ''}`} />
                                ))}
                            </div>
                        )}
                    </div>
                  </div>

                  {/* PHẦN 3: BÌNH LUẬN */}
                  <div className="border-t border-gray-800 pt-16 mb-16 pb-16">
                    <div className="flex items-center justify-between mb-10 gap-4">
                        <h3 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442a.562.562 0 01.313.988l-4.289 3.692a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.289-3.692a.562.562 0 01.313-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> Battle Reports ({selectedProduct.reviews ? selectedProduct.reviews.length : 0})</h3>
                    </div>

                    {user ? (
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 mb-12 shadow-inner">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-lg border border-blue-400 shadow-md shadow-blue-500/20">{user.username?.charAt(0).toUpperCase() || 'U'}</div>
                                <div className="flex-1">
                                    <p className="font-bold text-white mb-1.5">Gửi đánh giá của Pilot <strong className="text-blue-400">{user.username}</strong></p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Mẫu Mobile Suit này vận hành như thế nào trong trận chiến?</p>
                                    <div className="flex text-yellow-500 gap-1.5 mb-5 bg-black w-fit p-2 rounded-lg border border-gray-800">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} onClick={() => setModalUserRating(5 - i)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={5 - i <= modalUserRating ? "currentColor" : "none"} className="w-8 h-8 cursor-pointer transform hover:scale-110 transition-transform"><path stroke="currentColor" strokeWidth={1} d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.12 4.637c-.194.808.691 1.451 1.425 1.02L10 14.217l4.132 2.413c.734.431 1.619-.212 1.426-1.02l-1.12-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" /></svg>
                                        ))}
                                    </div>
                                    <textarea value={modalUserComment} onChange={(e) => setModalUserComment(e.target.value)} rows="3" placeholder="Ví dụ: Giáp dày, súng bắn nhanh..." className="w-full bg-black/50 border border-gray-700 text-sm text-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition-colors shadow-inner outline-none mb-4"></textarea>
                                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2">Gửi Báo Cáo <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg></button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#181818] p-6 rounded-2xl border border-gray-800 text-center text-gray-400 text-sm mb-12 shadow-inner">Vui lòng <a href="https://hobbyjapan-social.vercel.app/auth/login" className="text-blue-400 font-bold hover:underline">đăng nhập</a> để gửi báo cáo chiến trường.</div>
                    )}

                    {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {selectedProduct.reviews.map((review, idx) => (
                                <div key={review.id || idx} className="bg-[#181818] p-6 sm:p-7 rounded-2xl border border-gray-800 flex gap-5 shadow-inner relative group">
                                    <div className="absolute top-6 right-6 flex text-yellow-500 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={i < (review.rating || 5) ? "currentColor" : "none"} className="w-4 h-4"><path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.12 4.637c-.194.808.691 1.451 1.425 1.02L10 14.217l4.132 2.413c.734.431 1.619-.212 1.426-1.02l-1.12-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" /></svg>
                                        ))}
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-gray-300 text-lg border border-gray-600 shadow-md group-hover:border-blue-500 transition-colors">{review.avatar || (review.name?.charAt(0).toUpperCase() || 'U')}</div>
                                    <div className="flex-1">
                                        <div className="mb-2.5">
                                            <p className="font-bold text-white text-[15px]">{review.name || review.Name}</p>
                                            <p className="text-xs text-gray-600 uppercase tracking-widest">{review.date || review.Date}</p>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed bg-black/30 p-4 rounded-xl border border-gray-800 italic shadow-inner">"{review.comment || review.Comment}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-[#181818] rounded-2xl border border-gray-800 text-gray-500 italic text-sm shadow-inner">Chưa có báo cáo chiến trường nào cho mẫu Model này.</div>
                    )}
                  </div>

                  {/* PHẦN 4: SẢN PHẨM LIÊN QUAN */}
                  <div className="border-t border-gray-800 pt-10 mt-12 pb-6 relative group">
                    <div className="flex items-center justify-between mb-8 gap-4">
                        <h3 className="text-[18px] md:text-xl font-black uppercase text-white tracking-wide flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> 
                          Mobile Suits liên quan khác
                        </h3>
                    </div>

                    <div className="relative group">
                        <button onClick={() => scrollRelatedCarousel('left')} className="absolute -left-3 md:-left-6 top-[40%] -translate-y-1/2 z-20 bg-[#1a1a1a] hover:bg-blue-600 text-white p-3 rounded-full border border-gray-700 opacity-60 group-hover:opacity-100 transition-all shadow-2xl">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        </button>
                        <button onClick={() => scrollRelatedCarousel('right')} className="absolute -right-3 md:-right-6 top-[40%] -translate-y-1/2 z-20 bg-[#1a1a1a] hover:bg-blue-600 text-white p-3 rounded-full border border-gray-700 opacity-60 group-hover:opacity-100 transition-all shadow-2xl">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        </button>

                        <div ref={relatedCarouselRef} className="flex gap-4 lg:gap-6 overflow-x-auto scroll-smooth pb-4 pt-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {getRelatedProducts(selectedProduct.id || selectedProduct.Id).map((p) => (
                                <div key={p.id || p.Id} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] flex-shrink-0 animate-fade-in-up">
                                    <ProductCard product={p} formatPrice={formatPrice} onQuickView={handleOpenModal} />
                                </div>
                            ))}
                            {getRelatedProducts(selectedProduct.id).length === 0 && (
                                <div className="text-center py-10 w-full text-gray-600 bg-[#181818] rounded-xl border border-gray-800 shadow-inner">Không có sản phẩm liên quan khác.</div>
                            )}
                        </div>
                    </div>
                  </div>

                </div>
            </div>
          </div>
        </div>
      , document.body)}

    </div>
  );
};

export default Home;