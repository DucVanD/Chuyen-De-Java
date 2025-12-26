import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiBrand from "../../../api/apiBrand";

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
    country: "",
  });

  useEffect(() => {
    apiBrand.getById(id).then(setForm).catch(() => {
      toast.error("Không tìm thấy thương hiệu");
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiBrand.update(id, form);
      toast.success("Cập nhật thành công");
      navigate("/admin/brands");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Cập nhật thương hiệu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name","slug","image","country"].map((f) => (
          <input key={f} name={f} value={form[f] || ""}
            onChange={handleChange}
            className="w-full border p-2" />
        ))}

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditBrand;
