import { useEffect, useState } from "react";
import apiStock from "../../../api/apiStock";
import apiProduct from "../../../api/apiProduct";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaWarehouse, FaArrowLeft, FaExclamationTriangle, FaPlus, FaCube, FaPlusSquare, FaSave, FaTimes, FaChartLine } from "react-icons/fa";

const FormNhapKho = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    note: "Bổ sung tồn kho cho sản phẩm sắp hết",
  });
  const [loading, setLoading] = useState(false);
  const [lowStock, setLowStock] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await apiProduct.lowstock();
        if (res.status && Array.isArray(res.data)) {
          setLowStock(res.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách hàng sắp hết:", err);
      }
    };
    fetchLowStock();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_id || !form.quantity) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const res = await apiStock.import(form);
      if (res.data.status) {
        toast.success("✅ Nhập kho hàng thành công!");
        setForm({ product_id: "", quantity: "", note: "" });
        setShowForm(false);
        const reload = await apiProduct.lowstock();
        if (reload.status && Array.isArray(reload.data)) {
          setLowStock(reload.data);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi khi nhập kho!");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="space-y-6 animate-fadeIn pb-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FaExclamationTriangle className="text-rose-500" /> Sản phẩm sắp hết hàng
            </h3>
            <p className="text-slate-500 text-sm mt-1">Cảnh báo tồn kho dưới mức an toàn (Dưới 10 sản phẩm)</p>
          </div>
          <button
            onClick={() => navigate("/admin/inventory")}
            className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
          >
            <FaArrowLeft className="mr-2" /> Quay về danh sách kho
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-20">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin sản phẩm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Tồn kho hiện tại</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStock.length > 0 ? (
                  lowStock.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-rose-600 transition-colors">#{p.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-rose-50 text-rose-600 border border-rose-100`}>
                          {p.qty} sản phẩm
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedProductName(p.name);
                            setForm({ ...form, product_id: p.id });
                            setShowForm(true);
                          }}
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                        >
                          <FaPlus /> Nhập hàng ngay
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-slate-400 font-medium">
                      <FaCube size={48} className="mx-auto mb-4 opacity-10" />
                      Tuyệt vời! Hiện không có sản phẩm nào sắp hết hàng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaPlusSquare className="text-emerald-600" /> Nhập kho hàng hóa
          </h3>
          <p className="text-slate-500 text-sm mt-1">Cập nhật số lượng sản phẩm nhập vào kho hệ thống</p>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Quay lại danh sách sắp hết
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Sản phẩm đang chọn</label>
              <div className="px-4 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-100 border-dashed italic">
                {selectedProductName} (ID: #{form.product_id})
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Số lượng nhập mới</label>
              <input
                type="number"
                name="quantity"
                min="1"
                placeholder="Nhập con số cụ thể..."
                value={form.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ghi chú nhập hàng</label>
            <textarea
              name="note"
              rows="4"
              placeholder="Mô tả lý do hoặc nguồn gốc nhập hàng..."
              value={form.note}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang thực thi...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaSave /> Xác nhận nhập kho
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
            >
              <FaTimes className="inline mr-2" /> Hủy bỏ
            </button>
          </div>
        </form>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <FaChartLine size={20} />
        </div>
        <div>
          <h5 className="font-bold text-indigo-900 leading-none mb-2 text-lg">Phân bổ thông minh</h5>
          <p className="text-indigo-700/80 text-sm leading-relaxed font-semibold">
            Số lượng nhập vào sẽ được cộng dồn trực tiếp vào kho hiện hữu. Hệ thống sẽ tự động cập nhật lại lịch sử biến động cho quá trình đối chiếu sau này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormNhapKho;
