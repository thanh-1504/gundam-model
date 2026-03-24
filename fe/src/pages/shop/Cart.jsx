import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { useCartContext } from '../../features/cart/context/CartContext'; // <--- Import Context Giỏ hàng

const Cart = () => {
  const { user } = useContext(AuthContext);
  
  // Lấy thẳng data và hàm từ Context, không cần useState nữa!
  const { cartItems, updateQuantity, removeItem, totalPrice, clearCart } = useCartContext();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Logic kiểm tra đăng nhập giữ nguyên
  if (!user) {
    return (
      <div className="max-w-[1000px] mx-auto text-center py-20 bg-[#1a1a1a] rounded-xl border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-black uppercase text-white mb-4">Bạn chưa đăng nhập</h2>
        <p className="text-gray-400 mb-8">Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
        <a href="https://hobbyjapan-social.vercel.app/auth/login" className="bg-blue-600 hover:bg-blue-500 inline-block text-white px-8 py-3 rounded font-bold uppercase transition-colors">
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-black uppercase text-white">
          Giỏ hàng của <span className="text-blue-400">{user.username}</span>
        </h2>
        {cartItems.length > 0 && (
           <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-400 underline uppercase font-bold">
             Xóa toàn bộ
           </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-gray-700 shadow-2xl">
          <p className="text-gray-400 mb-6 text-lg">Giỏ hàng của bạn đang trống.</p>
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded font-bold uppercase transition-colors">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-[#1a1a1a] p-4 rounded-lg border border-gray-700 shadow-md">
                <div className="w-24 h-24 bg-black rounded flex-shrink-0 flex items-center justify-center border border-gray-800">
                  <span className="text-[10px] text-gray-600">No Image</span>
                </div>
                <div className="flex-grow">
                  <span className="font-bold text-gray-200 line-clamp-1">{item.name}</span>
                  <p className="text-red-400 font-bold mt-1">{formatPrice(item.price)}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-black rounded border border-gray-600 overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-800 text-gray-300 transition-colors">-</button>
                      <span className="px-3 py-1 text-sm font-bold w-10 text-center border-l border-r border-gray-600">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-800 text-gray-300 transition-colors">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-gray-500 hover:text-red-500 underline transition-colors">
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="hidden md:block text-right font-bold text-gray-300">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Bảng Tóm tắt (Giữ nguyên) */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 shadow-xl h-fit sticky top-24">
            <h3 className="text-lg font-bold uppercase text-white border-b border-gray-700 pb-3 mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 text-sm text-gray-300 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-3 mt-3 text-lg font-black text-white">
                <span>Tổng cộng:</span>
                <span className="text-red-500">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded uppercase tracking-wide transition-all shadow-lg active:scale-95">
              Thanh toán ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;