import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiStockAdmin from "../../../api/admin/apiStockAdmin";
import apiProductAdmin from "../../../api/admin/apiProductAdmin";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import { FaArrowLeft, FaSave, FaSignOutAlt } from "react-icons/fa";

const FormXuatKho = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  /* SEARCH PRODUCT */
  const loadProductOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];
    const response = await apiProductAdmin.search(inputValue);
    const products = response.content || [];
    return products.map((p) => ({
      value: p.id,
      label: `${p.name} (Tồn: ${p.qty})`,
    }));
  };

  const handleProductChange = (opt) => {
    setForm((prev) => ({
      ...prev,
      productId: opt ? opt.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) return toast.error("Vui lòng chọn sản phẩm");
    if (!form.quantity || form.quantity <= 0) return toast.error("Số lượng không hợp lệ");

    setSubmitting(true);
    try {
      await apiStockAdmin.create({
        ...form,
        movementType: "OUT",
      });
      toast.success("Xuất kho thành công");
      navigate("/admin/inventory");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xuất kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaSignOutAlt className="text-red-600" /> Xuất hàng khỏi kho
        </h2>
        <button
          onClick={() => navigate("/admin/inventory")}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium"
        >
          <FaArrowLeft /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PRODUCT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm <span className="text-red-500">*</span></label>
          <AsyncSelect
            loadOptions={loadProductOptions}
            placeholder="Tìm kiếm sản phẩm..."
            onChange={handleProductChange}
            classNamePrefix="react-select"
            noOptionsMessage={() => "Không tìm thấy sản phẩm"}
          />
        </div>

        {/* QUANTITY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng xuất <span className="text-red-500">*</span></label>
          <input
            type="number"
            min="1"
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            required
          />
        </div>

        {/* NOTE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú xuất kho</label>
          <textarea
            placeholder="Lý do xuất kho (Bán lẻ, tiêu hủy, chuyển kho...)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/inventory")}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-200"
          >
            {submitting ? "Đang xử lý..." : <><FaSave /> Xác nhận xuất kho</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormXuatKho;
