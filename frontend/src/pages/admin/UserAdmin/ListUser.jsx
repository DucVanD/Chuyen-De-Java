import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import apiUserAdmin from "../../../api/admin/apiUserAdmin";

const roleColor = {
  CUSTOMER: "bg-green-100 text-green-700",
};

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  /* ======================
      FETCH USERS (PAGE)
  ====================== */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiUserAdmin.getPage(page, size, keyword, ["CUSTOMER"]);
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  /* ======================
      TOGGLE STATUS
  ====================== */
  const handleToggleStatus = async (user) => {
    try {
      if (user.status === 1) {
        await apiUserAdmin.lock(user.id);
        toast.success("Đã khóa người dùng");
      } else {
        await apiUserAdmin.unlock(user.id);
        toast.success("Đã mở khóa người dùng");
      }
      fetchUsers();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này? Thao tác này sẽ xóa cả ảnh đại diện trên Cloudinary.")) {
      try {
        await apiUserAdmin.delete(id);
        toast.success("Xóa thành công");
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || "Xóa thất bại");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* HEADER */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b gap-4">
        <h3 className="text-2xl font-semibold text-gray-800">Danh sách khách hàng</h3>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* SEARCH */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Tìm khách hàng..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Tìm
            </button>
          </form>

          <Link
            to="/admin/user/add"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-all whitespace-nowrap"
          >
            <FaPlus className="mr-2" /> Thêm mới
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
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
                    <th className="py-3 px-4">Vai trò</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-500">{user.id}</td>

                        {/* AVATAR */}
                        <td className="py-3 px-4">
                          <img
                            src={user.avatar || "https://placehold.co/40"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full mx-auto object-cover border border-gray-200"
                          />
                        </td>

                        <td className="py-3 px-4 text-left font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600 text-xs">{user.email}</td>
                        <td className="py-3 px-4 text-gray-600">{user.phone}</td>

                        {/* ROLE */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'STAFF' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {user.role}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="py-3 px-4">
                          {user.status === 1 ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                              Khóa
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 px-4">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`${user.status === 1 ? 'text-green-600' : 'text-gray-400'} hover:scale-110 transition-transform`}
                              title={user.status === 1 ? "Khóa" : "Mở khóa"}
                            >
                              {user.status === 1 ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                            </button>

                            {/* EDIT with STATE */}
                            <Link
                              to={`/admin/user/edit/${user.id}`}
                              state={{ from: location.pathname }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <FaEdit size={18} />
                            </Link>

                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
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
                      <td colSpan="8" className="py-10 text-center text-gray-400 italic">
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50 hover:bg-gray-200 transition-all font-medium text-gray-700"
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-md transition-all font-medium ${page === i ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50 hover:bg-gray-200 transition-all font-medium text-gray-700"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListUser;