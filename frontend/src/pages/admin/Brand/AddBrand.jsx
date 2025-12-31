import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCamera, FaArrowLeft, FaSave } from "react-icons/fa";
import apiBrandAdmin from "../../../api/admin/apiBrandAdmin";
import apiUpload from "../../../api/apiUpload";

// Slug generator helper


const AddBrand = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    imagePublicId: "", // ✅ Added for Cloudinary
    description: "",
    country: "",
    status: 1, // ✅ Mặc định là Hoạt động
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Instant Preview
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: previewUrl }));

    setUploading(true);
    try {
      const res = await apiUpload.uploadBrandImage(file);
      setForm((prev) => ({
        ...prev,
        image: res.url,
        imagePublicId: res.publicId
      }));
      toast.success("✅ Upload ảnh thành công");
    } catch {
      toast.error("❌ Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return toast.error("Vui lòng upload ảnh thương hiệu");

    try {
      await apiBrandAdmin.create(form);
      toast.success("Thêm thương hiệu thành công");
      navigate("/admin/brands");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm thất bại");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Thêm thương hiệu mới</h2>
        <button
          onClick={() => navigate("/admin/brands")}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium"
        >
          <FaArrowLeft /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image Upload Section - New Clean UI */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {form.image ? (
              <img
                src={form.image}
                className="w-full h-full object-contain p-2"
                alt="Preview"
              />
            ) : (
              <div className="text-center text-gray-400">
                <FaCamera size={32} className="mx-auto mb-2 opacity-50" />
                <span className="text-xs">Chưa có logo</span>
              </div>
            )}

            <label className="absolute inset-0 cursor-pointer hover:bg-black/10 flex items-center justify-center transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
              <span className="bg-white text-indigo-700 px-3 py-1.5 rounded shadow-sm text-xs font-bold">
                {form.image ? "Thay đổi" : "Chọn ảnh"}
              </span>
            </label>

            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-indigo-600 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-2">Định dạng: PNG, JPG, WEBP (Tối đa 2MB)</p>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu <span className="text-red-500">*</span></label>
            <input
              name="name"
              placeholder="Nhập tên..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Unused Slug Input - Backend generates it */}
          <div className="hidden">
            <input name="slug" value={form.slug} readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
            <input
              name="country"
              placeholder="Ví dụ: Việt Nam"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          {/* ✅ Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              name="status"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none font-medium ${Number(form.status) === 1
                ? "bg-green-50 text-green-700 border-green-200 focus:ring-green-500"
                : "bg-gray-50 text-gray-700 border-gray-200 focus:ring-gray-500"
                }`}
              value={form.status}
              onChange={handleChange}
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ẩn / Tạm ngưng</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              name="description"
              placeholder="Thông tin thêm về thương hiệu..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/brands")}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            disabled={uploading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            <FaSave /> Lưu thương hiệu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;