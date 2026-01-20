import { useSearchParams, useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaHome, FaHistory, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const status = params.get("status");
  const orderId = params.get("order_id");
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsAnimating(true), 100);

    // VNPay success: status = "success" or vnp_ResponseCode = "00"
    if (status === "success" || status === "00") {
      localStorage.removeItem("cartItems");
      setMessage("Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi! Đơn hàng của bạn đã được tiếp nhận và sẽ sớm được chuẩn bị để giao đến bạn.");
    }
    // VNPay cancelled/failed: status = "cancelled" or vnp_ResponseCode != "00"
    else if (status === "cancelled" || status === "7" || (status && status !== "00" && status !== "success")) {
      setMessage("Giao dịch tài khoản đã bị tạm dừng hoặc bạn đã hủy thanh toán. Bạn có thể thử lại sau vài phút hoặc đổi phương thức thanh toán.");
    }
    // Payment failed
    else if (status === "failed") {
      setMessage("Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng kiểm tra lại số dư hoặc liên hệ ngân hàng để được hỗ trợ.");
    }
    // Invalid transaction
    else {
      setMessage("Thông tin giao dịch không hợp lệ hoặc link đã hết hạn sử dụng. Vui lòng quay lại giỏ hàng để bắt đầu lại.");
    }
  }, [status, navigate]);

  const getTheme = () => {
    const isSuccess = status === "success" || status === "00";
    const isCancel = status === "cancelled" || status === "7" || (status && status !== "00" && status !== "success" && status !== "failed");
    const isFailed = status === "failed";

    if (isSuccess) {
      return {
        title: "Thanh toán thành công!",
        gradient: "from-emerald-500 to-teal-600",
        icon: <FaCheckCircle className="text-emerald-500" />,
        colorClass: "text-emerald-600",
        bgLight: "bg-emerald-50",
        shadow: "shadow-emerald-200/50",
        btn: "bg-emerald-600 hover:bg-emerald-700",
      };
    }
    if (isCancel) {
      return {
        title: "Thanh toán đã hủy",
        gradient: "from-amber-400 to-orange-500",
        icon: <FaExclamationCircle className="text-amber-500" />,
        colorClass: "text-amber-600",
        bgLight: "bg-amber-50",
        shadow: "shadow-amber-200/50",
        btn: "bg-amber-500 hover:bg-amber-600",
      };
    }
    return {
      title: "Thanh toán thất bại",
      gradient: "from-rose-500 to-red-600",
      icon: <FaTimesCircle className="text-rose-500" />,
      colorClass: "text-rose-600",
      bgLight: "bg-rose-50",
      shadow: "shadow-rose-200/50",
      btn: "bg-rose-600 hover:bg-rose-700",
    };
  };

  const theme = getTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.gradient} p-4 sm:p-6 transition-all duration-700`}>
      {/* Background shapes for aesthetic */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>

      <div className={`w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl ${theme.shadow} overflow-hidden transition-all duration-1000 transform ${isAnimating ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        {/* Top Header Card */}
        <div className={`h-2 bg-gradient-to-r ${theme.gradient}`}></div>

        <div className="p-8 sm:p-12 text-center">
          {/* Animated Icon Container */}
          <div className="flex justify-center mb-8 relative">
            <div className={`absolute inset-0 ${theme.bgLight} rounded-full blur-xl scale-125 opacity-60`}></div>
            <div className={`relative bg-white rounded-full p-1 shadow-lg transform transition-transform duration-700 delay-300 ${isAnimating ? "scale-100 rotate-0" : "scale-0 -rotate-45"}`}>
              <div className="text-7xl">
                {theme.icon}
              </div>
            </div>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-extrabold ${theme.colorClass} mb-4 tracking-tight`}>
            {theme.title}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>

          {orderId && (
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full mb-10">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Mã đơn hàng:</span>
              <span className="text-sm font-bold text-gray-700">#{orderId}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/"
              className={`flex items-center justify-center gap-2 ${theme.btn} text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 group`}
            >
              <FaHome className="group-hover:-translate-y-1 transition-transform" />
              <span>Trang chủ</span>
            </Link>

            {(status === "success" || status === "00") ? (
              <Link
                to="/history-bought"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 group"
              >
                <FaHistory className="group-hover:rotate-12 transition-transform" />
                <span>Xem đơn hàng</span>
              </Link>
            ) : (
              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 group"
              >
                <FaShoppingCart className="group-hover:bounce-sm transition-transform" />
                <span>Về giỏ hàng</span>
              </Link>
            )}
          </div>

          {/* Simple return hint for failed/cancelled */}
          {(status !== "success" && status !== "00") && (
            <button
              onClick={() => navigate(-1)}
              className="mt-8 text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <FaArrowLeft className="text-[10px]" />
              Quay lại bước trước
            </button>
          )}

          {/* Footer security badge */}
          <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-4 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Secure Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
