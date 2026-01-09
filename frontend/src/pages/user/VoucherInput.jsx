import { useState, useEffect } from "react";
import { FaTag, FaSpinner } from "react-icons/fa";
import apiVoucher from "../../api/user/apiVoucher";
import { toast } from "react-toastify";
import { FaClipboardCheck } from "react-icons/fa6";
const VoucherInput = ({ subtotal, onVoucherApplied }) => {
    const [voucherCode, setVoucherCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [savedCodes, setSavedCodes] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedVouchers") || "[]");
        setSavedCodes(saved);
    }, []);

    const handleApplyVoucher = async (codeToApply) => {
        const code = (typeof codeToApply === 'string') ? codeToApply : voucherCode;
        if (!code.trim()) {
            toast.warn("Vui lòng nhập mã voucher");
            return;
        }

        setLoading(true);
        try {
            const voucher = await apiVoucher.validateVoucher(code.toUpperCase(), subtotal);
            const discountAmount = apiVoucher.calculateDiscount(voucher, subtotal);

            setAppliedVoucher(voucher);
            setDiscount(discountAmount);
            onVoucherApplied(voucher, discountAmount);
            setVoucherCode(voucher.voucherCode);

            toast.success(`Áp dụng mã ${voucher.voucherCode} thành công!`);
        } catch (error) {
            toast.error(error);
            setAppliedVoucher(null);
            setDiscount(0);
            onVoucherApplied(null, 0);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveVoucher = () => {
        setVoucherCode("");
        setAppliedVoucher(null);
        setDiscount(0);
        onVoucherApplied(null, 0);
        toast.info("Đã xóa mã giảm giá");
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTag className="text-green-600" />
                Mã giảm giá
            </h3>

            {!appliedVoucher ? (
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            onKeyPress={(e) => e.key === "Enter" && handleApplyVoucher()}
                            placeholder="Nhập mã voucher"
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none uppercase text-sm"
                            disabled={loading}
                        />
                        <button
                            onClick={handleApplyVoucher}
                            disabled={loading}
                            className="bg-green-600 text-white px-3 py-2.5 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Đang kiểm tra...</span>
                                </>
                            ) : (
                                <FaClipboardCheck />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Nhập mã giảm giá để nhận ưu đãi
                    </p>

                    {savedCodes.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Mã bạn đã lưu:</p>
                            <div className="flex flex-wrap gap-2">
                                {savedCodes.map(code => (
                                    <button
                                        key={code}
                                        onClick={() => handleApplyVoucher(code)}
                                        className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-1 rounded hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="font-semibold text-green-800">{appliedVoucher.voucherCode}</p>
                                <p className="text-sm text-green-600 mt-1">{appliedVoucher.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Giảm: {appliedVoucher.discountType === "PERCENTAGE"
                                        ? `${appliedVoucher.discountValue}%`
                                        : `${Number(appliedVoucher.discountValue).toLocaleString("vi-VN")}đ`}
                                </p>
                            </div>
                            <button
                                onClick={handleRemoveVoucher}
                                className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="font-semibold text-green-600">
                            -{Number(discount).toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoucherInput;
