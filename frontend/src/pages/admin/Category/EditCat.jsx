import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCategoryAdmin from "../../../api/admin/apiCategoryAdmin";
import apiUpload from "../../../api/apiUpload";

const EditCat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState({
    name: "",
    description: "",
    status: 1,
    parentId: null,
    image: "",
    imagePublicId: ""
  });

  const [preview, setPreview] = useState(null);

  /* ===============================
      FETCH CATEGORY
  =============================== */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Gọi hàm getById mới thêm trong apiCategoryAdmin
        const data = await apiCategoryAdmin.getById(id);

        setCategory({
          name: data.name,
          description: data.description || "",
          status: data.status,
          parentId: data.parentId,
          image: data.image,
          imagePublicId: data.imagePublicId
        });

        setPreview(data.image || null);
      } catch (err) {
        toast.error("❌ Không thể tải danh mục"); // Sửa alert thành toast cho đẹp
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  /* ===============================
      FETCH ALL CATEGORIES
  =============================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiCategoryAdmin.getAll();
        setCategories(data);
      } catch {
        toast.error("❌ Không thể tải danh mục cha");
      }
    };
    fetchCategories();
  }, [id]);

  /* ===============================
      HELPER: FIND ALL DESCENDANTS
  =============================== */
  const getDescendants = (allCats, parentId) => {
    let descendants = [];
    const children = allCats.filter((c) => c.parentId === parentId);

    children.forEach((child) => {
      descendants.push(child.id);
      descendants = [...descendants, ...getDescendants(allCats, child.id)];
    });

    return descendants;
  };

  // Filter list cha: Bỏ chính nó & tất cả con cháu
  const validParents = categories.filter((cat) => {
    // 1. Bỏ chính nó
    if (cat.id === Number(id)) return false;

    // 2. Bỏ tất cả con cháu (đệ quy)
    const descendants = getDescendants(categories, Number(id));
    if (descendants.includes(cat.id)) return false;

    return true;
  });

  /* ===============================
      HANDLE CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value === "" ? null : value
    }));
  };

  /* ===============================
      UPLOAD IMAGE
  =============================== */
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await apiUpload.uploadCategoryImage(file);

      setCategory(prev => ({
        ...prev,
        image: res.url,
        imagePublicId: res.publicId
      }));
      setPreview(res.url);

      toast.success("✅ Đã tải ảnh lên");
    } catch {
      toast.error("❌ Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
      SUBMIT UPDATE (JSON)
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: category.name,
        // slug tự động sinh ở backend
        description: category.description,
        status: Number(category.status),
        parentId: category.parentId ? Number(category.parentId) : null,
        image: category.image,
        imagePublicId: category.imagePublicId
      };

      await apiCategoryAdmin.update(id, payload); // Sửa API call

      toast.success("✅ Cập nhật danh mục thành công");
      navigate(`/admin/categories`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-2xl font-semibold">Chỉnh sửa danh mục</h3>
        <button
          onClick={() => navigate("/admin/categories")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ← Về danh sách
        </button>
      </div>

      {/* FORM */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Thông tin cơ bản */}
            <div className="bg-gray-50 p-6 rounded">
              <label className="block mb-2">Tên danh mục</label>
              <input
                name="name"
                value={category.name}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
              />

              {/* Slug tự động sinh ở backend */}

              <label className="block mb-2">Mô tả</label>
              <textarea
                name="description"
                value={category.description}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
              />

              <label className="block mb-2">Trạng thái</label>
              <select
                name="status"
                value={category.status}
                onChange={handleChange}
                className="w-full border p-2"
              >
                <option value={1}>Xuất bản</option>
                <option value={0}>Không xuất bản</option>
              </select>
            </div>

            {/* Phân loại & hình ảnh */}
            <div>
              <div className="bg-indigo-50 p-6 rounded mb-6">
                <label className="block mb-2">Danh mục cha</label>
                <select
                  name="parentId"
                  value={category.parentId ?? ""}
                  onChange={handleChange}
                  className="w-full border p-2"
                >
                  <option value="">-- Chọn danh mục cha --</option>
                  {validParents
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-gray-50 p-6 rounded">
                <label className="block mb-2 font-medium">Hình ảnh</label>

                <div className="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-contain p-2" alt="Category" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Chưa có ảnh
                    </div>
                  )}

                  <label className="absolute inset-0 cursor-pointer hover:bg-black/10 flex items-center justify-center">
                    <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                    <span className="bg-white px-4 py-2 rounded shadow text-sm font-medium">
                      {preview ? "Thay đổi ảnh" : "Chọn ảnh"}
                    </span>
                  </label>

                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCat;