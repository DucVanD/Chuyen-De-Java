import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiOrderAdmin from "../../../api/admin/apiOrderAdmin";
import { imageURL } from "../../../api/config";
import { generateSalesReceipt } from "../../../utils/invoiceGenerator";

// Helper function to get image URL
const getImageUrl = (thumbnail) => {
  if (!thumbnail) return "/placeholder.png";
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${imageURL}/products/${thumbnail}`;
};

const DetailOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy chi tiết đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiOrderAdmin.getById(id);
        setOrder(res);
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err);
        alert("Lỗi khi tải chi tiết đơn hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleExportInvoice = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const invoiceWindow = window.open('', '_blank');

      const invoiceHTML = generateSalesReceipt(order, currentUser);

      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();
    } catch (error) {
      alert('Lỗi: ' + error.message);
      console.error('Invoice generation error:', error);
    }
  };



  // Map trạng thái đơn hàng (Backend Enum)
  const statusLabels = {
    PENDING: { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
    SHIPPING: { text: "Đang giao", color: "bg-teal-100 text-teal-800" },
    COMPLETED: { text: "Hoàn thành", color: "bg-green-100 text-green-800" },
    CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-800" },
  };

  const paymentStatusLabels = {
    UNPAID: { text: "Chưa thanh toán", color: "bg-gray-100 text-gray-700" },
    PAID: { text: "Đã thanh toán", color: "bg-green-100 text-green-700" },
    FAILED: { text: "Thanh toán thất bại", color: "bg-red-100 text-red-700" },
    REFUNDED: { text: "Đã hoàn tiền", color: "bg-purple-100 text-purple-700" },
  };

  // Hàm lấy text hiển thị
  const getStatusText = (status) => statusLabels[status]?.text || "Không xác định";

  // Hàm lấy class màu sắc
  const getStatusClass = (status) => statusLabels[status]?.color || "bg-gray-100 text-gray-600";


  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang tải...</div>;
  }

  if (!order) {
    return <div className="text-center py-10 text-red-500">Không có dữ liệu!</div>;
  }

  const totalAmount = order.orderDetails.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết đơn hàng #{order.id}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportInvoice}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm inline-flex items-center"
            >
              <i className="fa fa-file-pdf mr-1"></i> Xuất hóa đơn
            </button>

            <button
              onClick={() => navigate(`/admin/order/edit/${order.id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm inline-flex items-center"
            >
              <i className="fa fa-edit mr-1"></i> Cập nhật đơn
            </button>

            <button
              onClick={() => {
                const lp = localStorage.getItem("currentOrderPage");
                // Strictly handle page index 0 or not set to go to root /admin/orders
                if (!lp || lp === "1" || lp === "0" || lp === "null" || lp === "undefined") {
                  navigate("/admin/orders");
                } else {
                  navigate(`/admin/orders/${lp}`);
                }
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm inline-flex items-center"
            >
              <i className="fa fa-arrow-left mr-1"></i> Về danh sách
            </button>
          </div>
        </div>


        {/* Nội dung chính */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            {/* 🧾 Thông tin người đặt hàng */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-gray-800 max-w-md mx-auto">
                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Thông tin người nhận</h2>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Tên: {order.receiverName}</h3>
                <p className="text-sm text-gray-500 mb-3">Email: {order.receiverEmail}</p>

                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-4">
                  <span className="font-medium">{order.receiverPhone}</span>
                </div>

                {/* Address section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Địa chỉ giao hàng</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {order.receiverAddress}
                    <br />
                    {order.ward}, {order.district}
                  </p>
                </div>
                {/* note */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Ghi chú đơn hàng
                  </h3>
                  <p className="text-red-600 leading-relaxed text-sm">  {order.note ? order.note : "Không có ghi chú"}</p>

                </div>

                {/* Cancel Reason - Display only if cancelled */}
                {order.status === "CANCELLED" && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100 mb-4">
                    <h3 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1">
                      <span className="text-lg">🚫</span> Lý do hủy đơn
                    </h3>
                    <p className="text-red-700 leading-relaxed text-sm font-medium">
                      {order.cancelReason || "Không có lý do cụ thể"}
                    </p>
                  </div>
                )}

                {/* Payment section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Phương thức thanh toán
                  </h3>
                  <p
                    className={`text-sm font-medium italic ${order.paymentMethod === "COD" ? "text-green-600" : "text-blue-600"
                      }`}
                  >
                    {order.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng (COD)"
                      : order.paymentMethod === "VNPAY"
                        ? "Thanh toán VNPAY"
                        : "Chuyển khoản ngân hàng"}
                  </p>
                  <div className="mt-2 text-xs">
                    Trạng thái:{" "}
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${paymentStatusLabels[order.paymentStatus]?.color || 'bg-gray-100'}`}
                    >
                      {paymentStatusLabels[order.paymentStatus]?.text || order.paymentStatus}
                    </span>
                  </div>
                </div>



                {/* Status */}
                <div className="flex justify-center mt-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

            </div>

            {/* 🛒 Danh sách sản phẩm */}
            <div className="md:col-span-2">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
                  Sản phẩm đã đặt
                </h2>
                <div className="space-y-3">
                  {order.orderDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex items-center justify-between bg-white p-3 rounded shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(detail.product?.image)}
                          alt={detail.product?.name || "Product"}
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {detail.product?.name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Giá: {detail.priceBuy.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700">
                          Số lượng: {detail.quantity}{" "}
                          <span className="text-xs text-gray-400 block mt-1">
                            {detail.product?.saleType === "WEIGHT"
                              ? (() => {
                                const totalGrams = detail.quantity * (detail.product?.baseWeight || 0);
                                const formattedWeight = totalGrams >= 1000
                                  ? (totalGrams / 1000).toFixed(1).replace(/\.0$/, "") + " kg"
                                  : totalGrams + " g";
                                return `${detail.product?.unitLabel || 'phần'} (${formattedWeight})`;
                              })()
                              : (detail.product?.unitLabel || "đơn vị")}
                          </span>
                        </p>
                        <p className="text-gray-700 font-semibold">
                          Tổng: {detail.amount.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Tạm tính:</span>
                    <span className="font-medium">{totalAmount.toLocaleString("vi-VN")} đ</span>
                  </div>

                  {order.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600 mb-2">
                        <span>Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ''}:</span>
                        <span className="font-medium">-{order.discountAmount.toLocaleString("vi-VN")} đ</span>
                      </div>
                      <div className="border-t pt-2"></div>
                    </>
                  )}

                  <div className="flex justify-between text-xl font-bold text-gray-800 mt-2">
                    <span>Tổng thanh toán:</span>
                    <span className="text-red-600">{order.totalAmount.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ⚙️ Thông tin quản lý đơn hàng */}
            <div className="md:col-span-3 mt-2 bg-purple-50 p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                Thông tin quản lý đơn hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Mã đơn hàng:</p>
                  <p className="text-gray-800">{order.orderCode}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Ngày tạo:</p>
                  <p className="text-gray-800">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Người đặt:</p>
                  <p className="text-gray-800">{order.receiverName}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Ngày cập nhật:</p>
                  <p className="text-gray-800">
                    {new Date(order.updatedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailOrder;
