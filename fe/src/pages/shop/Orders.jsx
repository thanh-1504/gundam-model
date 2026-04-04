import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (!orders.length) {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-800 bg-[#121212] p-8 md:p-12 text-center shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-400 mb-4">Orders</p>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Chưa có đơn hàng nào</h1>
        <p className="text-gray-400 mb-8">Lịch sử mua hàng sẽ xuất hiện ở đây sau khi bạn thanh toán thành công.</p>
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
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-800 bg-[#121212] p-6 md:p-8 shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-400 mb-3">Orders</p>
        <h1 className="text-3xl font-black text-white">Lịch sử thanh toán</h1>
      </div>

      <div className="grid gap-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-3xl border border-gray-800 bg-[#121212] p-6 shadow-xl shadow-black/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">#{order.id || 'local-order'}</p>
                <h2 className="mt-2 text-xl font-black text-white">
                  {order.receiverName || 'Khách hàng'}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {order.phone} · {order.address}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                <span className={`rounded-full px-3 py-1 ${order.status === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                  {order.status || 'pending'}
                </span>
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-blue-400">
                  {order.paymentMethod || 'cod'}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-gray-800 pt-5 text-sm text-gray-300 md:grid-cols-2">
              <div>
                <p className="text-gray-500">Sản phẩm</p>
                <p className="mt-1 font-bold text-white">{order.items?.length || 0} món</p>
              </div>
              <div>
                <p className="text-gray-500">Tổng tiền</p>
                <p className="mt-1 font-black text-red-500">{formatPrice(order.totalPrice || 0)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-bold text-white uppercase tracking-wider hover:bg-blue-500 transition-colors"
        >
          Mua thêm sản phẩm
        </Link>
      </div>
    </div>
  );
};

export default Orders;