import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiUser from "../../../api/apiUser";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    status: 1,
  });

  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      await apiUser.create(form, password);
      toast.success("Thêm người dùng thành công");
      navigate("/admin/users");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Thêm người dùng</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Họ tên"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Số điện thoại"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full border p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          name="address"
          placeholder="Địa chỉ"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default AddUser;
