import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiCategory from "../../../api/apiCategory";
import { imageURL } from "../../../api/config";

const EditCat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Thêm trường slug vào state khởi tạo
  const [category, setCategory] = useState({
    name: "",
    slug: "", 
    description: "",
    status: 1,
    parentId: null,
    image: ""
  });

  const [preview, setPreview] = useState(null);

  /* ===============================
      FETCH CATEGORY
  =============================== */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await apiCategory.getCategoryById(id);

        // 2. Cập nhật slug từ dữ liệu server trả về
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
            ? `${imageURL}/category/${data.image}?v=${Date.now()}`
            : null
        );
      } catch (err) {
        alert("❌ Không thể tải danh mục");
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
        alert("❌ Không thể tải danh mục cha");
      }
    };
    fetchCategories();
  }, []);

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
      SUBMIT UPDATE (JSON)
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 3. Gửi kèm slug trong payload để Backend không set thành null
      const payload = {
        name: category.name,
        slug: category.slug, 
        description: category.description,
        status: Number(category.status),
        parentId: category.parentId ? Number(category.parentId) : null,
        image: category.image
      };

      await apiCategory.update(id, payload);

      alert("✅ Cập nhật danh mục thành công");
      // const page = localStorage.getItem("currentCategoryPage") || 1;
      // navigate(`/admin/categories/${page}`);
        navigate(`/admin/categories`);
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;

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

      {/* Form */}
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

              {/* Tùy chọn: Input Slug (có thể ẩn hoặc để readonly nếu không muốn sửa) */}
              <label className="block mb-2">Slug (Đường dẫn tĩnh)</label>
              <input
                name="slug"
                value={category.slug}
                onChange={handleChange}
                className="w-full border p-2 mb-4 bg-gray-100"
                readOnly // Để readOnly nếu bạn không muốn người dùng sửa slug thủ công
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
                  <option value="">Danh mục cha</option>
                  {categories
                    .filter(cat => cat.id !== Number(id))
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-gray-50 p-6 rounded">
                <img
                  src={preview || "https://via.placeholder.com/150"}
                  className="w-40 h-32 object-cover mx-auto mb-4"
                  alt=""
                />

                <button
                  type="submit"
                  disabled={loading}
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