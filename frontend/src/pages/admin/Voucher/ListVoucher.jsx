import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiVoucherAdmin from "../../../api/admin/apiVoucherAdmin";
import { FaPlus, FaEdit, FaTrash, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";

const ListVoucher = () => {
    const navigate = useNavigate();
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, active, inactive

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const data = await apiVoucherAdmin.getAll();
            setVouchers(data);
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải danh sách voucher");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa voucher này?")) {
            try {
                await apiVoucherAdmin.delete(id);
                toast.success("Xóa voucher thành công");
                fetchVouchers();
            } catch (err) {
                toast.error("Không thể xóa voucher");
            }
        }
    };

    const getStatusBadge = (voucher) => {
        const now = new Date();
        const start = new Date(voucher.startDate);
        const end = new Date(voucher.endDate);

        if (voucher.status === 0) {
            return <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">Inactive</span>;
        }
        if (now < start) {
            return <span className="px-2 py-1 text-xs rounded bg-blue-200 text-blue-700">Sắp diễn ra</span>;
        }
        if (now > end) {
            return <span className="px-2 py-1 text-xs rounded bg-red-200 text-red-700">Hết hạn</span>;
        }
        return <span className="px-2 py-1 text-xs rounded bg-green-200 text-green-700">Đang hoạt động</span>;
    };

    const filteredVouchers = vouchers.filter((v) => {
        if (filter === "active") return v.status === 1;
        if (filter === "inactive") return v.status === 0;
        return true;
    });

    if (loading) {
        return <div className="text-center py-10">Đang tải...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b">
                <h3 className="text-2xl font-semibold">Quản lý Voucher</h3>
                <button
                    onClick={() => navigate("/admin/voucher/add")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FaPlus /> Thêm Voucher
                </button>
            </div>

            {/* Filter */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded ${filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        Tất cả ({vouchers.length})
                    </button>
                    <button
                        onClick={() => setFilter("active")}
                        className={`px-4 py-2 rounded ${filter === "active" ? "bg-green-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        Hoạt động ({vouchers.filter((v) => v.status === 1).length})
                    </button>
                    <button
                        onClick={() => setFilter("inactive")}
                        className={`px-4 py-2 rounded ${filter === "inactive" ? "bg-gray-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        Không hoạt động ({vouchers.filter((v) => v.status === 0).length})
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn tối thiểu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sử dụng</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredVouchers.length > 0 ? (
                            filteredVouchers.map((voucher) => (
                                <tr key={voucher.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <FaTag className="text-indigo-600" />
                                            <span className="font-mono font-semibold">{voucher.voucherCode}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{voucher.name}</td>
                                    <td className="px-4 py-3">
                                        {voucher.discountType === "PERCENTAGE" ? "Phần trăm" : "Số tiền"}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-red-600">
                                        {voucher.discountType === "PERCENTAGE"
                                            ? `${voucher.discountValue}%`
                                            : `${Number(voucher.discountValue).toLocaleString("vi-VN")}đ`}
                                    </td>
                                    <td className="px-4 py-3">
                                        {Number(voucher.minOrderAmount).toLocaleString("vi-VN")}đ
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">
                                            {voucher.usedCount}/{voucher.usageLimit || "∞"}
                                        </div>
                                        {voucher.usageLimit && (
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            (voucher.usedCount / voucher.usageLimit) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(voucher)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/voucher/edit/${voucher.id}`)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(voucher.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-6 text-gray-500">
                                    Không có voucher nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListVoucher;
