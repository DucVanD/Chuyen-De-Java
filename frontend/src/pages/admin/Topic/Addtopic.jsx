import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiTopic from "../../../api/apiTopic";
import { toast } from "react-toastify";
import { FaArrowLeft, FaTag, FaInfoCircle, FaLink, FaSave } from "react-icons/fa";

const AddTopic = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: 1,
  });

  const generateSlug = (text) =>
    text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: name === "status" ? Number(value) : value };
      if (name === "name") updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiTopic.create(formData);
      toast.success("✅ Thêm chủ đề thành công!");
      setTimeout(() => navigate("/admin/topics"), 1500);
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("❌ Lỗi khi thêm chủ đề!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaTag className="text-indigo-600" /> Thêm chủ đề mới
          </h3>
          <p className="text-slate-500 text-sm mt-1">Khởi tạo chủ đề để phân loại các bài viết tin tức</p>
        </div>
        <Link
          to="/admin/topics"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Về danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg border-b border-slate-50 pb-4">
              <FaInfoCircle />
              <h4>Thông tin chủ đề</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên chủ đề</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  placeholder="Ví dụ: Tin công nghệ, Mẹo nhà bếp..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Đường dẫn (Slug)</label>
                <div className="relative">
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm text-slate-500 outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                  placeholder="Mô tả tóm tắt nội dung các bài viết của chủ đề này..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="space-y-6">
          {/* Settings Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <FaTag />
              <h4>Thiết lập</h4>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trạng thái hiển thị</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none font-bold transition-all ${formData.status == 1 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}
              >
                <option value={1}>✓ Công khai ngay</option>
                <option value={0}>✕ Tạm ẩn / Nháp</option>
              </select>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaSave className="mr-2" /> Lưu chủ đề
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTopic;