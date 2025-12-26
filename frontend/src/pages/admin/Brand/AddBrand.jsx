import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiBrand from "../../../api/apiBrand";

// ✅ Hàm tạo slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")                 // tách dấu
    .replace(/[\u0300-\u036f]/g, "")  // xóa dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const AddBrand = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    country: "",
  });

  // ✅ name đổi → slug tự đổi
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm({
        ...form,
        name: value,
        slug: generateSlug(value),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiBrand.create(form);
      toast.success("Thêm thương hiệu thành công");
      navigate("/admin/brands");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Thêm thương hiệu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          name="name"
          placeholder="Tên thương hiệu"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* SLUG */}
        <input
          name="slug"
          placeholder="Slug (tự sinh)"
          className="w-full border p-2 rounded bg-gray-100"
          value={form.slug}
          onChange={handleChange}
          required
        />

        {/* IMAGE */}
        <input
          name="image"
          placeholder="Image URL"
          className="w-full border p-2 rounded"
          value={form.image}
          onChange={handleChange}
        />

        {/* COUNTRY */}
        <input
          name="country"
          placeholder="Quốc gia"
          className="w-full border p-2 rounded"
          value={form.country}
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Mô tả"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={handleChange}
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default AddBrand;
