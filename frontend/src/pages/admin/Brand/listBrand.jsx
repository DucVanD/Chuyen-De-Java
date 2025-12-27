import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import apiBrand from "../../../api/apiBrand";

const ListBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await apiBrand.getAll();
      setBrands(data);
    } catch { toast.error("Lỗi tải thương hiệu"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thương hiệu này?")) return;
    try {
      await apiBrand.delete(id);
      toast.success("Đã xóa thương hiệu");
      fetchBrands();
    } catch { toast.error("Xóa thất bại"); }
  };

  const handleToggleStatus = async (brand) => {
    try {
      const newStatus = brand.status === 1 ? 0 : 1;
      // Gọi API update (giả định)
      await apiBrand.update(brand.id, { ...brand, status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      fetchBrands();
    } catch { toast.error("Lỗi cập nhật trạng thái"); }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[500px]">
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold text-gray-800">Quản lý Thương hiệu</h3>
        <Link to="/admin/brand/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center shadow-sm transition-all">
          <FaPlus className="mr-2" /> Thêm mới
        </Link>
      </div>

      <div className="p-6">
        {loading ? <p className="text-center py-10 text-gray-500">Đang tải...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Logo</th>
                  <th className="py-3 px-4 text-left">Tên thương hiệu</th>
                  <th className="py-3 px-4">Quốc gia</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {brands.length > 0 ? (
                  brands.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">{b.id}</td>
                      <td className="py-3 px-4">
                        <img src={b.image || "https://placehold.co/80x50"} alt={b.name} className="w-16 h-10 object-contain mx-auto border rounded bg-white" />
                      </td>
                      <td className="py-3 px-4 text-left font-medium text-gray-900">{b.name}</td>
                      <td className="py-3 px-4 text-gray-600">{b.country || "-"}</td>
                      
                      <td className="py-3 px-4">
                        {b.status === 1 ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Hoạt động</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">Ẩn</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-3 items-center">
                          <button onClick={() => handleToggleStatus(b)} className="text-green-600 hover:text-green-800 transition-colors">
                            {b.status === 1 ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                          </button>
                          <Link to={`/admin/brand/edit/${b.id}`} className="text-blue-600 hover:text-blue-800 transition-colors"><FaEdit size={18} /></Link>
                          <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800 transition-colors"><FaTrash size={16} /></button>
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
        )}
      </div>
    </div>
  );
};
export default ListBrand;