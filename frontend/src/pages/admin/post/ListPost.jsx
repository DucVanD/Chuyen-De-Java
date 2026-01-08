import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaNewspaper,
  FaSearch,
  FaChevronRight,
  FaCube
} from "react-icons/fa";
import apiPost from "../../../api/apiPost";
import { imageURL } from "../../../api/config";
import { toast } from "react-toastify";

const ListPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await apiPost.getAll();
      if (Array.isArray(res)) {
        setPosts(res);
      } else if (res.data && Array.isArray(res.data)) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bài viết:", err);
      toast.error("Không thể tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await apiPost.delete(id);
        toast.success("Xóa bài viết thành công!");
        fetchPosts();
      } catch (err) {
        toast.error("Lỗi khi xóa bài viết");
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaNewspaper className="text-indigo-600" /> Quản lý bài viết
          </h3>
          <p className="text-slate-500 text-sm mt-1">Quản lý nội dung tin tức, blog và hướng dẫn</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/addPost"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95 font-semibold"
          >
            <FaPlus className="mr-2" /> Viết bài mới
          </Link>
          <Link
            to="/admin/posts/trash"
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center transition-all font-semibold"
          >
            <FaTrash className="mr-2" /> Thùng rác
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết theo tiêu đề..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-20">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin bài viết</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4"><div className="h-12 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          src={item.image ? `${imageURL}/posts/${item.image}` : "https://via.placeholder.com/80x60?text=No+Image"}
                          alt={item.title}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150x100?text=No+Image"; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">Slug: {item.slug}</span>
                          {item.topic_name && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold"># {item.topic_name}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        {item.status === 1 ? 'Công khai' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/editPost/${item.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Sửa"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                    <FaCube size={48} className="mx-auto mb-4 opacity-10" />
                    Không tìm thấy bài viết nào.
                  </td>
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