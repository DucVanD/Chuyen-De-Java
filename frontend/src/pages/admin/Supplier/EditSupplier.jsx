import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiSupplier from "../../../api/apiSupplier";

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: 1,
  });

  useEffect(() => {
    apiSupplier.getById(id).then(setForm).catch(() => {
      toast.error("Không tìm thấy nhà cung cấp");
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiSupplier.update(id, form);
      toast.success("Cập nhật thành công");
      navigate("/admin/suppliers");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Cập nhật nhà cung cấp</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          value={form.address || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value={1}>Hoạt động</option>
          <option value={0}>Ngưng hợp tác</option>
        </select>

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditSupplier;
