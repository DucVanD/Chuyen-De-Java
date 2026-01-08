import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEye,
  FaEdit,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaFilter,
  FaBox,
  FaCube,
  FaChevronRight,
  FaChevronLeft
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiProduct from "../../../api/apiProduct";
import apiCategory from "../../../api/apiCategory";
import apiBrand from "../../../api/apiBrand";
import { imageURL } from "../../../api/config";

const ListProduct = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const [filters, setFilters] = useState({
    category_id: "",
    brand_id: "",
    min_price: "",
    max_price: "",
    low_stock: false,
    status: "",
    keyword: "",
  });

  useEffect(() => {
    apiCategory.getAll().then((res) => setCategories(res.data?.data || []));
    apiBrand.getAll().then((res) => setBrands(res.data?.data || []));
  }, []);

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await apiProduct.getAllFiltered(filters, pageNum);
      if (res.status) {
        setProducts(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
      }
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      toast.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(Number(page) || 1);
  }, [page]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      navigate(`/admin/products/${pageNumber}`);
    }
  };

  const handleFilter = () => {
    navigate(`/admin/products/1`);
    fetchProducts(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const res = await apiProduct.delete(id);
      if (res.status) {
        toast.success("Đã chuyển sản phẩm vào thùng rác!");
        fetchProducts(currentPage);
      }
    } catch (err) {
      toast.error("Lỗi khi xóa sản phẩm!");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await apiProduct.toggleStatus(id);
      fetchProducts(currentPage);
      toast.success("Đã cập nhật trạng thái!");
    } catch (err) {
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaBox className="text-indigo-600" /> Quản lý sản phẩm
          </h3>
          <p className="text-slate-500 text-sm mt-1">Xem và quản lý tất cả sản phẩm trong hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/addProduct"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95 font-semibold"
          >
            <FaPlus className="mr-2" /> Thêm sản phẩm
          </Link>
          <Link
            to="/admin/trashProduct"
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
            <FaFilter className="text-indigo-500" /> Bộ lọc tìm kiếm
          </div>
          <span className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}>
            <FaChevronRight size={12} className="rotate-90" />
          </span>
        </button>

        {isFilterOpen && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tìm kiếm</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tên sản phẩm..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Danh mục</label>
              <select
                value={filters.category_id}
                onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white transition-all"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Thương hiệu</label>
              <select
                value={filters.brand_id}
                onChange={(e) => setFilters({ ...filters, brand_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white transition-all"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end flex-wrap gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Áp dụng lọc
              </button>
              <button
                onClick={() => setFilters({ category_id: "", brand_id: "", min_price: "", max_price: "", low_stock: false, status: "", keyword: "" })}
                className="bg-slate-100 p-2.5 rounded-xl hover:bg-slate-200 transition-all text-slate-500"
                title="Reset"
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-left">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20 text-center">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phân loại</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Giá bán</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Kho</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
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
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                          <img
                            src={`${imageURL}/product/${p.thumbnail}`}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.name}</span>
                          <span className="text-xs text-slate-400 font-medium">Slug: {p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{p.categoryName || "Chưa rõ"}</span>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{p.brandName || "No Brand"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">
                          {p.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </span>
                        {p.sale > 0 && (
                          <span className="text-[11px] text-emerald-500 font-bold bg-emerald-50 self-end px-1.5 rounded">
                            Sale: {p.sale?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-xs ${p.qty <= 10 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"}`}>
                        {p.qty}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`text-2xl transition-all ${p.status === 1 ? "text-emerald-500" : "text-slate-300"}`}
                      >
                        {p.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/editProduct/${p.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Sửa"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                    <FaCube size={48} className="mx-auto mb-4 opacity-10" />
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-sm text-slate-500 font-medium">
            Trang <span className="text-slate-900 font-bold">{currentPage}</span> / {lastPage}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <FaChevronLeft size={14} />
            </button>

            {Array.from({ length: Math.min(5, lastPage) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === p ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {p}
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

export default ListProduct;
