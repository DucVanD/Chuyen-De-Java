import { Link } from "react-router-dom";
import { FaHome, FaLeaf, FaCheck, FaUsers, FaStore, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import apiPost from "../../api/user/apiPost";

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await apiPost.getPostBySlug("gioi-thieu");
        if (res) {
          setContent(res);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin giới thiệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-semibold">Giới thiệu</span>
        </nav>

        {/* Dynamic Content */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            {content ? content.title : "BEAN FARM"}
          </h1>
          {content && content.image && (
            <img
              src={content.image}
              alt={content.title}
              className="w-full h-[450px] object-cover rounded-2xl shadow-lg mb-8"
            />
          )}
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content ? content.content : "Nội dung đang được cập nhật..." }} />
        </div>

        {!content && (
          <>
            {/* Fallback code if no backend data */}
            {/* ... keeping some of the nice UI sections ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Vision */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <FaLeaf className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">TẦM NHÌN</h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Bean Farm được thành lập với mong muốn nhập khẩu và cung cấp các sản phẩm hữu cơ chất lượng cao...
                </p>
              </div>
              {/* Mission */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">MỤC TIÊU</h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Chúng tôi đã kết nối và phân phối sản phẩm cho các đối tác lớn tại TP. Hồ Chí Minh và Hà Nội...
                </p>
              </div>
            </div>
          </>
        )}

        {/* Stats Section always visible */}
        <div className="bg-green-600 rounded-2xl p-8 mb-16 mt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <FaCalendarAlt className="text-2xl mr-2" />
              </div>
              <div className="text-3xl font-bold mb-1">2</div>
              <div className="text-sm opacity-90">Năm Kinh Nghiệm</div>
            </div>
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <FaUsers className="text-2xl mr-2" />
              </div>
              <div className="text-3xl font-bold mb-1">200</div>
              <div className="text-sm opacity-90">Nhân Viên</div>
            </div>
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <FaUsers className="text-2xl mr-2" />
              </div>
              <div className="text-3xl font-bold mb-1">3000+</div>
              <div className="text-sm opacity-90">Khách Hàng</div>
            </div>
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <FaStore className="text-2xl mr-2" />
              </div>
              <div className="text-3xl font-bold mb-1">8</div>
              <div className="text-sm opacity-90">Cửa Hàng</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
