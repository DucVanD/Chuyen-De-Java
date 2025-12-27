import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave, FaBoxOpen, FaCamera, FaPercentage, FaTag, FaLayerGroup } from "react-icons/fa";

import apiProduct from "../../../api/apiProduct";
import apiCategory from "../../../api/apiCategory";
import apiBrand from "../../../api/apiBrand";
import apiUpload from "../../../api/apiUpload";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Dữ liệu danh mục/thương hiệu
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // State quản lý checkbox khuyến mại
  const [isDiscounted, setIsDiscounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    brandId: "",
    image: "", 
    imagePublicId: "", // ✅ 1. THÊM DÒNG NÀY
    description: "",
    detail: "",
    salePrice: "",
    discountPrice: "",
    status: 1,
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, brs] = await Promise.all([
          apiCategory.getAll(),
          apiBrand.getAll(),
        ]);
        setCategories(cats || []);
        setBrands(brs || []);
      } catch {
        toast.error("Lỗi kết nối dữ liệu danh mục/thương hiệu");
      }
    };
    fetchData();
  }, []);

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
      return updated;
    });
  };

  // Toggle Checkbox Khuyến Mại
  const handleToggleDiscount = (e) => {
    const checked = e.target.checked;
    setIsDiscounted(checked);
    if (!checked) {
      setForm((prev) => ({ ...prev, discountPrice: "" }));
    }
  };

  // Upload Ảnh
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // ✅ 2. SỬA ĐOẠN NÀY: Hứng object res gồm url và publicId
      const res = await apiUpload.uploadProductImage(file);
      
      setForm((prev) => ({ 
        ...prev, 
        image: res.url,            // Link ảnh để hiển thị
        imagePublicId: res.publicId // ID để lưu vào DB
      }));
      
      toast.success("Đã tải ảnh lên");
    } catch {
      toast.error("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.categoryId || !form.brandId) return toast.error("Vui lòng chọn Danh mục & Thương hiệu");
    if (!form.image) return toast.error("Vui lòng tải ảnh sản phẩm");
    if (isDiscounted && Number(form.discountPrice) >= Number(form.salePrice)) {
      return toast.error("Giá khuyến mại phải nhỏ hơn giá gốc");
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        salePrice: Number(form.salePrice),
        discountPrice: isDiscounted && form.discountPrice ? Number(form.discountPrice) : null, 
        status: Number(form.status),
        imagePublicId: form.imagePublicId // ✅ 3. THÊM DÒNG NÀY (Gửi ID lên Server)
      };

      await apiProduct.create(payload);
      toast.success("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Thêm sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        
        {/* === HEADER === */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaBoxOpen className="text-indigo-600" /> Thêm Sản Phẩm Mới
            </h1>
            <p className="text-sm text-gray-500 mt-1">Điền thông tin sản phẩm đầy đủ bên dưới</p>
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
              disabled={loading || uploading}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
            >
              {loading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"/> : <><FaSave /> Lưu Sản Phẩm</>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* === CỘT TRÁI: THÔNG TIN CHUNG === */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card: Thông tin cơ bản */}
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
                    placeholder="Nhập tên sản phẩm..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn (Slug)</label>
                  <input
                    name="slug"
                    value={form.slug}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    placeholder="Mô tả sơ lược về sản phẩm..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chi tiết sản phẩm</label>
                  <textarea
                    name="detail"
                    value={form.detail}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Thông số kỹ thuật, bài viết chi tiết..."
                  />
                </div>
              </div>
            </div>
            
            {/* Card: Giá bán (Có logic giảm giá) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaTag className="text-indigo-500" /> Giá bán & Khuyến mại
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Giá Gốc */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá niêm yết (VNĐ) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="salePrice"
                    value={form.salePrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-800"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* Checkbox Toggle */}
                <div className="flex flex-col justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="discountToggle"
                        checked={isDiscounted}
                        onChange={handleToggleDiscount}
                        className="w-5 h-5 text-indigo-600 rounded cursor-pointer focus:ring-indigo-500"
                      />
                      <label htmlFor="discountToggle" className="font-medium text-gray-700 cursor-pointer select-none">
                        Bật giá khuyến mại?
                      </label>
                   </div>
                   <p className="text-xs text-gray-500 mt-1 ml-8">Tích vào để nhập giá sau khi giảm.</p>
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
                          placeholder="Nhập giá sau giảm..."
                        />
                      </div>
                      
                      {/* Tính % Giảm */}
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
            
            {/* Card: Phân loại */}
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
                    {categories?.map((c) => (
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
                    {brands?.map((b) => (
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none font-medium ${
                      Number(form.status) === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Ẩn / Nháp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card: Ảnh đại diện */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                 <FaCamera className="text-indigo-500" /> Ảnh sản phẩm
              </h3>

              <div className="flex flex-col items-center">
                <div className="relative group w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-colors">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FaCamera size={40} className="mx-auto mb-2 opacity-50" />
                      <span className="text-sm">Tải ảnh lên</span>
                    </div>
                  )}
                  
                  <label className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-indigo-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                      {form.image ? "Thay đổi ảnh" : "Chọn ảnh"}
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
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Hỗ trợ: JPG, PNG, WEBP. <br/> Kích thước tối ưu: 600x600px.
                </p>
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

export default AddProduct;