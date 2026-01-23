import apiPostAdmin from "../../../api/admin/apiPostAdmin";
import { getImageUrl } from "../../../api/config";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaEye, FaEdit } from "react-icons/fa";

const ListPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const isAdmin = JSON.parse(localStorage.getItem("adminUser"))?.role === "ADMIN";

  // Lấy danh sách bài viết
  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiPostAdmin.getPage(page - 1, 8, "POST");
      setPosts(res.content);
      setCurrentPage(res.number + 1);
      setLastPage(res.totalPages);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bài viết:", err);
      toast.error("Không thể tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // Phân trang
  const handlePageChange = (page) => {
    if (page > 0 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  // Toggle trạng thái
  const handleToggleStatus = async (id) => {
    try {
      await apiPostAdmin.toggleStatus(id);
      toast.success("Cập nhật trạng thái thành công");
      fetchPosts(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  // Xóa bài viết
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này không?")) return;
    try {
      await apiPostAdmin.delete(id);
      toast.success("Xóa bài viết thành công");
      fetchPosts(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Xóa bài viết thất bại!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Danh sách bài viết
        </h3>
        {isAdmin && (
          <div className="flex space-x-3">
            <Link
              to="/admin/post/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i> Thêm bài viết
            </Link>
            <Link
              to="/admin/posts/trash"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition duration-200"
            >
              <FaTrash className="mr-2" /> Thùng rác
            </Link>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {posts.length > 0 ? (
                posts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex-shrink-0 h-14 w-20">
                        {item.image ? (
                          <img
                            className="h-14 w-20 object-cover border border-gray-200 rounded-md shadow-sm"
                            src={getImageUrl(item.image, "post")}
                            alt={item.title}
                          />
                        ) : (
                          <div className="h-14 w-20 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-[10px] text-center px-1">
                              Không có hình
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="font-medium truncate max-w-[200px]" title={item.title}>{item.title}</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">
                        Slug: {item.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.topicName || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.status === 1 ? (
                        <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-700">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`${item.status === 1 ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                          title="Đổi trạng thái"
                        >
                          {item.status === 1 ? (
                            <FaToggleOn className="text-xl" />
                          ) : (
                            <FaToggleOff className="text-xl" />
                          )}
                        </button>

                        <Link
                          to={`/post/${item.slug}`}
                          target="_blank"
                          className="text-indigo-500 hover:text-indigo-700"
                          title="Xem trên web"
                        >
                          <FaEye className="text-lg" />
                        </Link>

                        <Link
                          to={`/admin/post/edit/${item.id}`}
                          className="text-blue-500 hover:text-blue-700"
                          title="Chỉnh sửa"
                        >
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
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {/* Nút Trước */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Trước
            </button>

            {/* Số trang */}
            {Array.from({ length: lastPage }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Nút Sau */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ListPost;
