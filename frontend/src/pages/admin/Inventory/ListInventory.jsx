import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUndo,
  FaPlusCircle,
  FaMinusCircle,
  FaCog,
  FaWarehouse,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaHistory
} from "react-icons/fa";
import apiStock from "../../../api/apiStock";
import { toast } from "react-toastify";

const ListInventory = () => {
  const [movements, setMovements] = useState([]);
  const [filters, setFilters] = useState({ type: "", product_name: "", date: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchMovements = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiStock.getAll({ page, ...filters });
      const listData = res.data?.data || res.data || {};
      setMovements(listData.data || []);
      setCurrentPage(listData.current_page || 1);
      setLastPage(listData.last_page || 1);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu tồn kho:", error);
      toast.error("Không thể tải dữ liệu tồn kho!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const typeConfig = {
    import: { text: "Nhập kho", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <FaPlusCircle className="text-emerald-500" /> },
    export: { text: "Xuất kho", color: "bg-rose-100 text-rose-700 border-rose-200", icon: <FaMinusCircle className="text-rose-500" /> },
    adjustment: { text: "Điều chỉnh", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <FaCog className="text-amber-500" /> },
    return: { text: "Trả hàng", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <FaUndo className="text-blue-500" /> },
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchMovements(1);
  };

  const resetFilter = () => {
    setFilters({ type: "", product_name: "", date: "" });
    fetchMovements(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > lastPage) return;
    fetchMovements(page);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaWarehouse className="text-indigo-600" /> Kiểm kê tồn kho
          </h3>
          <p className="text-slate-500 text-sm mt-1">Lịch sử biến động hàng hóa và điều chỉnh số lượng</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/inventory/import"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center shadow-lg shadow-emerald-600/20 transition-all font-semibold active:scale-95"
          >
            <FaPlusCircle className="mr-2" /> Nhập kho
          </Link>
          <Link
            to="/admin/inventory/export"
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl flex items-center shadow-lg shadow-rose-600/20 transition-all font-semibold active:scale-95"
          >
            <FaMinusCircle className="mr-2" /> Xuất kho
          </Link>
          <Link
            to="/admin/inventory/adjust"
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl flex items-center shadow-lg shadow-amber-500/20 transition-all font-semibold active:scale-95"
          >
            <FaCog className="mr-2" /> Điều chỉnh
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
            <FaFilter className="text-indigo-500" /> Công cụ lọc lịch sử
          </div>
          <span className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}>
            <FaChevronRight size={12} className="rotate-90" />
          </span>
        </button>

        {isFilterOpen && (
          <form onSubmit={handleFilter} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Loại thao tác</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white transition-all font-medium"
              >
                <option value="">Tất cả thao tác</option>
                <option value="import">Nhập kho</option>
                <option value="export">Xuất kho</option>
                <option value="adjustment">Điều chỉnh</option>
                <option value="return">Trả hàng</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Sản phẩm</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  value={filters.product_name}
                  onChange={(e) => setFilters({ ...filters, product_name: e.target.value })}
                  placeholder="Tìm tên hoặc mã sản phẩm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-end flex-wrap gap-2">
              <button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Áp dụng
              </button>
              <button
                type="button"
                onClick={resetFilter}
                className="bg-slate-100 p-2.5 rounded-xl hover:bg-slate-200 transition-all text-slate-500"
              >
                <FaUndo size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Số lượng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Kết dư</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ghi chú & Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4"><div className="h-12 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : movements.length > 0 ? (
                movements.map((item) => {
                  const config = typeConfig[item.type] || { text: item.type, color: "bg-slate-100 text-slate-500" };
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-center font-bold text-slate-400">#{item.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide uppercase ${config.color}`}>
                          {config.icon}
                          {config.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 line-clamp-1">{item.product_name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded self-start mt-1 font-mono">SKU: {item.product_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`text-sm font-bold ${item.quantity_change > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {item.quantity_change > 0 ? `+${item.quantity_change}` : item.quantity_change}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                          {item.qty_after}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-600 font-medium line-clamp-1 italic">{item.note || "Không có ghi chú"}</span>
                          <span className="text-[10px] text-slate-400 mt-1 font-bold">
                            {new Date(item.created_at).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400 font-medium">
                    <FaHistory size={48} className="mx-auto mb-4 opacity-10" />
                    Chưa có lịch sử biến động kho nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500 font-medium">Trang <span className="text-slate-900 font-bold">{currentPage}</span> / {lastPage}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <FaChevronLeft size={14} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                  let pageNum = i + 1;
                  if (lastPage > 5 && currentPage > 3) pageNum = currentPage - 3 + i + 1;
                  if (pageNum > lastPage) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === pageNum ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListInventory;
