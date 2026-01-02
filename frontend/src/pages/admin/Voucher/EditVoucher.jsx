import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiVoucherAdmin from "../../../api/admin/apiVoucherAdmin";
import { toast } from "react-toastify";

const EditVoucher = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        voucherCode: "",
        name: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        maxDiscount: "",
        minOrderAmount: "0",
        usageLimit: "",
        usedCount: 0,
        startDate: "",
        endDate: "",
        status: 1,
    });

    useEffect(() => {
        fetchVoucher();
    }, [id]);

    const fetchVoucher = async () => {
        try {
            const data = await apiVoucherAdmin.getById(id);

            // Format dates for datetime-local input
            const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const date = new Date(dateStr);
                return date.toISOString().slice(0, 16);
            };

            setFormData({
                ...data,
                startDate: formatDate(data.startDate),
                endDate: formatDate(data.endDate),
            });
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải thông tin voucher");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            toast.error("Ngày bắt đầu phải trước ngày kết thúc");
            return;
        }

        if (formData.discountType === "PERCENTAGE" && (formData.discountValue < 1 || formData.discountValue > 100)) {
            toast.error("Giá trị giảm phần trăm phải từ 1-100");
            return;
        }

        try {
            await apiVoucherAdmin.update(id, formData);
            toast.success("Cập nhật voucher thành công");
            navigate("/admin/vouchers");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Không thể cập nhật voucher");
        }
    };

    if (loading) {
        return <div className="text-center py-10">Đang tải...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b">
                <h3 className="text-2xl font-semibold">Chỉnh sửa Voucher</h3>
                <button
                    onClick={() => navigate("/admin/vouchers")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    ← Quay lại
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Voucher Code (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Mã Voucher</label>
                        <input
                            type="text"
                            readOnly
                            value={formData.voucherCode}
                            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tên Voucher <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Discount Type (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Loại giảm giá</label>
                        <input
                            type="text"
                            readOnly
                            value={formData.discountType === "PERCENTAGE" ? "Phần trăm (%)" : "Số tiền cố định (đ)"}
                            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Giá trị giảm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.discountValue}
                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Max Discount (for PERCENTAGE only) */}
                    {formData.discountType === "PERCENTAGE" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Giảm tối đa (đ)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.maxDiscount || ""}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}

                    {/* Min Order Amount */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Đơn hàng tối thiểu (đ)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.minOrderAmount}
                            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Usage Limit */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Giới hạn sử dụng</label>
                        <input
                            type="number"
                            min={formData.usedCount}
                            value={formData.usageLimit || ""}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Đã sử dụng: {formData.usedCount} lần
                        </p>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Trạng thái</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                            className="w-full p-2 border rounded"
                        >
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Không hoạt động</option>
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
                    >
                        Cập nhật Voucher
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/vouchers")}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditVoucher;
