import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import apiProduct from "../../../api/apiProduct";
import apiCategory from "../../../api/apiCategory";
import apiBrand from "../../../api/apiBrand";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const brand = await apiBrand.getAll();
      setBrands(brand);
      const category = await apiCategory.getAll();
      setCategories(category);
    } catch (err) {
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);


  console.log("data", categories, "asas", brands)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId || !form.brandId) {
      toast.error("Vui lòng chọn danh mục và thương hiệu");
      return;
    }

    await apiProduct.create(form);
    toast.success("Thêm sản phẩm thành công");
    navigate("/admin/products");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* Tên */}
        <div className="col-span-2">
          <label className="block mb-1">Tên sản phẩm</label>
          <input
            name="name"
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
        {/* <div>
          <label className="block mb-1">Giá nhập</label>
          <input
            type="number"
            name="costPrice"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div> */}

        <div>
          <label className="block mb-1">Giá bán</label>
          <input
            type="number"
            name="salePrice"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Giá khuyến mãi</label>
          <input
            type="number"
            name="discountPrice"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block mb-1">Trạng thái</label>
          <select
            name="status"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        {/* Mô tả */}
        <div className="col-span-2">
          <label className="block mb-1">Mô tả ngắn</label>
          <textarea
            name="description"
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
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={5}
          />
        </div>

        {/* Submit */}
        <div className="col-span-2 text-right">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Lưu sản phẩm
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
