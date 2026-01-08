import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaAward,
  FaCube
} from "react-icons/fa";
import { imageURL } from "../../../api/config";
import apiBrand from "../../../api/apiBrand";
import { toast } from "react-toastify";

const ListBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = () => {
    setLoading(true);
    apiBrand
      .getAll()
      .then((res) => {
        if (res.status) {
          setBrands(res.data?.data || res.data || []);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách thương hiệu:", err);
        toast.error("Không thể tải danh sách thương hiệu!");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      // Placeholder for delete logic if implemented in apiBrand
      toast.info("Tính năng xóa đang được cập nhật!");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaAward className="text-indigo-600" /> Quản lý thương hiệu
          </h3>
          <p className="text-slate-500 text-sm mt-1">Danh sách các đối tác và thương hiệu cung cấp sản phẩm</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95 font-semibold"
          >
            <FaPlus className="mr-2" /> Thêm thương hiệu
          </button>
          <button
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center transition-all font-semibold"
          >
            <FaTrash className="mr-2" /> Thùng rác
          </button>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-left">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20 text-center">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên thương hiệu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quốc gia</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4"><div className="h-12 bg-slate-50 rounded-lg"></div></td>
                  </tr>
                ))
              ) : brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{brand.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-12 rounded-lg overflow-hidden border border-slate-100 shadow-sm bg-white">
                        <img
                          className="w-full h-full object-contain p-1"
                          src={brand.image ? `${imageURL}/brand/${brand.image}` : `https://ui-avatars.com/api/?name=${brand.name}&background=f1f5f9&color=6366f1&bold=true`}
                          alt={brand.name}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80x40?text=No+Image"; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{brand.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium italic">Slug: {brand.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 text-sm">
                      {brand.country || "Việt Nam"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-emerald-500 hover:text-emerald-600 transition-colors text-xl">
                          <FaToggleOn />
                        </button>
                        <Link
                          to={`/admin/editBrand/${brand.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                    <FaCube size={48} className="mx-auto mb-4 opacity-10" />
                    Không có thương hiệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListBrand;
