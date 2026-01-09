import { Link } from "react-router-dom";
import useAddToCart from "../../hooks/useAddToCart";
import { getImageUrl } from "../../api/config";
import { FaCartPlus, FaRegHeart } from "react-icons/fa"; // Cần cài react-icons
import "react-toastify/dist/ReactToastify.css";

function ProductItem({ product }) {
  const handleAddToCart = useAddToCart();

  // TÍNH % GIẢM GIÁ
  const discountPercent =
    product.salePrice && product.discountPrice
      ? Math.round(
        ((product.salePrice - product.discountPrice) / product.salePrice) * 100
      )
      : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col p-3 relative">

      {/* Ảnh sản phẩm */}
      <div className="relative overflow-hidden rounded-xl">
        <Link to={`/product/${product.slug}`}>
          <img
            src={getImageUrl(product.image, 'product')}
            alt={product.name}
            className="w-full h-[160px] sm:h-[190px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>
        {/* absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-sm */}
        {/* Badge Giảm giá - Chuyển sang màu đỏ thuần hoặc cam cho nổi bật */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-pink-500 text-white text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-tr-lg rounded-bl-lg shadow animate-pulse">
            -{discountPercent}%
          </div>
        )}

        {/* Nút yêu thích (Hiện khi hover ở Desktop, luôn hiện ở Mobile nếu muốn) */}
        <button className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300">
          <FaRegHeart />
        </button>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col justify-between flex-grow mt-3 space-y-2">
        {/* Tên - Giới hạn 2 dòng */}
        <Link
          to={`/product/${product.slug}`}
          className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 hover:text-green-700 transition-colors min-h-[40px]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Giá */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-end gap-2">
            {product.discountPrice && product.discountPrice > 0 ? (
              <>
                <span className="text-red-600 font-bold text-base sm:text-lg">
                  {product.discountPrice.toLocaleString()}₫
                </span>
                <span className="text-gray-400 text-xs line-through mb-1">
                  {product.salePrice.toLocaleString()}₫
                </span>
              </>
            ) : (
              <span className="text-red-600 font-bold text-base sm:text-lg">
                {product.salePrice.toLocaleString()}₫
              </span>
            )}
          </div>

          {/* Đơn vị tính */}
          <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase font-medium">
            / {product.saleType === "WEIGHT" ? `${product.baseWeight}g` : "Gói"}
          </span>
        </div>

        {/* Nút giỏ hàng - Bỏ màu vàng, dùng tông xanh chủ đạo */}
        <button
          onClick={() => handleAddToCart(product)}
          disabled={product.qty === 0}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${product.qty === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/30 active:scale-95"
            }`}
        >
          {product.qty === 0 ? (
            "Hết hàng"
          ) : (
            <>
              <FaCartPlus className="text-lg" />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductItem;