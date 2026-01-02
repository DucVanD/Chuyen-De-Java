import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiUserAdmin from "../../../api/admin/apiUserAdmin";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const roleColor = {
  ADMIN: "bg-red-100 text-red-700",
  STAFF: "bg-blue-100 text-blue-700",
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // PAGINATION & SEARCH STATE
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  /* ======================
      FETCH EMPLOYEES
  ====================== */
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await apiUserAdmin.getPage(page, size, keyword, ["ADMIN", "STAFF"]);
      setEmployees(res.content);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchEmployees();
  };

  /* ======================
      TOGGLE STATUS
  ====================== */
  const handleToggleStatus = async (emp) => {
    try {
      if (emp.status === 1) {
        await apiUserAdmin.lock(emp.id);
        toast.success("Đã khóa nhân viên");
      } else {
        await apiUserAdmin.unlock(emp.id);
        toast.success("Đã mở khóa nhân viên");
      }
      fetchEmployees();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await apiUserAdmin.delete(id);
        toast.success("Xoá thành công!");
        fetchEmployees();
      } catch {
        toast.error("Lỗi khi xóa nhân viên");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold">Danh sách nhân viên</h3>

        <Link
          to="/admin/user/createUser"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center shadow-sm transition-all"
        >
          <FaPlus className="mr-2" /> Thêm nhân viên
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* SEARCH BAR */}
        <div className="mb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaSearch />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tìm nhân viên (tên, email, sđt)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Đang tải dữ liệu...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-center">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Avatar</th>
                    <th className="py-3 px-4 text-left">Họ tên</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">SĐT</th>
                    <th className="py-3 px-4">Chức vụ</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {employees.length > 0 ? (
                    employees.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-500">{e.id}</td>

                        {/* AVATAR COLUMN */}
                        <td className="py-3 px-4">
                          <img
                            src={e.avatar || "https://placehold.co/40"}
                            alt={e.name}
                            className="w-10 h-10 rounded-full mx-auto object-cover border border-gray-200"
                          />
                        </td>

                        <td className="py-3 px-4 text-left font-medium text-gray-900">
                          {e.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{e.email}</td>
                        <td className="py-3 px-4 text-gray-600">{e.phone}</td>

                        {/* ROLE BADGE */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${roleColor[e.role]}`}
                          >
                            {e.role}
                          </span>
                        </td>

                        {/* STATUS BADGE */}
                        <td className="py-3 px-4">
                          {e.status === 1 ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">
                              Khóa
                            </span>
                          )}
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="py-3 px-4">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              onClick={() => handleToggleStatus(e)}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title={e.status === 1 ? "Khóa tài khoản" : "Mở khóa"}
                            >
                              {e.status === 1 ? (
                                <FaToggleOn size={20} />
                              ) : (
                                <FaToggleOff size={20} />
                              )}
                            </button>

                            <Link
                              to={`/admin/user/editUser/${e.id}`}
                              state={{ from: location.pathname }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <FaEdit size={18} />
                            </Link>

                            <button
                              onClick={() => handleDelete(e.id)}
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
                      <td
                        colSpan="8"
                        className="py-10 text-center text-gray-400 italic"
                      >
                        Chưa có dữ liệu nhân viên
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị trang <span className="font-medium">{page + 1}</span> / <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === i
                              ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page === totalPages - 1}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}