import { useState } from "react";
import { FaUserShield, FaUsers, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaUserTie, FaSave, FaTimes, FaCube } from "react-icons/fa";
import { toast } from "react-toastify";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", phone: "0901234567", role: "ADMIN", status: "ACTIVE" },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", phone: "0912345678", role: "STAFF", status: "ACTIVE" },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "STAFF",
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", role: "STAFF" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setEmployees(employees.map((emp) => emp.id === editingId ? { ...form, id: editingId, status: emp.status } : emp));
      toast.success("✅ Cập nhật thông tin thành công!");
    } else {
      setEmployees([...employees, { ...form, id: Date.now(), status: "ACTIVE" }]);
      toast.success("✅ Thêm nhân viên mới thành công!");
    }
    resetForm();
  };

  const handleEdit = (emp) => {
    setForm({ name: emp.name, email: emp.email, phone: emp.phone, role: emp.role });
    setEditingId(emp.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá nhân viên này?")) {
      setEmployees(employees.filter((e) => e.id !== id));
      toast.info("Đã xoá nhân viên khỏi hệ thống.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaUserShield className="text-indigo-600" /> Quản trị nhân sự
          </h3>
          <p className="text-slate-500 text-sm mt-1">Quản lý đội ngũ nhân viên và phân quyền truy cập hệ thống</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(!isFormOpen);
          }}
          className={`flex items-center justify-center px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${isFormOpen ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/50" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"}`}
        >
          {isFormOpen ? <><FaTimes className="mr-2" /> Đóng lại</> : <><FaPlus className="mr-2" /> Thêm thành viên</>}
        </button>
      </div>

      {/* Form Section (Collapsible) */}
      {isFormOpen && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 animate-slideDown overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg mb-2">
              {editingId ? <FaEdit /> : <FaPlus />}
              <h4>{editingId ? "Cập nhật thông tin nhân viên" : "Đăng ký nhân viên mới"}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <div className="relative">
                  <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                    placeholder="Nhập tên nhân viên..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                    placeholder="email@congty.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                    placeholder="0123.456.789"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chức vụ / Quyền hạn</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold bg-white"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  <option value="STAFF">Nhân viên (STAFF)</option>
                  <option value="MANAGER">Quản lý (MANAGER)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
              >
                <FaSave /> {editingId ? "Ghi nhận thay đổi" : "Tạo tài khoản ngay"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin nhân viên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Chức vụ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg border border-slate-200">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{emp.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold">ID: #{emp.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaEnvelope className="text-slate-300 text-[10px]" />
                          {emp.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold italic">
                          <FaPhone className="text-slate-300 text-[10px]" />
                          {emp.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase ${emp.role === 'ADMIN' ? 'bg-rose-100 text-rose-600 border border-rose-200' : emp.role === 'MANAGER' ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'bg-blue-100 text-blue-600 border border-blue-200'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-2 text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow border border-transparent hover:border-slate-100"
                          title="Sửa thông tin"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-rose-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow border border-transparent hover:border-slate-100"
                          title="Sa thải / Xóa"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">
                    <FaUsers size={48} className="mx-auto mb-4 opacity-10" />
                    Hệ thống chưa có nhân viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="text-xl font-bold mb-1">Tổng quan nhân sự</h4>
          <p className="text-white/60 text-sm">Hệ thống đang phục vụ cho {employees.length} thành viên nội bộ.</p>
        </div>
        <div className="flex gap-8 relative z-10">
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Quản trị viên</p>
            <p className="text-2xl font-black">{employees.filter(e => e.role === 'ADMIN').length}</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Nhân viên</p>
            <p className="text-2xl font-black">{employees.filter(e => e.role === 'STAFF').length}</p>
          </div>
        </div>
        <FaUserShield className="absolute -right-4 -bottom-4 text-white/5" size={160} />
      </div>
    </div>
  );
};

export default EmployeeManagement;
