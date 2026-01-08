import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import apiOrder from "../../../api/apiOrder";
import {
  FaTrash,
  FaEye,
  FaEdit,
  FaSearch,
  FaShoppingCart,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaBox
} from "react-icons/fa";
import { toast } from "react-toastify";

const ListOrder = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    payment: "",
    order_code: "",
  });

  const statusLabels = {
    1: { text: "Chờ xác nhận", color: "bg-amber-100 text-amber-700 border-amber-200" },
    2: { text: "Đã xác nhận", color: "bg-sky-100 text-sky-800 border-sky-200" },
    3: { text: "Đóng gói", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    4: { text: "Đang giao", color: "bg-blue-100 text-blue-700 border-blue-200" },
    5: { text: "Đã giao", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    6: { text: "Hoàn trả", color: "bg-rose-100 text-rose-700 border-rose-200" },
    7: { text: "Đã hủy", color: "bg-slate-100 text-slate-500 border-slate-200" },
  };

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiOrder.getAllFilter(page, filters);
      if (res.status) {
        setOrders(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
      }
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      toast.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(Number(page) || 1);
  }, [page]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      navigate(`/admin/orders/${pageNumber}`);
    }
  };

  const handleFilter = () => {
    navigate(`/admin/orders/1`);
    fetchOrders(1);
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
      try {
        const res = await apiOrder.delete(id);
        if (res.status === true) {
          toast.success("Xóa đơn hàng thành công!");
          fetchOrders(currentPage);
        } else {
          toast.warning(res.message || "Không thể xóa đơn hàng!");
        }
      } catch (error) {
        toast.error("Lỗi khi xóa đơn hàng!");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaShoppingCart className="text-indigo-600" /> Quản lý đơn hàng
          </h3>
          <p className="text-slate-500 text-sm mt-1">Theo dõi và xử lý các đơn hàng từ khách hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders/trash"
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center transition-all font-semibold"
          >
            <FaTrash className="mr-2" /> Thùng rác
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <FaFilter className="text-indigo-500" /> Công cụ lọc đơn hàng
          </div>
          <span className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}>
            <FaChevronRight size={12} className="rotate-90" />
          </span>
        </button>

        {isFilterOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Mã đơn hàng</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn..."
                  value={filters.order_code}
                  onChange={(e) => setFilters({ ...filters, order_code: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white transition-all"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(statusLabels).map(([key, val]) => (
                  <option key={key} value={key}>{val.text}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Thanh toán</label>
              <select
                value={filters.payment}
                onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white transition-all"
              >
                <option value="">Tất cả phương thức</option>
                <option value="COD">Tiền mặt (COD)</option>
                <option value="BANK">Chuyển khoản</option>
                <option value="MOMO">Ví MoMo</option>
              </select>
            </div>

            <div className="flex items-end flex-wrap gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Tìm kiếm
              </button>
              <button
                onClick={() => { setFilters({ status: "", payment: "", order_code: "" }); fetchOrders(1); }}
                className="bg-slate-100 p-2.5 rounded-xl hover:bg-slate-200 transition-all text-slate-500"
              >
                <FaFilter size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã vận đơn</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">HT. Thanh toán</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4"><div className="h-12 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  const status = statusLabels[order.status] || { text: "N/A", color: "bg-slate-100 text-slate-400" };
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{order.id}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{order.order_code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">{order.name || order.user?.name || "Khách vãng lai"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">
                          {Number(order.total_amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-bold px-2 py-1 rounded border ${order.payment === 'MOMO' ? 'bg-pink-50 text-pink-600 border-pink-100' : order.payment === 'BANK' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/orderDetail/${order.id}`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/editOrder/${order.id}`)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Xử lý"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Hủy đơn"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                    <FaBox size={48} className="mx-auto mb-4 opacity-10" />
                    Không tìm thấy đơn hàng nào thỏa mãn điều kiện.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-sm text-slate-500 font-medium">
            Hiển thị trang <span className="text-slate-900 font-bold">{currentPage}</span> / {lastPage}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <FaChevronLeft size={14} />
            </button>

            {Array.from({ length: lastPage }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === i + 1 ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOrder;
