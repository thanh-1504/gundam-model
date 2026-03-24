import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';

// 1. Import Contexts (Chỉ import 1 lần duy nhất ở đây)
import { AuthProvider, AuthContext } from './features/auth/context/AuthContext';
import { CartProvider } from './features/cart/context/CartContext';

// 2. Import Layout & Pages
import SimpleLayout from './components/Layout/SimpleLayout';
import Home from './pages/shop/Home';
import Catalog from './pages/shop/Catalog';
import Cart from './pages/shop/Cart';
import UserManagement from './pages/admin/UserManagement';
import Contact from './pages/shop/Contact'; // <-- File Contact bạn vừa tạo

// URL Đăng nhập bên ngoài
const EXTERNAL_LOGIN_URL = "https://hobbyjapan-social.vercel.app/auth/login";

// Component chuyển hướng an toàn ra web ngoài
const ExternalRedirect = ({ url }) => {
  window.location.href = url;
  return null;
};

// Bộ bảo vệ Route: Chỉ cho phép Admin truy cập
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    window.location.href = EXTERNAL_LOGIN_URL;
    return null; 
  }
  
  if (user.role !== 'admin') return <Navigate to="/" replace />; 
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Thông báo góc phải */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#1f1f1f', color: '#fff', border: '1px solid #333' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Layout chính cho người dùng */}
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Catalog />} />
              <Route path="cart" element={<Cart />} />
              {/* ĐÃ THÊM ROUTE CONTACT VÀO ĐÂY */}
              <Route path="contact" element={<Contact />} /> 
            </Route>

            {/* Layout riêng cho Admin */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } 
            />

            {/* Bắt route /login nội bộ và đẩy ra ngoài */}
            <Route 
              path="/login" 
              element={<ExternalRedirect url={EXTERNAL_LOGIN_URL} />} 
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;