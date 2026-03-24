import { useState } from 'react';

const ProductGallery = ({ images = [] }) => {
  // Nếu không có hình, hiện ảnh lỗi
  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-black rounded-xl flex items-center justify-center border border-gray-800">
        <span className="text-gray-700 text-xs">No Image</span>
      </div>
    );
  }

  // State lưu hình ảnh đang được xem chính
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* KHUNG ẢNH CHÍNH (Bo tròn, viền xịn) */}
      <div className="w-full aspect-square bg-black rounded-2xl flex items-center justify-center p-4 border border-gray-800 shadow-inner overflow-hidden relative">
        <img 
          src={mainImage} 
          alt="Product main view" 
          className="max-w-full max-h-full object-contain animate-fade-in"
        />
        {/* Hiệu ứng kính mờ chìm dưới ảnh (Optional, cho sang) */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent -z-10"></div>
      </div>

      {/* DANH SÁCH ẢNH NHỎ (Thumbnails) - Chỉ hiện nếu có từ 2 hình trở lên */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.slice(0, 5).map((img, index) => (
            <button 
              key={index}
              onClick={() => setMainImage(img)}
              className={`aspect-square bg-black rounded-lg p-1.5 border-2 transition-all overflow-hidden ${
                mainImage === img 
                  ? 'border-blue-500 ring-2 ring-blue-500/30' 
                  : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;