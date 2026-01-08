import { useState, useEffect } from "react";
import apiStock from "../../../api/apiStock";
import apiProduct from "../../../api/apiProduct";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaCog, FaArrowLeft, FaInfoCircle, FaSave, FaTimes, FaBoxOpen, FaSearch, FaPlus, FaMinus } from "react-icons/fa";

const FormDieuChinh = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    adjust_sign: "plus",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiProduct.getAll();
        setProductList(res.data || res || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setForm({ ...form, product_id: product.id });
    setSearchTerm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_id || !form.quantity) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const res = await apiStock.adjust(form);
      if (res.data.status) {
        toast.success("✅ Điều chỉnh tồn kho thành công!");
        setForm({ product_id: "", quantity: "", adjust_sign: "plus", note: "" });
        setSelectedProduct(null);
        const reload = await apiProduct.getAll();
        setProductList(reload.data || reload || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi khi điều chỉnh!");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = searchTerm
    ? productList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaCog className="text-amber-500 animate-spin-slow" /> Điều chỉnh kho sai lệch
          </h3>
          <p className="text-slate-500 text-sm mt-1">Sử dụng để cân bằng tồn kho khi phát hiện sai số kiểm kê</p>
        </div>
        <Link
          to="/admin/inventory"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Về danh sách kho
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Search Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg border-b border-slate-50 pb-4">
            <FaSearch />
            <h4>Chọn sản phẩm hiệu chỉnh</h4>
          </div>

          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Mã hoặc tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
            />
            {searchTerm && (
              <div className="absolute z-10 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-50">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{p.name}</span>
                      <span className="text-[10px] text-slate-400">ID: #{p.id}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                      Tồn: {p.qty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedProduct ? (
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl animate-fadeIn">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <FaBoxOpen size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 leading-tight">{selectedProduct.name}</h5>
                  <p className="text-slate-500 text-xs mt-1">Mã hệ thống: #{selectedProduct.id}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">Tồn kho hiện hữu:</span>
                <span className="text-lg font-black text-amber-600">{selectedProduct.qty} <small className="text-xs font-medium text-slate-400">sp</small></span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-10 text-center">
              <FaBoxOpen size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm font-medium">Bắt đầu bằng cách chọn sản phẩm</p>
            </div>
          )}
        </div>

        {/* Adjust Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-lg border-b border-slate-50 pb-4">
            <FaCog />
            <h4>Thiết lập điều chỉnh</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phương thức hiệu chỉnh</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer font-bold ${form.adjust_sign === "plus" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}>
                  <input
                    type="radio"
                    name="adjust_sign"
                    value="plus"
                    checked={form.adjust_sign === "plus"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <FaPlus size={12} /> Tăng thêm
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer font-bold ${form.adjust_sign === "minus" ? "bg-rose-50 border-rose-500 text-rose-700" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}>
                  <input
                    type="radio"
                    name="adjust_sign"
                    value="minus"
                    checked={form.adjust_sign === "minus"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <FaMinus size={12} /> Giảm bớt
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Số lượng lệch</label>
              <input
                type="number"
                name="quantity"
                min="1"
                placeholder="0"
                value={form.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-bold text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Lý do hiệu chỉnh</label>
              <textarea
                name="note"
                rows="3"
                placeholder="Lý do điều chỉnh (Kiểm kho định kỳ, hàng hư hỏng...)"
                value={form.note}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none resize-none"
                required
              ></textarea>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={loading || !selectedProduct}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "XÁC NHẬN ĐIỀU CHỈNH"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setForm({ product_id: "", quantity: "", adjust_sign: "plus", note: "" });
                }}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
              >
                <FaTimes />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
          <FaInfoCircle size={20} />
        </div>
        <div>
          <h5 className="font-bold text-amber-900 leading-none mb-2 text-lg">Cân bằng tồn kho</h5>
          <p className="text-amber-700/80 text-sm font-semibold leading-relaxed">
            Hệ thống sẽ thực hiện phép cộng hoặc trừ tùy theo phương thức bạn chọn để đưa số dư kho về trạng thái thực tế nhất.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormDieuChinh;
