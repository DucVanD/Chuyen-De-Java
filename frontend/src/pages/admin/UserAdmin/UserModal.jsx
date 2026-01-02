import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCamera, FaTimes, FaSave } from "react-icons/fa";
import apiUserAdmin from "../../../api/admin/apiUserAdmin";
import apiUpload from "../../../api/apiUpload";

const UserModal = ({ isOpen, onClose, onSuccess, userToEdit }) => {
  const [uploading, setUploading] = useState(false);
  const [password, setPassword] = useState("");

  // State form
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    status: 1,
    avatar: "",
    avatarPublicId: "",
  });

  // Reset form khi mở Modal
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        // Chế độ EDIT
        setForm({
          name: userToEdit.name,
          email: userToEdit.email, // Thường email không cho sửa, nhưng hiển thị để xem
          phone: userToEdit.phone,
          address: userToEdit.address || "",
          role: userToEdit.role,
          status: userToEdit.status,
          avatar: userToEdit.avatar || "",
          avatarPublicId: userToEdit.avatarPublicId || "",
        });
        setPassword(""); // Edit thì reset pass (nếu nhập mới đổi)
      } else {
        // Chế độ ADD
        setForm({
          name: "",
          email: "",
          phone: "",
          address: "",
          role: "CUSTOMER",
          status: 1,
          avatar: "",
          avatarPublicId: "",
        });
        setPassword("");
      }
    }
  }, [isOpen, userToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await apiUpload.uploadUserAvatar(file);
      setForm((prev) => ({
        ...prev,
        avatar: res.url,
        avatarPublicId: res.publicId
      }));
      toast.success("✅ Upload avatar thành công");
    } catch {
      toast.error("❌ Upload avatar thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!userToEdit && !password) {
      return toast.error("Vui lòng nhập mật khẩu cho người dùng mới");
    }

    try {
      if (userToEdit) {
        // --- API UPDATE ---
        // Nếu có nhập password thì gửi kèm, không thì thôi (tùy backend xử lý)
        const updateData = { ...form };
        if (password) updateData.password = password;

        await apiUserAdmin.update(userToEdit.id, updateData);
        toast.success("Cập nhật thành công!");
      } else {
        // --- API CREATE ---
        await apiUserAdmin.create(form, password);
        toast.success("Thêm mới thành công!");
      }

      onSuccess(); // Load lại list ở cha
      onClose();   // Đóng modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {userToEdit ? "Cập nhật thông tin" : "Thêm người dùng mới"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={form.avatar || "https://placehold.co/150?text=Avatar"}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-md transform transition-transform group-hover:scale-110">
                  <FaCamera size={14} />
                  <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" />
                </label>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                    <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="label-text">Họ và tên <span className="text-red-500">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Nguyễn Văn A" />
              </div>

              <div>
                <label className="label-text">Email <span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field disabled:bg-gray-100 disabled:text-gray-500"
                  disabled={!!userToEdit} // Thường không cho sửa email
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="label-text">Số điện thoại <span className="text-red-500">*</span></label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="09xxxx" />
              </div>

              <div className="md:col-span-2">
                <label className="label-text">Địa chỉ</label>
                <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Nhập địa chỉ..." />
              </div>

              <div>
                <label className="label-text">
                  {userToEdit ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                  {!userToEdit && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label className="label-text">Vai trò</label>
                <select name="role" value={form.role} onChange={handleChange} className="input-field bg-white">
                  <option value="CUSTOMER">Customer</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="label-text">Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`input-field font-medium ${Number(form.status) === 1 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Khóa</option>
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors">
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all"
              >
                <FaSave /> {userToEdit ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Style CSS nội bộ cho gọn */}
      <style>{`
        .label-text { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
        .input-field { width: 100%; padding: 0.625rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default UserModal;