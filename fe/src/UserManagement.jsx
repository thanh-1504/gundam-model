import { useState, useEffect } from 'react';
import axios from 'axios';
// Đảm bảo bạn đã để file logo.png trong thư mục src/assets/img/
import logoHobby from './img/logo.png'; 

// ĐỊA CHỈ API RENDER CỦA BẠN
const API_URL = 'https://gundam-model.onrender.com/users'; 

function App() {
  const [users, setUsers] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // Thêm trường xác nhận mật khẩu
    role: 'user',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // 1. LẤY DANH SÁCH (READ)
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. THÊM HOẶC CẬP NHẬT (CREATE / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra Xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu và Xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      // Loại bỏ confirmPassword ra khỏi data gửi lên API
      const { confirmPassword, ...submitData } = formData;

      if (editingId) {
        // CẬP NHẬT: PATCH
        await axios.patch(`${API_URL}/${editingId}`, submitData);
        setEditingId(null);
        alert('Cập nhật thành công!');
      } else {
        // THÊM MỚI: POST
        await axios.post(API_URL, submitData);
        alert('Thêm mới thành công!');
      }
      setFormData({ username: '', email: '', password: '', confirmPassword: '', role: 'user', phone: '', address: '' });
      fetchUsers();
    } catch (error) {
      alert('Lỗi: Username/Email đã tồn tại hoặc server Render đang khởi động (đợi 30s)!');
    }
  };

  // 3. ĐỔ DỮ LIỆU LÊN FORM ĐỂ SỬA
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Để trống mật khẩu nếu không muốn đổi
      confirmPassword: '',
      role: user.role || 'user',
      phone: user.phone || '',
      address: user.address || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. XÓA (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Header (Logo & Title) */}
        <div className="mb-10">
          <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden border border-gray-600 shadow-lg bg-black">
            <img 
              src={logoHobby} 
              alt="Hobby Japan Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Hobby Japan - Demo
          </h1>
        </div>

        {/* Form Nhập liệu - Layout Grid 2 cột */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-12">
          
          {/* CỘT TRÁI & PHẢI ĐƯỢC XẾP THEO THỨ TỰ GRID */}
          
          {/* Hàng 1 */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Username</label>
            <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-black border border-gray-600 p-2.5 rounded text-sm focus:border-blue-500 outline-none transition-colors" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-black border border-gray-600 p-2.5 rounded text-sm focus:border-blue-500 outline-none transition-colors" required />
          </div>

          {/* Hàng 2 */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full bg-black border border-gray-600 p-2.5 rounded text-sm focus:border-blue-500 outline-none transition-colors" required={!editingId} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Xác nhận Password</label>
            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-black border border-gray-600 p-2.5 rounded text-sm focus:border-blue-500 outline-none transition-colors" required={!editingId || formData.password.length > 0} />
          </div>

          {/* Hàng 3 */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">SĐT</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black border border-gray-600 p-2.5 rounded text-sm focus:border-blue-500 outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Địa chỉ</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-black border border-gray-600 p-2.5 rounded text-sm focus:border-blue-500 outline-none transition-colors" />
          </div>

          {/* Hàng 4 */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Role</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer border border-gray-500 rounded-md px-4 py-2 text-sm bg-black hover:bg-gray-900 transition-colors">
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="accent-white w-4 h-4" /> User
              </label>
              <label className="flex items-center gap-2 cursor-pointer border border-gray-500 rounded-md px-4 py-2 text-sm bg-black hover:bg-gray-900 transition-colors">
                <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="accent-white w-4 h-4" /> Admin
              </label>
            </div>
          </div>

          {/* Nút Lưu (Nằm cùng hàng 4, cột phải) */}
          <div className="flex items-end">
            <button type="submit" className="w-full bg-[#2a85ff] hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded text-sm transition-all h-[42px]">
              {editingId ? 'Cập nhật' : 'Lưu'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData({username:'', email:'', password:'', confirmPassword:'', role:'user', phone:'', address:''})}} className="ml-4 text-gray-400 hover:text-white underline text-sm whitespace-nowrap">Hủy sửa</button>
            )}
          </div>
        </form>

        {/* Bảng Danh sách */}
        <div className="border border-gray-600 rounded overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2c2c2c] border-b border-gray-600 text-gray-300 text-[10px] sm:text-xs uppercase tracking-widest font-black">
                <th className="p-3 border-r border-gray-600 w-16 text-center">Mã</th>
                <th className="p-3 border-r border-gray-600">Username</th>
                <th className="p-3 border-r border-gray-600">Email</th>
                <th className="p-3 border-r border-gray-600">SĐT</th>
                <th className="p-3 border-r border-gray-600 text-center">Role</th>
                <th className="p-3 border-r border-gray-600">Địa chỉ</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users === null ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-500 italic">Đang tải dữ liệu từ Cloud Render... (Vui lòng đợi 30s)</td></tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-600 bg-[#1a1a1a] hover:bg-[#252525] transition-colors text-xs sm:text-sm">
                    <td className="p-3 border-r border-gray-600 text-center text-gray-500 font-mono italic">{u.id}</td>
                    <td className="p-3 border-r border-gray-600 font-semibold">{u.username}</td>
                    <td className="p-3 border-r border-gray-600 text-gray-400">{u.email}</td>
                    <td className="p-3 border-r border-gray-600 text-gray-400 font-mono">{u.phone || 'Chưa có'}</td>
                    <td className="p-3 border-r border-gray-600 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>
                            {u.role}
                        </span>
                    </td>
                    <td className="p-3 border-r border-gray-600 text-gray-400 italic">{u.address || 'Chưa có'}</td>
                    <td className="p-3 flex justify-center items-center gap-2">
                      <button onClick={() => handleEdit(u)} className="bg-[#4a69bd] hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded shadow transition-all">Sửa</button>
                      <button onClick={() => handleDelete(u.id)} className="bg-[#e55039] hover:bg-red-700 text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded shadow transition-all">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="p-10 text-center text-gray-500">Database trống. Hãy thực hiện lưu người dùng đầu tiên!</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-gray-600 text-[10px] uppercase tracking-widest">
            Hobby Japan User Management System v1.0.0
        </p>
      </div>
    </div>
  );
}

export default App;