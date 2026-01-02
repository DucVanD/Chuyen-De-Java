import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaBoxOpen, FaCalendar, FaHashtag } from "react-icons/fa";
import apiStockAdmin from "../../../api/admin/apiStockAdmin";

const ListOrderExport = () => {
    const [exports, setExports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, today, week, month

    useEffect(() => {
        fetchExports();
    }, [filter]);

    const fetchExports = async () => {
        try {
            setLoading(true);
            const data = await apiStockAdmin.getByType("OUT");

            // Transform data to match component format
            const transformedData = data.map(item => ({
                id: item.id,
                orderId: item.orderId,
                orderCode: item.orderCode || "N/A",
                totalQuantity: item.quantity,
                totalAmount: item.unitPrice,
                itemsCount: parseInt(item.note?.match(/(\d+) items/)?.[1] || "1"),
                createdAt: item.createdAt,
                note: item.note
            }));

            setExports(transformedData);
        } catch (error) {
            console.error("Error fetching exports:", error);
            setExports([]);
        } finally {
            setLoading(false);
        }
    };

    console.log(exports);
    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "₫";

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString("vi-VN");
    };

    const getFilteredData = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        return exports.filter(exp => {
            const expDate = new Date(exp.createdAt);
            switch (filter) {
                case "today":
                    return expDate >= today;
                case "week":
                    return expDate >= weekAgo;
                case "month":
                    return expDate >= monthAgo;
                default:
                    return true;
            }
        });
    };

    const filteredExports = getFilteredData();

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBoxOpen className="text-red-600" />
                        Quản lý Xuất Kho
                    </h1>
                    <p className="text-gray-500 mt-1">Theo dõi hàng xuất qua đơn hàng</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex gap-2">
                    {[
                        { value: "all", label: "Tất cả" },
                        { value: "today", label: "Hôm nay" },
                        { value: "week", label: "7 ngày" },
                        { value: "month", label: "30 ngày" }
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === f.value
                                ? "bg-red-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng đơn xuất</p>
                            <p className="text-2xl font-bold text-gray-800">{filteredExports.length}</p>
                        </div>
                        <FaHashtag className="text-3xl text-red-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng số lượng</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {filteredExports.reduce((sum, exp) => sum + exp.totalQuantity, 0)}
                            </p>
                        </div>
                        <FaBoxOpen className="text-3xl text-orange-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng giá trị</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {formatPrice(filteredExports.reduce((sum, exp) => sum + exp.totalAmount, 0))}
                            </p>
                        </div>
                        <FaCalendar className="text-3xl text-green-600" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã đơn hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượng sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng số lượng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá trị đơn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thời gian
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : filteredExports.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            filteredExports.map((exp) => (
                                <tr key={exp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-medium text-blue-600">{exp.orderCode}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-gray-900">{exp.itemsCount} sản phẩm</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-gray-900">{exp.totalQuantity} đơn vị</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-green-600">{formatPrice(exp.totalAmount)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(exp.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            to={`/admin/order/detail/${exp.orderId}`}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <FaEye />
                                            <span>Chi tiết</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListOrderExport;
