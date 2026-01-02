import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiVoucherAdmin from "../../../api/admin/apiVoucherAdmin";
import { toast } from "react-toastify";

const AddVoucher = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        voucherCode: "",
        name: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        maxDiscount: "",
        minOrderAmount: "0",
        usageLimit: "",
        startDate: "",
        endDate: "",
        status: 1,
    });

    const generateCode = () => {
        const code = "VC" + Date.now().toString().slice(-8);
        setFormData({ ...formData, voucherCode: code });
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
            await apiVoucherAdmin.create(formData);
            toast.success("Tạo voucher thành công");
            navigate("/admin/vouchers");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Không thể tạo voucher");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b">
                <h3 className="text-2xl font-semibold">Thêm Voucher Mới</h3>
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
                    {/* Voucher Code */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Mã Voucher <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                required
                                value={formData.voucherCode}
                                onChange={(e) =>
                                    setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() })
                                }
                                className="flex-1 p-2 border rounded"
                                placeholder="VD: SUMMER2024"
                            />
                            <button
                                type="button"
                                onClick={generateCode}
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            >
                                Tạo tự động
                            </button>
                        </div>
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
                            placeholder="VD: Giảm giá mùa hè"
                        />
                    </div>

                    {/* Discount Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Loại giảm giá <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.discountType}
                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="PERCENTAGE">Phần trăm (%)</option>
                            <option value="FIXED_AMOUNT">Số tiền cố định (đ)</option>
                        </select>
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
                            placeholder={formData.discountType === "PERCENTAGE" ? "VD: 10" : "VD: 50000"}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.discountType === "PERCENTAGE"
                                ? "Nhập từ 1-100"
                                : "Nhập số tiền giảm"}
                        </p>
                    </div>

                    {/* Max Discount (for PERCENTAGE only) */}
                    {formData.discountType === "PERCENTAGE" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Giảm tối đa (đ)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="VD: 100000"
                            />
                            <p className="text-xs text-gray-500 mt-1">Để trống nếu không giới hạn</p>
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
                            placeholder="VD: 200000"
                        />
                    </div>

                    {/* Usage Limit */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Giới hạn sử dụng</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="VD: 100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Để trống nếu không giới hạn</p>
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
                        Tạo Voucher
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

export default AddVoucher;
