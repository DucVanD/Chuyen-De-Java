import { Link } from "react-router-dom";
import useAddToCart from "../../hooks/useAddToCart";
import { getImageUrl } from "../../api/config";
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 p-3 sm:p-4">
      {/* Ảnh sản phẩm */}
      <div className="overflow-hidden rounded-xl relative group">
        <Link to={`/product/${product.slug}`}>
          <img
            src={getImageUrl(product.image, 'product')}
            alt={product.name}
            className="w-full h-[160px] sm:h-[190px] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>

        {/* % giảm giá */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-tr-lg rounded-bl-lg shadow animate-pulse">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="flex flex-col justify-between flex-grow py-2">
        {/* Tên */}
        <Link
          to={`/product/${product.slug}`}
          className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-green-700 transition-colors"
        >
          {product.name}
        </Link>

        {/* Giá */}
        <div className="mt-2">
          {product.discountPrice && product.discountPrice > 0 ? (
            <>
              <p className="text-red-600 font-bold text-[15px] sm:text-[16px]">
                {product.discountPrice.toLocaleString()}₫
              </p>
              <p className="text-gray-400 text-xs line-through">
                {product.salePrice.toLocaleString()}₫
              </p>
            </>
          ) : (
            <p className="text-red-600 font-bold text-[15px] sm:text-[16px]">
              {product.salePrice.toLocaleString()}₫
            </p>
          )}
        </div>

        {/* Nút giỏ hàng */}
        <button
          onClick={() => handleAddToCart(product)}
          disabled={product.qty === 0}
          className={`w-full py-2 mt-3 rounded-xl text-sm font-medium shadow transition-all duration-300 ${product.qty === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-yellow-500 text-white hover:from-green-500 hover:to-yellow-400 hover:shadow-lg"
            }`}
        >
          {product.qty === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}

export default ProductItem;
