import { Link } from "react-router-dom";
import { FaTrashRestore, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiOrderAdmin from "../../../api/admin/apiOrderAdmin";

const TrashOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const res = await apiOrderAdmin.getTrash();
            setOrders(res || []);
        } catch (err) {
            toast.error("Lỗi khi lấy danh sách thùng rác!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const handleRestore = async (id) => {
        try {
            await apiOrderAdmin.restore(id);
            toast.success("Khôi phục đơn hàng thành công!");
            fetchTrash();
        } catch (err) {
            toast.error(err.response?.data?.message || "Khôi phục thất bại!");
        }
    };

    const handlePermanentDelete = async (id) => {
        if (!window.confirm("Xóa vĩnh viễn sẽ không thể khôi phục! Bạn chắc chắn?")) return;
        try {
            await apiOrderAdmin.permanentDelete(id);
            toast.success("Đã xóa vĩnh viễn đơn hàng!");
            fetchTrash();
        } catch (err) {
            toast.error(err.response?.data?.message || "Xóa vĩnh viễn thất bại!");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">Thùng rác đơn hàng</h3>
                <div>
                    <Link to="/admin/orders" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center transition duration-200">
                        <i className="fas fa-arrow-left mr-2"></i> Về danh sách
                    </Link>
                </div>
            </div>

            <div className="p-6 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">ID</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Mã đơn</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Khách hàng</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Tổng tiền</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Phương thức</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">Đang tải...</td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 text-center">
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
                                        <div className="flex items-center justify-center space-x-4">
                                            <button
                                                onClick={() => handleRestore(order.id)}
                                                className="text-green-500 hover:text-green-700 transition"
                                                title="Khôi phục"
                                            >
                                                <FaTrashRestore className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => handlePermanentDelete(order.id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Xóa vĩnh viễn"
                                            >
                                                <FaTrash className="text-xl" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">Thùng rác trống.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrashOrder;
