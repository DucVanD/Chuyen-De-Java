import { useState, useEffect } from "react";
import apiStock from "../../../api/apiStock";
import apiProduct from "../../../api/apiProduct";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaMinusSquare, FaArrowLeft, FaInfoCircle, FaSave, FaTimes, FaBoxOpen, FaSearch, FaTag } from "react-icons/fa";

const FormXuatKho = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
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
        // Depending on the API structure, might be res.data or just res
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
      toast.error("Vui lòng chọn sản phẩm và nhập số lượng!");
      return;
    }

    if (selectedProduct && form.quantity > selectedProduct.qty) {
      toast.warning(`Số lượng xuất (${form.quantity}) vượt quá tồn kho hiện có (${selectedProduct.qty})!`);
    }

    try {
      setLoading(true);
      const res = await apiStock.export(form);
      if (res.data.status) {
        toast.success("✅ Xuất kho thành công!");
        setForm({ product_id: "", quantity: "", note: "" });
        setSelectedProduct(null);
        // Optionally reload products to get updated qty
        const reload = await apiProduct.getAll();
        setProductList(reload.data || reload || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi khi xuất kho!");
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
            <FaMinusSquare className="text-rose-600" /> Xuất hàng khỏi kho
          </h3>
          <p className="text-slate-500 text-sm mt-1">Giảm trừ tồn kho cho các mục đích xuất xưởng hoặc tiêu hủy</p>
        </div>
        <Link
          to="/admin/inventory"
          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Về danh sách kho
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Selection Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg border-b border-slate-50 pb-4">
            <FaSearch />
            <h4>Chọn sản phẩm xuất</h4>
          </div>

          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Tìm tên sản phẩm muốn xuất..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
            />

            {searchTerm && (
              <div className="absolute z-10 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{p.name}</span>
                        <span className="text-[10px] text-slate-400">ID: #{p.id}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${p.qty < 10 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                        Tồn: {p.qty}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-sm">Không tìm thấy sản phẩm</div>
                )}
              </div>
            )}
          </div>

          {selectedProduct ? (
            <div className="bg-slate-900 text-white p-6 rounded-2xl animate-fadeIn space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-white overflow-hidden">
                  <FaBoxOpen size={30} />
                </div>
                <div>
                  <h5 className="font-bold text-lg leading-tight">{selectedProduct.name}</h5>
                  <p className="text-white/60 text-xs">SKU: {selectedProduct.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Tồn hiện tại</p>
                  <p className="text-xl font-black text-white">{selectedProduct.qty}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Trạng thái</p>
                  <p className={`text-sm font-bold mt-1 ${selectedProduct.qty < 10 ? "text-rose-400" : "text-emerald-400"}`}>
                    {selectedProduct.qty < 10 ? "⚠️ Cần nhập thêm" : "✓ Ổn định"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-10 text-center space-y-3">
              <FaBoxOpen size={40} className="mx-auto text-slate-200" />
              <p className="text-slate-400 text-sm font-medium">Chọn một sản phẩm từ danh sách tìm kiếm để bắt đầu xuất kho</p>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-lg border-b border-slate-50 pb-4">
            <FaTag />
            <h4>Chi tiết phiếu xuất</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Số lượng xuất kho</label>
              <input
                type="number"
                name="quantity"
                min="1"
                placeholder="Nhập số lượng..."
                value={form.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-bold text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Lý do & Ghi chú</label>
              <textarea
                name="note"
                rows="5"
                placeholder="Ví dụ: Xuất bán lẻ, Hàng lỗi, Chuyển chi nhánh..."
                value={form.note}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none resize-none"
              ></textarea>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading || !selectedProduct}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaSave /> XÁC NHẬN XUẤT KHO
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setForm({ product_id: "", quantity: "", note: "" });
                }}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                title="Reset form"
              >
                <FaTimes />
              </button>
            </div>
          </form>

          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-start gap-3">
            <FaInfoCircle className="text-rose-500 mt-0.5 flex-shrink-0" />
            <p className="text-rose-700 text-xs leading-relaxed font-semibold">
              Lưu ý: Thao tác xuất kho sẽ trừ trực tiếp vào số lượng hiện có. Không thể hoàn tác sau khi đã xác nhận.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormXuatKho;
