import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCamera, FaArrowLeft, FaSave } from "react-icons/fa";
import apiUser from "../../../api/user/apiUser";
import apiUpload from "../../../api/apiUpload";

const AddUser = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    status: 1,
    avatar: "",
  });

  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const avatarUrl = await apiUpload.uploadUserAvatar(file);
      setForm((prev) => ({ ...prev, avatar: avatarUrl }));
      toast.success("✅ Upload avatar thành công");
    } catch {
      toast.error("❌ Upload avatar thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return toast.error("Vui lòng nhập mật khẩu");

    try {
      await apiUser.create(form, password);
      toast.success("Thêm người dùng thành công");
      navigate("/admin/users");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm thất bại");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Thêm người dùng mới</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium"
        >
          <FaArrowLeft /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={form.avatar || "https://placehold.co/150?text=Avatar"}
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-all shadow-lg transform group-hover:scale-110">
              <FaCamera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                className="hidden"
              />
            </label>
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">Nhấn icon máy ảnh để tải ảnh lên</p>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
            <input
              name="name"
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
            <input
              name="phone"
              placeholder="0912..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
            <input
              type="password"
              placeholder="••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              name="address"
              placeholder="Số nhà, đường, phường/xã..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              name="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              onChange={handleChange}
              value={form.role}
            >
              <option value="CUSTOMER">Customer (Khách hàng)</option>
              <option value="STAFF">Staff (Nhân viên)</option>
              <option value="ADMIN">Admin (Quản trị viên)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-4">
           <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            disabled={uploading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            {uploading ? "Đang xử lý..." : <><FaSave /> Lưu người dùng</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;