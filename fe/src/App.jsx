import { Toaster } from "react-hot-toast";
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import SimpleLayout from "./components/Layout/SimpleLayout";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { CartProvider } from "./features/cart/context/CartContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Cart from "./pages/shop/Cart";
import Catalog from "./pages/shop/Catalog";
import Checkout from "./pages/shop/Checkout";
import Home from "./pages/shop/Home";
import Orders from "./pages/shop/Orders";
const EXTERNAL_LOGIN_URL = "https://hobbyjapan-social.vercel.app/auth/login";

const ExternalRedirect = ({ url }) => {
  window.location.href = url;
  return null;
};

// const AdminRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     window.location.href = EXTERNAL_LOGIN_URL;
//     return null;
//   }

//   if (user.role !== "admin") return <Navigate to="/" replace />;

//   return children;
// };

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster
            position="top-center"
            containerStyle={{
              top: 92,
              left: 16,
              right: 16,
            }}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#ffffff",
                color: "#111827",
                border: "1px solid #d1d5db",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                borderRadius: "12px",
                fontWeight: 600,
              },
              success: {
                iconTheme: { primary: "#22c55e", secondary: "#ffffff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
              },
            }}
          />

          <Routes>
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Catalog />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
              {/* TẠM THỜI ĐÓNG ROUTE NÀY LẠI */}
              {/* <Route path="contact" element={<Contact />} />  */}
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
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
