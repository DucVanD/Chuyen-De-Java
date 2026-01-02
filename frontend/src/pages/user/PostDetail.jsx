import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaTag } from "react-icons/fa";
import apiPost from "../../api/user/apiPost";
import { imageURL } from "../../api/config";
import { FaSearch, FaEye } from "react-icons/fa";

// import {
//   FaTruck,
//   FaUndoAlt,
//   FaMoneyBillWave,
//   FaHeadset,
// } from "react-icons/fa";
// ✅ Hàm xử lý thumbnail thống nhất
const getThumbnail = (image) => {
    if (!image) return "/assets/images/no-image.jpg";
    return image;
};

const DetailPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [postNew, setPostNew] = useState(null);

    const [relatedPosts, setRelatedPosts] = useState([]);
    const [showFull, setShowFull] = useState(false); // ✅ Trạng thái "Xem thêm"

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await apiPost.getPostBySlug(slug);
                setPost(res); // Backend returns the DTO directly
            } catch (err) {
                console.error("❌ Lỗi tải bài viết:", err);
            }
        };
        fetchPost();
    }, [slug]);




    useEffect(() => {
        apiPost
            .getNewest()
            .then((res) => setPostNew(res.data || []))
            .catch((err) => console.error("Lỗi khi lấy bài viết mới:", err));
    }, []);



    if (!post)
        return (
            <div className="text-center text-gray-500 py-20">Đang tải bài viết...</div>
        );

    // ✅ Giới hạn hiển thị 1500 ký tự đầu nếu bài viết dài (tùy chọn)
    const shouldTruncate = post.content && post.content.length > 1500;
    const truncatedContent = shouldTruncate
        ? post.content.slice(0, 1500) + "..."
        : post.content;

    return (
        <div className="max-w-7xl mx-auto px-4 mt-10">
            {/* === Breadcrumb === */}
            <nav className="text-sm text-gray-500 mb-6 font-medium">
                <Link to="/" className="hover:text-green-600 transition">
                    Trang chủ
                </Link>
                <span className="mx-2 text-gray-300">/</span>
                {post.postType === "POST" ? (
                    <>
                        <Link to="/posts/1" className="hover:text-green-600 transition">
                            Bài viết
                        </Link>
                        <span className="mx-2 text-gray-300">/</span>
                    </>
                ) : null}
                <span className="text-gray-900 font-bold truncate max-w-xs inline-block align-bottom">{post.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* === Main content === */}
                <article className="lg:col-span-3 bg-white rounded-xl shadow p-6">
                    {/* ✅ Thumbnail hiển thị chuẩn */}
                    <img
                        src={getThumbnail(post.image)}
                        alt={post.title}
                        className="w-full rounded-xl object-cover mb-6"
                    />

                    {/* Tiêu đề + thông tin */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-3 leading-snug">
                        {post.title}
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 mb-6 gap-4">
                        <span className="flex items-center gap-1">
                            <FaCalendarAlt />
                            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="flex items-center gap-1">
                            <FaUser /> {post.created_by || "Admin"}
                        </span>
                        {post.postType === "POST" && post.topicId && (
                            <span className="flex items-center gap-1">
                                <FaTag /> {post.topicName || "Chủ đề"}
                            </span>
                        )}
                    </div>

                    {/* ✅ Nội dung chi tiết có "Xem thêm" */}
                    <div
                        className="prose max-w-none prose-green"
                        dangerouslySetInnerHTML={{
                            __html: showFull ? post.content : truncatedContent,
                        }}
                    />

                    {/* ✅ Nút xem thêm / thu gọn */}
                    {shouldTruncate && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowFull(!showFull)}
                                className="text-green-600 font-medium hover:underline transition"
                            >
                                {showFull ? "Thu gọn ▲" : "Xem thêm ▼"}
                            </button>
                        </div>
                    )}
                </article>

                {/* === Sidebar === */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Search */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Tìm kiếm
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors">
                                <FaSearch />
                            </button>
                        </div>
                    </div>

                    {/* Bài viết mới - Only show for POST type */}
                    {post.postType === "POST" && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-green-600 text-white px-4 py-3">
                                <h3 className="font-semibold uppercase tracking-wider text-sm">BÀI VIẾT MỚI</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {Array.isArray(postNew) && postNew.length > 0 ? (
                                    postNew.slice(0, 5).map((post, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors"
                                        >
                                            <img
                                                src={post.image || "/assets/images/no-image.jpg"}
                                                alt={post.title}
                                                className="w-16 h-16 object-cover rounded shadow-sm"
                                            />
                                            <div className="flex-1">
                                                <Link
                                                    to={`/post/${post.slug}`}
                                                    className="text-sm font-medium text-gray-800 hover:text-green-600 transition-colors line-clamp-2 leading-tight"
                                                >
                                                    {post.title}
                                                </Link>
                                                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                                                    <FaCalendarAlt size={10} />
                                                    {new Date(post.created_at || post.createdAt).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic px-2">Chưa có bài viết mới.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailPost;
