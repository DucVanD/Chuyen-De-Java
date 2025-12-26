import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiProduct from "../../../api/apiProduct";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTrash,
  FaEye,
  FaEdit,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
const ListProduct = () => {
  const [products, setProducts] = useState([]);

  const loadData = async () => {
    try {
      const res = await apiProduct.getAll();
      // Lưu ý: Kiểm tra xem API trả về mảng trực tiếp hay nằm trong res.data
      setProducts(res.data || res);
    } catch (error) {
      console.log("Lỗi lấy danh sách:", error);
    }
  };

  // 2. Gọi API khi component mount
  useEffect(() => {
    loadData();
  }, []); // Thêm [] để chỉ chạy 1 lần


  console.log("san pham o day", products)
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    await apiProduct.delete(id);
    toast.success("Đã xóa sản phẩm");
    loadData();
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Sản phẩm</h2>
        <Link
          to="/admin/addProduct"
          className=""
        >
          <FaPlus className="mr-2" /> Thêm mới
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Giá bán</th>
            <th className="border p-2">Tồn kho</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.salePrice}</td>
              <td className="border p-2 text-center">{p.qty}</td>
              <td className="border p-2">
                {p.status === 1 ? "Hoạt động" : "Ẩn"}
              </td>
              <td className="border p-2 text-center space-x-2">
                <Link
                  to={`/admin/editProduct/${p.id}`}
                  className="text-blue-600"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListProduct;
