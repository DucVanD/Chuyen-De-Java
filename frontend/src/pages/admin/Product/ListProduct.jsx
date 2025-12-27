import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiProduct from "../../../api/apiProduct";
import { FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaSearch, FaFilter, FaRedo } from "react-icons/fa";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
      LOAD DATA
  ====================== */
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiProduct.getAll();
      setProducts(data);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
      ACTIONS
  ====================== */
  const handleSearch = async () => {
    if (!keyword.trim()) {
      loadData();
      return;
    }
    setLoading(true);
    try {
      const data = await apiProduct.search(keyword);
      setProducts(data);
    } catch {
      toast.error("Lỗi tìm kiếm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const data = await apiProduct.filter(null, status);
      setProducts(data);
    } catch {
      toast.error("Lỗi lọc sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKeyword("");
    setStatus("");
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await apiProduct.delete(id);
      toast.success("Đã xóa sản phẩm");
      loadData(); // Reload lại danh sách
    } catch {
      toast.error("Xóa thất bại (Sản phẩm có thể đang trong đơn hàng)");
    }
  };

  // 🔥 TÍNH NĂNG MỚI: BẬT/TẮT TRẠNG THÁI
  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 1 ? 0 : 1;
      // Gọi API update (giữ nguyên các trường khác, chỉ đổi status)
      await apiProduct.update(product.id, { ...product, status: newStatus });
      
      toast.success(newStatus === 1 ? "Đã hiển thị sản phẩm" : "Đã ẩn sản phẩm");
      loadData(); // Reload để cập nhật giao diện
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
        <Link
          to="/admin/addProduct"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
        >
          <FaPlus className="mr-2" /> Thêm sản phẩm
        </Link>
      </div>

      {/* TOOLBAR (SEARCH & FILTER) */}
      <div className="p-6 bg-gray-50 border-b flex flex-wrap gap-3 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border border-gray-300 px-4 py-2 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          Tìm kiếm
        </button>

        <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="1">Đang hoạt động</option>
          <option value="0">Đang ẩn</option>
        </select>

        <button onClick={handleFilter} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaFilter size={14} /> Lọc
        </button>

        <button onClick={handleReset} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ml-auto">
          <FaRedo size={14} /> Reset
        </button>
      </div>

      {/* TABLE DATA */}
      <div className="p-6">
        {loading ? (
          <p className="text-center py-10 text-gray-500 italic">Đang tải dữ liệu sản phẩm...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Ảnh</th>
                  <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                  <th className="py-3 px-4 text-right">Giá bán</th>
                  <th className="py-3 px-4">Kho</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-3 px-4 text-gray-500">{p.id}</td>

                      <td className="py-3 px-4">
                        <div className="w-16 h-16 mx-auto rounded-lg border border-gray-200 overflow-hidden bg-white">
                           <img
                            src={p.image || "https://placehold.co/100"}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-left">
                        <p className="font-medium text-gray-900 line-clamp-2">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.slug}</p>
                      </td>

                      <td className="py-3 px-4 text-right font-semibold text-indigo-600">
                        {formatPrice(p.salePrice)}
                      </td>

                      <td className="py-3 px-4">
                        {p.qty > 0 ? (
                            <span className="font-medium text-gray-700">{p.qty}</span>
                        ) : (
                            <span className="text-red-500 text-xs font-bold">Hết hàng</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.status === 1 ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 border border-green-200">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600 border border-gray-200">
                            Đang ẩn
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex justify-center items-center space-x-3">
                          {/* Toggle Status Button */}
                          <button 
                            onClick={() => handleToggleStatus(p)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title={p.status === 1 ? "Ấn để ẩn" : "Ấn để hiện"}
                          >
                             {p.status === 1 ? <FaToggleOn size={22} /> : <FaToggleOff size={22} className="text-gray-400" />}
                          </button>

                          <Link
                            to={`/admin/editProduct/${p.id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit size={18} />
                          </Link>

                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
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
                    <td colSpan="7" className="py-10 text-center text-gray-400 italic">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProduct;