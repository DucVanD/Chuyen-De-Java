import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaImage, FaNewspaper, FaInfoCircle, FaSave, FaList, FaTag } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import apiPost from "../../../api/apiPost";
import apiTopic from "../../../api/apiTopic";
import { toast } from "react-toastify";

const AddPost = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detail: "",
    topic_id: "",
    type: "post",
    status: 1,
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await apiTopic.getAll();
        setTopics(res.data || res || []);
      } catch (error) {
        console.error("Lỗi khi tải chủ đề:", error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    return () => {
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    };
  }, [thumbPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, detail: content }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.topic_id) {
      toast.warning("Vui lòng chọn chủ đề!");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("content", formData.detail);
      data.append("topicId", formData.topic_id);
      data.append("type", formData.type);
      data.append("status", formData.status);

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      await apiPost.create(data);
      toast.success("✅ Thêm bài viết thành công!");
      setTimeout(() => navigate("/admin/posts"), 1500);
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response?.data);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || "Lỗi khi lưu bài viết!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaNewspaper className="text-indigo-600" /> Viết bài mới
          </h3>
          <p className="text-slate-500 text-sm mt-1">Sáng tạo nội dung mới cho blog và tin tức</p>
        </div>
        <Link
          to="/admin/posts"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Quay lại danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg mb-2">
              <FaInfoCircle />
              <h4>Nội dung bài viết</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề bài viết</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${errors.title ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}`}
                  placeholder="Nhập tiêu đề thu hút người đọc..."
                  required
                />
                {errors.title && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.title[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                  placeholder="Tóm tắt ý chính của bài viết..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nội dung chi tiết</label>
                <div className="rounded-xl overflow-hidden border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                  <Editor
                    apiKey="08g2njx5rtkfad5tsq5p91c0bos9siwvip1tcsinbsduna70"
                    value={formData.detail}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: ["advlist", "autolink", "lists", "link", "image", "preview", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "help", "wordcount"],
                      toolbar: "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image table | code fullscreen",
                      content_style: "body { font-family:Inter,sans-serif; font-size:14px; color: #334155 }",
                      skin: "oxide",
                      content_css: "default"
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="space-y-6">
          {/* Meta Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <FaList />
              <h4>Phân loại & Trạng thái</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chủ đề bài viết</label>
                <div className="relative">
                  <select
                    name="topic_id"
                    value={formData.topic_id}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white font-medium"
                    required
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <FaTag className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={12} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chế độ xuất bản</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none font-bold transition-all ${formData.status == 1 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}
                >
                  <option value="1">✓ Công khai</option>
                  <option value="2">✎ Bản nháp</option>
                  <option value="0">✕ Ẩn bài viết</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <FaImage />
              <h4>Hình nền</h4>
            </div>

            <div className="relative">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all duration-200 overflow-hidden group">
                {thumbPreview ? (
                  <div className="relative w-full h-full">
                    <img src={thumbPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-bold">Thay đổi hình ảnh</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-indigo-500">
                    <FaImage className="w-10 h-10 mb-3" />
                    <p className="text-sm font-medium">Chọn ảnh đại diện bài viết</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
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
                  <FaSave className="mr-2" /> Xuất bản bài viết
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;