import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiStockAdmin from "../../../api/admin/apiStockAdmin";
import { FaPlus, FaMinus, FaExchangeAlt, FaUndo, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ListInventory = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(7);

  useEffect(() => {
    loadMovements();
  }, [currentPage, size]);

  const loadMovements = () => {
    setLoading(true);
    apiStockAdmin.getPage(currentPage, size)
      .then((data) => {
        setList(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        console.error("Lỗi tải lịch sử kho", err);
      })
      .finally(() => setLoading(false));
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case "IN": return "bg-green-100 text-green-700 border-green-200";
      case "OUT": return "bg-red-100 text-red-700 border-red-200";
      case "ADJUSTMENT": return "bg-orange-100 text-orange-700 border-orange-200";
      case "RETURN": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case "IN": return "Nhập kho";
      case "OUT": return "Xuất kho";
      case "ADJUSTMENT": return "Điều chỉnh";
      case "RETURN": return "Trả hàng";
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      {/* HEADER */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử Kho hàng</h2>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/inventory/import" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all text-sm font-medium">
            <FaPlus className="mr-2" /> Nhập kho
          </Link>

          <Link to="/admin/inventory/export" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all text-sm font-medium">
            <FaMinus className="mr-2" /> Xuất kho
          </Link>

          <Link to="/admin/inventory/adjust" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all text-sm font-medium">
            <FaExchangeAlt className="mr-2" /> Điều chỉnh
          </Link>

        </div>
      </div>

      {/* TABLE */}
      <div className="p-6">
        {loading ? (
          <p className="text-center py-10 text-gray-500 italic">Đang tải dữ liệu...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-center">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4 text-left">Sản phẩm</th>
                    <th className="py-3 px-4">Loại giao dịch</th>
                    <th className="py-3 px-4">Số lượng</th>
                    <th className="py-3 px-4">Tồn sau GD</th>
                    <th className="py-3 px-4 text-right">Giá trị đơn/c</th>
                    <th className="py-3 px-4">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.length > 0 ? (
                    list.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-500">#{m.id}</td>

                        <td className="py-3 px-4 text-left">
                          <div className="font-medium text-gray-900">{m.productName}</div>
                          <div className="text-xs text-gray-500">Mã SP: {m.productId}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getBadgeStyle(m.movementType)}`}>
                            {getTypeName(m.movementType)}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-medium text-lg">
                          {m.quantity > 0 ? (
                            <span className="text-green-600">+{m.quantity}</span>
                          ) : (
                            <span className="text-red-600">{m.quantity}</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-gray-700 font-semibold">{m.currentStock}</td>

                        <td className="py-3 px-4 text-right">
                          {m.unitPrice ? (
                            <span className="text-gray-900 font-medium">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(m.unitPrice)}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-xs">N/A</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-gray-600 text-xs text-right">
                          {new Date(m.createdAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-gray-400">Chưa có dữ liệu lịch sử kho</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">
                  Trang <span className="font-semibold text-gray-900">{currentPage + 1}</span> / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FaChevronLeft className="text-gray-600" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 rounded-md border text-sm font-medium transition-all ${currentPage === i
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border-gray-300"
                        }`}
                    >
                      {i + 1}
                    </button>
                  )).slice(
                    Math.max(0, currentPage - 2),
                    Math.min(totalPages, currentPage + 3)
                  )}
                  <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FaChevronRight className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default ListInventory;