import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import apiSupplier from "../../../api/apiSupplier";

const ListSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await apiSupplier.getAll();
      setSuppliers(data);
    } catch { toast.error("Không thể tải danh sách nhà cung cấp"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nhà cung cấp này?")) return;
    try {
      await apiSupplier.delete(id);
      toast.success("Đã xóa nhà cung cấp");
      fetchSuppliers();
    } catch { toast.error("Xóa thất bại"); }
  };

  const handleToggleStatus = async (sup) => {
    try {
      const newStatus = sup.status === 1 ? 0 : 1;
      await apiSupplier.update(sup.id, { ...sup, status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      fetchSuppliers();
    } catch { toast.error("Lỗi cập nhật trạng thái"); }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[500px]">
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold text-gray-800">Quản lý Nhà cung cấp</h3>
        <Link to="/admin/supplier/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center shadow-sm transition-all">
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
                  <th className="py-3 px-4">Mã NCC</th>
                  <th className="py-3 px-4 text-left">Tên nhà cung cấp</th>
                  <th className="py-3 px-4 text-left">Liên hệ</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {suppliers.length > 0 ? (
                  suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">{s.id}</td>
                      <td className="py-3 px-4 font-mono text-indigo-600 font-medium">{s.supplierCode}</td>
                      <td className="py-3 px-4 text-left font-medium text-gray-900">{s.name}</td>
                      <td className="py-3 px-4 text-left text-gray-600">
                        <div className="text-xs">
                          <p>📧 {s.email}</p>
                          <p>📞 {s.phone}</p>
                        </div>
                      </td>
                      
                      <td className="py-3 px-4">
                        {s.status === 1 ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Hoạt động</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">Ngưng</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-3 items-center">
                          <button onClick={() => handleToggleStatus(s)} className="text-green-600 hover:text-green-800 transition-colors">
                            {s.status === 1 ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                          </button>
                          <Link to={`/admin/supplier/edit/${s.id}`} className="text-blue-600 hover:text-blue-800 transition-colors"><FaEdit size={18} /></Link>
                          <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800 transition-colors"><FaTrash size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="py-10 text-center text-gray-400">Chưa có nhà cung cấp</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListSupplier;