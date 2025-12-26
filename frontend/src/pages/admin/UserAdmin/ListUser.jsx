import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";
import apiUser from "../../../api/apiUser";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // FETCH USERS
  // ======================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiUser.getAll(); // backend trả List<UserDto>
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ======================
  // TOGGLE STATUS
  // ======================
  const handleToggleStatus = async (user) => {
    try {
      if (user.status === 1) {
        await apiUser.lock(user.id);
        toast.success("Đã khóa người dùng");
      } else {
        await apiUser.unlock(user.id);
        toast.success("Đã mở khóa người dùng");
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // ======================
  // DELETE (TẠM THỜI)
  // ======================
  const handleDelete = () => {
    toast.warning("Backend chưa hỗ trợ xóa user");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold">Danh sách người dùng</h3>

        <Link
          to="/admin/user/createUser"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Thêm mới
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-xs uppercase">ID</th>
                  <th className="px-4 py-3 text-xs uppercase">Họ tên</th>
                  <th className="px-4 py-3 text-xs uppercase">Email</th>
                  <th className="px-4 py-3 text-xs uppercase">SĐT</th>
                  <th className="px-4 py-3 text-xs uppercase">Vai trò</th>
                  <th className="px-4 py-3 text-xs uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-xs uppercase">Hành động</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-2">{user.id}</td>
                      <td className="py-2 font-medium">{user.name}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.phone}</td>
                      <td className="py-2">{user.role}</td>
                      <td className="py-2">
                        {user.status === 1 ? (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">
                            Khóa
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <div className="flex justify-center space-x-3">
                          {/* TOGGLE */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="text-green-600 hover:text-green-800"
                          >
                            {user.status === 1 ? (
                              <FaToggleOn size={20} />
                            ) : (
                              <FaToggleOff size={20} />
                            )}
                          </button>

                          {/* DETAIL (CHƯA LÀM) */}
                          <Link
                            to="#"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <FaEye />
                          </Link>

                          {/* EDIT */}
                          <Link
                            to={`/admin/user/editUser/${user.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </Link>

                          {/* DELETE (TẠM) */}
                          <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-6 text-gray-500">
                      Không có người dùng nào
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
