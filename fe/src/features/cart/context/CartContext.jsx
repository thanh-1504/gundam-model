import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Lấy dữ liệu từ localStorage khi khởi tạo
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Tự động lưu vào localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Các hàm xử lý logic
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        toast.success(`Đã tăng số lượng: ${product.name}`);
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`Đã thêm vào giỏ: ${product.name}`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // Không cho giảm dưới 1
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Đã xóa sản phẩm khỏi giỏ!');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 4. Các biến tính toán phụ
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQuantity, removeItem, clearCart, totalItems, totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook tùy chỉnh để dùng cho tiện
export const useCartContext = () => useContext(CartContext);