import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import apiPost from "../../../api/apiPost";
import apiTopic from "../../../api/apiTopic";

const AddPost = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detail: "", // Nội dung từ Editor
    topic_id: "",
    type: "post",
    status: 1,
  });
  
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Lấy danh sách chủ đề
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await apiTopic.getAll();
        setTopics(res.data || res);
      } catch (error) {
        console.error("Lỗi khi tải chủ đề:", error);
      }
    };
    fetchTopics();
  }, []);

  // Cleanup URL preview để tránh rò rỉ bộ nhớ
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
    
    // Validate cơ bản
    if (!formData.topic_id) {
        alert("Vui lòng chọn chủ đề!");
        return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = new FormData();
      
      // Map lại dữ liệu để khớp 100% với PostDto ở Backend
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("content", formData.detail);   // Backend: content
      data.append("topicId", formData.topic_id); // Backend: topicId
      data.append("type", formData.type);
      data.append("status", formData.status);

      // Thêm file ảnh nếu có
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      const res = await apiPost.create(data); 
      
      alert("Thêm bài viết thành công!");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response?.data);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      alert(error.response?.data?.message || "Lỗi khi lưu bài viết (Lỗi 500)! Kiểm tra Console Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b">
          <h3 className="text-2xl font-semibold text-gray-800">Thêm bài viết mới</h3>
          <Link to="/admin/posts" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center">
            <FaArrowLeft className="mr-2" /> Về danh sách
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Cột trái: Nội dung chính */}
            <div className="lg:w-2/3 space-y-4">
              <div>
                <label className="block font-medium mb-1">Tiêu đề bài viết</label>
                <input
                  type="text"
                  name="title"
                  className={`w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Nhập tiêu đề..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Mô tả ngắn</label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Tóm tắt nội dung bài viết..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Nội dung chi tiết</label>
                <Editor
                  apiKey="08g2njx5rtkfad5tsq5p91c0bos9siwvip1tcsinbsduna70"
                  value={formData.detail}
                  init={{ 
                    height: 450, 
                    menubar: true,
                    plugins: 'link image code table lists',
                    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image'
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </div>

            {/* Cột phải: Cài đặt bổ sung */}
            <div className="lg:w-1/3 space-y-4">
              
              {/* Chủ đề */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <label className="block font-medium mb-2 text-gray-700">Chủ đề (Topic)</label>
                <select 
                  name="topic_id" 
                  className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-indigo-500"
                  value={formData.topic_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn chủ đề --</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Hình đại diện */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <label className="block font-medium mb-2 text-gray-700">Hình đại diện (Thumbnail)</label>
                <div className="mb-3 border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center overflow-hidden bg-white relative">
                  {thumbPreview ? (
                    <img src={thumbPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                        <FaImage className="text-gray-300 text-5xl mx-auto mb-2" />
                        <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                    </div>
                  )}
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
                />
              </div>

              {/* Trạng thái */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                <label className="block font-medium mb-2 text-gray-700">Trạng thái xuất bản</label>
                <select 
                  name="status" 
                  className="w-full border border-gray-300 p-2 rounded bg-white outline-none focus:border-indigo-500"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="1">Hiển thị (Public)</option>
                  <option value="2">Bản nháp (Draft)</option>
                  <option value="0">Ẩn (Hidden)</option>
                </select>
              </div>

              {/* Nút lưu */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
              >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                        ĐANG XỬ LÝ...
                    </span>
                ) : "LƯU BÀI VIẾT"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </section>
  );
};

export default AddPost;