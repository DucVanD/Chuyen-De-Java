import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaUsers,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { imageURL } from "../../../api/config";
import apiUser from "../../../api/apiUser";

const ListUser = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiUser.getAllPage(page);
      if (res.status) {
        setUsers(res.data.data);
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách user:", err);
      toast.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(Number(page) || 1);
  }, [page]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      navigate(`/admin/users/${pageNumber}`);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await apiUser.toggleStatus(id);
      if (res.status) {
        toast.success(res.message);
        fetchUsers(currentPage);
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const res = await apiUser.delete(id);
      if (res.status) {
        toast.success(res.message);
        fetchUsers(currentPage);
      }
    } catch (err) {
      toast.error("Xóa người dùng thất bại!");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaUsers className="text-indigo-600" /> Quản lý thành viên
          </h3>
          <p className="text-slate-500 text-sm mt-1">Danh sách tất cả người dùng và quản trị viên hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/user/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95 font-semibold"
          >
            <FaPlus className="mr-2" /> Thêm thành viên
          </Link>
          <Link
            to="/admin/user/trash"
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center transition-all font-semibold"
          >
            <FaTrash className="mr-2" /> Thùng rác
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-20">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thành viên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin tài khoản</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4"><div className="h-12 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100">
                          <img
                            className="w-full h-full object-cover"
                            src={user.avatar ? `${imageURL}/avatar/${user.avatar}` : `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&bold=true`}
                            alt={user.name}
                            onError={(e) => { e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"; }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{user.name}</span>
                          <span className="text-xs text-slate-400 font-medium">{user.email}</span>
                          <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight">{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-bold text-slate-600 bg-slate-50 self-start px-2 py-0.5 rounded-lg border border-slate-100">{user.username}</span>
                        <span className="text-xs text-slate-400 mt-1 truncate max-w-[200px]" title={user.address}>
                          {user.address || "Chưa cập nhật địa chỉ"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        {user.status === 1 ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 transition-all ${user.status === 1 ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}
                          title={user.status === 1 ? "Khóa tài khoản" : "Mở khóa"}
                        >
                          {user.status === 1 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                        </button>
                        <Link
                          to={`/admin/userDetail/${user.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <FaEye size={18} />
                        </Link>
                        <Link
                          to={`/admin/user/edit/${user.id}`}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                    <FaUserCircle size={48} className="mx-auto mb-4 opacity-10" />
                    Không có thành viên nào được tìm thấy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-sm text-slate-500 font-medium">
            Hiển thị trang <span className="text-slate-900 font-bold">{currentPage}</span> / {lastPage}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <FaChevronLeft size={14} />
            </button>

            {Array.from({ length: lastPage }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === i + 1 ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUser;
