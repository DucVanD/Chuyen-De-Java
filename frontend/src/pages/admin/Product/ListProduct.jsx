import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiProductAdmin from "../../../api/admin/apiProductAdmin";
import apiCategoryAdmin from "../../../api/admin/apiCategoryAdmin";
import apiBrandAdmin from "../../../api/admin/apiBrandAdmin";
import { FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaSearch, FaFilter, FaRedo } from "react-icons/fa";
import { getImageUrl } from "../../../api/config";

// Utility to format quantity (Standard Supermarket Logic)
const formatQuantity = (qty, saleType, unitLabel) => {
  let value = qty;
  let unit = unitLabel || (saleType === "WEIGHT" ? "phần" : "đv");

  if (saleType === "WEIGHT") {
    if (qty >= 1000) {
      value = (qty / 1000).toFixed(1).replace(/\.0$/, "");
      unit = "kg";
    } else {
      unit = "g";
    }
  }

  return { value, unit };
};

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Data cho dropdown filters
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Filter States
  const [keyword, setKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hasPromo, setHasPromo] = useState(false);

  // User Role
  const [currentUser, setCurrentUser] = useState(null);

  // Pagination State
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(8);

  useEffect(() => {
    // 1. Get User Role
    const userStr = localStorage.getItem("adminUser");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    // 2. Load Initial Data
    loadInitialData();
  }, []);

  // Load products whenever filters or page changes
  useEffect(() => {
    loadProducts();
  }, [currentPage, size]);

  const loadInitialData = async () => {
    try {
      const [cats, brs] = await Promise.all([
        apiCategoryAdmin.getAll(),
        apiBrandAdmin.getAll()
      ]);

      const rootCategories = cats.filter(c => c.parentId != null);
      setCategories(rootCategories);
      setBrands(brs);
    } catch (err) {
      console.error("Lỗi tải danh mục/thương hiệu", err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (keyword.trim()) {
        data = await apiProductAdmin.search(keyword, currentPage, size);
      }
      else if (filterCategory || filterBrand || filterStatus || minPrice || maxPrice || hasPromo) {
        data = await apiProductAdmin.filter(
          null,
          filterCategory || null,
          filterBrand || null,
          filterStatus || null,
          minPrice || null,
          maxPrice || null,
          hasPromo || null,
          currentPage,
          size
        );
      }
      else {
        data = await apiProductAdmin.getPage(currentPage, size);
      }

      if (data && data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } else {
        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(0);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams({ page: 0 });
    loadProducts();
  };

  const handleFilter = () => {
    setKeyword("");
    setSearchParams({ page: 0 });
    loadProducts();
  };

  const handleReset = () => {
    setKeyword("");
    setFilterCategory("");
    setFilterBrand("");
    setFilterStatus("");
    setMinPrice("");
    setMaxPrice("");
    setHasPromo(false);
    setSearchParams({ page: 0 });
    setTimeout(() => {
      loadProducts();
    }, 100);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await apiProductAdmin.delete(id);
      toast.success("Đã xóa sản phẩm");
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa thất bại (Sản phẩm có thể đang trong đơn hàng)");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await apiProductAdmin.toggleStatus(id);
      toast.success("Cập nhật trạng thái thành công");
      loadProducts();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const isAdmin = currentUser?.role === "ADMIN";
  const isStaff = currentUser?.role === "ADMIN" || currentUser?.role === "STAFF";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>

        {isAdmin && (
          <Link
            to="/admin/product/add"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
          >
            <FaPlus className="mr-2" /> Thêm sản phẩm
          </Link>
        )}
      </div>

      <div className="p-6 bg-gray-50 border-b space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
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

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">-- Danh mục --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">-- Thương hiệu --</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">-- Trạng thái --</option>
            <option value="1">Đang hoạt động</option>
            <option value="0">Đang ẩn</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="number"
            placeholder="Giá từ..."
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-32 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Giá đến..."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-32 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <label className="flex items-center gap-2 cursor-pointer select-none bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100">
            <input
              type="checkbox"
              checked={hasPromo}
              onChange={(e) => setHasPromo(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700 text-sm font-medium">Đang khuyến mãi</span>
          </label>

          <div className="flex-1"></div>

          <button onClick={handleFilter} className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <FaFilter size={14} /> Lọc
          </button>

          <button onClick={handleReset} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-5 py-2 rounded-lg flex items-center gap-2 transition-colors ml-2">
            <FaRedo size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-center py-10 text-gray-500 italic">Đang tải dữ liệu sản phẩm...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                  <th className="py-3 px-4 text-left">Sản phẩm</th>
                  <th className="py-3 px-4 text-left">Danh mục & Brand</th>
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
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0">
                            <img
                              src={getImageUrl(p.image, 'product')}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2" title={p.name}>{p.name}</p>
                            <p className="text-xs text-gray-400">{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-left">
                        <p className="text-gray-800 font-medium">{p.categoryName || "—"}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{p.brandName || "—"}</p>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.salePrice ? (
                          <>
                            <p className="text-red-600 font-bold">{formatPrice(p.discountPrice)}</p>
                            <p className="text-gray-400 text-xs line-through">{formatPrice(p.salePrice)}</p>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-900">{formatPrice(p.salePrice)}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.qty > 0 ? (
                          (() => {
                            const { value, unit } = formatQuantity(p.qty, p.saleType, p.unitLabel);
                            return (
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-gray-800 text-base">{value}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter -mt-1">{unit}</span>
                              </div>
                            );
                          })()
                        ) : (
                          <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded">Hết hàng</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.status === 1 ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 border border-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600 border border-gray-200">
                            Hidden
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex justify-center items-center space-x-3">
                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => handleToggleStatus(p.id)}
                                className="text-green-600 hover:text-green-800 transition-colors"
                                title={p.status === 1 ? "Ấn để ẩn" : "Ấn để hiện"}
                              >
                                {p.status === 1 ? <FaToggleOn size={22} /> : <FaToggleOff size={22} className="text-gray-400" />}
                              </button>

                              <Link
                                to={`/admin/product/edit/${p.id}?page=${currentPage}`}
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
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No permission</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400 italic">
                      Không tìm thấy sản phẩm nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6 p-4 border-t bg-gray-50">
          <button
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors bg-white text-gray-700 font-medium shadow-sm"
          >
            ← Trước
          </button>
          <span className="flex items-center text-gray-600 font-medium">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors bg-white text-gray-700 font-medium shadow-sm"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default ListProduct;