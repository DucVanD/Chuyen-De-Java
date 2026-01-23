import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiUser from "../../api/user/apiUser";
import apiOrder from "../../api/user/apiOrder";
import apiContactUser from "../../api/user/apiContactUser";
import { toast } from "react-toastify";
import { FaBoxOpen, FaCalendarAlt, FaTimes, FaRobot } from "react-icons/fa";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

// ---------------- STATUS ----------------
const statusLabels = {
  1: { text: "Đang chờ xác nhận", color: "bg-yellow-100 text-yellow-800" }, // PENDING
  2: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },          // CONFIRMED
  3: { text: "Đang giao hàng", color: "bg-orange-100 text-orange-800" },   // SHIPPING
  4: { text: "Hoàn thành", color: "bg-green-100 text-green-800" },         // COMPLETED
  5: { text: "Đã hủy", color: "bg-red-100 text-red-800" },                 // CANCELLED
};

// ---------------- PAYMENT STATUS ----------------
const paymentStatusLabels = {
  UNPAID: { text: "Chưa thanh toán", color: "bg-gray-100 text-gray-700", icon: "⏳" },
  PAID: { text: "Đã thanh toán", color: "bg-green-100 text-green-700", icon: "✅" },
  FAILED: { text: "Thanh toán thất bại", color: "bg-red-100 text-red-700", icon: "❌" },
  REFUNDED: { text: "Đã hoàn tiền", color: "bg-purple-100 text-purple-700", icon: "💰" },
};

// ---------------- CANCEL REASONS ----------------
const cancelOptions = [
  "🕒 Đặt nhầm / không còn nhu cầu",
  "💰 Thấy giá cao hơn so với nơi khác",
  "✏️ Muốn đổi sang sản phẩm khác",
  "🚫 Thông tin đặt hàng sai (địa chỉ, số điện thoại,...)",
  "❌ Khác (nhập lý do riêng)",
];

// ---------------- LOADING OVERLAY ----------------
const Spinner = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
    <div className="text-base font-medium text-gray-600 animate-pulse">
      Đang tải dữ liệu...
    </div>
  </div>
);

const HistoryBought = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // States
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "",
    payment: "",
    min_total: "",
    max_total: "",
  });

  // Modal cancel
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  // Support tickets
  const [orderTickets, setOrderTickets] = useState({}); // { orderCode: [tickets] }

  // ---------------- FETCH HISTORY ----------------
  const fetchHistory = async (pageNum = 1) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      // Use new API endpoint for user order history
      const res = await apiOrder.getMyOrders(pageNum, activeFilters);

      // Map backend status enum to frontend status ID
      const mapStatus = (statusStr) => {
        const mapping = {
          "PENDING": 1,
          "CONFIRMED": 2,
          "SHIPPING": 3,
          "COMPLETED": 4,
          "CANCELLED": 5
        };
        return mapping[statusStr] || 1;
      };

      // Transform data to match component expectations
      if (res.status && res.data) {
        const transformedData = {
          ...res.data,
          orders: res.data.orders.map(order => ({
            ...order,
            order_code: order.orderCode,
            created_at: new Date(order.createdAt).toLocaleString("vi-VN"),
            payment: order.paymentMethod,
            paymentStatus: order.paymentStatus, // Add payment status
            // Normalize HATEOAS links (Handle both Array and Object, and both naming conventions)
            _links: Array.isArray(order.links || order._links)
              ? (order.links || order._links).reduce((acc, link) => ({ ...acc, [link.rel]: link }), {})
              : (order.links || order._links),
            // Keep as numbers for logic, format in render
            subtotal: order.subtotal || 0,
            discount_amount: order.discountAmount || 0,
            voucher_code: order.voucherCode,
            total_amount: order.totalAmount || 0,
            status: mapStatus(order.status),
            products: order.orderDetails?.map(detail => ({
              name: detail.productName || detail.product?.name,
              thumbnail: detail.product?.image || "/placeholder.png",
              price_buy: detail.priceBuy || 0,
              qty: detail.quantity,
              amount: detail.amount || 0,
              saleType: detail.product?.saleType,
              unitLabel: detail.product?.unitLabel,
              baseWeight: detail.product?.baseWeight
            })) || []
          }))
        };
        setUserData(transformedData);

        // Fetch tickets for all orders
        transformedData.orders.forEach(order => {
          fetchOrderTickets(order.order_code);
        });
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy lịch sử:", err);
      // Chỉ set null nếu chưa có dữ liệu (lần đầu tải)
      if (!userData) {
        setUserData(null);
      }

      const errorMsg = err.response?.data?.message || err.message || "Lỗi kết nối Server";
      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn. Đang tải lại...");
      } else {
        toast.error("Không thể tải lịch sử đơn hàng: " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(parseInt(page) || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ---------------- TICKET HELPERS ----------------
  const getTicketTypeLabel = (type) => {
    const labels = {
      CANCEL: "🚫 Yêu cầu hủy đơn",
      CHANGE_ADDRESS: "📍 Đổi địa chỉ",
      PRODUCT_ISSUE: "⚠️ Vấn đề sản phẩm",
      DELAY: "⏰ Giao hàng chậm",
      GENERAL: "💬 Khác"
    };
    return labels[type] || type;
  };

  const getTicketStatusColor = (status) => {
    const colors = {
      OPEN: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      RESOLVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const fetchOrderTickets = async (orderCode) => {
    if (orderTickets[orderCode]) return; // Already fetched

    try {
      const tickets = await apiContactUser.getByOrderCode(orderCode);
      setOrderTickets(prev => ({ ...prev, [orderCode]: tickets }));
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  // ---------------- HANDLERS ----------------
  const handleFilter = () => {
    if (page !== "1") navigate(`/history-bought/1`);
    else fetchHistory(1);
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= (userData?.pagination?.last_page || 1)) {
      navigate(`/history-bought/${pageNum}`);
    }
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setCustomReason("");
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason) {
      toast.warning("Vui lòng chọn lý do hủy đơn hàng!");
      return;
    }
    const finalReason =
      cancelReason === "❌ Khác (nhập lý do riêng)" ? customReason : cancelReason;

    if (!finalReason.trim()) {
      toast.warning("Vui lòng nhập lý do cụ thể!");
      return;
    }

    try {
      setLoading(true);
      const res = await apiOrder.cancelOrder(selectedOrder.id, finalReason);
      setLoading(false);
      setShowCancelModal(false);

      if (res.status) {
        toast.success(
          selectedOrder.payment !== "COD"
            ? "💸 Đơn hàng đã được hủy. Tiền sẽ hoàn lại trong 8 giờ tới."
            : "🗑️ Hủy đơn hàng thành công!"
        );
        fetchHistory(page || 1);
      } else {
        toast.error(res.message || "Không thể hủy đơn hàng.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Lỗi khi hủy đơn hàng!");
      console.error(err);
    }
  };

  const handleSupportOrder = (order) => {
    window.dispatchEvent(
      new CustomEvent("openChatbot", {
        detail: {
          initialMessage: `Tôi cần hỗ trợ cho đơn hàng #${order.order_code}. Trạng thái hiện tại là gì?`,
        },
      })
    );
  };

  // ---------------- RENDER ----------------
  if (loading && !userData) {
    return (
      <div className="flex h-64 items-center justify-center text-lg text-gray-500">
        Đang tải lịch sử mua hàng...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Không có dữ liệu lịch sử mua hàng.
      </div>
    );
  }

  const { summary, orders, pagination } = userData;

  console.log("aksj", userData)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <HiOutlineClipboardDocumentCheck className="h-6 w-6 text-indigo-600" />
        <span>Lịch sử mua hàng</span>
      </h1>

      {/* Filters */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4 mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Từ ngày</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Đến ngày</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Tất cả</option>
              {Object.entries(statusLabels).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.text}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Thanh toán</label>
            <select
              value={filters.payment}
              onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="COD">COD</option>
              <option value="BANK">Chuyển khoản</option>
              <option value="VNPAY">VnPay</option>
            </select>
          </div>
          <button
            onClick={handleFilter}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-semibold"
          >
            {loading ? "Đang lọc..." : "Lọc"}
          </button>
        </div>

        <div className="text-sm text-gray-700 pt-2 border-t border-gray-200 mt-2">
          <p>
            Tổng đơn:{" "}
            <span className="font-semibold text-indigo-700">
              {summary?.total_orders || 0}
            </span>{" "}
            | Tổng sản phẩm:{" "}
            <span className="font-semibold text-indigo-700">
              {summary?.total_products || 0}
            </span>
          </p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <p>🟢 Đã giao: <b>{summary.delivered_orders}</b></p>
            <p>🟡 Đang chờ: <b>{summary.pending_orders}</b></p>
            <p>?? Đang giao: <b>{summary.delivered_shipping}</b></p>
            <p>🔵 Đã xác nhận: <b>{summary.confirmed_orders}</b></p>
            <p>🔴 Đã hủy: <b>{summary.canceled_orders}</b></p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="relative min-h-[300px]">
        {loading && <Spinner />}

        {!loading && orders?.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6 bg-white transition hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">
                      Mã đơn:{" "}
                      <span className="text-indigo-600 font-mono">{order.order_code}</span>
                    </p>
                    {orderTickets[order.order_code]?.some(t => t.status === 'RESOLVED') && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                        📩 Có phản hồi
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <FaCalendarAlt className="text-gray-400" /> {order.created_at}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <p className="text-sm text-gray-600">
                      Phương thức:{" "}
                      <span className="font-medium text-blue-600">{order.payment}</span>
                    </p>
                    {/* Payment Status Badge */}
                    {order.paymentStatus && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusLabels[order.paymentStatus]?.color || 'bg-gray-100 text-gray-700'}`}
                      >
                        <span>{paymentStatusLabels[order.paymentStatus]?.icon || '❓'}</span>
                        <span>{paymentStatusLabels[order.paymentStatus]?.text || order.paymentStatus}</span>
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[order.status]?.color}`}
                >
                  {statusLabels[order.status]?.text || "Không xác định"}
                </span>
              </div>

              {order.products?.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        Giá: {p.price_buy.toLocaleString("vi-VN")} đ | SL: {p.qty}{" "}
                        <span className="text-xs text-gray-400">
                          {p.saleType === "WEIGHT"
                            ? `${p.unitLabel || 'phần'} (${p.qty * (p.baseWeight || 0)} gram)`
                            : (p.unitLabel || "đơn vị")}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">{p.amount.toLocaleString("vi-VN")} đ</p>
                </div>
              ))}

              {/* Support Tickets Section */}
              {orderTickets[order.order_code]?.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    📩 Yêu cầu hỗ trợ
                  </h4>
                  <div className="space-y-3">
                    {orderTickets[order.order_code].map(ticket => (
                      <div key={ticket.id} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {getTicketTypeLabel(ticket.type)}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTicketStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ticket.content}</p>
                        {ticket.replyContent && (
                          <div className="mt-2 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                            <p className="text-xs font-semibold text-green-700 mb-1">✅ Phản hồi từ Admin:</p>
                            <p className="text-sm text-gray-700">{ticket.replyContent}</p>
                            {ticket.updatedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(ticket.updatedAt).toLocaleString('vi-VN')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}


              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-medium">{order.subtotal.toLocaleString("vi-VN")} đ</span>
                  </div>

                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá {order.voucher_code ? `(${order.voucher_code})` : ''}:</span>
                      <span className="font-medium">-{order.discount_amount.toLocaleString("vi-VN")} đ</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t border-gray-300">
                    <span>Tổng thanh toán:</span>
                    <span className="text-indigo-700">{order.total_amount.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  {/* AI Support Button */}
                  <button
                    onClick={() => handleSupportOrder(order)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm transition flex items-center gap-2 border border-indigo-200"
                  >
                    <FaRobot className="text-indigo-600" />
                    Hỗ trợ AI
                  </button>

                  {/* Review Button - Only for completed orders (status 4) */}
                  {order.status === 4 && (
                    <button
                      onClick={() => {/* TODO: Open review modal */ }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm transition flex items-center gap-1"
                    >
                      ⭐ Đánh giá
                    </button>
                  )}

                  {/* HATEOAS: Thanh toán ngay button (if payment_url link exists) */}
                  {order._links?.payment_url && (
                    <button
                      onClick={() => window.location.href = order._links.payment_url.href}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition flex items-center gap-1"
                    >
                      💳 Thanh toán ngay
                    </button>
                  )}

                  {/* HATEOAS: Cancel Button (if cancel_order link exists) */}
                  {order._links?.cancel_order && (
                    <button
                      onClick={() => openCancelModal(order)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 pt-16">
            <FaBoxOpen className="mx-auto text-5xl mb-3 text-gray-400" />
            <p>Không có đơn hàng nào phù hợp.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={pagination.current_page === 1 || loading}
            onClick={() => goToPage(pagination.current_page - 1)}
            className="px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ← Trước
          </button>
          <span className="text-sm text-gray-700">
            Trang {pagination.current_page} / {pagination.last_page}
          </span>
          <button
            disabled={pagination.current_page === pagination.last_page || loading}
            onClick={() => goToPage(pagination.current_page + 1)}
            className="px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Sau →
          </button>
        </div>
      )}
      {/* bg-gray-900 bg-opacity-40 */}
      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0  backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Hủy đơn hàng <span className="text-indigo-600">#{selectedOrder?.order_code}</span>
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              Vui lòng chọn lý do hủy đơn hàng:
            </p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm mb-3"
            >
              <option value="">-- Chọn lý do --</option>
              {cancelOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {cancelReason === "❌ Khác (nhập lý do riêng)" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do cụ thể..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm mb-3"
                rows="3"
              ></textarea>
            )}

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                Đóng
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryBought;
