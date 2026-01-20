import { Link, useParams } from "react-router-dom";
import {
  FaTruck,
  FaUndoAlt,
  FaMoneyBillWave,
  FaHeadset,
  FaStar,
  FaHeart,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";
import { useState, useEffect } from "react";
// Assuming apiProduct is defined elsewhere
import apiProduct from "../../api/user/apiProduct"; // Keep if you need the real API
import apiVoucher from "../../api/user/apiVoucher";
import { imageURL, getImageUrl } from "../../api/config";
import useAddToCart from "../../hooks/useAddToCart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductItem from "./ProductItem";
import { FaSortAmountDownAlt, FaFilter, FaCheck, FaExclamationTriangle } from "react-icons/fa"; // Thêm FaFilter, FaCheck

const Detail = () => {
  const { slug } = useParams(); // lấy slug từ URL
  const [product, setProduct] = useState(null); // Changed to use DUMMY_PRODUCT
  const [loading, setLoading] = useState(false); // Set to false since we use dummy data
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const handleAddToCart = useAddToCart();
  // Simulate API fetch. You should uncomment and use your real API call.
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [vouchers, setVouchers] = useState([]);
  const [savedCodes, setSavedCodes] = useState([]);

  useEffect(() => {
    const fetchProductAndVouchers = async () => {
      setLoading(true);
      try {
        const [prodRes, voucherRes] = await Promise.all([
          apiProduct.getProductBySlug(slug),
          apiVoucher.getActive()
        ]);

        if (prodRes) {
          setProduct(prodRes);
          if (prodRes.categoryId) {
            const related = await apiProduct.getRelatedProducts(prodRes.id, prodRes.categoryId);
            setRelatedProducts(related || []);
          }
        } else {
          setError("Không tìm thấy sản phẩm.");
        }

        setVouchers(voucherRes || []);

        // Load saved vouchers from localStorage
        const saved = JSON.parse(localStorage.getItem("savedVouchers") || "[]");
        setSavedCodes(saved);

      } catch (err) {
        console.error(err);
        setError("Sân phẩm không tồn tại hoặc đã bị gỡ bỏ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndVouchers();
  }, [slug]);

  const handleSaveVoucher = (code) => {
    const saved = JSON.parse(localStorage.getItem("savedVouchers") || "[]");
    if (!saved.includes(code)) {
      const newSaved = [...saved, code];
      localStorage.setItem("savedVouchers", JSON.stringify(newSaved));
      setSavedCodes(newSaved);
      toast.success(`Đã lưu mã ${code} vào kho quà!`);
    } else {
      toast.info(`Mã ${code} đã có trong kho quà của bạn.`);
    }
    // Also copy to clipboard for convenience
    navigator.clipboard.writeText(code);
  };





  // Tabs state
  const [activeTab, setActiveTab] = useState("description"); // "description", "guide", "reviews"

  // console.log("Product Details:", product);
  // Quantity handlers
  const maxPortions = product?.saleType === "WEIGHT"
    ? Math.floor((product?.qty || 0) / (product?.baseWeight || 1))
    : (product?.qty || 0);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxPortions) return Math.max(1, maxPortions);
      return next;
    });
  };
  const handleQuantityInput = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
      return;
    }

    if (value > maxPortions) {
      toast.warn(`Rất tiếc, chúng tôi chỉ còn ${maxPortions} phần trong kho.`, { toastId: "stock-limit" });
      setQuantity(maxPortions);
    } else {
      setQuantity(value);
    }
  };

  const formatWeight = (grams) => {
    if (!grams) return "0g";
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1).replace(/\.0$/, "")}kg`;
    }
    return `${grams}g`;
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-red-500">
        {error || "Sản phẩm không tồn tại."}
      </div>
    );
  }

  // Nội dung Hướng dẫn mua hàng
  const GuideContent = () => (
    <div className="space-y-4 text-gray-700">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Hướng dẫn mua hàng tại Store</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-green-700 mb-2">Bước 1: Tìm kiếm sản phẩm</h4>
          <p className="text-sm">Sử dụng thanh tìm kiếm hoặc duyệt qua các danh mục sản phẩm để tìm món đồ bạn yêu thích.</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-green-700 mb-2">Bước 2: Thêm vào giỏ hàng</h4>
          <p className="text-sm">Chọn số lượng và nhấn "Thêm vào giỏ". Bạn có thể tiếp tục mua sắm hoặc tiến hành thanh toán.</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-green-700 mb-2">Bước 3: Nhập thông tin thanh toán</h4>
          <p className="text-sm">Cung cấp địa chỉ giao hàng và số điện thoại chính xác để chúng tôi phục vụ bạn tốt nhất.</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-green-700 mb-2">Bước 4: Xác nhận đơn hàng</h4>
          <p className="text-sm">Chọn phương thức thanh toán và hoàn tất đặt hàng. Nhân viên sẽ gọi điện xác nhận trong 15 phút.</p>
        </div>
      </div>
    </div>
  );

  // Nội dung Đánh giá
  const ReviewsContent = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <FaStar className="text-4xl text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">Chưa có đánh giá nào</h3>
      <p className="text-gray-500 mt-2">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
      <button className="mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
        Viết đánh giá
      </button>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb đơn giản */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/collections/all" className="hover:text-green-600 transition-colors">
            {product.categoryName || "Danh mục"}
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900 font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          {/* Ảnh sản phẩm (Left Column) */}
          <div className="space-y-3 order-1 md:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white p-2 sm:p-5 shadow-sm">
              {/* Discount Tag */}
              {product.discountPrice > 0 && product.salePrice > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                  -{Math.round(100 - (product.discountPrice / product.salePrice) * 100)}%
                </div>
              )}


              <div className="flex justify-center items-center h-[300px] sm:h-[400px]">
                <img
                  src={getImageUrl(product.image, 'product')}
                  alt={product.name}
                  className="object-contain max-h-full max-w-full hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm (Right Column) */}
          <div className="order-2 md:order-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 sm:mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Brand and Stock Status */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-4">
              <p>
                Thương hiệu:{" "}
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">
                  {product.brandName || "Đang cập nhật"}
                </span>
              </p>
              <span className="hidden sm:inline">|</span>
              <p>
                Tình trạng:{" "}
                <span className={`font-bold ${maxPortions > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {maxPortions > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
              </p>
              <span className="hidden sm:inline">|</span>
              <p className="text-[11px]">Mã: #{product.id}</p>
            </div>

            <hr className="my-4" />

            {/* Price Block (Matching image layout) */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                {/* Nếu có giảm giá */}
                {product.discountPrice > 0 && product.discountPrice < product.salePrice ? (
                  <>
                    <span className="text-4xl font-bold text-red-600">
                      {product.discountPrice.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {product.salePrice.toLocaleString("vi-VN")}₫
                    </span>
                  </>
                ) : (
                  // Không có giảm giá
                  <span className="text-4xl font-bold text-red-600">
                    {product.salePrice ? product.salePrice.toLocaleString("vi-VN") : "Liên hệ"}₫
                  </span>
                )}
                <span className="text-xl text-gray-500 font-medium self-end mb-1">
                  / {product.saleType === "WEIGHT" ? formatWeight(product.baseWeight) : (product.unitLabel || "Gói")}
                </span>
              </div>

              {/* Phần "tiết kiệm" */}
              {product.discountPrice > 0 && product.discountPrice < product.salePrice && (
                <p className="text-sm text-gray-600 mt-1">
                  Tiết kiệm{" "}
                  <span className="font-bold text-red-600">
                    {(product.salePrice - product.discountPrice).toLocaleString("vi-VN")}₫
                  </span>{" "}
                  so với giá thị trường
                </p>
              )}
            </div>


            {/* Views Count */}
            <p className="text-sm text-gray-500 mb-4 flex items-center">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="font-semibold text-gray-700 mr-2">4.5</span>
              (27 người xem sản phẩm này)
            </p>

            {/* Usage/Instruction Box (New section from image) */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm mb-6">
              <p className="font-semibold mb-2">Thông tin vắn tắt:</p>
              <div className="text-gray-700">
                {product.description || "Đang cập nhật mô tả..."}
              </div>
              <button className="text-blue-500 font-bold text-sm mt-3 flex items-center hover:text-green-700 transition-colors">
                <FaStar className="mr-2" />
                Tìm cửa hàng gần bạn nhất
              </button>
            </div>

            {/* Quantity + Add to Cart + Actions (Combined and Styled) */}
            {product.saleType === "WEIGHT" && (
              <div className="text-sm font-medium text-gray-600 mb-3 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 inline-flex items-center gap-2">
                <span className="text-emerald-800">Quy cách:</span>
                <span className="text-emerald-700 font-bold">{quantity} phần</span>
                <span className="text-gray-400">×</span>
                <span>{formatWeight(product.baseWeight)}</span>
                <span className="text-gray-400">=</span>
                <span className="text-emerald-700 font-black text-base">{formatWeight(quantity * product.baseWeight)}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              {/* Bộ chọn số lượng */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50 self-start sm:self-auto">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-5 py-2 text-xl font-bold text-gray-600 hover:bg-white hover:text-emerald-600 transition-all"
                >
                  −
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-14 text-center bg-transparent py-2 text-lg font-bold text-gray-800 focus:outline-none"
                  min="1"
                />

                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-5 py-2 text-xl font-bold text-gray-600 hover:bg-white hover:text-emerald-600 transition-all"
                >
                  +
                </button>
              </div>

              {/* Nút thêm giỏ hàng */}
              <button
                onClick={() => {
                  if (quantity > maxPortions) {
                    toast.error(`Số lượng đặt hàng vượt quá kho (${maxPortions} phần). Vui lòng điều chỉnh lại.`);
                    return;
                  }
                  handleAddToCart(product, quantity);
                }}
                disabled={!product.qty || product.qty <= 0}
                className={`flex-grow text-lg font-extrabold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform active:scale-95 ${!product.qty || product.qty <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-green-700 hover:shadow-green-200"
                  }`}
              >
                <i className="fa-solid fa-cart-shopping mr-2"></i>
                {!product.qty || product.qty <= 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
              </button>

              {/* Nút yêu thích + chia sẻ */}
              <div className="flex gap-2">
                <button className="flex-1 sm:flex-none border border-gray-200 text-gray-400 p-3 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                  <FaHeart className="text-xl mx-auto" />
                </button>
                <button className="flex-1 sm:flex-none border border-gray-200 text-gray-400 p-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-100 transition-all shadow-sm">
                  <FaShareAlt className="text-xl mx-auto" />
                </button>
              </div>
            </div>

            {/* Guarantee/Policy (Optimized for Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 border-t border-b py-5 mb-6">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-truck text-green-600 w-5"></i>
                <span>Miễn phí vận chuyển tại TPHCM</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-shield-halved text-green-600 w-5"></i>
                <span>Bảo hành chính hãng toàn quốc</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-check text-green-600 w-5"></i>
                <span>Cam kết chất lượng 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-rotate-left text-green-600 w-5"></i>
                <span>1 đổi 1 nếu sản phẩm lỗi</span>
              </div>
            </div>


            {/* Note/Memo Field */}
            <div className="mb-8 pt-4 border-t border-gray-50">
              <label htmlFor="product-note" className="text-sm font-bold text-gray-800 mb-3 block">Ghi chú sản phẩm:</label>
              <textarea
                id="product-note"
                rows="2"
                placeholder="Thêm lời nhắn cho chúng tôi (ví dụ: giao giờ hành chính, gọi trước khi đến...)"
                className="w-full border border-gray-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all outline-none bg-gray-50/30"
              />
            </div>
          </div>
        </div>

        {/* --- Mã giảm giá (Coupon Code Section) --- */}
        {vouchers.length > 0 && (
          <div className="bg-emerald-50/50 rounded-2xl p-5 sm:p-8 my-10 border border-emerald-100">
            <h3 className="font-extrabold text-xl text-center text-emerald-900 mb-6 flex items-center justify-center gap-2">
              <span className="text-yellow-500">✨</span> MÃ GIẢM GIÁ ĐANG CÓ <span className="text-yellow-500">✨</span>
            </h3>

            {/* Scroll Container */}
            <div className="overflow-x-auto scrollbar-none pb-2">
              <div className="
                flex gap-4 
                sm:grid sm:grid-cols-2 lg:grid-cols-4
              ">
                {vouchers.map((v) => {
                  const isSaved = savedCodes.includes(v.voucherCode);
                  return (
                    <div
                      key={v.id}
                      className="min-w-[280px] flex-shrink-0 sm:min-w-0 bg-white border-2 border-dashed border-emerald-300 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:border-emerald-500 relative overflow-hidden group"
                    >
                      <div className="absolute -right-8 -top-8 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative z-10">
                        <p className="font-bold text-emerald-800 text-sm mb-2">{v.name}</p>
                        <div className="text-[11px] text-gray-500 leading-relaxed mb-4">
                          <p className="font-medium">
                            {v.discountType === "PERCENTAGE"
                              ? `Giảm ${v.discountValue}% (Tối đa ${v.maxDiscount.toLocaleString()}đ)`
                              : `Giảm ${v.discountValue.toLocaleString()}đ`}
                          </p>
                          <p>Đơn tối thiểu: <span className="text-emerald-600 font-bold">{v.minOrderAmount.toLocaleString()}đ</span></p>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-auto">
                          <span className="font-black text-lg text-indigo-600 tracking-wider">
                            {v.voucherCode}
                          </span>
                          <button
                            onClick={() => handleSaveVoucher(v.voucherCode)}
                            className={`text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all whitespace-nowrap ${isSaved
                              ? "bg-gray-100 text-gray-400 cursor-default"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 px-5"
                              }`}
                          >
                            {isSaved ? "Đã lưu" : "Lưu mã"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* --- End Mã giảm giá --- */}

        {/* Tabs Mô tả / Hướng dẫn / Đánh giá - Scrollable on Mobile */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-gray-100 mb-6 mt-12 sticky top-0 bg-white z-20">
          <div className="flex gap-6 sm:gap-12 min-w-max px-2">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 font-bold text-base sm:text-lg transition-all relative ${activeTab === "description"
                ? "text-emerald-600"
                : "text-gray-400 hover:text-emerald-600"
                }`}
            >
              Mô tả sản phẩm
              {activeTab === "description" && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full shadow-[0_-2px_6px_rgba(16,185,129,0.3)]" />}
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`pb-4 font-bold text-base sm:text-lg transition-all relative ${activeTab === "guide"
                ? "text-emerald-600"
                : "text-gray-400 hover:text-emerald-600"
                }`}
            >
              Hướng dẫn mua hàng
              {activeTab === "guide" && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full shadow-[0_-2px_6px_rgba(16,185,129,0.3)]" />}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 font-bold text-base sm:text-lg transition-all relative ${activeTab === "reviews"
                ? "text-emerald-600"
                : "text-gray-400 hover:text-emerald-600"
                }`}
            >
              Đánh giá (0)
              {activeTab === "reviews" && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full shadow-[0_-2px_6px_rgba(16,185,129,0.3)]" />}
            </button>
          </div>
        </div>

        {/* Nội dung Tabs */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 min-h-[300px] animate-fadeIn">
          {activeTab === "description" && (
            <div>
              {product.detail ? (
                <div
                  className="prose prose-green max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.detail }}
                />
              ) : (
                <p className="italic text-gray-400">Chưa có thông tin chi tiết cho sản phẩm này.</p>
              )}
            </div>
          )}

          {activeTab === "guide" && <GuideContent />}

          {activeTab === "reviews" && <ReviewsContent />}
        </div>

        {/* Sản phẩm liên quan - Using original component's related products */}
        <h2 className="text-2xl font-bold mt-12 mb-5 text-gray-800">
          Sản phẩm liên quan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <ProductItem key={item.id} product={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Không có sản phẩm liên quan.
            </p>
          )}
        </div>



        {/* --- Chính sách hỗ trợ (Retained and slightly improved) --- */}
        <section className="mt-16 pt-10 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-0">
          {[
            { t: "Vận chuyển miễn phí", s: "Hóa đơn trên 3 triệu" },
            { t: "Đổi trả miễn phí", s: "Trong vòng 7 ngày" },
            { t: "100% Hoàn tiền", s: "Nếu sản phẩm lỗi" },
            { t: "Hotline: 1900 6750", s: "Hỗ trợ 24/7" },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default"
            >
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <FaCheck className="text-sm" />
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
                  {b.t}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">{b.s}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default Detail;