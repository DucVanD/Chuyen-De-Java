import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiCategory from "../../../api/apiCategory";
import { imageURL } from "../../../api/config";
import { FaArrowLeft, FaEdit, FaLayerGroup, FaInfoCircle, FaLink, FaImage, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

const EditCat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
    status: 1,
    parentId: null,
    image: ""
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const data = await apiCategory.getCategoryById(id);
        setCategory({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          status: data.status,
          parentId: data.parentId,
          image: data.image
        });

        setPreview(
          data.image
            ? `${imageURL}/category/${data.image}`
            : null
        );
      } catch (err) {
        toast.error("❌ Không thể tải thông tin danh mục");
        navigate("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiCategory.getAll();
        setCategories(data);
      } catch {
        console.error("Lỗi khi tải danh sách cha");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value === "" ? null : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: category.name,
        slug: category.slug,
        description: category.description,
        status: Number(category.status),
        parentId: category.parentId ? Number(category.parentId) : null,
        image: category.image
      };

      await apiCategory.update(id, payload);
      toast.success("✅ Cập nhật danh mục thành công");
      navigate(`/admin/categories`);
    } catch (err) {
      toast.error("❌ Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Đang tải dữ liệu danh mục...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaEdit className="text-indigo-600" /> Chỉnh sửa danh mục
          </h3>
          <p className="text-slate-500 text-sm mt-1">Cập nhật thông tin và cấu trúc cho nhóm sản phẩm</p>
        </div>
        <Link
          to="/admin/categories"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Về danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg border-b border-slate-50 pb-4">
              <FaInfoCircle />
              <h4>Thông tin cơ bản</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên danh mục</label>
                <input
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Đường dẫn (Slug)</label>
                <div className="relative">
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    name="slug"
                    value={category.slug}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm text-slate-500 outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Structure & Display Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <FaLayerGroup />
              <h4>Phân cấp</h4>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Danh mục cha</label>
              <select
                name="parentId"
                value={category.parentId ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white font-medium text-slate-700"
              >
                <option value="">-- Danh mục gốc --</option>
                {categories
                  .filter(cat => cat.id !== Number(id))
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trạng thái</label>
              <select
                name="status"
                value={category.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none font-bold transition-all ${category.status == 1 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}
              >
                <option value={1}>✓ Công khai</option>
                <option value={0}>✕ Tạm ẩn</option>
              </select>
            </div>
          </div>

          {/* Image Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <FaImage />
              <h4>Hình ảnh</h4>
            </div>
            <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Category" className="w-full h-full object-cover" />
              ) : (
                <FaImage className="text-slate-200 text-5xl" />
              )}
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

export default EditCat;