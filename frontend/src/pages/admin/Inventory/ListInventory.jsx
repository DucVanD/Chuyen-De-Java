import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiStock from "../../../api/user/apiStock";
import { FaPlus, FaMinus, FaExchangeAlt, FaUndo } from "react-icons/fa";

const ListInventory = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiStock.getAll()
      .then(setList)
      .finally(() => setLoading(false));
  }, []);

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

          <Link to="/admin/inventory/return" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all text-sm font-medium">
            <FaUndo className="mr-2" /> Trả hàng
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="p-6">
        {loading ? (
          <p className="text-center py-10 text-gray-500 italic">Đang tải dữ liệu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4 text-left">Sản phẩm</th>
                  <th className="py-3 px-4">Loại giao dịch</th>
                  <th className="py-3 px-4">Số lượng</th>
                  <th className="py-3 px-4">Tồn sau GD</th>
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

                      <td className="py-3 px-4 font-medium">
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </td>
                      
                      <td className="py-3 px-4 text-gray-700 font-semibold">{m.currentStock}</td>
                      
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {new Date(m.createdAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-gray-400">Chưa có dữ liệu lịch sử kho</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListInventory;