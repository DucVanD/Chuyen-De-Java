import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiCategoryAdmin from "../../../api/admin/apiCategoryAdmin";
import { FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaMinusSquare, FaPlusSquare } from "react-icons/fa";

const ListCat = () => {
  const [categories, setCategories] = useState([]); // Flat list gốc
  const [treeData, setTreeData] = useState([]); // Dữ liệu dạng cây đã filter
  const [loading, setLoading] = useState(false);

  // States cho filter & search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  // State quản lý expand/collapse (lưu set các ID đang mở)
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Load ALL data (không phân trang) để dựng cây
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiCategoryAdmin.getAll();
      setCategories(res);
      // Mặc định KHÔNG expand (collapsed)
      setExpandedRows(new Set());
    } catch (err) {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ===============================
      TREE LOGIC: BUILD & FILTER
  =============================== */

  // 1. Hàm build tree từ flat list
  const buildTree = (cats) => {
    const map = {};
    const roots = [];

    // Init map
    cats.forEach(c => {
      map[c.id] = { ...c, children: [] };
    });

    // Link parent-child
    cats.forEach(c => {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  };

  // 2. Hàm filter trên tree (đệ quy)
  // Giữ lại node nếu: (node thoả mãn filter) HOẶC (có con thoả mãn filter)
  const filterNodes = (nodes, search, status) => {
    return nodes.reduce((acc, node) => {
      // Check điều kiện node hiện tại
      const matchesSearch = node.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" ||
        (status === "active" && node.status === 1) ||
        (status === "inactive" && node.status === 0);

      const isSelfMatch = matchesSearch && matchesStatus;

      // Filter đệ quy con
      const filteredChildren = filterNodes(node.children || [], search, status);

      // Giữ node nếu: self match HOẶC có con match
      if (isSelfMatch || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }

      return acc;
    }, []);
  };

  // Effect để update treeData khi categories/search/filter thay đổi
  useEffect(() => {
    const roots = buildTree(categories);
    const filtered = filterNodes(roots, searchTerm, filterStatus);
    setTreeData(filtered);

    // Nếu đang search, tự động expand hết để thấy kết quả
    if (searchTerm) {
      const allIds = categories.map(c => c.id);
      setExpandedRows(new Set(allIds));
    }
  }, [categories, searchTerm, filterStatus]);

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  /* TOGGLE STATUS */
  const handleToggleStatus = async (cat) => {
    try {
      // Sử dụng đúng hàm toggleStatus đã định nghĩa trong API
      await apiCategoryAdmin.toggleStatus(cat.id);

      const newStatus = cat.status === 1 ? 0 : 1;
      toast.success(newStatus === 1 ? "Đã hiện danh mục" : "Đã ẩn danh mục");

      // Reload lại data
      loadData();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  /* ===============================
      DELETE CATEGORY
  =============================== */
  const handleDelete = async (id) => {
    // Confirm trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      await apiCategoryAdmin.delete(id);
      toast.success("✅ Xóa danh mục thành công!");

      // Reload lại data
      loadData();
    } catch (err) {
      // ✅ HIỂN THỊ THÔNG BÁO LỖI RÕ RÀNG
      const errorMsg = err.response?.data?.message || err.response?.data || "Xóa danh mục thất bại";
      toast.error("❌ " + errorMsg, {
        autoClose: 5000,
        position: "top-right"
      });
      console.error("Delete error:", err.response?.data);
    }
  };

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  // Pagination Logic (Client-side)
  const totalPages = Math.ceil(treeData.length / rowsPerPage);
  const currentData = treeData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Reset page khi search/filter query thay đổi
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterStatus]);

  /* ===============================
      RENDER HELPER: RECURSIVE ROW
  =============================== */
  const renderRow = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedRows.has(node.id);
    const paddingLeft = level * 40 + 20; // 40px mỗi cấp

    return (
      <>
        {/* Main Row */}
        <tr key={node.id} className="hover:bg-gray-50 transition-colors border-b">
          {/* 1. ID */}
          <td className="py-4 px-4 text-gray-500">{node.id}</td>

          {/* 2. Image */}
          <td className="py-2 px-4">
            <img
              src={node.image || "https://placehold.co/150x100?text=No+Image"}
              className="h-10 w-14 object-cover border rounded mx-auto"
              alt={node.name}
            />
          </td>

          {/* 3. Name (Tree Logic) */}
          <td className="py-2 px-4 text-left">
            <div style={{ paddingLeft: `${paddingLeft}px` }} className="flex items-center">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(node.id)}
                  className="mr-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
                >
                  {isExpanded ? <FaMinusSquare /> : <FaPlusSquare />}
                </button>
              )}
              {!hasChildren && <span className="w-6 mr-2"></span>} {/* Spacer */}

              <span className={`font-medium ${level === 0 ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                {node.name}
              </span>
            </div>
          </td>

          {/* 4. Product Count (New) */}
          <td className="py-2 px-4">
            <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold">
              {node.productCount || 0} sản phẩm
            </span>
          </td>

          {/* 5. Status */}
          <td className="py-2 px-4">
            {node.status === 1 ? (
              <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">Active</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-600">Inactive</span>
            )}
          </td>

          {/* 6. Action */}
          <td className="py-2 px-4">
            <div className="flex justify-center items-center gap-3">
              <button onClick={() => handleToggleStatus(node)} className="text-gray-500 hover:text-green-600 transition-colors" title="Bật/Tắt">
                {node.status === 1 ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
              </button>
              <Link to={`/admin/editcat/${node.id}`} className="text-blue-500 hover:text-blue-700 transition-colors" title="Sửa">
                <FaEdit size={18} />
              </Link>
              <button onClick={() => handleDelete(node.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Xóa">
                <FaTrash size={16} />
              </button>
            </div>
          </td>
        </tr>

        {/* Recursive Children Rendering */}
        {hasChildren && isExpanded && node.children.map(child => renderRow(child, level + 1))}
      </>
    );
  };

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

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="flex gap-4 flex-1">
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Tìm kiếm danh mục..."
              className="border px-4 py-2 rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Status */}
            <select
              className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="inactive">Đang ẩn</option>
            </select>
          </div>

          {/* Show Total Count */}
          <div className="text-gray-500 self-center">
            Tổng: <span className="font-bold text-gray-800">{treeData.length}</span> danh mục gốc
          </div>
        </div>

        {loading ? <p className="text-center py-10 text-gray-500">Đang tải dữ liệu...</p> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                    <th className="py-3 px-4 w-16">ID</th>
                    <th className="py-3 px-4 w-24">Hình ảnh</th>
                    <th className="py-3 px-4">Tên danh mục</th>
                    <th className="py-3 px-4 w-32 text-center">Sản phẩm</th>
                    <th className="py-3 px-4 w-32">Trạng thái</th>
                    <th className="py-3 px-4 w-40 text-center">Chức năng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.length > 0 ? (
                    currentData.map((node) => renderRow(node))
                  ) : (
                    <tr><td colSpan="6" className="py-10 text-center text-gray-400">Không tìm thấy dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  ← Trước
                </button>
                <span className="flex items-center text-gray-600">Trang {page + 1} / {totalPages}</span>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default ListCat;