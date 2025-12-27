// src/pages/admin/posts/ListPost.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import apiPost from "../../../api/apiPost"; 
import { imageURL } from "../../../api/config"; // Đảm bảo imageURL trỏ tới http://localhost:8080/images/posts

const ListPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await apiPost.getAll(); // Backend trả về List trực tiếp
      
      // Vì Spring Boot trả về Array trực tiếp (không có .status hay .data.data)
      // Nên ta kiểm tra nếu res là mảng thì set vào state
      if (Array.isArray(res)) {
        setPosts(res);
      } else if (res.data && Array.isArray(res.data)) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bài viết:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Hàm xử lý xóa (ví dụ)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
        try {
            await apiPost.delete(id);
            fetchPosts(); // Load lại danh sách sau khi xóa
        } catch (err) {
            alert("Lỗi khi xóa bài viết");
        }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Danh sách bài viết
        </h3>
        <div className="flex space-x-3">
          <Link
            to="/admin/addPost"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center transition duration-200"
          >
            <FaPlus className="mr-2" /> Thêm mới
          </Link>
          <Link
            to="/admin/posts/trash"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition duration-200"
          >
            <FaTrash className="mr-2" /> Thùng rác
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Chức năng</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                    <td colSpan="5" className="text-center py-6">Đang tải dữ liệu...</td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex-shrink-0 h-14 w-20">
                        {/* Lưu ý: Backend dùng trường 'image' chứ không phải 'thumbnail' */}
                        {item.image ? (
                          <img
                            className="h-14 w-20 object-cover border border-gray-200 rounded-md"
                            src={`${imageURL}/posts/${item.image}`}
                            alt={item.title}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/80x60?text=No+Image"; }}
                          />
                        ) : (
                          <div className="h-14 w-20 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs text-center">Không có hình</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-gray-500 text-xs">Slug: {item.slug}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.status === 1 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hiển thị</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ẩn</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center space-x-3">
                      

                      

                        <Link to={`/admin/editPost/${item.id}`} className="text-blue-500 hover:text-blue-700" title="Chỉnh sửa">
                          <FaEdit className="text-lg" />
                        </Link>

                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700" 
                          title="Xóa"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">Không có dữ liệu bài viết nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListPost;