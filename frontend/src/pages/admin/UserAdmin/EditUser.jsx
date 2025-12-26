import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiUser from "../../../api/apiUser";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    status: 1,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiUser.getById(id);
        setForm({
          name: data.name,
          phone: data.phone,
          address: data.address || "",
          role: data.role,
          status: data.status,
        });
      } catch {
        toast.error("Không tìm thấy người dùng");
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiUser.update(id, form);
      toast.success("Cập nhật thành công");
      navigate("/admin/users");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Cập nhật người dùng</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value={1}>Hoạt động</option>
          <option value={0}>Khóa</option>
        </select>

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditUser;
