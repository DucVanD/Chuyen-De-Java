import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiOrder from "../../../api/apiOrder";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave, FaShoppingCart, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaClock, FaTruck, FaBox, FaUndo, FaTimes } from "react-icons/fa";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        toast.error("Lỗi khi tải dữ liệu đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const isLocked = order && [6, 7].includes(order.status);

  const allowedStatuses = (() => {
    if (!order) return [];
    switch (order.status) {
      case 1: return [1, 2, 3, 4, 5, 6, 7];
      case 2: return [2, 3, 4, 5, 6, 7];
      case 3: return [3, 4, 5, 6, 7];
      case 4: return [4, 5, 6, 7];
      case 5: return [5, 6];
      case 6:
      case 7: return [order.status];
      default: return [order.status];
    }
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.warning("🔒 Đơn hàng này không thể chỉnh sửa trạng thái!");
      return;
    }

    setSaving(true);
    try {
      const res = await apiOrder.editOrder(id, {
        status: parseInt(order.status),
      });
      if (res.status) {
        toast.success("✅ Cập nhật trạng thái đơn hàng thành công!");
        setTimeout(() => navigate("/admin/orders"), 1000);
      }
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật đơn hàng!");
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [
    { value: 1, label: "Đang chờ xác nhận", icon: <FaClock /> },
    { value: 2, label: "Đã xác nhận", icon: <FaCheckCircle /> },
    { value: 3, label: "Đang đóng gói", icon: <FaBox /> },
    { value: 4, label: "Đang giao hàng", icon: <FaTruck /> },
    { value: 5, label: "Đã giao hàng", icon: <FaCheckCircle /> },
    { value: 6, label: "Hoàn hàng / Trả hàng", icon: <FaUndo /> },
    { value: 7, label: "Đã hủy đơn hàng", icon: <FaTimes /> },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold">Đang tải cấu hình vận đơn...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaShoppingCart className="text-indigo-600" /> Quản lý trạng thái đơn
          </h3>
          <p className="text-slate-500 text-sm mt-1">Cập nhật lộ trình vận chuyển và xác nhận xử lý đơn hàng</p>
        </div>
        <Link
          to="/admin/orders"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Về danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg border-b border-slate-50 pb-4">
              <FaInfoCircle className="text-indigo-600" />
              <h4>Thông tin cốt lõi</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Tên khách hàng", value: order.name },
                { label: "Email liên lạc", value: order.email },
                { label: "Số điện thoại", value: order.phone },
                { label: "Giá trị đơn hàng", value: `${Number(order.total_amount || 0).toLocaleString("vi-VN")} đ`, bold: true },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                  <div className={`px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 ${item.bold ? 'font-black text-indigo-600' : 'font-medium'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Địa chỉ giao hàng thực tế</label>
              <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium leading-relaxed">
                {order.address}
              </div>
            </div>
          </div>

          {/* Note Card */}
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 relative overflow-hidden group">
            <h5 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Ghi chú vận chuyển (Chỉ đọc)</h5>
            <p className="text-amber-900 text-sm font-semibold italic relative z-10">
              {order.note ? `"${order.note}"` : "Không có ghi chú đính kèm."}
            </p>
            <FaExclamationTriangle className="absolute -right-4 -bottom-4 text-amber-500/10" size={80} />
          </div>
        </div>

        {/* Sidebar area */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg border-b border-slate-50 pb-4">
              <FaTruck className="text-indigo-600" />
              <h4>Điều chỉnh trạng thái</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cập nhật tiến độ</label>
                <div className="space-y-2">
                  {statusOptions.map((option) => {
                    const isAllowed = allowedStatuses.includes(option.value);
                    const isSelected = order.status === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : isAllowed
                              ? 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
                              : 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={isSelected}
                          disabled={!isAllowed || isLocked}
                          onChange={(e) => setOrder({ ...order, status: parseInt(e.target.value) })}
                          className="hidden"
                        />
                        <span className={`${isSelected ? 'text-white' : 'text-indigo-500'}`}>
                          {option.icon}
                        </span>
                        <span className="text-sm font-bold tracking-tight">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLocked || saving}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 mt-4 ${isLocked
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                  }`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><FaSave /> {isLocked ? "Đơn hàng bị khóa" : "Cập nhật ngay"}</>
                )}
              </button>

              {isLocked && (
                <p className="text-[10px] text-rose-500 font-bold text-center italic mt-2 animate-pulse">
                  Đơn hàng đã hoàn tất hoặc bị hủy, không thể thay đổi thêm.
                </p>
              )}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-100">
            <h5 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Tự động hóa</h5>
            <p className="text-sm font-semibold leading-relaxed relative z-10 italic">
              Email thông báo sẽ tự động được gửi đến khách hàng khi bạn cập nhật trạng thái đơn hàng sang "Đang giao hàng" hoặc "Đã hủy".
            </p>
            <FaClock className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform duration-500" size={100} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOrder;
