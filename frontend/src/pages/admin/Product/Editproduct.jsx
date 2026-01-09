import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave, FaEdit, FaCamera, FaTag, FaLayerGroup, FaPercentage, FaBoxOpen } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";

import apiProductAdmin from "../../../api/admin/apiProductAdmin";
import apiCategoryAdmin from "../../../api/admin/apiCategoryAdmin";
import apiBrandAdmin from "../../../api/admin/apiBrandAdmin";
import apiUpload from "../../../api/apiUpload";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State quản lý checkbox khuyến mại
  const [isDiscounted, setIsDiscounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    brandId: "",
    image: "",
    imagePublicId: "", // ✅ THÊM: Để lưu ID ảnh phục vụ việc xóa
    description: "",
    detail: "",
    salePrice: "",
    discountPrice: "",
    status: 1,
    qty: 0,
    lockedQty: 0,
    costPrice: 0, // Khởi tạo giá nhập trong state
    // ✅ THÊM CÁC FIELD CHO SALE TYPE
    saleType: "UNIT",
    baseWeight: "",
    unitLabel: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, cats, brs] = await Promise.all([
          apiProductAdmin.getById(id),
          apiCategoryAdmin.getAll(),
          apiBrandAdmin.getAll()
        ]);

        // Xử lý logic hiển thị checkbox khuyến mại
        const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.salePrice;
        setIsDiscounted(!!hasDiscount);

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          categoryId: product.categoryId || "",
          brandId: product.brandId || "",
          image: product.image || "",
          imagePublicId: product.imagePublicId || "", // ✅ THÊM: Lấy publicId từ DB
          description: product.description || "",
          detail: product.detail || "",
          salePrice: product.salePrice || "",
          discountPrice: product.discountPrice || "",
          status: product.status ?? 1,
          qty: product.qty || 0,
          lockedQty: product.lockedQty || 0,
          costPrice: product.costPrice || null,
          // ✅ THÊM SaleType fields
          saleType: product.saleType || "UNIT",
          baseWeight: product.baseWeight || "",
          unitLabel: product.unitLabel || "",
        });

        setCategories(cats || []);
        setBrands(brs || []);
      } catch (err) {
        console.error(err);
        toast.error("❌ Không thể tải dữ liệu sản phẩm");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  /* ================= SLUG GENERATOR ================= */
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "name") updated.slug = generateSlug(value);

      // ✅ Reset baseWeight khi đổi từ WEIGHT sang UNIT
      if (name === "saleType" && value === "UNIT") {
        updated.baseWeight = "";
      }

      return updated;
    });
  };

  const handleToggleDiscount = (e) => {
    const checked = e.target.checked;
    setIsDiscounted(checked);
    if (!checked) {
      setForm((prev) => ({ ...prev, discountPrice: "" }));
    }
  };

  const handleEditorChange = (content) => {
    setForm((prev) => ({ ...prev, detail: content }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ HIỂN THỊ PREVIEW NGAY LẬP TỨC
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: previewUrl }));

    setUploading(true);
    try {
      // ✅ SỬA: Hứng object trả về (url và publicId) thay vì chỉ string
      const res = await apiUpload.uploadProductImage(file);

      setForm((prev) => ({
        ...prev,
        image: res.url,           // Hiển thị ảnh
        imagePublicId: res.publicId // Lưu ID để lưu vào DB
      }));
      toast.success("✅ Upload ảnh mới thành công");
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.name || form.name.length < 3) return toast.error("Tên sản phẩm phải từ 3 ký tự trở lên");
    if (!form.categoryId || !form.brandId) return toast.error("Vui lòng điền đủ thông tin bắt buộc");

    const sPrice = Number(form.salePrice);
    const dPrice = Number(form.discountPrice);
    const cPrice = Number(form.costPrice);

    // 1. Kiểm tra Giá niêm yết vs Giá nhập (nếu có giá nhập)
    if (cPrice > 0 && sPrice < cPrice) {
      console.warn("Validation failed: SalePrice < CostPrice", { sPrice, cPrice });
      return toast.error(`Giá niêm yết (${sPrice.toLocaleString()}đ) không được thấp hơn giá nhập (${cPrice.toLocaleString()}đ)`);
    }

    // 2. Kiểm tra Giá khuyến mại vs Giá niêm yết
    if (isDiscounted && dPrice >= sPrice) {
      console.warn("Validation failed: DiscountPrice >= SalePrice", { dPrice, sPrice });
      return toast.error("Giá khuyến mại phải nhỏ hơn giá niêm yết");
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        image: form.image,
        imagePublicId: form.imagePublicId, // ✅ THÊM: Gửi publicId về backend
        description: form.description,
        detail: form.detail,
        salePrice: Number(form.salePrice),
        discountPrice: isDiscounted && form.discountPrice ? Number(form.discountPrice) : null,
        status: Number(form.status),
        costPrice: form.costPrice, // Giữ nguyên giá nhập hiện tại
        qty: form.qty, // Giữ nguyên số lượng hiện tại
        // ✅ THÊM SaleType fields
        saleType: form.saleType,
        baseWeight: form.saleType === "WEIGHT" && form.baseWeight ? Number(form.baseWeight) : null,
        unitLabel: form.unitLabel || null,
      };

      await apiProductAdmin.update(id, payload);

      toast.success("✅ Cập nhật sản phẩm thành công");
      setTimeout(() => navigate("/admin/products"), 500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
      Đang tải dữ liệu...
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">

        {/* === HEADER === */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaEdit className="text-indigo-600" /> Chỉnh Sửa Sản Phẩm
            </h1>
            <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin chi tiết cho sản phẩm #{id}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FaArrowLeft size={14} /> Quay lại
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
            >
              {submitting ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <><FaSave /> Lưu Thay Đổi</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* === CỘT TRÁI: THÔNG TIN CHÍNH === */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card 1: Thông tin cơ bản */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin cơ bản</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chi tiết sản phẩm</label>
                  <Editor
                    apiKey="08g2njx5rtkfad5tsq5p91c0bos9siwvip1tcsinbsduna70"
                    value={form.detail}
                    init={{
                      height: 400,
                      menubar: true,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic underline | " +
                        "alignleft aligncenter alignright | bullist numlist outdent indent | link image media | code fullscreen",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Giá & Khuyến mại */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaTag className="text-indigo-500" /> Giá bán & Khuyến mại
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Giá Niêm Yết */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá niêm yết (VNĐ) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="salePrice"
                    value={form.salePrice}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-800 ${form.costPrice > 0 && Number(form.salePrice) < form.costPrice ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    required
                  />
                  {form.costPrice > 0 && Number(form.salePrice) < form.costPrice && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      ⚠️ Giá bán đang thấp hơn giá nhập ({form.costPrice.toLocaleString()}đ)
                    </p>
                  )}
                </div>

                {/* Checkbox Toggle */}
                <div className="flex flex-col justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="discountToggleEdit"
                      checked={isDiscounted}
                      onChange={handleToggleDiscount}
                      className="w-5 h-5 text-indigo-600 rounded cursor-pointer focus:ring-indigo-500"
                    />
                    <label htmlFor="discountToggleEdit" className="font-medium text-gray-700 cursor-pointer select-none">
                      Đang có khuyến mại?
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-8">Tích vào để nhập giá ưu đãi.</p>
                </div>

                {/* Giá Khuyến Mại (Ẩn/Hiện) */}
                {isDiscounted && (
                  <div className="md:col-span-2 animate-fadeIn bg-red-50 p-4 rounded-lg border border-red-100 flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-red-600 mb-1">Giá khuyến mại (VNĐ)</label>
                      <input
                        type="number"
                        name="discountPrice"
                        value={form.discountPrice}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-200 text-red-700 font-bold bg-white"
                        placeholder="Nhập giá ưu đãi..."
                      />
                    </div>

                    {/* Badge % Giảm */}
                    {Number(form.discountPrice) > 0 && Number(form.salePrice) > 0 && (
                      <div className="flex flex-col items-center justify-center bg-white p-2 rounded-lg shadow-sm border border-red-200 h-full px-4">
                        <FaPercentage className="text-red-500 mb-1" />
                        <span className="text-xl font-black text-red-600">
                          -{Math.round(100 - (form.discountPrice / form.salePrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === CỘT PHẢI: CẤU HÌNH & ẢNH === */}
          <div className="space-y-6">

            {/* Card 3: Phân loại & Trạng thái */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaLayerGroup className="text-indigo-500" /> Phân loại
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories
                      .filter(c => c.parentId !== null) // ✅ CHỈ HIỆN DANH MỤC CON
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu <span className="text-red-500">*</span></label>
                  <select
                    name="brandId"
                    value={form.brandId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none font-medium ${Number(form.status) === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Ẩn / Nháp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ✅ Card: Cấu hình Bán hàng (SaleType) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBoxOpen className="text-indigo-500" /> Cấu hình bán hàng
              </h3>

              <div className="space-y-4">
                {/* Loại bán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại bán <span className="text-red-500">*</span></label>
                  <select
                    name="saleType"
                    value={form.saleType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                    required
                  >
                    <option value="UNIT">Theo đơn vị (gói/chai/thùng/...)</option>
                    <option value="WEIGHT">Theo cân (gram)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {form.saleType === "WEIGHT"
                      ? "📊 Kho lưu gram, bán theo phần/khúc"
                      : "📦 Kho lưu số lượng đơn vị"}
                  </p>
                </div>

                {/* Base Weight - chỉ hiện khi WEIGHT */}
                {form.saleType === "WEIGHT" && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Quy cách (gram / phần) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="baseWeight"
                      value={form.baseWeight}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Ví dụ: 300"
                      min="1"
                      required={form.saleType === "WEIGHT"}
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Ví dụ: Thịt 300g/phần → nhập <strong>300</strong>
                    </p>
                  </div>
                )}

                {/* Unit Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị hiển thị</label>
                  <input
                    type="text"
                    name="unitLabel"
                    value={form.unitLabel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder={form.saleType === "WEIGHT" ? "phần, khúc, ..." : "gói, chai, thùng, ..."}
                    maxLength="20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.saleType === "WEIGHT"
                      ? "Ví dụ: phần, khúc, miếng"
                      : "Ví dụ: gói, chai, thùng, hộp, lon"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Kho hàng (Read-only) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBoxOpen className="text-indigo-500" /> Tồn kho
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                  <span className="block text-xs text-blue-600 font-bold uppercase">Tồn kho</span>
                  <span className="text-2xl font-bold text-blue-800">{form.qty}</span>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 text-center">
                  <span className="block text-xs text-orange-600 font-bold uppercase">Giá nhập (VNĐ)</span>
                  <span className={`block font-bold mt-1 ${form.costPrice ? 'text-2xl text-orange-800' : 'text-xs text-orange-500 italic'}`}>
                    {form.costPrice
                      ? new Intl.NumberFormat("vi-VN").format(form.costPrice)
                      : "Sản phẩm chưa được nhập kho"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Giá nhập và tồn kho sẽ được cập nhật tự động khi thực hiện phiếu nhập hàng.</p>
            </div>

            {/* Card 5: Ảnh sản phẩm */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCamera className="text-indigo-500" /> Ảnh sản phẩm
              </h3>

              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FaCamera size={40} className="mx-auto mb-2 opacity-50" />
                      <span className="text-sm">Tải ảnh lên</span>
                    </div>
                  )}

                  <label className="absolute inset-0 cursor-pointer hover:bg-black/10 flex items-center justify-center transition-all">
                    <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                    <span className="bg-white text-indigo-700 px-4 py-2 rounded shadow-lg text-sm font-bold">
                      {form.image ? "Thay đổi" : "Chọn ảnh"}
                    </span>
                  </label>

                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent mb-2"></div>
                        <span className="text-xs font-semibold text-indigo-600">Đang tải lên...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default EditProduct;