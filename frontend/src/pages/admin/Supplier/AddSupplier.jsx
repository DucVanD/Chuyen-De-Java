import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiSupplier from "../../../api/apiSupplier";

const AddSupplier = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiSupplier.create(form);
      toast.success("Thêm nhà cung cấp thành công");
      navigate("/admin/suppliers");
    } catch {
      toast.error("Thêm thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Thêm nhà cung cấp</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Tên nhà cung cấp"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Số điện thoại"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Địa chỉ"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <p className="text-sm text-gray-500">
          Mã nhà cung cấp sẽ được tạo tự động
        </p>

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;
