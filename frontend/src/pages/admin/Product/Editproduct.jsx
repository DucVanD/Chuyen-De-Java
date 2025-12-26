import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import apiProduct from "../../../api/apiProduct";
import apiCategory from "../../../api/apiCategory";
import apiBrand from "../../../api/apiBrand";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    brandId: "",
    image: "",
    description: "",
    detail: "",
    // costPrice: "",
    salePrice: "",
    discountPrice: "",
    status: 1,
   
  });

  useEffect(() => {
  const fetchData = async () => {
    const product = await apiProduct.getById(id);
    setForm(product);

    const cateRes = await apiCategory.getAll();
    setCategories(cateRes);

    const brandRes = await apiBrand.getAll();
    setBrands(brandRes);
  };

  fetchData();
}, [id]);

console.log("askj",categories)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiProduct.update(id, form);
    toast.success("Cập nhật sản phẩm thành công");
    navigate("/admin/products");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sửa sản phẩm</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* Tên */}
        <div className="col-span-2">
          <label className="block mb-1">Tên sản phẩm</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Slug */}
        <div className="col-span-2">
          <label className="block mb-1">Slug</label>
          <input
            name="slug"
            value={form.slug || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block mb-1">Danh mục</label>
          <select
            name="categoryId"
            value={form.categoryId || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Thương hiệu */}
        <div>
          <label className="block mb-1">Thương hiệu</label>
          <select
            name="brandId"
            value={form.brandId || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands?.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Giá */}
        <div>
          <label className="block mb-1">Giá nhập</label>
          <input
            type="number"
            name="costPrice"
            value={form.costPrice || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Giá bán</label>
          <input
            type="number"
            name="salePrice"
            value={form.salePrice || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Giá khuyến mãi</label>
          <input
            type="number"
            name="discountPrice"
            value={form.discountPrice || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block mb-1">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        {/* Tồn kho – CHỈ ĐỌC */}
        <div>
          <label className="block mb-1">Tồn kho</label>
          <input
            value={form.qty}
            disabled
            className="w-full border p-2 bg-gray-100 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Đang giữ</label>
          <input
            value={form.lockedQty}
            disabled
            className="w-full border p-2 bg-gray-100 rounded"
          />
        </div>

        {/* Mô tả */}
        <div className="col-span-2">
          <label className="block mb-1">Mô tả ngắn</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        {/* Chi tiết */}
        <div className="col-span-2">
          <label className="block mb-1">Chi tiết</label>
          <textarea
            name="detail"
            value={form.detail || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={5}
          />
        </div>

        {/* Submit */}
        <div className="col-span-2 text-right">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Cập nhật
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProduct;
