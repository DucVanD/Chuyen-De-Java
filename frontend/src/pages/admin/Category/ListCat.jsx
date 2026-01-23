import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCategoryAdmin from "../../../api/admin/apiCategoryAdmin";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaMinusSquare,
  FaPlusSquare
} from "react-icons/fa";

const ListCat = () => {
  const [categories, setCategories] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedRows, setExpandedRows] = useState(new Set());

  /* ===============================
      USER & PERMISSION
  =============================== */
  const [currentUser, setCurrentUser] = useState(null);
  const role = currentUser?.role;
  const isAdmin = role === "ADMIN";
  const isStaff = role === "ADMIN" || role === "STAFF";

  /* ===============================
      LOAD USER
  =============================== */
  useEffect(() => {
    const userStr = localStorage.getItem("adminUser");
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  /* ===============================
      LOAD DATA
  =============================== */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiCategoryAdmin.getAll();
      setCategories(res);
      setExpandedRows(new Set());
    } catch {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ===============================
      TREE LOGIC
  =============================== */
  const buildTree = (cats) => {
    const map = {};
    const roots = [];
    cats.forEach(c => (map[c.id] = { ...c, children: [] }));
    cats.forEach(c => {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  };

  const filterNodes = (nodes, search, status) => {
    return nodes.reduce((acc, node) => {
      const matchSearch = node.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        status === "all" ||
        (status === "active" && node.status === 1) ||
        (status === "inactive" && node.status === 0);

      const children = filterNodes(node.children || [], search, status);
      if ((matchSearch && matchStatus) || children.length > 0) {
        acc.push({ ...node, children });
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    const roots = buildTree(categories);
    const filtered = filterNodes(roots, searchTerm, filterStatus);
    setTreeData(filtered);

    if (searchTerm) {
      setExpandedRows(new Set(categories.map(c => c.id)));
    }
  }, [categories, searchTerm, filterStatus]);

  const toggleExpand = (id) => {
    const newSet = new Set(expandedRows);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedRows(newSet);
  };

  /* ===============================
      ADMIN ACTIONS ONLY
  =============================== */
  const handleToggleStatus = async (cat) => {
    if (!isAdmin) return;
    try {
      await apiCategoryAdmin.toggleStatus(cat.id);
      toast.success(cat.status === 1 ? "Đã ẩn danh mục" : "Đã hiện danh mục");
      loadData();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Xóa danh mục này?")) return;
    try {
      await apiCategoryAdmin.delete(id);
      toast.success("Đã xóa danh mục");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  /* ===============================
      PAGINATION
  =============================== */
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "0", 10);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(treeData.length / rowsPerPage);
  const currentData = treeData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  useEffect(() => {
    setSearchParams({ page: 0 });
  }, [searchTerm, filterStatus]);

  /* ===============================
      RENDER ROW
  =============================== */
  const renderRow = (node, level = 0) => {
    const hasChildren = node.children?.length > 0;
    const isExpanded = expandedRows.has(node.id);
    const paddingLeft = level * 40 + 20;

    return (
      <React.Fragment key={node.id}>
        <tr className="border-b hover:bg-gray-50">
          <td className="px-4 py-2 text-gray-500">{node.id}</td>

          <td className="px-4 py-2">
            <img
              src={node.image || "https://placehold.co/100x70"}
              className="h-10 w-14 object-cover rounded mx-auto"
              alt={node.name}
            />
          </td>

          <td className="px-4 py-2">
            <div style={{ paddingLeft }} className="flex items-center">
              {hasChildren ? (
                <button onClick={() => toggleExpand(node.id)} className="mr-2 text-gray-500">
                  {isExpanded ? <FaMinusSquare /> : <FaPlusSquare />}
                </button>
              ) : (
                <span className="w-6 mr-2"></span>
              )}
              <span className="font-medium">{node.name}</span>
            </div>
          </td>

          <td className="px-4 py-2 text-center">
            {node.productCount || 0}
          </td>

          <td className="px-4 py-2">
            {node.status === 1 ? "Active" : "Inactive"}
          </td>

          <td className="px-4 py-2 text-center">
            {isAdmin ? (
              <div className="flex justify-center gap-3">
                <button onClick={() => handleToggleStatus(node)}>
                  {node.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <Link to={`/admin/category/edit/${node.id}`}>
                  <FaEdit />
                </Link>
                <button onClick={() => handleDelete(node.id)}>
                  <FaTrash />
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">View only</span>
            )}
          </td>
        </tr>

        {hasChildren && isExpanded && node.children.map(c => renderRow(c, level + 1))}
      </React.Fragment >
    );
  };

  /* ===============================
      RENDER
  =============================== */
  return (
    <div className="bg-white rounded shadow min-h-[500px]">
      <div className="p-6 flex justify-between border-b">
        <h3 className="text-xl font-semibold">Quản lý Danh mục</h3>

        {isAdmin && (
          <Link
            to="/admin/category/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Thêm mới
          </Link>
        )}
      </div>

      {/* Search & Filter */}
      <div className="p-6 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hiện</option>
          <option value="inactive">Đang ẩn</option>
        </select>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-400">Đang tải...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Ảnh</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">SP</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map(node => renderRow(node))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 0}
              onClick={() => setSearchParams({ page: page - 1 })}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              ← Trước
            </button>

            <span className="flex items-center text-gray-600">
              Trang {page + 1} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setSearchParams({ page: page + 1 })}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Sau →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ListCat;
