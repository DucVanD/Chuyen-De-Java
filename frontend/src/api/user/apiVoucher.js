import axiosInstance from "../axios";

const apiVoucher = {
    // Get all active vouchers
    getAll: () =>
        axiosInstance.get("/vouchers").then((res) => res.data),

    // Get currently active vouchers for users to claim
    getActive: () =>
        axiosInstance.get("/vouchers/active").then((res) => res.data),

    // Get voucher by code (for applying discount)
    getByCode: (code) =>
        axiosInstance.get(`/vouchers/code/${code}`).then((res) => res.data),

    // Validate voucher for order
    validateVoucher: async (code, orderAmount) => {
        try {
            const voucher = await apiVoucher.getByCode(code);

            // Check if voucher is active
            if (voucher.status === 0) {
                throw new Error("Voucher không còn hiệu lực");
            }

            // Check date range
            const now = new Date();
            const start = new Date(voucher.startDate);
            const end = new Date(voucher.endDate);

            if (now < start) {
                throw new Error("Voucher chưa đến thời gian sử dụng");
            }

            if (now > end) {
                throw new Error("Voucher đã hết hạn");
            }

            // Check usage limit
            if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
                throw new Error("Voucher đã hết lượt sử dụng");
            }

            // Check minimum order amount
            if (orderAmount < voucher.minOrderAmount) {
                throw new Error(
                    `Đơn hàng tối thiểu ${Number(voucher.minOrderAmount).toLocaleString("vi-VN")}đ`
                );
            }

            return voucher;
        } catch (error) {
            throw error.response?.data?.message || error.message || "Mã voucher không hợp lệ";
        }
    },

    // Calculate discount amount
    calculateDiscount: (voucher, orderAmount) => {
        if (!voucher) return 0;

        if (voucher.discountType === "PERCENTAGE") {
            const discount = (orderAmount * voucher.discountValue) / 100;
            // Apply max discount if set
            if (voucher.maxDiscount && discount > voucher.maxDiscount) {
                return voucher.maxDiscount;
            }
            return discount;
        }

        // FIXED_AMOUNT
        return Math.min(voucher.discountValue, orderAmount);
    },
};

export default apiVoucher;
