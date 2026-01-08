import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaImage, FaList, FaTag, FaInfoCircle, FaDollarSign, FaBoxOpen } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import apiProduct from "../../../api/apiProduct";
import apiCategory from "../../../api/apiCategory";
import apiBrand from "../../../api/apiBrand";
import { imageURL } from "../../../api/config";
import { toast } from "react-toastify";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const savedPage = localStorage.getItem("currentProductPage") || 1;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    detail: "",
    price_root: "",
    price_sale: "",
    qty: 1,
    category_id: "",
    brand_id: "",
    status: 1,
  });

  useEffect(() => {
    (async () => {
      try {
        const [resCat, resBrand] = await Promise.all([
          apiCategory.getAll(),
          apiBrand.getAll(),
        ]);
        setCategories(resCat.data?.data || []);
        setBrands(resBrand.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi load category/brand:", err);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      try {
        const res = await apiProduct.getProductId(id);
        let product = res.data?.data || res.data;

        if (product) {
          setFormData({
            name: product.name || "",
            description: product.description || "",
            detail: product.detail || "",
            price_root: product.price_root || "",
            price_sale: product.price_sale ?? 0,
            qty: product.qty || 1,
            category_id: product.category_id || "",
            brand_id: product.brand_id || "",
            status: product.status ?? 1,
          });

          if (product.thumbnail) {
            setThumbPreview(`${imageURL}/product/${product.thumbnail}`);
          }
        } else {
          toast.error("Không tìm thấy sản phẩm");
          navigate("/admin/products");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        toast.error("Không load được dữ liệu sản phẩm");
        navigate("/admin/products");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      if (thumbPreview && thumbPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbPreview);
      }
    };
  }, [thumbPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file || null);
    setThumbPreview(file ? URL.createObjectURL(file) : thumbPreview);
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, detail: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      const numericKeys = ["price_root", "price_sale", "qty"];

      Object.keys(formData).forEach((key) => {
        let value = formData[key];
        if (typeof value === "string" && numericKeys.includes(key)) {
          value = value.replace(/[, ]+/g, "");
        }
        data.append(key, value ?? "");
      });

      if (thumbnail) data.append("thumbnail", thumbnail);

      const res = await apiProduct.EditProduct(id, data);
      toast.success(res.message || "✅ Cập nhật sản phẩm thành công!");
      setTimeout(() => navigate(`/admin/products/${savedPage}`), 1500);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Chỉnh sửa sản phẩm</h3>
          <p className="text-slate-500 text-sm mt-1">Cập nhật thông tin chi tiết và giá bán của sản phẩm</p>
        </div>
        <Link
          to={`/admin/products/${savedPage}`}
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Quay lại danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg mb-2">
              <FaInfoCircle />
              <h4>Thông tin cơ bản</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  placeholder="Ví dụ: iPhone 15 Pro Max 256GB"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                  placeholder="Tóm tắt đặc điểm nổi bật..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Chi tiết sản phẩm</label>
                <div className="rounded-xl overflow-hidden border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                  <Editor
                    apiKey="08g2njx5rtkfad5tsq5p91c0bos9siwvip1tcsinbsduna70"
                    value={formData.detail}
                    init={{
                      height: 450,
                      menubar: false,
                      plugins: ["advlist", "autolink", "lists", "link", "image", "preview", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "help", "wordcount"],
                      toolbar: "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image table | code fullscreen",
                      content_style: "body { font-family:Inter,sans-serif; font-size:14px; color: #334155 }",
                      skin: "oxide",
                      content_css: "default"
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg mb-6">
              <FaDollarSign />
              <h4>Giá & Kho hàng</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Giá niêm yết</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price_root"
                    value={formData.price_root}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    placeholder="0"
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₫</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Giá khuyến mãi</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price_sale"
                    value={formData.price_sale}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-emerald-600 font-semibold"
                    placeholder="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₫</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Số lượng kho</label>
                <div className="relative">
                  <input
                    type="number"
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    placeholder="1"
                    required
                  />
                  <FaBoxOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="space-y-6">
          {/* Classification Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <FaList />
              <h4>Phân loại</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Danh mục</label>
                <div className="relative">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <FaTag size={12} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thương hiệu</label>
                <div className="relative">
                  <select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white"
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((br) => (
                      <option key={br.id} value={br.id}>{br.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <FaTag size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <FaImage />
              <h4>Hình ảnh</h4>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all duration-200 overflow-hidden group">
                  {thumbPreview ? (
                    <div className="relative w-full h-full">
                      <img src={thumbPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-bold bg-indigo-600 px-3 py-1 rounded-full shadow-lg">Thay đổi ảnh</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 font-medium">Click để chọn ảnh</p>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trạng thái hiển thị</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-semibold ${formData.status == 1 ? "text-indigo-600 bg-indigo-50/30" : "text-slate-500 bg-slate-50"}`}
                >
                  <option value="1">✓ Xuất bản công khai</option>
                  <option value="0">✕ Tạm ẩn / Lưu nháp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Đang lưu dữ liệu...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
