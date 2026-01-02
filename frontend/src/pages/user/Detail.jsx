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
import { imageURL, getImageUrl } from "../../api/config";
import useAddToCart from "../../hooks/useAddToCart";
import "react-toastify/dist/ReactToastify.css";
import ProductItem from "./ProductItem";

const Detail = () => {
  const { slug } = useParams(); // lấy slug từ URL
  const [product, setProduct] = useState(null); // Changed to use DUMMY_PRODUCT
  const [loading, setLoading] = useState(false); // Set to false since we use dummy data
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const handleAddToCart = useAddToCart();
  // Simulate API fetch. You should uncomment and use your real API call.
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await apiProduct.getProductBySlug(slug);
        console.log("du lieu api", res);

        if (res) {
          setProduct(res);

          // ✅ Gọi sản phẩm liên quan khi có categoryId
          if (res.categoryId) {
            const related = await apiProduct.getRelatedProducts(res.id, res.categoryId);
            setRelatedProducts(related || []);
          }
        } else {
          setError("Không tìm thấy sản phẩm.");
        }
      } catch (err) {
        console.error(err);
        setError("Sân phẩm không tồn tại hoặc đã bị gỡ bỏ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);





  // Tabs state
  const [activeTab, setActiveTab] = useState("description"); // "description", "guide", "reviews"

  // console.log("Product Details:", product);
  // Quantity handlers
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };
  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(Math.max(1, value || 1));
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Ảnh sản phẩm (Left Column) */}
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white p-5">
              {/* Discount Tag */}
              {product.discountPrice > 0 && product.salePrice > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                  -{Math.round(100 - (product.discountPrice / product.salePrice) * 100)}%
                </div>
              )}


              {/* Main Image */}
              <div className="flex justify-center items-center h-auto min-h-[300px]">
                <div className="w-full max-w-[400px]">
                  <img
                    src={getImageUrl(product.image, 'product')}
                    alt={product.name}
                    className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Thông tin sản phẩm (Right Column) */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Brand and Stock Status (Matching image layout) */}
            <p className="text-base text-gray-600 mb-4">
              Thương hiệu:{" "}
              <span className="text-green-600 font-semibold">
                {product.brandName || "Đang cập nhật"}
              </span>{" "}
              | Tình trạng:{" "}
              <span
                className={`font-semibold ${product.qty > 0 ? "text-green-600" : "text-red-500"
                  }`}
              >
                {product.qty > 0 ? "Còn hàng" : "Hết hàng"}
              </span>
              <span className="text-gray-500 text-sm ml-4">
                | Mã sản phẩm: #{product.id}
              </span>
            </p>

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
              <button className="text-green-600 font-bold text-sm mt-3 flex items-center hover:text-green-700 transition-colors">
                <FaStar className="mr-2" />
                Tìm cửa hàng gần bạn nhất
              </button>
            </div>

            {/* Quantity + Add to Cart + Actions (Combined and Styled) */}

            <div className="flex items-center gap-4 mb-6">
              {/* Bộ chọn số lượng */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  −
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-16 text-center border-x border-gray-300 py-3 text-lg font-semibold focus:outline-none"
                  min="1"
                />

                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              {/* Nút thêm giỏ hàng */}
              <button
                onClick={() => handleAddToCart(product, quantity)}
                disabled={!product.qty || product.qty <= 0}
                className={`flex-grow text-lg font-extrabold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform active:scale-95 ${!product.qty || product.qty <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200"
                  }`}
              >
                <i className="fa-solid fa-cart-shopping mr-2"></i>
                {!product.qty || product.qty <= 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
              </button>

              {/* Nút yêu thích + chia sẻ */}
              <button className="border border-gray-300 text-gray-600 p-3 rounded-lg hover:bg-gray-100 transition">
                <FaHeart className="text-red-500 text-xl" />
              </button>
              <button className="border border-gray-300 text-gray-600 p-3 rounded-lg hover:bg-gray-100 transition">
                <FaShareAlt className="text-xl" />
              </button>
            </div>

            {/* Guarantee/Policy (Matching image layout) */}
            <div className="flex justify-between items-center text-sm text-gray-600 border-t border-b py-3 mb-6">
              <div className="flex items-center">
                <i className="fa-solid fa-truck text-green-600 mr-2"></i>
                Miễn phí vận chuyển tại TPHCM
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-shield-halved text-green-600 mr-2"></i>
                Bảo hành chính hãng toàn quốc
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-check text-green-600 mr-2"></i>
                Cam kết chất lượng 100%
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-rotate-left text-green-600 mr-2"></i>
                1 đổi 1 nếu sản phẩm lỗi
              </div>
            </div>


            {/* Note/Memo Field */}
            <div className="mb-8">
              <label htmlFor="product-note" className="text-sm font-semibold text-gray-700 mb-2 block">Ghi chú:</label>
              <input
                id="product-note"
                type="text"
                placeholder="Thêm ghi chú sản phẩm"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* --- Mã giảm giá (Coupon Code Section) --- */}
        <div className="bg-green-50 rounded-xl p-6 my-10 border border-green-200">
          <h3 className="font-bold text-xl text-center text-green-800 mb-4">
            MÃ GIẢM GIÁ
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { code: "BEA50", desc: "Nhập mã BEA50 giảm 50K đơn từ 750K", type: "Lưu mã" },
              { code: "BEA15", desc: "Nhập mã BEA15 giảm 15% đơn từ 1.500.000₫", type: "Lưu mã" },
              { code: "BEAN99K", desc: "Nhập mã BEAN99K giảm ngay 99K", type: "Lưu mã" },
              { code: "FREESHIP", desc: "Nhập mã FREESHIP miễn phí vận chuyển", type: "OK" },
            ].map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white border-2 border-dashed border-green-500 rounded-lg p-4 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-gray-600 mb-1">{coupon.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-extrabold text-xl text-green-600">
                      {coupon.code}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(coupon.code)}
                      className={`text-sm font-bold px-3 py-1 rounded-full transition ${coupon.type === "Lưu mã"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                      {coupon.type}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* --- End Mã giảm giá --- */}

        {/* Tabs Mô tả / Hướng dẫn / Đánh giá */}
        <div className="border-b flex gap-8 mb-6 mt-12">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 font-semibold text-lg transition-all duration-200 ${activeTab === "description"
              ? "border-b-3 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
              }`}
          >
            Mô tả sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`pb-3 font-semibold text-lg transition-all duration-200 ${activeTab === "guide"
              ? "border-b-3 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
              }`}
          >
            Hướng dẫn mua hàng
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 font-semibold text-lg transition-all duration-200 ${activeTab === "reviews"
              ? "border-b-3 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
              }`}
          >
            Đánh giá (0)
          </button>
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
        <h2 className="text-2xl font-bold mt-12 mb-5 text-gray-800">
          Chính sách hỗ trợ
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <FaTruck className="text-green-600 text-3xl" />,
              text: "Vận chuyển miễn phí",
              sub: "Hóa đơn trên 1.000.000₫", // Changed for a more realistic condition
            },
            {
              icon: <FaUndoAlt className="text-green-600 text-3xl" />,
              text: "Đổi trả miễn phí",
              sub: "Trong vòng 7 ngày",
            },
            {
              icon: <FaMoneyBillWave className="text-green-600 text-3xl" />,
              text: "100% Hoàn tiền",
              sub: "Nếu sản phẩm lỗi",
            },
            {
              icon: <FaHeadset className="text-green-600 text-3xl" />,
              text: "Hotline: 1900 6750",
              sub: "Hỗ trợ 24/7",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition"
            >
              {item.icon}
              <div>
                <p className="font-bold text-gray-800">{item.text}</p>
                <p className="text-sm text-gray-600 mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Detail;