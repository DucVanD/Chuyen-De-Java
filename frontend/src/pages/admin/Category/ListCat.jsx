import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCategory from "../../../api/apiCategory";
import { FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

const ListCat = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  /* LOAD PAGE */
  const loadPage = async (p = 0) => {
    setLoading(true);
    try {
      const res = await apiCategory.getPage(p, 5);
      setCategories(res.content);
      setPage(res.number);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error("Không thể tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPage(page); }, [page]);

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
    try {
      await apiCategory.delete(id);
      toast.success("Xóa thành công!");
      loadPage(page);
    } catch {
      toast.error("Xóa thất bại (có thể danh mục đang chứa sản phẩm)!");
    }
  };

  /* TOGGLE STATUS */
  const handleToggleStatus = async (cat) => {
    try {
      // Giả sử API có hàm switchStatus hoặc update status
      // Nếu chưa có, bạn dùng apiCategory.update(cat.id, { ...cat, status: cat.status === 1 ? 0 : 1 })
      const newStatus = cat.status === 1 ? 0 : 1;
      // Gọi API update (Demo logic)
      await apiCategory.update(cat.id, { ...cat, status: newStatus }); 
      
      toast.success(newStatus === 1 ? "Đã hiện danh mục" : "Đã ẩn danh mục");
      loadPage(page);
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const categoryMap = Object.fromEntries(categories.map(cat => [cat.id, cat.name]));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[500px]">
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold text-gray-800">Quản lý Danh mục</h3>
        <Link to="/admin/addCat" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center shadow-sm transition-all">
          <FaPlus className="mr-2" /> Thêm mới
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? <p className="text-center py-10 text-gray-500">Đang tải dữ liệu...</p> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-center">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Hình ảnh</th>
                    <th className="py-3 px-4 text-left">Tên danh mục</th>
                    <th className="py-3 px-4 text-left">Danh mục cha</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Chức năng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-500">{cat.id}</td>
                        <td className="py-3 px-4">
                          <img 
                            src={cat.image || "https://placehold.co/150x100"} 
                            className="h-12 w-16 object-cover border rounded mx-auto" 
                            alt={cat.name} 
                          />
                        </td>
                        <td className="py-3 px-4 text-left font-medium text-gray-900">{cat.name}</td>
                        <td className="py-3 px-4 text-left text-gray-600">
                          {cat.parentId ? categoryMap[cat.parentId] || "---" : <span className="text-gray-400 italic">Gốc</span>}
                        </td>
                        
                        {/* STATUS BADGE */}
                        <td className="py-3 px-4">
                          {cat.status === 1 ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Hiển thị</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">Ẩn</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex justify-center items-center gap-3">
                            {/* TOGGLE BUTTON */}
                            <button onClick={() => handleToggleStatus(cat)} className="text-green-600 hover:text-green-800 transition-colors" title="Bật/Tắt">
                              {cat.status === 1 ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                            </button>

                            <Link to={`/admin/editcat/${cat.id}`} className="text-blue-600 hover:text-blue-800 transition-colors" title="Sửa">
                              <FaEdit size={18} />
                            </Link>

                            <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Xóa">
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="py-10 text-center text-gray-400">Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-6">
              <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors">
                ← Trước
              </button>
              <span className="flex items-center text-gray-600">Trang {page + 1} / {totalPages}</span>
              <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors">
                Sau →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ListCat;