import { Link } from "react-router-dom";
import useAddToCart from "../../hooks/useAddToCart";
import { getImageUrl } from "../../api/config";
import { FaCartPlus, FaRegHeart, FaFire } from "react-icons/fa";
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

  // Kiểm tra stock
  const maxPortions = product.saleType === "WEIGHT"
    ? Math.floor((product.qty || 0) / (product.baseWeight || 1))
    : (product.qty || 0);

  const isLowStock = maxPortions > 0 && maxPortions <= 10;
  const isOutOfStock = maxPortions <= 0;

  const formatWeight = (grams) => {
    if (!grams) return "0g";
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1).replace(/\.0$/, "")}kg`;
    }
    return `${grams}g`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl  hover:-translate-y-2 transition-all duration-300 flex flex-col p-4 relative overflow-hidden">

      {/* Background gradient effect on hover */}
      <div className="" />
      {/* absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-100/0 group-hover:from-emerald-50/30 group-hover:via-emerald-50/20 group-hover:to-emerald-100/30 transition-all duration-500 pointer-events-none */}
      {/* Ảnh sản phẩm */}
      <div className="relative overflow-hidden rounded-xl bg-gray-50">
        <Link to={`/product/${product.slug}`}>
          <img
            src={getImageUrl(product.image, 'product')}
            alt={product.name}
            className="w-full h-[180px] sm:h-[200px] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Badge Giảm giá */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg animate-pulse">
            <FaFire className="text-yellow-300" />
            <span>-{discountPercent}%</span>
          </div>
        )}

        {/* Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
            Sắp hết
          </div>
        )}

        {/* Nút yêu thích */}
        <button className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110 transition-all shadow-md opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 duration-300">
          <FaRegHeart className="text-sm" />
        </button>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col justify-between flex-grow mt-4 space-y-3 relative z-10">

        {/* Tên - Giới hạn 2 dòng */}
        <Link
          to={`/product/${product.slug}`}
          className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 hover:text-emerald-600 transition-colors min-h-[40px] leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Giá */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {product.discountPrice && product.discountPrice > 0 ? (
              <>
                <span className="text-rose-600 font-bold text-lg sm:text-xl">
                  {product.discountPrice.toLocaleString()}₫
                </span>
                <span className="text-gray-400 text-xs line-through">
                  {product.salePrice.toLocaleString()}₫
                </span>
              </>
            ) : (
              <span className="text-rose-600 font-bold text-lg sm:text-xl">
                {product.salePrice.toLocaleString()}₫
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
              {product.unitLabel || (product.saleType === "WEIGHT" ? "Phần" : "Gói")}
            </span>
            {!isOutOfStock && (
              <span className="text-[10px] text-emerald-600 font-medium">
                Còn {maxPortions} {product.unitLabel || (product.saleType === "WEIGHT" ? "phần" : "sản phẩm")}
              </span>
            )}
          </div>
        </div>

        {/* Nút giỏ hàng */}
        <button
          onClick={() => handleAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isOutOfStock
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95 group-hover:scale-105"
            }`}
        >
          {isOutOfStock ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Hết hàng
            </span>
          ) : (
            <>
              <FaCartPlus className="text-lg group-hover:animate-bounce" />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductItem;