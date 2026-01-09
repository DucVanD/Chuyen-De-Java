import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // ✅ Import useSearchParams
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import { FaArrowLeft, FaSave, FaBoxOpen } from "react-icons/fa";

import apiStockAdmin from "../../../api/admin/apiStockAdmin";
import apiProductAdmin from "../../../api/admin/apiProductAdmin";
import apiSupplierAdmin from "../../../api/admin/apiSupplierAdmin";

const FormNhapKho = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productIdFromUrl = searchParams.get("productId");

  const [suppliers, setSuppliers] = useState([]);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    productId: "",
    supplierId: "",
    quantity: "",
    unitPrice: "",
    note: "",
  });

  /* LOAD INITIAL DATA */
  useEffect(() => {
    // 1. Load suppliers
    apiSupplierAdmin.getAll()
      .then(setSuppliers)
      .catch(() => toast.error("Không tải được nhà cung cấp"));

    // 2. If productId in URL, load product detail
    if (productIdFromUrl) {
      handleProductChange({ value: productIdFromUrl });
    }
  }, [productIdFromUrl]);

  /* SEARCH PRODUCT */
  const loadProductOptions = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) return [];
    const response = await apiProductAdmin.search(inputValue);
    // Lưu ý: search của Admin trả về Page<ProductDto>
    const products = response.content || [];
    return products.map((p) => ({
      value: p.id,
      label: p.name,
    }));
  };

  /* CHANGE PRODUCT */
  const handleProductChange = async (opt) => {
    if (!opt) {
      setForm((prev) => ({ ...prev, productId: "", unitPrice: "", supplierId: "" }));
      setSelectedProduct(null); // ✅ Clear product detail
      return;
    }

    const productId = opt.value;
    setForm((prev) => ({ ...prev, productId }));

    // ✅ FETCH CHI TIẾT SẢN PHẨM (để lấy saleType, baseWeight, unitLabel)
    try {
      setLoadingPrice(true);
      const [productDetail, lastPrice, lastSupId] = await Promise.all([
        apiProductAdmin.getById(productId),
        apiStockAdmin.getLastImportPrice(productId),
        apiStockAdmin.getLastSupplierId(productId)
      ]);

      setSelectedProduct(productDetail); // ✅ Lưu chi tiết sản phẩm
      setForm((prev) => ({
        ...prev,
        unitPrice: (lastPrice && lastPrice > 0) ? lastPrice : prev.unitPrice,
        supplierId: lastSupId || prev.supplierId
      }));
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
      await apiStockAdmin.create({
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
              value={selectedProduct ? { value: selectedProduct.id, label: selectedProduct.name } : null}
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

        {/* ✅ INFO BOX - THÔNG TIN SẢN PHẨM */}
        {selectedProduct && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-blue-800">📦 Thông tin sản phẩm</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Loại bán:</span>{" "}
                <span className="font-medium text-gray-800">
                  {selectedProduct.saleType === "WEIGHT" ? "Theo cân" : "Theo đơn vị"}
                </span>
              </div>
              {selectedProduct.saleType === "WEIGHT" && selectedProduct.baseWeight && (
                <div>
                  <span className="text-gray-600">Quy cách bán:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {selectedProduct.baseWeight}g / 1 {selectedProduct.unitLabel || "phần"}
                  </span>
                </div>
              )}
              {selectedProduct.saleType === "UNIT" && selectedProduct.unitLabel && (
                <div>
                  <span className="text-gray-600">Đơn vị:</span>{" "}
                  <span className="font-medium text-gray-800">{selectedProduct.unitLabel}</span>
                </div>
              )}
              {/* ✅ THÊM: Hiển thị tồn kho hiện tại */}
              <div className="col-span-2 pt-2 border-t border-blue-200">
                <span className="text-gray-600">Tồn kho hiện tại:</span>{" "}
                <span className="font-bold text-blue-700">
                  {selectedProduct.saleType === "WEIGHT"
                    ? `${selectedProduct.qty?.toLocaleString() || 0} gram`
                    : `${selectedProduct.qty || 0} ${selectedProduct.unitLabel || "đơn vị"}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ROW 2: Quantity & Price - ✅ LABELS ĐỘNG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedProduct?.saleType === "WEIGHT"
                ? "Số lượng nhập (gram)"
                : `Số lượng nhập (${selectedProduct?.unitLabel || "đơn vị"})`}
              {" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder={selectedProduct?.saleType === "WEIGHT"
                ? "Ví dụ: 50000"
                : `Ví dụ: 100 ${selectedProduct?.unitLabel || ""}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
            {/* ✅ THÊM: Hiển thị quy đổi cho WEIGHT */}
            {selectedProduct?.saleType === "WEIGHT" && selectedProduct?.baseWeight && form.quantity > 0 && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ≈ {Math.floor(form.quantity / selectedProduct.baseWeight)} {selectedProduct.unitLabel || "phần"}
                ({selectedProduct.baseWeight}g / {selectedProduct.unitLabel || "phần"})
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedProduct?.saleType === "WEIGHT"
                ? "Đơn giá nhập (VNĐ / kg)"
                : `Đơn giá nhập (VNĐ / ${selectedProduct?.unitLabel || "đơn vị"})`}
              {" "}
              <span className="text-red-500">*</span>
              {loadingPrice && <span className="text-xs text-green-600 ml-2 animate-pulse">(Đang lấy giá cũ...)</span>}
            </label>
            <input
              type="number"
              min="0"
              placeholder={selectedProduct?.saleType === "WEIGHT" ? "Ví dụ: 150000" : "Ví dụ: 25000"}
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