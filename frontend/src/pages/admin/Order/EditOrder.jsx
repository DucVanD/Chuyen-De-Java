// src/pages/admin/orders/EditOrder.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiOrderAdmin from "../../../api/admin/apiOrderAdmin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===== MAP LABEL TRẠNG THÁI ===== */
const ORDER_STATUS_LABELS = {
  PENDING: "Đang chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  COMPLETED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalStatus, setOriginalStatus] = useState(null); // Lưu status gốc từ DB

  /* ===== LOAD ORDER ===== */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiOrderAdmin.getById(id);
        console.log("Order data:", res);
        setOrder(res);
        setOriginalStatus(res.status); // Lưu status gốc
      } catch (err) {
        console.error(err);
        toast.error("❌ Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  /* ===== KHÓA ĐƠN ===== */
  // Khóa dựa trên STATUS GỐC từ DB, không phải state đang thay đổi
  const isLocked = originalStatus && ["COMPLETED", "CANCELLED"].includes(originalStatus);

  /* ===== TRẠNG THÁI HỢP LỆ ===== */
  const allowedStatuses = (() => {
    if (!order) return [];
    switch (order.status) {
      case "PENDING":
        return ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"];
      case "CONFIRMED":
        return ["CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"];
      case "SHIPPING":
        return ["SHIPPING", "COMPLETED", "CANCELLED"];
      case "COMPLETED":
      case "CANCELLED":
        // Đã giao hoặc đã hủy → KHÓA, không thay đổi được
        return [order.status];
      default:
        return [order.status];
    }
  })();

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.warning("⚠️ Đơn hàng đã hoàn tất hoặc bị hủy");
      return;
    }

    try {
      await apiOrderAdmin.updateStatus(id, {
        status: order.status, // STRING
        paymentStatus: order.paymentStatus,
        // Thêm các trường địa chỉ và thông tin khách hàng
        receiverName: order.receiverName,
        receiverEmail: order.receiverEmail,
        receiverPhone: order.receiverPhone,
        receiverAddress: order.receiverAddress,
        ward: order.ward,
        district: order.district,
      });

      toast.success("✅ Cập nhật đơn hàng thành công");
      setTimeout(() => {
        // Kiểm tra xem có từ trang liên hệ qua không
        const fromContacts = localStorage.getItem("fromContactsPage");

        if (fromContacts === "true") {
          // Xóa flag và quay về trang liên hệ
          localStorage.removeItem("fromContactsPage");
          navigate("/admin/contacts");
        } else {
          // Quay về danh sách đơn hàng như bình thường
          const lp = localStorage.getItem("currentOrderPage");
          if (!lp || lp === "1" || lp === "0" || lp === "null" || lp === "undefined") {
            navigate("/admin/orders");
          } else {
            navigate(`/admin/orders/${lp}`);
          }
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("❌ Cập nhật thất bại");
    }
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fadeIn">
      {/* ===== HEADER ===== */}
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold">
          Chỉnh sửa đơn hàng #{order.orderCode}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/contacts")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm inline-flex items-center"
          >
            <i className="fa fa-envelope mr-1"></i> Về liên hệ
          </button>
          <button
            onClick={() => {
              const lp = localStorage.getItem("currentOrderPage");
              if (!lp || lp === "1" || lp === "0" || lp === "null" || lp === "undefined") {
                navigate("/admin/orders");
              } else {
                navigate(`/admin/orders/${lp}`);
              }
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm inline-flex items-center"
          >
            <i className="fa fa-list mr-1"></i> Về danh sách
          </button>
          <button
            onClick={() => navigate(`/admin/order/detail/${id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm inline-flex items-center"
          >
            <i className="fa fa-info-circle mr-1"></i> Về chi tiết
          </button>
        </div>
      </div>

      {/* ===== FORM ===== */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ===== KHÁCH HÀNG ===== */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">
                Thông tin khách hàng
              </h4>

              {/* Tên người nhận */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Tên người nhận</label>
                <input
                  type="text"
                  value={order.receiverName || ""}
                  onChange={(e) => setOrder({ ...order, receiverName: e.target.value })}
                  disabled={isLocked}
                  className={`w-full p-2 border rounded ${isLocked ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={order.receiverEmail || ""}
                  onChange={(e) => setOrder({ ...order, receiverEmail: e.target.value })}
                  disabled={isLocked}
                  className={`w-full p-2 border rounded ${isLocked ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                />
              </div>

              {/* Điện thoại */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Điện thoại</label>
                <input
                  type="tel"
                  value={order.receiverPhone || ""}
                  onChange={(e) => setOrder({ ...order, receiverPhone: e.target.value })}
                  disabled={isLocked}
                  className={`w-full p-2 border rounded ${isLocked ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                />
              </div>

              {/* Địa chỉ */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={order.receiverAddress || ""}
                  onChange={(e) => setOrder({ ...order, receiverAddress: e.target.value })}
                  disabled={isLocked}
                  className={`w-full p-2 border rounded ${isLocked ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                  placeholder="Số nhà, tên đường"
                />
              </div>

              {/* Phường/Xã */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Phường/Xã</label>
                <input
                  type="text"
                  value={order.ward || ""}
                  onChange={(e) => setOrder({ ...order, ward: e.target.value })}
                  disabled={isLocked}
                  className={`w-full p-2 border rounded ${isLocked ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                />
              </div>

              {/* Quận/Huyện */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Quận/Huyện</label>
                <input
                  type="text"
                  value={order.district || ""}
                  onChange={(e) => setOrder({ ...order, district: e.target.value })}
                  disabled={isLocked}
                  className={`w-full p-2 border rounded ${isLocked ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tổng tiền</label>
                <input
                  readOnly
                  value={`${Number(order.totalAmount).toLocaleString(
                    "vi-VN"
                  )} đ`}
                  className="w-full p-2 border rounded bg-gray-100 font-semibold text-red-600"
                />
              </div>
            </div>

            {/* ===== TRẠNG THÁI ===== */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">
                Trạng thái đơn hàng
              </h4>

              <div className="mb-4">
                <label className="block text-sm mb-1">Trạng thái</label>
                <select
                  value={order.status}
                  disabled={isLocked}
                  onChange={(e) =>
                    setOrder({ ...order, status: e.target.value })
                  }
                  className={`w-full p-2 border rounded ${isLocked
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white"
                    }`}
                >
                  {allowedStatuses.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>

                {isLocked && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    ⚠️ Đơn hàng đã hoàn tất hoặc đã hủy – không thể chỉnh sửa
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Ghi chú</label>
                <textarea
                  readOnly
                  rows={4}
                  value={order.note || ""}
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLocked}
                className={`w-full py-2 rounded text-white font-semibold ${isLocked
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
              >
                {isLocked ? "Không thể cập nhật" : "Cập nhật đơn hàng"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
