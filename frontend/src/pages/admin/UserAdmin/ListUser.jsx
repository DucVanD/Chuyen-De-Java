import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import apiUser from "../../../api/user/apiUser";

const roleColor = {
  CUSTOMER: "bg-green-100 text-green-700",
};

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Lấy đường dẫn hiện tại để back về

  /* ======================
      FETCH USERS
  ====================== */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiUser.getAll();
      // Lọc lấy CUSTOMER
      const customers = data.filter((u) => u.role === "CUSTOMER");
      setUsers(customers);
    } catch (err) {
      toast.error("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ======================
      TOGGLE STATUS
  ====================== */
  const handleToggleStatus = async (user) => {
    try {
      if (user.status === 1) {
        await apiUser.lock(user.id);
        toast.success("Đã khóa khách hàng");
      } else {
        await apiUser.unlock(user.id);
        toast.success("Đã mở khóa khách hàng");
      }
      fetchUsers();
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold text-gray-800">Danh sách khách hàng</h3>
        <Link 
          to="/admin/user/createUser" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center shadow-sm transition-all"
        >
          <FaPlus className="mr-2" /> Thêm khách hàng
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Đang tải dữ liệu...</p>
        ) : (
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
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.phone}</td>
                      
                      {/* ROLE */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${roleColor[user.role]}`}>
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
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">
                            Khóa
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3 px-4">
                        <div className="flex justify-center items-center space-x-3">
                          <button 
                            onClick={() => handleToggleStatus(user)} 
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title={user.status === 1 ? "Khóa" : "Mở khóa"}
                          >
                            {user.status === 1 ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                          </button>
                          
                          {/* EDIT with STATE */}
                          <Link 
                            to={`/admin/user/editUser/${user.id}`} 
                            state={{ from: location.pathname }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit size={18} />
                          </Link>

                          <button 
                            onClick={() => toast.info("Chưa hỗ trợ xóa")} 
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
                    <td colSpan="8" className="py-10 text-center text-gray-400 italic">
                      Chưa có khách hàng nào
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

export default ListUser;