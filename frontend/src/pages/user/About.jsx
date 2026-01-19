import { Link } from "react-router-dom";
import { 
  FaHome, FaLeaf, FaCheck, FaUsers, FaStore, FaCalendarAlt, 
  FaHandHoldingHeart, FaSeedling, FaShippingFast, FaMedal 
} from "react-icons/fa"; // Đã thêm icon mới
import { useEffect, useState } from "react";
import apiPost from "../../api/user/apiPost";

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await apiPost.getPostBySlug("gioi-thieu");
        if (res) setContent(res);
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
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-green-600 transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-semibold">Giới thiệu</span>
        </nav>

        {/* --- PHẦN 1: NỘI DUNG CHÍNH (DYNAMIC) --- */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 uppercase tracking-wide">
            {content ? content.title : "Về Bean Farm"}
          </h1>
          
          {content && content.image && (
            <div className="relative w-full h-[300px] sm:h-[450px] mb-8 rounded-3xl overflow-hidden shadow-xl">
               <img
                src={content.image}
                alt={content.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none text-gray-600 leading-relaxed text-justify sm:text-center"
            dangerouslySetInnerHTML={{ __html: content ? content.content : "Bean Farm là hệ thống cửa hàng thực phẩm sạch uy tín, chuyên cung cấp các loại rau củ quả, thịt cá tươi ngon và các sản phẩm hữu cơ chất lượng cao. Chúng tôi cam kết mang đến bữa ăn an toàn cho mọi gia đình Việt." }} 
          />
        </div>

        {/* --- PHẦN 2: TẦM NHÌN & SỨ MỆNH (CARD GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Vision */}
            <div className="bg-green-50 rounded-3xl p-8 border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-600/20">
                  <FaLeaf className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Tầm nhìn</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Trở thành hệ thống phân phối thực phẩm hữu cơ hàng đầu Việt Nam, là cầu nối tin cậy đưa nông sản sạch từ trang trại thẳng đến bàn ăn của hàng triệu gia đình.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                  <FaCheck className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Sứ mệnh</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Nâng cao chất lượng cuộc sống thông qua việc cung cấp thực phẩm an toàn, minh bạch nguồn gốc, đồng thời hỗ trợ người nông dân phát triển nông nghiệp bền vững.
                  </p>
                </div>
              </div>
            </div>
        </div>

        {/* --- PHẦN 3: GIÁ TRỊ CỐT LÕI (NEW) --- */}
        <div className="mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">Giá Trị Cốt Lõi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: FaSeedling, title: "Tự Nhiên 100%", desc: "Không hóa chất, không chất bảo quản độc hại.", color: "text-green-600", bg: "bg-green-100" },
                    { icon: FaHandHoldingHeart, title: "Tận Tâm", desc: "Phục vụ khách hàng như người thân trong gia đình.", color: "text-red-500", bg: "bg-red-100" },
                    { icon: FaMedal, title: "Uy Tín", desc: "Minh bạch nguồn gốc xuất xứ từng sản phẩm.", color: "text-blue-500", bg: "bg-blue-100" },
                    { icon: FaShippingFast, title: "Tiện Lợi", desc: "Mua sắm dễ dàng, giao hàng nhanh chóng trong 2h.", color: "text-yellow-500", bg: "bg-yellow-100" },
                ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-2 transition-transform duration-300">
                        <div className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mb-4`}>
                            <item.icon className={`${item.color} text-2xl`} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* --- PHẦN 4: THỐNG KÊ (STATS) --- */}
        <div className="relative rounded-3xl overflow-hidden mb-16">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center bg-fixed"></div>
          <div className="absolute inset-0 bg-green-900/80"></div> {/* Lớp phủ màu xanh tối */}

          <div className="relative z-10 p-10 sm:p-16">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: FaCalendarAlt, num: "5+", label: "Năm Kinh Nghiệm" },
                    { icon: FaUsers, num: "200+", label: "Nhân Sự Tận Tâm" },
                    { icon: FaLeaf, num: "3000+", label: "Khách Hàng Tin Dùng" },
                    { icon: FaStore, num: "8", label: "Cửa Hàng Tại TP.HCM" },
                ].map((stat, idx) => (
                    <div key={idx} className="text-center text-white group">
                        <div className="flex items-center justify-center mb-4">
                            <stat.icon className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="text-4xl font-bold mb-2">{stat.num}</div>
                        <div className="text-sm sm:text-base font-medium opacity-90 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default About;