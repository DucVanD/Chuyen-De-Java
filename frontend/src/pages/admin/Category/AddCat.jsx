import apiCategoryAdmin from "../../../api/admin/apiCategoryAdmin";
import apiUpload from "../../../api/apiUpload";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCat = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ STATE CHUẨN DTO SPRING
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: null,
    status: 1,
    image: "",
    imagePublicId: ""
  });

  /* ===============================
      FETCH PARENT CATEGORIES
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
  }, []);

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


      return updated;
    });
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

      setFormData((prev) => ({
        ...prev,
        image: res.url,
        imagePublicId: res.publicId
      }));

      toast.success("✅ Đã tải ảnh lên");
    } catch {
      toast.error("❌ Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  /* ===============================
      SUBMIT (JSON)
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!formData.name.trim()) {
      toast.error("❌ Tên danh mục không được để trống");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        // slug sẽ tự động sinh ở backend
        description: formData.description,
        status: Number(formData.status),
        parentId: formData.parentId,
        image: formData.image,
        imagePublicId: formData.imagePublicId
      };

      console.log("PAYLOAD GỬI LÊN:", payload);

      await apiCategoryAdmin.create(payload);

      toast.success("✅ Thêm danh mục thành công!");
      setTimeout(() => navigate("/admin/categories"), 1000);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Thêm danh mục thất bại";
      toast.error(`❌ ${message}`);
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

                {/* Slug tự động sinh ở backend, không cần hiển thị */}

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
              </div>

              {/* ✅ UPLOAD ẢNH */}
              <div className="bg-gray-50 p-6 rounded mt-6">
                <label className="block mb-2 font-medium">Hình ảnh</label>

                <div className="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-gray-400">Chưa có ảnh</span>
                  )}

                  <label className="absolute inset-0 cursor-pointer hover:bg-black/10 flex items-center justify-center">
                    <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                    <span className="bg-white px-4 py-2 rounded shadow text-sm font-medium">
                      {formData.image ? "Thay đổi" : "Chọn ảnh"}
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
