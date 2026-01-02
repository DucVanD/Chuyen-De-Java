import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaImage } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import apiPostAdmin from "../../../api/admin/apiPostAdmin";
import apiUpload from "../../../api/apiUpload";
import { getImageUrl } from "../../../api/config";
import { toast } from "react-toastify";

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [thumbPreview, setThumbPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        content: "",
        postType: "PAGE",
        status: 1,
        image: "",
        imagePublicId: "",
    });

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await apiPostAdmin.getById(id);
                if (!res) {
                    toast.error("Không tìm thấy trang");
                    return navigate("/admin/pages");
                }
                setFormData({
                    title: res.title || "",
                    slug: res.slug || "",
                    description: res.description || "",
                    content: res.content || "",
                    postType: "PAGE",
                    status: res.status ?? 1,
                    image: res.image || "",
                    imagePublicId: res.imagePublicId || "",
                });
                if (res.image) {
                    setThumbPreview(getImageUrl(res.image, "post"));
                }
            } catch (err) {
                console.error("Lỗi khi tải trang:", err);
                toast.error("Không thể tải dữ liệu trang");
                navigate("/admin/pages");
            }
        };
        fetchPage();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file || null);
        if (file) {
            setThumbPreview(URL.createObjectURL(file));
        }
    };

    const handleEditorChange = (content) => {
        setFormData((prev) => ({ ...prev, content: content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = formData.image;
            let finalImagePublicId = formData.imagePublicId;

            if (image) {
                const uploadRes = await apiUpload.uploadPostImage(image);
                finalImageUrl = uploadRes.url;
                finalImagePublicId = uploadRes.publicId;
            }

            await apiPostAdmin.update(id, {
                ...formData,
                image: finalImageUrl,
                imagePublicId: finalImagePublicId,
                postType: "PAGE"
            });
            toast.success("Cập nhật trang thành công");
            navigate("/admin/pages");
        } catch (error) {
            console.error("Lỗi khi cập nhật trang:", error);
            toast.error("Lỗi khi cập nhật trang");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">Chỉnh sửa trang</h3>
                    <button
                        onClick={() => navigate("/admin/pages")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-200"
                    >
                        <FaArrowLeft className="mr-2" /> Về danh sách
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-2/3 space-y-6">
                                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Thông tin cơ bản</h4>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500"
                                            placeholder="Nhập tiêu đề trang"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-100"
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500"
                                            placeholder="Nhập mô tả trang"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                                    <h4 className="text-lg font-semibold text-indigo-700 mb-4 pb-2 border-b border-indigo-200">Nội dung trang</h4>
                                    <Editor
                                        apiKey="08g2njx5rtkfad5tsq5p91c0bos9siwvip1tcsinbsduna70"
                                        value={formData.content}
                                        init={{
                                            height: 500,
                                            menubar: true,
                                            plugins: ["advlist", "autolink", "lists", "link", "image", "preview", "code", "fullscreen", "table", "wordcount"],
                                            toolbar: "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | preview code fullscreen",
                                        }}
                                        onEditorChange={handleEditorChange}
                                    />
                                </div>
                            </div>

                            <div className="lg:w-1/3 space-y-6">
                                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Hình ảnh & Trạng thái</h4>
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="w-full h-40 mb-4 relative bg-gray-200 rounded-md flex items-center justify-center overflow-hidden border border-gray-300">
                                            {thumbPreview ? (
                                                <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <FaImage className="text-gray-400 text-5xl" />
                                            )}
                                        </div>
                                        <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full p-2.5 border border-gray-300 rounded-md mb-6"
                                        >
                                            <option value="1">Hiển thị</option>
                                            <option value="0">Ẩn</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                                    >
                                        <FaSave className="mr-2" />
                                        {loading ? "Đang lưu..." : "Cập nhật trang"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default EditPage;
