import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../Redux/cartSlice";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaHome, FaHistory, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = params.get("status");
  const orderId = params.get("order_id");
  const [message, setMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 50);

    // ✅ Map localized backend statuses to messages
    const isSuccess = status === "success" || status === "thành công" || status === "00";
    const isCancel = status === "cancelled" || status === "đã_hủy" || status === "07" || status === "24";
    const isError = status === "error" || status === "lỗi" || status === "failed";

    if (isSuccess) {
      dispatch(clearCart());
      setMessage("Cảm ơn bạn đã tin dùng sản phẩm của Bean Farm! Đơn hàng của bạn đã được tiếp nhận và sẽ sớm được chuẩn bị để giao đến bạn.");
    } else if (isCancel) {
      setMessage("Bạn đã hủy thanh toán hoặc giao dịch bị tạm dừng. Đừng lo, bạn có thể thử lại sau hoặc đổi phương thức thanh toán khác.");
    } else if (isError) {
      setMessage("Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng kiểm tra lại số dư hoặc liên hệ ngân hàng để được hỗ trợ.");
    } else {
      setMessage("Thông tin giao dịch không xác định hoặc đã hết hạn. Vui lòng quay lại giỏ hàng để kiểm tra và bắt đầu lại quy trình.");
    }
  }, [status]);

  const getTheme = () => {
    const isSuccess = status === "success" || status === "thành công" || status === "00";
    const isCancel = status === "cancelled" || status === "đã_hủy" || status === "07" || status === "24";

    if (isSuccess) {
      return {
        title: "Thanh toán thành công!",
        icon: <FaCheckCircle className="text-emerald-500" />,
        accent: "bg-emerald-500",
        shadow: "shadow-emerald-100",
        text: "text-emerald-700",
        bg: "bg-emerald-50/50"
      };
    }
    if (isCancel) {
      return {
        title: "Thanh toán đã hủy",
        icon: <FaExclamationCircle className="text-amber-500" />,
        accent: "bg-amber-500",
        shadow: "shadow-amber-100",
        text: "text-amber-700",
        bg: "bg-amber-50/50"
      };
    }
    return {
      title: "Giao dịch thất bại",
      icon: <FaTimesCircle className="text-rose-500" />,
      accent: "bg-rose-500",
      shadow: "shadow-rose-100",
      text: "text-rose-700",
      bg: "bg-rose-50/50"
    };
  };

  const theme = getTheme();
  const isSuccess = status === "success" || status === "thành công" || status === "00";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 font-inter">
      <div className={`w-full max-w-lg transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>

        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">

          {/* Subtle Accent Header */}
          <div className={`h-1.5 w-full ${theme.accent}`}></div>

          <div className="p-8 sm:p-12 text-center">

            {/* Minimalist Icon Area */}
            <div className="flex justify-center mb-6">
              <div className={`w-24 h-24 ${theme.bg} rounded-full flex items-center justify-center text-5xl transition-transform duration-700 hover:scale-110 active:scale-95`}>
                {theme.icon}
              </div>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-3`}>
              {theme.title}
            </h1>

            <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed max-w-[20rem] mx-auto">
              {message}
            </p>

            {orderId && (
              <div className="bg-gray-50 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl mb-10 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã đơn hàng</span>
                <span className="text-sm font-bold text-gray-800">#{orderId}</span>
              </div>
            )}

            {/* Premium Button Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                <FaHome />
                <span>Trang chủ</span>
              </Link>

              {isSuccess ? (
                <Link
                  to="/history-bought"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:border-gray-300 transition-all active:scale-95"
                >
                  <FaHistory />
                  <span>Xem đơn hàng</span>
                </Link>
              ) : (
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:border-gray-300 transition-all active:scale-95"
                >
                  <FaShoppingCart />
                  <span>Về giỏ hàng</span>
                </Link>
              )}
            </div>

            {/* Discreet Back Link */}
            {!isSuccess && (
              <button
                onClick={() => navigate(-1)}
                className="mt-8 text-gray-400 hover:text-gray-600 text-xs font-semibold flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <FaArrowLeft className="text-[9px]" />
                <span>QUAY LẠI</span>
              </button>
            )}

          </div>

          {/* Clean Security Footer */}
          <div className="py-6 bg-gray-50/50 border-t border-gray-100 flex justify-center opacity-30">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Bean Farm Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
