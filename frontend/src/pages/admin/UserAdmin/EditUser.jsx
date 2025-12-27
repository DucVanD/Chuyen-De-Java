import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCamera, FaArrowLeft, FaSave } from "react-icons/fa";
import apiUser from "../../../api/apiUser";
import apiUpload from "../../../api/apiUpload";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    status: 1,
    avatar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiUser.getById(id);
        setForm({
          name: data.name,
          phone: data.phone,
          address: data.address || "",
          role: data.role,
          status: data.status,
          avatar: data.avatar || "",
        });
      } catch {
        toast.error("Không tìm thấy người dùng");
        navigate("/admin/users");
      }
    };
    fetchUser();
  }, [id, navigate]);

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
      toast.success("✅ Upload avatar mới thành công");
    } catch {
      toast.error("❌ Upload avatar thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiUser.update(id, form);
      toast.success("Cập nhật thành công");
      const from = location.state?.from || "/admin/users";
      navigate(from);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Cập nhật thông tin</h2>
        <button
          onClick={() => {
             const from = location.state?.from || "/admin/users";
             navigate(from);
          }}
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
              alt="User Avatar"
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
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none font-medium ${
                Number(form.status) === 1
                  ? "bg-green-50 text-green-700 border-green-200 focus:ring-green-500"
                  : "bg-red-50 text-red-700 border-red-200 focus:ring-red-500"
              }`}
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Khóa</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-4">
           <button
            type="button"
            onClick={() => {
                const from = location.state?.from || "/admin/users";
                navigate(from);
            }}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            disabled={uploading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            <FaSave /> Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;