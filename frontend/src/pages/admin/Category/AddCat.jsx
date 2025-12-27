import apiCategory from "../../../api/apiCategory";
import apiUpload from "../../../api/apiUpload";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCat = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ STATE CHUẨN DTO SPRING
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: null,
    status: 1
  });

  /* ===============================
      FETCH PARENT CATEGORIES
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
      SLUG GENERATOR
  =============================== */
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

  /* ===============================
      HANDLE CHANGE (FIX QUAN TRỌNG)
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          name === "parentId"
            ? value === "" ? null : Number(value) // ✅ ÉP KIỂU TẠI ĐÂY
            : value
      };

      if (name === "name") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  /* ===============================
      SUBMIT (JSON)
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        status: Number(formData.status),
        parentId: formData.parentId // ✅ ĐÃ LÀ number | null
      };

      console.log("PAYLOAD GỬI LÊN:", payload);

      await apiCategory.create(payload);

      toast.success("✅ Thêm danh mục thành công!");
      setTimeout(() => navigate("/admin/categories"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Thêm danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* HEADER */}
        <div className="p-6 flex justify-between items-center border-b">
          <h3 className="text-2xl font-semibold">Thêm danh mục</h3>
          <Link
            to="/admin/categories"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            ← Về danh sách
          </Link>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* THÔNG TIN */}
              <div className="bg-gray-50 p-6 rounded">
                <label className="block mb-2">Tên danh mục</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 mb-4"
                  required
                />

                <label className="block mb-2">Slug</label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full border p-2 mb-4 bg-gray-100"
                />

                <label className="block mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border p-2 mb-4"
                />

                <label className="block mb-2">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border p-2"
                >
                  <option value={1}>Xuất bản</option>
                  <option value={0}>Không xuất bản</option>
                </select>
              </div>

              {/* PHÂN LOẠI */}
              <div className="bg-indigo-50 p-6 rounded">
                <label className="block mb-2">Danh mục cha</label>
                <select
                  name="parentId"
                  value={formData.parentId ?? ""}
                  onChange={handleChange}
                  className="w-full border p-2"
                >
                  <option value="">Danh mục gốc</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-indigo-600 text-white py-2 rounded"
                >
                  {loading ? "Đang thêm..." : "Thêm danh mục"}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default AddCat;
