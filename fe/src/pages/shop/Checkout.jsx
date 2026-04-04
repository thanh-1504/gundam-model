import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../config/axiosClient';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { useCartContext } from '../../features/cart/context/CartContext';

const PAYMENT_METHODS = [
  {
    value: 'cod',
    label: 'Thanh toán khi nhận hàng',
    description: 'Xác nhận đơn ngay, thanh toán cho shipper khi nhận hàng.',
  },
  {
    value: 'momo',
    label: 'MoMo / Ví điện tử',
    description: 'Đánh dấu đơn là đã thanh toán sau khi xác nhận giao dịch.',
  },
  {
    value: 'payos',
    label: 'Chuyển khoản / Quét mã VietQR',
    description: 'Tự động tạo mã VietQR chuyển khoản cực nhanh (PayOS).',
  },
  {    value: 'demo',
    label: 'Mã giả lập / Demo Test',
    description: 'Dùng để demo trạng thái hiển thị "Đã thanh toán" (Bỏ qua OTP/Tiền thật).',
  },
  {    value: 'vnpay',
    label: 'Thanh toán trực tuyến bằng VNPay',
    description: 'Thanh toán qua ví VNPay, quét mã QR, thẻ ATM hoặc thẻ quốc tế.',
  },
];

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        receiverName: user.username || prev.receiverName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const orderItems = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    [cartItems],
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const storeOrderHistory = (order) => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const nextOrders = [order, ...savedOrders].slice(0, 20);
    localStorage.setItem('orders', JSON.stringify(nextOrders));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      window.location.href = 'https://hobbyjapan-social.vercel.app/auth/login';
      return;
    }

    if (!cartItems.length) {
      toast.error('Giỏ hàng đang trống.');
      return;
    }

    if (!formData.receiverName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin giao hàng.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        userId: user.id || null,
        receiverName: formData.receiverName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
        items: orderItems,
      };

      const response = await axiosClient.post('/orders', payload);
      const createdOrder = response.data?.data || response.data;

      storeOrderHistory({
        id: createdOrder?.id,
        status: createdOrder?.status || (formData.paymentMethod === 'cod' ? 'pending' : 'paid'),
        paymentMethod: formData.paymentMethod,
        receiverName: formData.receiverName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        totalPrice,
        items: cartItems,
        createdAt: createdOrder?.created_at || new Date().toISOString(),
      });

      clearCart();

      // Nếu API trả về momo hoặc vnpay payUrl, lập tức chuyển hướng
      if (createdOrder?.paymentUrl) {
        toast.success('Đang chuyển hướng sang cổng thanh toán...');
        window.location.href = createdOrder.paymentUrl;
        return;
      }

      toast.success('Thanh toán thành công. Đơn hàng đã được tạo.');
      navigate('/orders', { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể tạo đơn hàng vào lúc này.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-800 bg-gradient-to-br from-[#141414] via-[#101010] to-black p-8 md:p-12 shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-400 mb-4">Checkout</p>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Bạn cần đăng nhập để thanh toán</h1>
        <p className="text-gray-400 mb-8 max-w-xl">
          Đơn hàng sẽ được gắn với tài khoản của bạn để theo dõi trạng thái và lịch sử mua hàng.
        </p>
        <a
          href="https://hobbyjapan-social.vercel.app/auth/login"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-bold text-white uppercase tracking-wider hover:bg-blue-500 transition-colors"
        >
          Đăng nhập để thanh toán
        </a>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-800 bg-[#121212] p-8 md:p-12 text-center shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-400 mb-4">Checkout</p>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Giỏ hàng đang trống</h1>
        <p className="text-gray-400 mb-8">Thêm sản phẩm vào giỏ trước khi tiến hành thanh toán.</p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-bold text-white uppercase tracking-wider hover:bg-blue-500 transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-800 bg-[#121212] p-6 md:p-8 shadow-2xl shadow-black/40"
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-400 mb-3">Checkout</p>
          <h1 className="text-3xl font-black text-white mb-3">Thanh toán đơn hàng</h1>
          <p className="text-gray-400">Xác nhận thông tin giao hàng và chọn phương thức thanh toán phù hợp.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-300">Người nhận</span>
            <input
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-700 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-blue-500"
              placeholder="Họ và tên người nhận"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-300">Số điện thoại</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-700 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-blue-500"
              placeholder="Số điện thoại liên hệ"
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-300">Địa chỉ giao hàng</span>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
            className="w-full rounded-2xl border border-gray-700 bg-black px-4 py-3 text-white outline-none transition-colors focus:border-blue-500"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
          />
        </label>

        <div className="mt-6">
          <span className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-300">Phương thức thanh toán</span>
          <div className="grid gap-3">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  formData.paymentMethod === method.value
                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]'
                    : 'border-gray-800 bg-black hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={formData.paymentMethod === method.value}
                    onChange={handleChange}
                    className="mt-1 accent-blue-500"
                  />
                  <div>
                    <div className="font-bold text-white">{method.label}</div>
                    <p className="mt-1 text-sm text-gray-400">{method.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/cart" className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
            Quay lại giỏ hàng
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-blue-600 px-8 py-3 font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </div>
      </form>

      <aside className="h-fit rounded-3xl border border-gray-800 bg-[#121212] p-6 md:p-8 shadow-2xl shadow-black/40 lg:sticky lg:top-24">
        <h2 className="text-xl font-black text-white uppercase tracking-wide">Tóm tắt đơn hàng</h2>
        <div className="mt-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-black p-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-800 bg-[#111111] overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-[10px] text-gray-600">No Image</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-gray-200">{item.name}</p>
                <p className="mt-1 text-sm text-gray-400">Số lượng: {item.quantity}</p>
              </div>
              <div className="text-right text-sm font-bold text-red-500">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-gray-800 pt-5 text-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span>Tạm tính</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-black text-white">
            <span>Tổng thanh toán</span>
            <span className="text-red-500">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
          Đơn hàng sẽ được chuyển sang trạng thái <span className="font-bold">pending</span> với COD, hoặc <span className="font-bold">paid</span> với các phương thức còn lại.
        </div>
      </aside>
    </div>
  );
};

export default Checkout;