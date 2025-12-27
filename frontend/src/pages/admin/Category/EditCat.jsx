import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCategory from "../../../api/apiCategory";
import apiUpload from "../../../api/apiUpload";

const EditCat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
    status: 1,
    parentId: null,
    image: "" // ✅ URL cloudinary
  });

  /* ===============================
      FETCH CATEGORY DETAIL
  =============================== */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await apiCategory.getCategoryById(id);
        setCategory({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          status: data.status,
          parentId: data.parentId,
          image: data.image || ""
        });
      } catch (err) {
        toast.error("❌ Không thể tải danh mục");
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
        const data = await apiCategory.getAll();
        setCategories(data);
      } catch {
        toast.error("❌ Không thể tải danh mục cha");
      }
    };
    fetchCategories();
  }, []);

  /* ===============================
      HANDLE CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value === "" ? null : value
    }));
  };

  /* ===============================
      UPLOAD IMAGE (OPTIONAL)
  =============================== */
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await apiUpload.uploadCategoryImage(file);
      setCategory((prev) => ({
        ...prev,
        image: imageUrl
      }));
      toast.success("✅ Upload ảnh mới thành công");
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
      SUBMIT UPDATE
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: category.name,
        slug: category.slug,
        description: category.description,
        status: Number(category.status),
        parentId: category.parentId ? Number(category.parentId) : null,
        image: category.image // ✅ giữ cũ hoặc URL mới
      };

      await apiCategory.update(id, payload);

      toast.success("✅ Cập nhật danh mục thành công");
      setTimeout(() => navigate("/admin/categories"), 1000);
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
      {/* HEADER */}
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

            {/* INFO */}
            <div className="bg-gray-50 p-6 rounded">
              <label className="block mb-2">Tên danh mục</label>
              <input
                name="name"
                value={category.name}
                onChange={handleChange}
                className="w-full border p-2 mb-4"
              />

              <label className="block mb-2">Slug</label>
              <input
                name="slug"
                value={category.slug}
                readOnly
                className="w-full border p-2 mb-4 bg-gray-100"
              />

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

            {/* PARENT + IMAGE */}
            <div>
              <div className="bg-indigo-50 p-6 rounded mb-6">
                <label className="block mb-2">Danh mục cha</label>
                <select
                  name="parentId"
                  value={category.parentId ?? ""}
                  onChange={handleChange}
                  className="w-full border p-2"
                >
                  <option value="">Danh mục cha</option>
                  {categories
                    .filter((cat) => cat.id !== Number(id))
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-gray-50 p-6 rounded">
                <img
                  src={category.image || "https://placehold.co/200x150"}
                  className="w-40 h-32 object-cover mx-auto mb-4 rounded border"
                  alt=""
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="w-full border p-2 mb-4"
                />

                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full bg-indigo-600 text-white py-2 rounded"
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
