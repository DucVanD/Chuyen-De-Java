import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import { FaArrowLeft, FaSave, FaExchangeAlt } from "react-icons/fa";

import apiStockAdmin from "../../../api/admin/apiStockAdmin";
import apiProductAdmin from "../../../api/admin/apiProductAdmin";

const FormDieuChinh = () => {
  const navigate = useNavigate(); // ✅ Hook điều hướng
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    note: "",
  });

  /* SEARCH PRODUCT */
  const loadProductOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];
    const response = await apiProductAdmin.search(inputValue);
    const products = response.content || [];
    return products.map((p) => ({
      value: p.id,
      label: `${p.name} (Tồn: ${p.qty})`, // Hiển thị tồn kho để dễ điều chỉnh
    }));
  };

  const handleProductChange = (opt) => {
    setForm((prev) => ({
      ...prev,
      productId: opt ? opt.value : "",
    }));
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId) return toast.error("Vui lòng chọn sản phẩm");
    if (!form.quantity || form.quantity === 0) return toast.error("Số lượng điều chỉnh phải khác 0");
    if (!form.note.trim()) return toast.error("Vui lòng nhập lý do điều chỉnh");

    setSubmitting(true);
    try {
      await apiStockAdmin.create({
        ...form,
        movementType: "ADJUSTMENT",
      });

      toast.success("Điều chỉnh kho thành công");
      navigate("/admin/inventory"); // ✅ Chuyển về trang danh sách
    } catch {
      toast.error("Điều chỉnh thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaExchangeAlt className="text-orange-500" /> Điều chỉnh kho (Kiểm kê)
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
            className="react-select-container"
            classNamePrefix="react-select"
            noOptionsMessage={() => "Không tìm thấy sản phẩm"}
          />
        </div>

        {/* QUANTITY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng điều chỉnh <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="number"
              placeholder="Nhập số lượng (Ví dụ: 5 hoặc -2)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              required
            />
            <p className="text-xs text-gray-500 mt-1 italic">
              * Nhập số dương để tăng tồn, số âm để giảm tồn.
            </p>
          </div>
        </div>

        {/* NOTE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do điều chỉnh <span className="text-red-500">*</span></label>
          <textarea
            placeholder="Ví dụ: Hàng hư hỏng, thất lạc, kiểm kê sai sót..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            required
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
            className="px-6 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-200"
          >
            {submitting ? "Đang xử lý..." : <><FaSave /> Xác nhận điều chỉnh</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormDieuChinh;