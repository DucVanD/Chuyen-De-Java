import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import { FaArrowLeft, FaSave, FaBoxOpen } from "react-icons/fa";

import apiStock from "../../../api/apiStock";
import apiProduct from "../../../api/apiProduct";
import apiSupplier from "../../../api/apiSupplier";

const FormNhapKho = () => {
  const navigate = useNavigate(); // ✅ Hook điều hướng
  const [suppliers, setSuppliers] = useState([]);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    supplierId: "",
    quantity: "",
    unitPrice: "",
    note: "",
  });

  /* LOAD SUPPLIERS */
  useEffect(() => {
    apiSupplier.getAll()
      .then(setSuppliers)
      .catch(() => toast.error("Không tải được nhà cung cấp"));
  }, []);

  /* SEARCH PRODUCT */
  const loadProductOptions = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) return [];
    const products = await apiProduct.search(inputValue);
    return products.map((p) => ({
      value: p.id,
      label: p.name,
    }));
  };

  /* CHANGE PRODUCT */
  const handleProductChange = async (opt) => {
    if (!opt) {
      setForm((prev) => ({ ...prev, productId: "", unitPrice: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, productId: opt.value }));

    // AUTO GET LAST PRICE
    try {
      setLoadingPrice(true);
      const lastPrice = await apiStock.getLastImportPrice(opt.value);
      if (lastPrice && lastPrice > 0) {
        setForm((prev) => ({ ...prev, unitPrice: lastPrice }));
      }
    } catch {
      // Ignore error
    } finally {
      setLoadingPrice(false);
    }
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId) return toast.error("Vui lòng chọn sản phẩm");
    if (!form.supplierId) return toast.error("Vui lòng chọn nhà cung cấp");
    if (!form.quantity || form.quantity <= 0) return toast.error("Số lượng không hợp lệ");
    if (!form.unitPrice || form.unitPrice <= 0) return toast.error("Giá nhập không hợp lệ");

    setSubmitting(true);
    try {
      await apiStock.create({
        ...form,
        movementType: "IN",
      });

      toast.success("Nhập kho thành công");
      navigate("/admin/inventory"); // ✅ Chuyển về trang danh sách
    } catch {
      toast.error("Nhập kho thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaBoxOpen className="text-green-600" /> Nhập kho hàng hóa
        </h2>
        <button
          onClick={() => navigate("/admin/inventory")}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium"
        >
          <FaArrowLeft /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ROW 1: Product & Supplier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm <span className="text-red-500">*</span></label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadProductOptions}
              onChange={handleProductChange}
              placeholder="Tìm sản phẩm..."
              noOptionsMessage={() => "Không tìm thấy sản phẩm"}
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp <span className="text-red-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white h-[38px]"
              value={form.supplierId}
              onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
              required
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.supplierCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 2: Quantity & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng nhập <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="1"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn giá nhập (VNĐ) <span className="text-red-500">*</span>
              {loadingPrice && <span className="text-xs text-green-600 ml-2 animate-pulse">(Đang lấy giá cũ...)</span>}
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú nhập hàng</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
            rows={3}
            placeholder="Ví dụ: Nhập theo PO #123..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        {/* Actions */}
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
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
          >
            {submitting ? "Đang xử lý..." : <><FaSave /> Hoàn tất nhập kho</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormNhapKho;