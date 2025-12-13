import { useState } from "react";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "a@gmail.com",
      phone: "0901234567",
      role: "ADMIN",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "b@gmail.com",
      phone: "0912345678",
      role: "STAFF",
      status: "ACTIVE",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "STAFF",
  });

  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "STAFF",
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setEmployees(
        employees.map((e) =>
          e.id === editingId
            ? { ...form, id: editingId, status: e.status }
            : e
        )
      );
    } else {
      setEmployees([
        ...employees,
        { ...form, id: Date.now(), status: "ACTIVE" },
      ]);
    }

    resetForm();
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
    });
    setEditingId(emp.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Xoá nhân viên này?")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        👥 Quản lý nhân viên
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <input
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Họ tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
        </select>

        <div className="flex gap-2 md:col-span-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            {editingId ? "Cập nhật" : "Thêm nhân viên"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Huỷ
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Họ tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">SĐT</th>
              <th className="px-4 py-2 text-left">Chức vụ</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e) => (
              <tr
                key={e.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{e.name}</td>
                <td className="px-4 py-2">{e.email}</td>
                <td className="px-4 py-2">{e.phone}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      e.role === "ADMIN"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {e.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-600">
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(e)}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Chưa có nhân viên
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
