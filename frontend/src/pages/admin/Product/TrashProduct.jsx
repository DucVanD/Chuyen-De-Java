import { Link, useNavigate, useParams } from "react-router-dom";
import { FaTrashRestore, FaTrash, FaArrowLeft, FaBoxOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiProduct from "../../../api/apiProduct";
import { imageURL } from "../../../api/config";

const TrashProduct = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTrash = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await apiProduct.getTrash(pageNumber);
      if (res.status) {
        setProducts(res.data.data || []);
        setCurrentPage(res.data.current_page || 1);
        setLastPage(res.data.last_page || 1);
      }
    } catch (err) {
      toast.error("Không thể lấy dữ liệu thùng rác!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash(Number(page) || 1);
  }, [page]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      navigate(`/admin/trashProduct/${pageNumber}`);
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await apiProduct.restore(id);
      if (res.status) {
        toast.success("✅ Đã khôi phục sản phẩm!");
        fetchTrash(currentPage);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Khôi phục thất bại!");
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm("Cảnh báo: Xóa vĩnh viễn sẽ không thể khôi phục lại dữ liệu này! Bạn có chắc chắn?")) return;
    try {
      const res = await apiProduct.forceDelete(id);
      if (res.status) {
        toast.success("🗑️ Đã xóa vĩnh viễn sản phẩm!");
        fetchTrash(currentPage);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Xóa vĩnh viễn thất bại!");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaTrash className="text-rose-500" /> Thùng rác sản phẩm
          </h3>
          <p className="text-slate-500 text-sm mt-1">Khôi phục hoặc xóa bỏ vĩnh viễn các sản phẩm đã xóa tạm</p>
        </div>
        <Link
          to="/admin/products/1"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Quay lại danh sách
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-20">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin sản phẩm</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phân loại</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giá niêm yết</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4"><div className="h-16 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-rose-600">#{product.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          src={`${imageURL}/product/${product.thumbnail}`}
                          alt={product.name}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150x100?text=No+Image"; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">{product.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">Brand: {product.brandname || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                        {product.categoryname || 'Khác'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">
                        {product.price_root?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRestore(product.id)}
                          className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100"
                          title="Khôi phục"
                        >
                          <FaTrashRestore size={18} />
                        </button>
                        <button
                          onClick={() => handleForceDelete(product.id)}
                          className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100"
                          title="Xóa vĩnh viễn"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-medium">
                    <FaBoxOpen size={48} className="mx-auto mb-4 opacity-10" />
                    Thùng rác hiện đang trống.
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

export default TrashProduct;
