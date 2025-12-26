import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import apiBrand from "../../../api/apiBrand";

const ListBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await apiBrand.getAll();
      setBrands(data);
    } catch (err) {
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thương hiệu này?")) return;
    try {
      await apiBrand.delete(id);
      toast.success("Đã xóa thương hiệu");
      fetchBrands();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Danh sách thương hiệu</h2>
        <Link
          to="/admin/brand/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Thêm mới
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <table className="w-full border text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Quốc gia</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((b) => (
                <tr key={b.id} className="border-t">
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.slug}</td>
                  <td>{b.country}</td>
                  <td>
                    <div className="flex justify-center gap-3">
                      <Link
                        to={`/admin/brand/edit/${b.id}`}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(b.id)}
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
                <td colSpan="5" className="p-4 text-gray-500">
                  Không có thương hiệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListBrand;
