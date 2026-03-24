import { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chỗ này sau này có thể gắn API (như EmailJS) để gửi email thật
    toast.success('Tín hiệu đã được phát! Bộ chỉ huy sẽ phản hồi sớm nhất.', { icon: '🚀' });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white w-full py-12 relative overflow-hidden">
      
      {/* Background Decor (Cyberpunk Grid) */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header Trang */}
        <div className="mb-12 text-center md:text-left border-b border-gray-800 pb-6">
          <p className="text-blue-500 font-black tracking-[0.3em] text-sm uppercase mb-2">Transmission Channel</p>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
            KÊNH <span className="text-blue-500 border-b-[4px] border-blue-500 pb-1">GunContact</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN LẠC */}
          <div className="w-full lg:w-5/12 space-y-8">
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Bạn cần hỗ trợ về các mẫu Gunpla, tình trạng đơn hàng hoặc muốn đóng góp ý kiến? Hãy thiết lập kênh liên lạc với chúng tôi qua các tọa độ bên dưới.
            </p>

            <div className="space-y-6">
              {/* Địa chỉ */}
              <div className="flex items-start gap-4 p-5 bg-[#141414] border border-gray-800 rounded-2xl group hover:border-blue-500/50 transition-colors shadow-lg">
                <div className="w-12 h-12 bg-blue-600/10 rounded-full border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-500 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-gray-200 tracking-wider mb-1">Tọa độ Base</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Đại học Công Nghệ Sài Gòn (STU) - 180 Cao Lỗ, Phường Chánh Hưng, Quận 8, TP.HCM</p>
                </div>
              </div>

              {/* Hotline */}
              <div className="flex items-start gap-4 p-5 bg-[#141414] border border-gray-800 rounded-2xl group hover:border-blue-500/50 transition-colors shadow-lg">
                <div className="w-12 h-12 bg-blue-600/10 rounded-full border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-500 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.08-7.074-6.959l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-gray-200 tracking-wider mb-1">Kênh Tần Số Nhắn (Hotline)</h4>
                  <p className="text-blue-400 font-bold text-lg">0909.123.456</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 bg-[#141414] border border-gray-800 rounded-2xl group hover:border-blue-500/50 transition-colors shadow-lg">
                <div className="w-12 h-12 bg-blue-600/10 rounded-full border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-500 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-gray-200 tracking-wider mb-1">Hòm Thư Báo Cáo</h4>
                  <p className="text-gray-400 text-sm">support@gundamstore.vn</p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
          <div className="w-full lg:w-7/12">
            <div className="bg-[#111111] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-500/50 rounded-tr-3xl"></div>

              <h3 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                Gửi Tín Hiệu Yêu Cầu
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tên Pilot (Của bạn)</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tần số Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-black/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tiêu điểm (Vấn đề)</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full bg-black/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"/>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nội dung báo cáo</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full bg-black/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors shadow-inner resize-none"></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-sm tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-95 flex items-center justify-center gap-2 mt-4">
                  Phát Tín Hiệu
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;