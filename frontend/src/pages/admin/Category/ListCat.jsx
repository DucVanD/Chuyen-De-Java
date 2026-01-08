import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCategory from "../../../api/apiCategory";
import { imageURL } from "../../../api/config";
import { FaPlus, FaTrash, FaEdit, FaLayerGroup, FaTags, FaCube, FaChevronRight } from "react-icons/fa";

const ListCat = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await apiCategory.getAll();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      toast.error("Không thể tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await apiCategory.delete(id);
      toast.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const categoryMap = Object.fromEntries(
    categories.map(cat => [cat.id, cat.name])
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaLayerGroup className="text-indigo-600" /> Quản lý danh mục
          </h3>
          <p className="text-slate-500 text-sm mt-1">Phân loại sản phẩm theo các nhóm ngành hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/addCat"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95 font-semibold"
          >
            <FaPlus className="mr-2" /> Thêm danh mục
          </Link>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-left">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20 text-center">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cấp bậc</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4"><div className="h-12 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{category.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                        <img
                          className="w-full h-full object-cover"
                          src={category.image ? `${imageURL}/category/${category.image}` : 'https://placehold.co/100'}
                          alt={category.name}
                          onError={(e) => { e.target.src = "https://placehold.co/100"; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      {category.parentId ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <span className="px-2 py-0.5 bg-slate-100 rounded">Con của</span>
                          <FaChevronRight size={8} />
                          <span className="text-indigo-600 font-bold underline decoration-indigo-200">{categoryMap[category.parentId] || "Cấp cha"}</span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold"><FaTags className="inline mr-1" /> Danh mục cha</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium text-sm">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/editcat/${category.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Sửa"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
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
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                    <FaCube size={48} className="mx-auto mb-4 opacity-10" />
                    Chưa có danh mục nào được tạo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListCat;