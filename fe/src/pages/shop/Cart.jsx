import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { useCartContext } from '../../features/cart/context/CartContext';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem, totalPrice, clearCart } = useCartContext();

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (!user) {
    return (
      <div className="max-w-[1000px] mx-auto text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bạn chưa đăng nhập</h2>
        <p className="text-gray-500 mb-8">Vui lòng đăng nhập để xem và quản lý giỏ hàng.</p>
        <a href="https://hobbyjapan-social.vercel.app/auth/login" className="bg-orange-500 hover:bg-orange-600 inline-block text-white px-8 py-3 rounded-full font-bold transition-colors shadow-md">Đăng nhập ngay</a>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h2>
        {cartItems.length > 0 && (
           <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium underline">Xóa toàn bộ</button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 mb-6 text-lg">Giỏ hàng đang trống.</p>
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-md">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100">
                  <span className="text-[10px] text-gray-400">Hình ảnh</span>
                </div>
                <div className="flex-grow">
                  <span className="font-bold text-gray-800 line-clamp-1">{item.name}</span>
                  <p className="text-orange-600 font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold">-</button>
                      <span className="px-3 py-1 text-sm font-bold w-10 text-center bg-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-sm text-gray-400 hover:text-red-500 font-medium">Xóa</button>
                  </div>
                </div>
                <div className="hidden md:block text-right font-bold text-gray-800">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-4 mt-4 text-lg font-bold text-gray-900">
                <span>Tổng cộng:</span>
                <span className="text-orange-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl uppercase tracking-wide transition-colors shadow-md">
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;