import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../../Redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../api/config";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaSortAmountDownAlt, FaFilter, FaCheck } from "react-icons/fa";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaTruck,
  FaUndoAlt,
  FaMoneyBillWave,
  FaHeadset,
} from "react-icons/fa";
import VoucherInput from "./VoucherInput";

const Cart = () => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [companyInvoice, setCompanyInvoice] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const cartItems = useSelector((state) => state.cart.items);
  const isLoggedIn = useSelector((state) => !!state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Logic Xử lý ---

  const changeQuantity = (id, qty, maxQty) => {
    if (qty < 1) qty = 1;
    if (qty > maxQty) {
      qty = maxQty;
      toast.warn("Đã chọn số lượng tối đa trong kho!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
    dispatch(updateQuantity({ id, qty }));
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const clearAllCart = () => {
    if (cartItems.length === 0) {
      toast.info("🛒 Giỏ hàng đang trống!", { position: "top-right", autoClose: 1000 });
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
      dispatch(clearCart());
      toast.success("🧹 Đã xóa toàn bộ sản phẩm khỏi giỏ hàng!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  // ✅ Logic lấy giá cuối cùng (Ưu tiên giá giảm)
  const getFinalPrice = (item) => {
    if (item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.salePrice) {
      return item.discountPrice;
    }
    return item.salePrice;
  };

  // ✅ Tính phần trăm giảm giá
  const getDiscountPercent = (original, sale) => {
    if (!original || !sale || original <= sale) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  const getSubtotal = cartItems.reduce(
    (total, item) => total + getFinalPrice(item) * item.qty,
    0
  );

  const shippingFee = 0; // Free shipping
  const totalAmount = getSubtotal - discountAmount + shippingFee;

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const handleVoucherApplied = (voucher, discount) => {
    setAppliedVoucher(voucher);
    setDiscountAmount(discount);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.warn("Vui lòng đăng nhập để tiến hành thanh toán!", {
        position: "top-right",
        autoClose: 1000,
      });
      navigate("/registered", { state: { from: "/cart" } });
      return;
    }
    // Pass voucher data to checkout
    navigate("/checkout", {
      state: {
        appliedVoucher,
        discountAmount
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-green-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-semibold">Giỏ hàng</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl shadow-sm px-5 py-4 border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            🛒 Giỏ hàng của bạn
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Bạn hiện có <span className="font-semibold text-green-600">{cartItems.length}</span> sản phẩm trong giỏ hàng
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearAllCart}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium shadow-sm"
          >
            <FaTrash className="text-sm" />
            <span>Xóa tất cả</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 🛍 Danh sách sản phẩm */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-green-50 border-b border-green-100 font-semibold text-gray-700 text-sm uppercase tracking-wide">
              <div className="col-span-5">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Thành tiền</div>
              <div className="col-span-1 text-center">Xóa</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.length === 0 ? (
                <p className="p-6 text-center text-gray-500">Giỏ hàng của bạn đang trống 😢</p>
              ) : (
                cartItems.map((item) => {
                  const finalPrice = getFinalPrice(item);
                  const hasDiscount = item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.salePrice;

                  return (
                    <div key={item.id} className="p-4 md:grid md:grid-cols-12 flex flex-col md:items-center gap-4 hover:bg-gray-50 transition-colors">
                      {/* Cột: Hình ảnh & Tên */}
                      <div className="col-span-5 flex items-center gap-4">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-gray-200"
                        />
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-gray-400 text-sm">{item.categoryName || "Sản phẩm"}</p>
                        </div>
                      </div>

                      {/* Cột: Đơn giá (Có logic hiển thị giảm giá) */}
                      <div className="col-span-2 flex flex-col items-center justify-center">
                        {hasDiscount ? (
                          <>
                            <span className="font-bold text-gray-800">{formatPrice(finalPrice)}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-gray-400 line-through">{formatPrice(item.salePrice)}</span>
                              <span className="text-xs font-bold text-red-500 bg-red-50 px-1 rounded">
                                -{getDiscountPercent(item.salePrice, item.discountPrice)}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-700">{formatPrice(finalPrice)}</span>
                        )}
                      </div>

                      {/* Cột: Số lượng */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9">
                          <button
                            onClick={() => changeQuantity(item.id, item.qty - 1, item.product_qty)}
                            className="px-2 h-full hover:bg-gray-100 transition flex items-center"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => changeQuantity(item.id, parseInt(e.target.value) || 1, item.product_qty)}
                            className="w-10 text-center border-x border-gray-200 focus:outline-none h-full text-sm"
                            min="1"
                            max={item.product_qty}
                          />
                          <button
                            onClick={() => changeQuantity(item.id, item.qty + 1, item.product_qty)}
                            className="px-2 h-full hover:bg-gray-100 transition flex items-center"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      </div>

                      {/* Cột: Thành tiền (Giá cuối * SL) */}
                      <div className="col-span-2 text-center font-bold text-green-600">
                        {formatPrice(finalPrice * item.qty)}
                      </div>

                      {/* Cột: Xóa */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Summary */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-green-50 border-t border-green-100 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold">{formatPrice(getSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-semibold text-green-600">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="border-t border-green-200 pt-2 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-green-700">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="text-end">
              <button
                className="bg-green-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 shadow-md transition-all hover:-translate-y-1"
                onClick={handleCheckout}
              >
                TIẾN HÀNH THANH TOÁN
              </button>
            </div>
          )}
        </div>

        {/* 🧾 Sidebar (Giữ nguyên logic của bạn) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Thời gian giao hàng */}
          {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🕒 Thời gian giao hàng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày</label>
                <select
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">Chọn ngày giao hàng</option>
                  <option value="today">Hôm nay</option>
                  <option value="tomorrow">Ngày mai</option>
                  <option value="day-after">Ngày kia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn thời gian</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">Chọn khung giờ</option>
                  <option value="morning">8h00 - 12h00</option>
                  <option value="afternoon">12h00 - 17h00</option>
                  <option value="evening">17h00 - 20h00</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="companyInvoice"
                  checked={companyInvoice}
                  onChange={(e) => setCompanyInvoice(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="companyInvoice" className="ml-2 text-sm text-gray-700 select-none cursor-pointer">
                  Xuất hóa đơn công ty
                </label>
              </div>
            </div>
          </div> */}

          {/* Voucher Input */}
          <VoucherInput
            subtotal={getSubtotal}
            onVoucherApplied={handleVoucherApplied}
          />
        </div>
      </div>

      {/* Footer Info */}
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
  );
};

export default Cart;