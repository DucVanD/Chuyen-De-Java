import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaBoxOpen, FaCalendar, FaHashtag, FaChartPie, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import apiOrderAdmin from "../../../api/admin/apiOrderAdmin";

// Utility to format quantity (Standard Supermarket Logic)
const formatQuantity = (qty, saleType, unitLabel) => {
    if (saleType === "WEIGHT") {
        if (qty >= 1000) {
            return (qty / 1000).toFixed(1).replace(/\.0$/, "") + " kg";
        }
        return qty + " g";
    }
    return qty + " " + (unitLabel || "đv");
};

const ListOrderExport = () => {
    const [exports, setExports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, today, week, month
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchExports();
    }, [filter]);

    const fetchExports = async () => {
        try {
            setLoading(true);
            // Sourcing from Orders provides the most reliable itemized data
            const orders = await apiOrderAdmin.getAll();

            // Transform to itemized list (1 row per order detail)
            // This ensures every item has a name and correct unit formatting
            const itemizedList = orders
                .filter(o => o.status !== "CANCELLED") // Standard: Don't show cancelled in exports
                .flatMap(order => (order.orderDetails || []).map(item => ({
                    id: `${order.id}-${item.id}`,
                    orderId: order.id,
                    orderCode: order.orderCode || "N/A",
                    productName: item.product?.name || item.productName || "SP #" + item.productId,
                    quantity: item.quantity,
                    amount: item.amount,
                    saleType: item.product?.saleType || item.saleType,
                    unitLabel: item.product?.unitLabel || item.unitLabel,
                    baseWeight: item.product?.baseWeight || 0,
                    createdAt: order.createdAt
                })));

            setExports(itemizedList);
            setCurrentPage(0); // Reset to first page on data fetch/filter
        } catch (error) {
            console.error("Error fetching exports:", error);
            setExports([]);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + "₫";

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

    // Pagination logic
    const totalPages = Math.ceil(filteredExports.length / pageSize);
    const paginatedExports = filteredExports.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    // Stats calculations
    const totalRevenue = filteredExports.reduce((sum, item) => sum + (item.amount || 0), 0);
    const uniqueOrders = new Set(filteredExports.map(item => item.orderId)).size;
    const uniqueProducts = new Set(filteredExports.map(item => item.productName)).size;

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBoxOpen className="text-red-600" />
                        Quản lý Xuất Kho
                    </h1>
                    <p className="text-gray-500 mt-1">Báo cáo chi tiết từng mặt hàng xuất đi (Chuẩn Siêu Thị)</p>
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
                                ? "bg-red-600 text-white shadow-md shadow-red-100"
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Giao dịch xuất</p>
                            <p className="text-2xl font-extrabold text-gray-800">{uniqueOrders} <span className="text-sm font-normal text-gray-400">đơn</span></p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full">
                            <FaHashtag className="text-xl text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tổng giá trị xuất</p>
                            <p className="text-2xl font-extrabold text-green-600">{formatPrice(totalRevenue)}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <FaCalendar className="text-xl text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Loại hàng xuất</p>
                            <p className="text-2xl font-extrabold text-orange-600">{uniqueProducts} <span className="text-sm font-normal text-gray-400">món</span></p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full">
                            <FaChartPie className="text-xl text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Mã đơn
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Sản phẩm
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Số lượng
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Thành tiền
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Thời gian
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">
                                    Đang tải dữ liệu báo cáo...
                                </td>
                            </tr>
                        ) : paginatedExports.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <FaBoxOpen size={40} className="opacity-20" />
                                        <p>Không có dữ liệu xuất kho trong kỳ này</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedExports.map((exp) => (
                                <tr key={exp.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                            {exp.orderCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-gray-900">{exp.productName}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="font-extrabold text-indigo-600">
                                            {formatQuantity(
                                                exp.saleType === "WEIGHT" ? (exp.quantity * (exp.baseWeight || 1)) : exp.quantity,
                                                exp.saleType,
                                                exp.unitLabel
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-green-600">
                                        {formatPrice(exp.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500">
                                        {new Date(exp.createdAt).toLocaleString("vi-VN", {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link
                                            to={`/admin/order/detail/${exp.orderId}`}
                                            className="text-gray-400 hover:text-indigo-600 flex items-center justify-end gap-1 font-bold text-xs uppercase"
                                        >
                                            <FaEye />
                                            <span>Xem đơn</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 font-medium">
                        Hiển thị <span className="text-gray-900">{paginatedExports.length}</span> trên <span className="text-gray-900">{filteredExports.length}</span> kết quả
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <FaChevronLeft className="text-gray-600" />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${currentPage === i
                                        ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-100"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 3))}
                        </div>

                        <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <FaChevronRight className="text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListOrderExport;
