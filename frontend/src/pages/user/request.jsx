import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaClipboardList, 
  FaPaperPlane, 
  FaHistory, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationCircle 
} from "react-icons/fa";

const Request = () => {
  const [formData, setFormData] = useState({
    orderId: "",
    requestType: "warranty", // warranty, return, support
    email: "",
    phone: "",
    content: ""
  });

  // Mock data: Danh sách yêu cầu cũ (Thay thế Map ở cột phải)
  const historyRequests = [
    {
      id: "REQ-001",
      title: "Bảo hành máy xay sinh tố",
      date: "12/12/2024",
      status: "completed", // completed, pending, canceled
      statusText: "Đã xử lý"
    },
    {
      id: "REQ-002",
      title: "Đổi trả đơn hàng #DH8821",
      date: "10/01/2025",
      status: "pending",
      statusText: "Đang chờ duyệt"
    },
    {
      id: "REQ-003",
      title: "Hỗ trợ kỹ thuật lắp đặt",
      date: "15/01/2025",
      status: "pending",
      statusText: "Đang xử lý"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Request submitted:", formData);
    // Reset form
    setFormData({
      orderId: "",
      requestType: "warranty",
      email: "",
      phone: "",
      content: ""
    });
    alert("Gửi yêu cầu thành công!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'canceled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-semibold">Yêu cầu hỗ trợ</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Form Gửi Yêu Cầu */}
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                TRUNG TÂM HỖ TRỢ KHÁCH HÀNG
              </h1>
              <p className="text-gray-600 mb-6">
                Bạn gặp vấn đề với đơn hàng hoặc sản phẩm? Hãy gửi yêu cầu cho chúng tôi. 
                <span className="font-bold text-green-600"> Bean Farm cam kết hỗ trợ trong 24h.</span>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaClipboardList className="text-green-600" />
                GỬI YÊU CẦU MỚI
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Loại yêu cầu & Mã đơn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
                      Loại yêu cầu
                    </label>
                    <select
                      id="requestType"
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    >
                      <option value="warranty">🛡️ Bảo hành</option>
                      <option value="return">↩️ Đổi trả sản phẩm</option>
                      <option value="support">🎧 Hỗ trợ kỹ thuật</option>
                      <option value="other">📝 Khác</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                      Mã đơn hàng (nếu có)
                    </label>
                    <input
                      id="orderId"
                      name="orderId"
                      type="text"
                      value={formData.orderId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="#DH..."
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0909..."
                    />
                  </div>
                </div>

                {/* Nội dung */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Chi tiết vấn đề <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={5}
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center gap-2 shadow-md"
                >
                  <FaPaperPlane />
                  Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Lịch sử Yêu cầu (Thay thế cho Map) */}
          <div className="lg:sticky lg:top-8 space-y-6">
            
            {/* Box 1: Lịch sử */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaHistory className="text-green-600" />
                  LỊCH SỬ YÊU CẦU
                </h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                  {historyRequests.length}
                </span>
              </div>
              
              <div className="p-4 space-y-4">
                {historyRequests.length > 0 ? (
                  historyRequests.map((req) => (
                    <div key={req.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-white">
                      <div className="mt-1">
                        {req.status === 'completed' ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : req.status === 'pending' ? (
                          <FaClock className="text-yellow-500 text-xl" />
                        ) : (
                          <FaExclamationCircle className="text-red-500 text-xl" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-800 text-sm">{req.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(req.status)}`}>
                            {req.statusText}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Mã: {req.id}</p>
                        <p className="text-xs text-gray-400 mt-1">{req.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">Bạn chưa có yêu cầu nào.</p>
                )}
              </div>
              
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                 <Link to="/profile" className="text-sm text-green-600 font-medium hover:underline">
                    Xem tất cả trong Hồ sơ
                 </Link>
              </div>
            </div>

            {/* Box 2: Thông tin liên hệ nhanh (Giống Box Address bên Contact) */}
            <div className="bg-green-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Cần hỗ trợ gấp?</h3>
              <p className="text-green-100 text-sm mb-4">Gọi ngay hotline để được ưu tiên xử lý.</p>
              <div className="flex items-center gap-3 text-2xl font-bold">
                <FaClipboardList /> 1900 6750
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Request;