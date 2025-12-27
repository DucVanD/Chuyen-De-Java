import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiUser from "../../../api/apiUser";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const roleColor = {
  ADMIN: "bg-red-100 text-red-700",
  STAFF: "bg-blue-100 text-blue-700",
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Lấy đường dẫn hiện tại để back về

  /* ======================
      FETCH EMPLOYEES
  ====================== */
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await apiUser.getAll();
      // Lọc lấy ADMIN và STAFF
      const staffAndAdmin = data.filter(
        (u) => u.role === "ADMIN" || u.role === "STAFF"
      );
      setEmployees(staffAndAdmin);
    } catch {
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ======================
      TOGGLE STATUS
  ====================== */
  const handleToggleStatus = async (emp) => {
    try {
      if (emp.status === 1) {
        await apiUser.lock(emp.id);
        toast.success("Đã khóa nhân viên");
      } else {
        await apiUser.unlock(emp.id);
        toast.success("Đã mở khóa nhân viên");
      }
      fetchEmployees();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
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
                            onClick={() =>
                              toast.info("Chức năng xóa tạm thời bị khóa")
                            }
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
        )}
      </div>
    </div>
  );
}