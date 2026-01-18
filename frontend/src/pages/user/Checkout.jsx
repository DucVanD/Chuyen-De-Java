import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import apiOrder from "../../api/user/apiOrder";
import { clearCart } from "../../Redux/cartSlice";
import { getImageUrl } from "../../api/config";
import { toast } from "react-toastify";
import {
  FaMoneyBillWave,
  FaUniversity,
  FaQrcode,
  FaShieldAlt,
  FaHeadset,
  FaTruck,
  FaCheck,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// --- Data mẫu ---
const districts = {
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10", "Bình Thạnh", "Gò Vấp", "Tân Bình", "Tân Phú", "Thủ Đức"],
};
const wards = {
  "Quận 1": ["Bến Nghé", "Bến Thành"],
  "Quận 3": ["Phường 1", "Phường 2"],
  "Quận 5": ["Phường 8", "Phường 11"],
  "Quận 7": ["Tân Phú", "Tân Thuận Đông"],
  "Quận 10": ["Phường 1", "Phường 5"],
  "Bình Thạnh": ["Phường 19", "Phường 22"],
  "Gò Vấp": ["Phường 5", "Phường 8"],
  "Tân Bình": ["Phường 4", "Phường 6"],
  "Tân Phú": ["Phú Thọ Hòa", "Phú Trung"],
  "Thủ Đức": ["Linh Trung", "Hiệp Bình Chánh"],
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  // Get voucher from Cart
  const appliedVoucher = location.state?.appliedVoucher || null;
  const voucherDiscount = location.state?.discountAmount || 0;

  const [form, setForm] = useState({
    email: "", name: "", phone: "", address: "", province: "Hồ Chí Minh", district: "", ward: "", note: "", payment: "cod",
  });
  const [errors, setErrors] = useState({}); // ✅ State lưu lỗi validation
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { ward: "" } : {}),
    }));
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getFinalPrice = (item) => {
    if (item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.salePrice) {
      return item.discountPrice;
    }
    return item.salePrice;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getFinalPrice(item) * item.qty, 0);
  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập SĐT";
    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!form.district) newErrors.district = "Chọn quận/huyện";
    if (!form.ward) newErrors.ward = "Chọn phường/xã";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (loading) return;
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);
    const orderData = {
      // User ID (required by backend)
      userId: user.id,

      // User Info -> Receiver Info
      receiverName: form.name,
      receiverEmail: form.email,
      receiverPhone: form.phone,
      receiverAddress: form.address,
      district: form.district,
      ward: form.ward,
      note: form.note,

      // Payment -> Uppercase for Enum
      paymentMethod: form.payment.toUpperCase(),

      // Money fields with voucher discount
      subtotal: subtotal,
      shippingFee: 0,
      discountAmount: voucherDiscount,
      totalAmount: subtotal - voucherDiscount,

      // Voucher code (if applied)
      voucherCode: appliedVoucher?.voucherCode || null,

      // Cart -> OrderDetails
      orderDetails: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        priceBuy: getFinalPrice(item),
      })),
    };

    try {
      const res = await apiOrder.checkout(orderData);
      console.log("Checkout response:", res);

      // Handle VNPay payment
      if (form.payment === "vnpay") {
        // Backend returns { status, order, message } for VNPay
        if (res?.order?.id) {
          try {
            const paymentRes = await apiOrder.createVnpayPayment(res.order.id);
            if (paymentRes?.paymentUrl) {
              // Redirect to VNPay payment page
              window.location.href = paymentRes.paymentUrl;
              return;
            }
          } catch (paymentError) {
            console.error("VNPay payment error:", paymentError);
            toast.error("Không thể tạo link thanh toán VNPay. Vui lòng thử lại!");
            setLoading(false);
            return;
          }
        }
        toast.error("Không thể tạo đơn hàng. Vui lòng thử lại!");
        setLoading(false);
        return;
      }

      // Success for COD/BANK - backend returns OrderDto directly
      toast.success("🎉 Đặt hàng thành công!");
      dispatch(clearCart());
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Lỗi hệ thống, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // --- UI Components ---
  const InputField = ({ label, name, icon: Icon, placeholder }) => (
    <div className="mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Icon />
        </div>
        <input
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-3 border rounded-xl text-sm outline-none transition-all ${errors[name] ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            }`}
        />
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1 ml-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 1. STEPPER */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm mb-1"><FaCheck /></div>
            <span className="text-xs font-semibold text-green-700">Giỏ hàng</span>
          </div>
          <div className="flex-1 h-1 bg-green-600 mx-2 rounded"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm mb-1">2</div>
            <span className="text-xs font-semibold text-green-700">Thanh toán</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2 rounded"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm mb-1">3</div>
            <span className="text-xs font-medium text-gray-400">Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: FORM */}
        <div className="flex-1 space-y-6">
          {/* Thông tin giao hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" /> Thông tin nhận hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="name" icon={FaUser} placeholder="Họ và tên" />
              <InputField name="phone" icon={FaPhone} placeholder="Số điện thoại" />
            </div>
            <InputField name="email" icon={FaEnvelope} placeholder="Địa chỉ Email" />
            <InputField name="address" icon={FaMapMarkerAlt} placeholder="Địa chỉ (Số nhà, tên đường)" />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <select name="district" value={form.district} onChange={handleChange}
                  className={`w-full p-3 border rounded-xl text-sm outline-none appearance-none bg-white ${errors.district ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                  <option value="">Chọn Quận/Huyện</option>
                  {districts["Hồ Chí Minh"].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>
              <div>
                <select name="ward" value={form.ward} onChange={handleChange} disabled={!form.district}
                  className={`w-full p-3 border rounded-xl text-sm outline-none appearance-none bg-white ${errors.ward ? 'border-red-500 bg-red-50' : 'border-gray-200 disabled:bg-gray-100'}`}>
                  <option value="">Chọn Phường/Xã</option>
                  {(wards[form.district] || []).map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
                {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
              </div>
            </div>

            <textarea name="note" placeholder="Ghi chú cho đơn hàng (Ví dụ: Giao giờ hành chính)" value={form.note} onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm h-24 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
          </div>

          {/* 2. PAYMENT METHODS (GIAO DIỆN MỚI) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Phương thức thanh toán</h2>
            <div className="space-y-3">
              {[
                { id: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: <FaMoneyBillWave className="text-2xl text-green-600" />, desc: "Thanh toán tiền mặt khi giao hàng" },
                { id: "bank", label: "Chuyển khoản ngân hàng", icon: <FaUniversity className="text-2xl text-blue-600" />, desc: "Quét mã QR hoặc chuyển khoản thủ công" },
                { id: "vnpay", label: "Ví VNPAY / Thẻ ATM", icon: <FaQrcode className="text-2xl text-red-500" />, desc: "Thanh toán nhanh qua ứng dụng ngân hàng" }
              ].map((method) => (
                <div key={method.id}
                  onClick={() => handleChange({ target: { name: 'payment', value: method.id } })}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${form.payment === method.id ? "border-green-500 bg-green-50 ring-1 ring-green-500" : "border-gray-200 hover:border-green-300"}`}
                >
                  <div className="mr-4">{method.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{method.label}</h4>
                    <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${form.payment === method.id ? "border-green-600" : "border-gray-300"}`}>
                    {form.payment === method.id && <div className="w-3 h-3 bg-green-600 rounded-full"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: SUMMARY */}
        <div className="lg:w-[380px] space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">Đơn hàng của bạn</h2>

            <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative">
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{item.qty}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 line-clamp-2">{item.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {item.saleType === "WEIGHT"
                        ? `${item.unitLabel || "phần"} (${item.qty * (item.baseWeight || 0)} gram)`
                        : (item.unitLabel || "đơn vị")}
                    </p>
                    <p className="text-sm font-bold text-green-600 mt-1">{formatPrice(getFinalPrice(item) * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100 text-sm">
              <div className="flex justify-between text-gray-500"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <FaCheck className="text-xs" />
                    Giảm giá ({appliedVoucher?.voucherCode})
                  </span>
                  <span className="font-semibold">-{formatPrice(voucherDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500"><span>Phí vận chuyển</span><span className="text-green-600 font-medium">Miễn phí</span></div>
              <div className="flex justify-between text-xl font-bold text-red-600 pt-3">
                <span>Tổng cộng</span>
                <span>{formatPrice(subtotal - voucherDiscount)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} disabled={loading}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 hover:-translate-y-1"}`}>
              {loading ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
            </button>

            {/* 4. TRUST SIGNALS */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1">
                <FaShieldAlt className="text-green-600 text-xl" />
                <span className="text-[10px] text-gray-500 font-medium">Bảo mật tuyệt đối</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaTruck className="text-green-600 text-xl" />
                <span className="text-[10px] text-gray-500 font-medium">Giao siêu tốc</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaHeadset className="text-green-600 text-xl" />
                <span className="text-[10px] text-gray-500 font-medium">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MOBILE STICKY BAR (Chỉ hiện trên mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Tổng thanh toán</p>
          <p className="text-lg font-bold text-red-600">{formatPrice(subtotal)}</p>
        </div>
        <button onClick={handleCheckout} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-md active:scale-95">
          Đặt Hàng
        </button>
      </div>
    </div>
  );
};

export default Checkout;