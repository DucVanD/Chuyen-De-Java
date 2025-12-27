import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import apiPost from "../../../api/apiPost";
import apiTopic from "../../../api/apiTopic";
import { imageURL } from "../../../api/config";

const EditPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [topics, setTopics] = useState([]);
    const [imageFile, setImageFile] = useState(null); // File để gửi lên server
    const [preview, setPreview] = useState(null);    // URL để hiển thị ảnh
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        content: "", // Đổi từ detail thành content khớp PostDto
        topicId: "", // Đổi từ topic_id thành topicId khớp PostDto
        type: "post",
        status: 1,
    });

    // 1. Tải dữ liệu ban đầu
    useEffect(() => {
        (async () => {
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
                        content: postData.content || "", //
                        topicId: postData.topicId || "", //
                        type: postData.type || "post",
                        status: postData.status || 1,
                    });
                    // Hiển thị ảnh cũ (Backend dùng field 'image' để trả tên file)
                    if (postData.image) setPreview(`${imageURL}/posts/${postData.image}`);
                }
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            }
        })();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            // Append chính xác theo PostDto.java
            data.append("title", formData.title);
            data.append("slug", formData.slug || formData.title.toLowerCase().replace(/ /g, '-'));
            data.append("description", formData.description || "");
            data.append("content", formData.content || ""); //
            data.append("topicId", formData.topicId);       //
            data.append("type", formData.type);
            data.append("status", formData.status);

            // Gửi file vào trường 'thumbnail' (trường MultipartFile trong DTO)
            if (imageFile) {
                data.append("thumbnail", imageFile); 
            }

            await apiPost.update(id, data);
            alert("Cập nhật bài viết thành công!");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Lỗi 400/500:", error.response?.data);
            alert("Lỗi cập nhật! Kiểm tra console để xem chi tiết trường dữ liệu bị sai.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow rounded-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Chỉnh sửa bài viết</h2>
                <Link to="/admin/posts" className="bg-gray-600 text-white px-4 py-2 rounded flex items-center">
                    <FaArrowLeft className="mr-2" /> Quay lại
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột chính */}
                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <label className="block font-bold">Tiêu đề</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block font-bold">Nội dung</label>
                            <Editor
                                apiKey="08g2njx5rtkfad5tsq5p91c0bos9siwvip1tcsinbsduna70"
                                value={formData.content}
                                onEditorChange={(val) => setFormData({...formData, content: val})}
                                init={{ height: 400, menubar: false }}
                            />
                        </div>
                    </div>

                    {/* Cột phụ */}
                    <div className="bg-gray-50 p-5 border rounded space-y-5">
                        <div>
                            <label className="block font-bold">Chủ đề</label>
                            <select value={formData.topicId} onChange={e => setFormData({...formData, topicId: e.target.value})} className="w-full border p-2 rounded bg-white" required>
                                <option value="">Chọn chủ đề</option>
                                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold">Hình ảnh</label>
                            <input type="file" onChange={e => {
                                setImageFile(e.target.files[0]);
                                setPreview(URL.createObjectURL(e.target.files[0]));
                            }} className="w-full text-sm" />
                            {preview && <img src={preview} alt="ảnh" className="mt-3 w-full h-40 object-cover rounded border" />}
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition shadow-lg">
                            {loading ? "Đang xử lý..." : "LƯU THAY ĐỔI"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditPost;