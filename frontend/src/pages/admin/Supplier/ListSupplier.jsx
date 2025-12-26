import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import apiSupplier from "../../../api/apiSupplier";

const ListSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);

  const fetchSuppliers = async () => {
    try {
      const data = await apiSupplier.getAll();
      setSuppliers(data);
    } catch {
      toast.error("Không thể tải danh sách nhà cung cấp");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nhà cung cấp này?")) return;
    try {
      await apiSupplier.delete(id);
      toast.success("Đã xóa nhà cung cấp");
      fetchSuppliers();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Nhà cung cấp</h2>
        <Link
          to="/admin/supplier/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Thêm mới
        </Link>
      </div>

      <table className="w-full border text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Mã NCC</th>
            <th className="p-2">Tên</th>
            <th className="p-2">Email</th>
            <th className="p-2">SĐT</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((s) => (
              <tr key={s.id} className="border-t">
                <td>{s.id}</td>
                <td className="font-mono">{s.supplierCode}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>
                  {s.status === 1 ? (
                    <span className="text-green-600">Hoạt động</span>
                  ) : (
                    <span className="text-gray-500">Ngưng</span>
                  )}
                </td>
                <td>
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/admin/supplier/edit/${s.id}`}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-gray-500">
                Chưa có nhà cung cấp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListSupplier;
