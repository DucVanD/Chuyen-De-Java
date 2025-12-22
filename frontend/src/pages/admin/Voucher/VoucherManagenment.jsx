import { useState } from "react";

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "SALE10",
      type: "PERCENT",
      value: 10,
      minOrder: 200000,
      quantity: 50,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "ACTIVE",
    },
  ]);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "",
    minOrder: "",
    quantity: "",
    startDate: "",
    endDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm({
      code: "",
      type: "PERCENT",
      value: "",
      minOrder: "",
      quantity: "",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setVouchers(
        vouchers.map((v) =>
          v.id === editingId ? { ...v, ...form } : v
        )
      );
    } else {
      setVouchers([
        ...vouchers,
        {
          ...form,
          id: Date.now(),
          status: "ACTIVE",
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (v) => {
    setForm(v);
    setEditingId(v.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Xoá voucher này?")) {
      setVouchers(vouchers.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">🎟️ Quản lý Voucher</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <input
          className="border px-3 py-2 rounded"
          placeholder="Mã voucher"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />

        <select
          className="border px-3 py-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="PERCENT">Giảm %</option>
          <option value="FIXED">Giảm tiền</option>
        </select>

        <input
          className="border px-3 py-2 rounded"
          placeholder="Giá trị"
          type="number"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          required
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Đơn tối thiểu"
          type="number"
          value={form.minOrder}
          onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Số lượng"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <input
          className="border px-3 py-2 rounded"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <input
          className="border px-3 py-2 rounded"
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        <div className="md:col-span-4 flex gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            {editingId ? "Cập nhật" : "Thêm voucher"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Huỷ
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Loại</th>
              <th className="p-2">Giá trị</th>
              <th className="p-2">Đơn tối thiểu</th>
              <th className="p-2">Số lượng</th>
              <th className="p-2">Thời gian</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-2 font-semibold">{v.code}</td>
                <td className="p-2">
                  {v.type === "PERCENT" ? "Giảm %" : "Giảm tiền"}
                </td>
                <td className="p-2">{v.value}</td>
                <td className="p-2">{v.minOrder}</td>
                <td className="p-2">{v.quantity}</td>
                <td className="p-2">
                  {v.startDate} → {v.endDate}
                </td>
                <td className="p-2">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                    {v.status}
                  </span>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(v)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="bg-red-500 px-3 py-1 rounded text-white"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
