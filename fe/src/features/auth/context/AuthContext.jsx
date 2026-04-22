import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAuth = async () => {
      // 1. Quét tìm token trên thanh URL
      const urlString = window.location.href;
      const tokenMatch = urlString.match(/token=\s*([^&/#]+)/); 
      let tokenFromUrl = tokenMatch ? tokenMatch[1] : null;

      // 2. Nếu có token trên URL -> Cất vào localStorage và dọn dẹp URL
      if (tokenFromUrl) {
        tokenFromUrl = decodeURIComponent(tokenFromUrl).trim();
        localStorage.setItem('token', tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 3. Lấy token ra xài
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        
        // 🔥 BƯỚC ĐỘT PHÁ (OPTIMISTIC UI): Set user tạm thời ngay lập tức!
        // Điều này giúp nút Đăng nhập biến mất NGAY LẬP TỨC mà không cần đợi API
        setUser({
          username: '...', // Tên tạm hiển thị trong 1-2 giây chờ Backend
          email: 'Đang kết nối...',
          role: 'user',
          token: savedToken
        });

        try {
          // 4. GỌI LÊN BACKEND LẤY THÔNG TIN THẬT ĐỂ GHI ĐÈ VÀO
          const response = await axios.get('https://web-pgb0.onrender.com/me', {
            headers: { 
              Authorization: `Bearer ${savedToken}`,
              Accept: 'application/json'
            }
          });

          // NẾU THÀNH CÔNG: Lấy data thật từ Backend
          const userData = response.data?.data || response.data;
          
          // Cập nhật lại thông tin thật (Tên thật, Role thật)
          setUser({
            ...userData,
            token: savedToken
          });
          
        } catch (error) {
          // NẾU BACKEND LỖI (CORS, 404, 500...)
          console.error('❌ Backend từ chối Token hoặc lỗi kết nối (CORS/Sai API):', error);
          
          // 🔥 GIẢI PHÁP TẠM THỜI: TẠO USER ẢO ĐỂ BẠN LÀM TIẾP GIAO DIỆN 🔥
          console.warn('⚠️ ĐANG DÙNG FAKE USER ĐỂ TEST UI VÌ BACKEND LỖI!');
          setUser({
            username: 'Test Pilot',
            email: 'pilot@gundam.com',
            role: 'user',
            token: savedToken
          });
          
          // (Khi nào Backend sửa xong, bạn hãy xóa đoạn setUser ảo ở trên đi và 
          // mở lại 2 dòng dưới đây để code chạy đúng chuẩn bảo mật nhé)
          // localStorage.removeItem('token');
          // setUser(null);
        }
      }

      setLoading(false);
    };

    fetchUserAuth();
  }, []);

  // Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/'; 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
