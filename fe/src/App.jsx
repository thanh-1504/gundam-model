import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserManagement from './UserManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ mặc định */}
        <Route path="/" element={
          <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-white font-sans">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
              Hobby Japan Demo
            </h1>
            <p className="text-gray-400 mb-8 italic">
              Hệ thống quản lý dữ liệu Gundam Store
            </p>
            
            {/* Nút bấm chuyển hướng sang /users */}
            <Link 
              to="/users" 
              className="bg-[#007bff] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all uppercase tracking-widest shadow-lg active:scale-95"
            >
              Xem danh sách User
            </Link>
          </div>
        } />

        {/* CHỈ KHI GÕ /users HOẶC BẤM NÚT THÌ MỚI HIỆN GIAO DIỆN NÀY */}
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;