import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import apiOrderAdmin from "../../../api/admin/apiOrderAdmin";
import {
  FaTrash,
  FaEye,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
const ListOrder = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Tiêu chí lọc
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",  // Changed from 'payment' to match backend
    orderCode: "",      // Changed from 'order_code' to match backend
  });

  // Danh sách trạng thái đơn hàng (Backend Enum)
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
    FAILED: { text: "Thất bại", color: "bg-red-100 text-red-700" },
    REFUNDED: { text: "Đã hoàn tiền", color: "bg-purple-100 text-purple-700" },
  };

  // 🔹 Lấy danh sách đơn hàng
  const fetchOrders = async (pageIdx = 0) => {
    setLoading(true);
    try {
      const res = await apiOrderAdmin.getPage(pageIdx, 10, filters);
      setOrders(res.content || []);
      setCurrentPage(res.number + 1); // 1-indexed for UI
      setLastPage(res.totalPages > 0 ? res.totalPages - 1 : 0);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const p = Number(page) || 1;
    localStorage.setItem("currentOrderPage", p);
    fetchOrders(p - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Phân trang
  const goToPage = (p) => {
    if (p >= 1 && p <= (lastPage + 1)) {
      localStorage.setItem("currentOrderPage", p);
      if (p === 1) {
        navigate(`/admin/orders`);
      } else {
        navigate(`/admin/orders/${p}`);
      }
    }
  };


  // Áp dụng bộ lọc
  const handleFilter = () => {
    navigate(`/admin/orders`);
    fetchOrders(0);
  };

  // Bỏ lọc
  const handleClearFilters = async () => {
    const emptyFilters = {
      status: "",
      paymentMethod: "",
      orderCode: ""
    };
    setFilters(emptyFilters);
    navigate(`/admin/orders`);

    // Fetch immediately with empty filters
    setLoading(true);
    try {
      const res = await apiOrderAdmin.getPage(0, 10, emptyFilters);
      setOrders(res.content || []);
      setCurrentPage(res.number + 1);
      setLastPage(res.totalPages > 0 ? res.totalPages - 1 : 0);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Xóa đơn hàng
  const deleteOrder = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      try {
        await apiOrderAdmin.delete(id);
        toast.success("✅ Đã xóa đơn hàng thành công!");
        // Cập nhật lại danh sách ngay lập tức tại trang hiện tại
        fetchOrders(currentPage - 1);
      } catch (error) {
        const message = error.response?.data?.message || "Đã xảy ra lỗi. Không thể xóa đơn hàng.";
        toast.error("⚠️ " + message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Danh sách đơn hàng
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/admin/orders/trash")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition duration-200"
          >
            <FaTrash className="mr-2" /> Thùng rác
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="p-4 flex flex-col md:flex-row md:items-end gap-4 border-b border-gray-200 bg-gray-50">
        {/* Trạng thái */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Trạng thái</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded-md p-2 text-sm w-48"
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="SHIPPING">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Phương thức</label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            className="border rounded-md p-2 text-sm w-48"
          >
            <option value="">Tất cả</option>
            <option value="COD">Tiền mặt (COD)</option>
            <option value="BANK">Chuyển khoản</option>
            <option value="VNPAY">VNPAY</option>
          </select>
        </div>

        {/* Mã hóa đơn */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Mã hóa đơn</label>
          <input
            type="text"
            placeholder="Nhập mã đơn..."
            value={filters.orderCode}
            onChange={(e) =>
              setFilters({ ...filters, orderCode: e.target.value })
            }
            className="border rounded-md p-2 text-sm w-48"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center transition duration-200"
          >
            <FaSearch className="mr-2" />
            {loading ? "Đang lọc..." : "Lọc"}
          </button>
          <button
            onClick={handleClearFilters}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-md transition duration-200"
          >
            Bỏ lọc
          </button>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Thanh toán</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">TT Thanh toán</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => {
                const status = statusLabels[order.status] || {
                  text: "Không xác định",
                  color: "bg-gray-100 text-gray-800",
                };
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{order.id}</td>
                    <td className="px-4 py-3 text-sm font-mono">{order.orderCode}</td>
                    <td className="px-4 py-3 text-sm">{order.receiverName}</td>
                    <td className="px-4 py-3 text-sm">
                      {Number(order.totalAmount).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm">{order.paymentMethod}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${paymentStatusLabels[order.paymentStatus]?.color || 'bg-gray-100'}`}
                      >
                        {paymentStatusLabels[order.paymentStatus]?.text || order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-3 text-lg">
                        <button
                          onClick={() =>
                            navigate(`/admin/order/detail/${order.id}`)
                          }
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/order/edit/${order.id}`)
                          }
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không có đơn hàng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex justify-center mt-4 space-x-2 pb-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          {Array.from({ length: lastPage + 1 }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-3 py-1 rounded ${currentPage === p
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === lastPage + 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div >
  );
};

export default ListOrder;
