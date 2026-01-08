import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiCategory from "../../../api/apiCategory";
import { imageURL } from "../../../api/config";
import { toast } from "react-toastify";
import { FaArrowLeft, FaTrashRestore, FaTrashAlt, FaFolderOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TrashCat = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories(currentPage);
  }, [currentPage]);

  const loadCategories = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await apiCategory.getTrash(pageNumber);
      if (res.status) {
        setList(res.categories.data || []);
        setTotalPages(res.categories.last_page || 1);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh mục thùng rác");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await apiCategory.restore(id);
      if (res.status) {
        toast.success("✅ Khôi phục danh mục thành công");
        loadCategories(currentPage);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Lỗi khi khôi phục danh mục");
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm("Cảnh báo: Danh mục sẽ bị xóa vĩnh viễn khỏi hệ thống! Tiếp tục?")) return;
    try {
      const res = await apiCategory.forceDelete(id);
      if (res.status) {
        toast.success("🗑️ Xóa vĩnh viễn danh mục thành công");
        loadCategories(currentPage);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Lỗi khi xóa danh mục");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    navigate(`/admin/trashCat/${newPage}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaTrashAlt className="text-rose-500" /> Thùng rác danh mục
          </h3>
          <p className="text-slate-500 text-sm mt-1">Cấp túi cứu sinh hoặc khai tử các nhóm sản phẩm đã xóa tạm</p>
        </div>
        <Link
          to="/admin/categories"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Về trang quản lý
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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Thứ tự</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4"><div className="h-14 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : list.length > 0 ? (
                list.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-rose-600 transition-colors">#{cat.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          src={`${imageURL}/category/${cat.image}`}
                          alt={cat.name}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/100x70?text=No+Img"; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 line-clamp-1">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase italic">Slug: {cat.slug || 'n/a'}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-600 italic">
                      {cat.sort_order}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRestore(cat.id)}
                          className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-indigo-100"
                          title="Khôi phục"
                        >
                          <FaTrashRestore size={18} />
                        </button>
                        <button
                          onClick={() => handleForceDelete(cat.id)}
                          className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100"
                          title="Xóa vĩnh viễn"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">
                    <FaFolderOpen size={48} className="mx-auto mb-4 opacity-10" />
                    Không có danh mục nào đang chờ xử lý.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500 font-medium">Trang <span className="text-slate-900 font-bold">{currentPage}</span> / {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default TrashCat;
