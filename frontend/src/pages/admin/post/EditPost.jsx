import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaNewspaper, FaInfoCircle, FaImage, FaList, FaTag, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import apiPost from "../../../api/apiPost";
import apiTopic from "../../../api/apiTopic";
import { imageURL } from "../../../api/config";
import { toast } from "react-toastify";

const EditPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [topics, setTopics] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        content: "",
        topicId: "",
        type: "post",
        status: 1,
    });

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [topicRes, postData] = await Promise.all([
                    apiTopic.getAll(),
                    apiPost.getById(id)
                ]);
                setTopics(topicRes.data || topicRes || []);

                if (postData) {
                    setFormData({
                        title: postData.title || "",
                        slug: postData.slug || "",
                        description: postData.description || "",
                        content: postData.content || "",
                        topicId: postData.topicId || "",
                        type: postData.type || "post",
                        status: postData.status || 1,
                    });
                    if (postData.image) setPreview(`${imageURL}/posts/${postData.image}`);
                }
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
                toast.error("Không thể tải thông tin bài viết!");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("slug", formData.slug || formData.title.toLowerCase().replace(/ /g, '-'));
            data.append("description", formData.description || "");
            data.append("content", formData.content || "");
            data.append("topicId", formData.topicId);
            data.append("type", formData.type);
            data.append("status", formData.status);

            if (imageFile) {
                data.append("thumbnail", imageFile);
            }

            await apiPost.update(id, data);
            toast.success("✅ Cập nhật bài viết thành công!");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Lỗi cập nhật:", error.response?.data);
            toast.error("Lỗi cập nhật bài viết!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Đang tải nội dung bài viết...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FaEdit className="text-indigo-600" /> Chỉnh sửa bài viết
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Cập nhật nội dung và tùy chỉnh cài đặt bài viết</p>
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
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả ngắn</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                                    placeholder="Tóm tắt nội dung..."
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nội dung chi tiết</label>
                                <div className="rounded-xl overflow-hidden border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                                    <Editor
                                        apiKey="08g2njx5rtkfad5tsq5p91c0bos9siwvip1tcsinbsduna70"
                                        value={formData.content}
                                        onEditorChange={(val) => setFormData({ ...formData, content: val })}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: ["advlist", "autolink", "lists", "link", "image", "preview", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "help", "wordcount"],
                                            toolbar: "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image table | code fullscreen",
                                            content_style: "body { font-family:Inter,sans-serif; font-size:14px; color: #334155 }",
                                            skin: "oxide",
                                            content_css: "default"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="space-y-6">
                    {/* Settings Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
                            <FaList />
                            <h4>Phân loại & Trạng thái</h4>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chủ đề</label>
                                <div className="relative">
                                    <select
                                        value={formData.topicId}
                                        onChange={e => setFormData({ ...formData, topicId: e.target.value })}
                                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white font-medium"
                                        required
                                    >
                                        <option value="">Chọn chủ đề</option>
                                        {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    <FaTag className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={12} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trạng thái hiển thị</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: Number(e.target.value) })}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none font-bold transition-all ${formData.status == 1 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}
                                >
                                    <option value={1}>✓ Công khai</option>
                                    <option value={2}>✎ Bản nháp</option>
                                    <option value={0}>✕ Tạm ẩn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Image Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
                            <FaImage />
                            <h4>Hình ảnh đại diện</h4>
                        </div>

                        <div className="relative group">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all duration-200 overflow-hidden">
                                {preview ? (
                                    <div className="relative w-full h-full">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover shadow-inner" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-bold">Thay đổi hình ảnh</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                                        <FaImage className="w-10 h-10 mb-3" />
                                        <p className="text-sm font-medium">Chọn ảnh mới</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                            setPreview(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FaSave className="mr-2" /> Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditPost;