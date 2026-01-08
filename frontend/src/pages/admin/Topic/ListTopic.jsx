import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiTopic from "../../../api/apiTopic";
import {
  FaPlus,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTag,
  FaCube,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const ListTopic = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const data = await apiTopic.getAll();
      setTopics(data || []);
      // Backend might not return pagination for all topics, assuming 1 page if data is array
      setLastPage(1);
    } catch (err) {
      console.error("Lỗi:", err);
      toast.error("Không thể tải danh sách!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [page]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      navigate(`/admin/topics/${pageNumber}`);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await apiTopic.toggleStatus(id);
      if (res.status) {
        toast.success(res.message);
        fetchTopics();
      }
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái chủ đề!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chủ đề này không?")) return;
    try {
      const res = await apiTopic.delete(id);
      if (res.status) {
        toast.success(res.message);
        fetchTopics();
      }
    } catch (err) {
      toast.error("Xóa chủ đề thất bại!");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaTag className="text-indigo-600" /> Quản lý chủ đề
          </h3>
          <p className="text-slate-500 text-sm mt-1">Phân loại bài viết theo các chủ đề chuyên biệt</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/addTopic"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95 font-semibold"
          >
            <FaPlus className="mr-2" /> Thêm chủ đề mới
          </Link>
          <Link
            to="/admin/trashTopic"
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center transition-all font-semibold"
          >
            <FaTrash className="mr-2" /> Thùng rác
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-20">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên chủ đề</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả chi tiết</th>
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
              ) : topics.length > 0 ? (
                topics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{topic.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{topic.name}</span>
                        <span className="text-[10px] text-slate-400 italic">Slug: {topic.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 truncate max-w-xs">{topic.description || "Chưa có mô tả"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${topic.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${topic.status === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        {topic.status === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(topic.id)}
                          className={`p-2 transition-all ${topic.status === 1 ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}
                          title={topic.status === 1 ? "Khóa" : "Kích hoạt"}
                        >
                          {topic.status === 1 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                        </button>
                        <Link
                          to={`/admin/edittopic/${topic.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(topic.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
                    Không có chủ đề nào được tìm thấy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-sm text-slate-500 font-medium">Hiển thị trang <span className="text-slate-900 font-bold">{currentPage}</span> / {lastPage}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListTopic;
