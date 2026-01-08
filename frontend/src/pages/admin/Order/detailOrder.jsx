import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiOrder from "../../../api/apiOrder";
import { imageURL } from "../../../api/config";
import { FaFilePdf, FaArrowLeft, FaTruck, FaUser, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaBox, FaMoneyBillWave, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const DetailOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiOrder.getOrderId(id);
        if (res.status && res.data) {
          setOrder(res.data);
        } else {
          toast.error("Không tìm thấy đơn hàng!");
          navigate("/admin/orders");
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err);
        toast.error("Lỗi khi kết nối máy chủ lệnh!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleExportInvoice = async () => {
    try {
      await apiOrder.exportInvoice(order.id);
      toast.success("📄 Đang khởi tạo hóa đơn PDF...");
    } catch (error) {
      toast.error("Lỗi xuất hóa đơn!");
    }
  };

  const statusConfig = {
    1: { text: "Chờ xác nhận", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <FaClock className="text-amber-500" /> },
    2: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <FaCheckCircle className="text-blue-500" /> },
    3: { text: "Đang đóng gói", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: <FaBox className="text-indigo-500" /> },
    4: { text: "Đang giao hàng", color: "bg-cyan-100 text-cyan-700 border-cyan-200", icon: <FaTruck className="text-cyan-500" /> },
    5: { text: "Đã giao", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <FaCheckCircle className="text-emerald-500" /> },
    6: { text: "Hoàn trả", color: "bg-rose-100 text-rose-700 border-rose-200", icon: <FaArrowLeft className="text-rose-500" /> },
    7: { text: "Đã hủy", color: "bg-slate-100 text-slate-700 border-slate-200", icon: <FaExclamationTriangle className="text-slate-500" /> },
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-bold">Đang truy xuất dữ liệu vận đơn...</p>
    </div>
  );

  if (!order) return null;

  const totalAmount = order.orderDetails.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-800">Chi tiết vận đơn</h3>
            <span className="px-3 py-1 bg-slate-900 text-white font-mono text-sm rounded-lg">#{order.order_code || order.id}</span>
          </div>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
            <FaCalendarAlt size={12} /> Khởi tạo lúc: {new Date(order.created_at).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportInvoice}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <FaFilePdf /> Xuất hóa đơn
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            <FaArrowLeft /> Trở lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Information Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FaUser size={80} />
            </div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FaUser className="text-indigo-600" /> Thông tin nhận hàng
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400">Người nhận</p>
                <p className="text-lg font-black text-slate-800 uppercase">{order.name}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 font-mono italic">Email</p>
                  <p className="text-sm font-bold text-slate-600">{order.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Số điện thoại</p>
                  <p className="text-sm font-black text-indigo-600">{order.phone}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-2">
                  <FaMapMarkerAlt /> Địa chỉ bàn giao
                </p>
                <p className="text-sm text-slate-600 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {order.address}<br />
                  {order.ward}, {order.district}, {order.province}
                </p>
              </div>
            </div>
          </div>

          {/* Order Meta Card */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
            <h4 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-6">Chi tiết thanh toán</h4>
            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs font-semibold">Phương thức</span>
                <span className="flex items-center gap-2 text-sm font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                  <FaCreditCard className="text-indigo-400" />
                  {order.payment === "cod" ? "Tiền mặt (COD)" : "Chuyển khoản"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs font-semibold">Mã đơn hệ thống</span>
                <span className="text-sm font-mono font-bold text-indigo-300">#{order.id}</span>
              </div>
              <div className="pt-5 border-t border-white/10">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">Trạng thái hiện tại</p>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border font-black text-sm uppercase tracking-wide shadow-lg ${statusConfig[order.status]?.color}`}>
                  {statusConfig[order.status]?.icon}
                  {statusConfig[order.status]?.text}
                </div>
              </div>
            </div>
            <FaMoneyBillWave className="absolute -left-8 -bottom-8 text-white/5" size={150} />
          </div>
        </div>

        {/* Order Items Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <FaBox className="text-indigo-600" /> Danh mục sản phẩm ({order.orderDetails.length})
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white text-left">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-24">Số lượng</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Đơn giá</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.orderDetails.map((detail) => (
                    <tr key={detail.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-white">
                            <img
                              src={detail.product?.thumbnail?.startsWith("http") ? detail.product.thumbnail : `${imageURL}/product/${detail.product?.thumbnail}`}
                              alt={detail.product?.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/100x100?text=Product"; }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm line-clamp-1">{detail.product?.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">ID: #{detail.product?.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">x {detail.qty}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-slate-500">{detail.price_buy.toLocaleString("vi-VN")} đ</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-slate-800">{detail.amount.toLocaleString("vi-VN")} đ</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary Footer */}
            <div className="p-8 bg-slate-900 border-t border-slate-100 text-white relative overflow-hidden">
              <div className="flex flex-col items-end gap-2 relative z-10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Tổng giá trị đơn hàng</p>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  {totalAmount.toLocaleString("vi-VN")} <span className="text-lg font-bold">đ</span>
                </h1>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                  <FaCheckCircle size={10} /> Đã bao gồm thuế & phí vận chuyển
                </div>
              </div>
              <FaClock className="absolute -left-10 -bottom-10 text-white/5" size={180} />
            </div>
          </div>

          {/* Note Card */}
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 italic">
            <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Ghi chú từ khách hàng</h5>
            <p className="text-indigo-900 text-sm font-semibold">
              {order.note ? `"${order.note}"` : "Không có ghi chú đính kèm cho đơn hàng này."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
