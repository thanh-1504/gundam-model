import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Đã sửa lại đường dẫn import tương đối (lùi 2 cấp từ pages/admin ra src)
import logoHobby from '../../assets/logo.png'; 
import { AuthContext } from '../../features/auth/context/AuthContext';
import toast from 'react-hot-toast';

// const API_URL = 'https://gundam-model.onrender.com/users';
const API_URL = 'https://gundamstoreapi-gpd3fxemg8d3cpdt.eastasia-01.azurewebsites.net/users';

function UserManagement() {
  // 1. STATE ĐỂ THEO DÕI TRANG ĐANG HOẠT ĐỘNG (THEO YÊU CẦU MỚI)
  const [activePage, setActivePage] = useState('Quản lý Người dùng');

  // Logic Auth cũ (giữ nguyên)
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logic User CRUD cũ (giữ nguyên)
  const [users, setUsers] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchUsers();
    // Logic click bên ngoài để đóng dropdown (giữ nguyên)
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }
    try {
      const { confirmPassword, ...submitData } = formData;
      if (editingId) {
        await axios.patch(`${API_URL}/${editingId}`, submitData);
        setEditingId(null);
        toast.success('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, submitData);
        toast.success('Thêm người dùng thành công!')
      }
      setFormData({ username: '', email: '', password: '', confirmPassword: '', role: 'user', phone: '', address: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi: Username/Email đã tồn tại hoặc server đang khởi động!');
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setFormData({
      username: u.username,
      email: u.email,
      password: '',
      confirmPassword: '',
      role: u.role || 'user',
      phone: u.phone || '',
      address: u.address || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (error) {
      toast.error('Lỗi khi xóa!');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // Bọc toàn bộ màn hình, khóa scroll tổng để giữ layout cố định
    <div className="flex h-screen bg-[#0d0d0d] text-white font-sans overflow-hidden">
      
      {/* =========================================
          CỘT TRÁI: SIDEBAR MENU
      ========================================= */}
      <aside className="w-64 bg-[#141414] border-r border-gray-800 flex flex-col justify-between flex-shrink-0 shadow-2xl z-20">
        
        <div>
          {/* LOGO & TITLE: Đưa logo vào đây, cạnh chữ Gundam Admin */}
          <div className="h-300 flex items-center px-6 border-b border-gray-800 bg-[#0a0a0a]">
            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity w-full">
              {/* Logo to hơn */}
              <img 
                src={logoHobby} 
                alt="Logo" 
                className="w-12 h-12 rounded-xl border border-gray-700 shadow-lg object-contain bg-black flex-shrink-0" 
              />
              {/* Chữ xếp 2 dòng gọn gàng */}
              <div className="flex flex-col justify-center leading-none mt-1">
                <span className="text-xl font-black tracking-widest text-white uppercase mb-1.5">
                  Gundam
                </span>
                <span className="text-sm font-black tracking-[0.2em] text-orange-500 uppercase">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* MENU NAVIGATION */}
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => setActivePage('Quản lý Người dùng')} 
              className={`block w-full text-left font-bold p-2.5 rounded-lg transition-colors text-sm uppercase ${activePage === 'Quản lý Người dùng' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
               Quản lý Người dùng
            </button>
            
            {/* Các menu ảo, khi bấm vào sẽ đổi tên tiêu đề */}
            <button 
              onClick={() => setActivePage('Quản lý Sản phẩm')} 
              className={`block w-full text-left font-bold p-2.5 rounded-lg transition-colors text-sm uppercase ${activePage === 'Quản lý Sản phẩm' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
               Quản lý Sản phẩm
            </button>
            <button 
              onClick={() => setActivePage('Quản lý Đơn hàng')} 
              className={`block w-full text-left font-bold p-2.5 rounded-lg transition-colors text-sm uppercase ${activePage === 'Quản lý Đơn hàng' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
               Quản lý Đơn hàng
            </button>
          </nav>
        </div>

        {/* Nút Quay về trang chủ ở Đáy Sidebar */}
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-lg transition-all text-sm uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Về Trang Chủ
          </Link>
        </div>
      </aside>

      {/* =========================================
          CỘT PHẢI: KHU VỰC NỘI DUNG
      ========================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER TOP RIGHT */}
        <header className="h-16 bg-[#141414] border-b border-gray-800 flex items-center justify-between px-8 flex-shrink-0 z-10">
          
          {/* TIÊU ĐỀ TRANG ĐỘNG: Hiển thị tên menu được chọn (activePage) */}
          <h1 className="text-3xl font-black tracking-tight text-white font-sans animate-fade-in">
            {activePage}
            <span className="text-gray-500 font-normal ml-3 italic"> - Demo</span> {/* optional demo text */}
          </h1>
          
          {/* Dropdown User (giữ nguyên) */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors focus:outline-none"
            >
              Hi, <span className="text-orange-400">{user?.username || 'Admin'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Menu Sổ Xuống (giữ nguyên) */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-2xl py-2 overflow-hidden animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-700 mb-1">
                  <p className="text-xs text-gray-400">Đang đăng nhập với quyền:</p>
                  <p className="text-sm font-bold text-white capitalize">{user?.role || 'admin'}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* MAIN DATA AREA (Thanh cuộn độc lập - giữ nguyên) */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
          {/* Ở đây bạn có thể hiển thị nội dung khác nhau tùy theo activePage,
              hiện tại mình chỉ để trang Quản lý User để demo. */}
          
          {activePage === 'Quản lý Người dùng' ? (
            <div className="max-w-[1200px] mx-auto animate-fade-in">
              <h1 className="text-2xl font-black uppercase tracking-wide mb-8">Quản lý hệ thống Users</h1>

              {/* Form Thêm/Sửa Users (giữ nguyên) */}
              <form onSubmit={handleSubmit} className="bg-[#141414] p-6 rounded-xl border border-gray-800 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mb-10">
                {/* [Form Inputs...] */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">Username</label>
                  <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">Password</label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none" required={!editingId} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">Xác nhận Password</label>
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none" required={!editingId || formData.password.length > 0} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">SĐT</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase">Địa chỉ</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-black border border-gray-700 p-2.5 rounded text-sm focus:border-blue-500 outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2 flex items-center justify-between border-t border-gray-800 pt-5 mt-2">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer border border-gray-700 rounded-md px-4 py-2 text-sm bg-black hover:bg-gray-900 transition-colors">
                      <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="accent-blue-500" /> User
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border border-gray-700 rounded-md px-4 py-2 text-sm bg-black hover:bg-gray-900 transition-colors">
                      <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="accent-blue-500" /> Admin
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    {editingId && (
                      <button type="button" onClick={() => {setEditingId(null); setFormData({username:'', email:'', password:'', confirmPassword:'', role:'user', phone:'', address:''})}} className="text-gray-400 hover:text-white underline text-sm transition-colors">Hủy</button>
                    )}
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-8 rounded shadow-lg transition-all uppercase text-sm">
                      {editingId ? 'Cập nhật' : 'Lưu User'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Bảng Dữ Liệu Users (giữ nguyên) */}
              <div className="border border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-[#141414]">
                {/* [Bảng dữ liệu cũ...] */}
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#1f1f1f] text-gray-300 text-xs uppercase tracking-widest font-black border-b border-gray-700">
                      <th className="p-4 w-16 text-center">ID</th>
                      <th className="p-4">Username</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">SĐT</th>
                      <th className="p-4 text-center">Role</th>
                      <th className="p-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users === null ? (
                      <tr><td colSpan="6" className="p-10 text-center text-gray-500 italic">Đang tải dữ liệu...</td></tr>
                    ) : users.length > 0 ? (
                      users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors text-sm text-gray-300">
                          <td className="p-4 text-center text-gray-500 font-mono">{u.id}</td>
                          <td className="p-4 font-bold text-gray-100">{u.username}</td>
                          <td className="p-4 text-gray-400">{u.email}</td>
                          <td className="p-4 text-gray-400 font-mono">{u.phone || '-'}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${u.role === 'admin' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 flex justify-center items-center gap-3">
                            <button onClick={() => handleEdit(u)} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sửa</button>
                            <span className="text-gray-700">|</span>
                            <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-300 font-bold transition-colors">Xóa</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="p-10 text-center text-gray-500">Database trống.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Nội dung hiển thị cho các trang khác (ví dụ: Sản phẩm, Đơn hàng)
            <div className="max-w-[1200px] mx-auto text-center py-20 bg-[#141414] rounded-xl border border-gray-800 shadow-lg animate-fade-in">
              <h1 className="text-5xl font-black uppercase text-gray-600 mb-6">{activePage}</h1>
              <p className="text-gray-400">Nội dung đang được phát triển...</p>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}

export default UserManagement;