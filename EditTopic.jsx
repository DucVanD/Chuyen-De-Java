import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiTopic from "../../../api/apiTopic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTopic = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID từ URL

  const [topic, setTopic] = useState({
    name: "",
    description: "",
    status: 1,
    slug: ""
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 1. Lấy thông tin chi tiết chủ đề
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        // Đảm bảo hàm này đã được định nghĩa trong apiTopic.js
        const data = await apiTopic.getTopicById(id); 
        if (data) {
          setTopic(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không tìm thấy chủ đề này!");
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [id]);

  // ✅ 2. Xử lý thay đổi input và tự động tạo Slug nếu đổi tên
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTopic((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value
    }));
  };

  // ✅ 3. Gửi dữ liệu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Đảm bảo hàm này nhận (id, data) trong apiTopic.js
      await apiTopic.update(id, topic); 
      
      toast.success("Cập nhật chủ đề thành công!");
      
      // Quay lại trang danh sách sau 1.5s
      const savedPage = localStorage.getItem("currentTopicPage") || 1;
      setTimeout(() => navigate(`/admin/topics/${savedPage}`), 1500);
      
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Chỉnh sửa chủ đề
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
        >
          Trở về
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cột trái: Thông tin chính */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên chủ đề</label>
              <input
                type="text"
                name="name"
                value={topic.name}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-indigo-500 border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                name="description"
                value={topic.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2.5 border rounded-md focus:ring-indigo-500 border-gray-300"
              ></textarea>
            </div>
          </div>

          {/* Cột phải: Trạng thái & Nút lưu */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Trạng thái hiển thị</label>
              <select
                name="status"
                value={topic.status}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md bg-white border-gray-300"
              >
                <option value={1}>Xuất bản</option>
                <option value={0}>Không xuất bản</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white py-3 px-4 rounded-md font-bold transition ${
                isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <i className="fas fa-save mr-2"></i> 
              {isSubmitting ? "Đang lưu..." : "LƯU THAY ĐỔI"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTopic;