import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Eye,
  PlusCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiProductAdmin from "../../api/admin/apiProductAdmin";
import apiOrderAdmin from "../../api/admin/apiOrderAdmin";
import apiUserAdmin from "../../api/admin/apiUserAdmin";

// Utility to format quantity (Standard Supermarket Logic)
export const formatQuantity = (qty, saleType, unitLabel) => {
  if (saleType === "WEIGHT") {
    if (qty >= 1000) {
      return (qty / 1000).toFixed(1).replace(/\.0$/, "") + " kg";
    }
    return qty + " g";
  }
  return qty + " " + (unitLabel || "đv");
};

const Dashboard = () => {
  const [data, setData] = useState({
    summary: {
      total_products: 0,
      total_orders: 0,
      total_users: 0,
      total_revenue: "0₫",
      lowStockList: [],
    },
    top_products: [],
    recentExports: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().split("T")[0];
  });

  const fetchDashboardData = async (dateStr) => {
    try {
      setLoading(true);
      // ✅ Tạo range thời gian cho CẢ ngày được chọn (Local Time)
      const targetDate = new Date(dateStr + "T00:00:00");
      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);

      // 1. Fetch data in parallel
      const [productsPage, ordersAll, usersPage] = await Promise.all([
        apiProductAdmin.getPage(0, 100),
        apiOrderAdmin.getAll(),
        apiUserAdmin.getPage(0, 1),
      ]);

      // 2. Filter Orders (EXCLUDE CANCELLED)
      const filteredOrders = ordersAll.filter(o => {
        const d = new Date(o.createdAt);
        const isSelectedDay = d >= targetDate && d < nextDate;
        const isNotCancelled = o.status !== "CANCELLED";
        return isSelectedDay && isNotCancelled;
      });

      // 3. Process Summary Stats
      const dayRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const lowStock = (productsPage.content || [])
        .filter(p => (p.qty || 0) <= 20)
        .map(p => ({
          id: p.id,
          name: p.name,
          qty: p.qty,
          unitLabel: p.unitLabel,
          saleType: p.saleType
        }))
        .slice(0, 5);

      // 4. Calculate Top Products (By REVENUE)
      const productRevenue = {};
      filteredOrders.forEach(order => {
        if (order.orderDetails) {
          order.orderDetails.forEach(item => {
            const name = item.product?.name || item.productName || "SP #" + item.productId;
            productRevenue[name] = (productRevenue[name] || 0) + (item.amount || 0);
          });
        }
      });

      const topProductsByRevenue = Object.entries(productRevenue)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // 5. Recent Exports - SUMMARY VIEW (1 row per Order)
      // As requested by user: Grouped for cleaner dashboard overview
      const transformedExports = filteredOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(order => ({
          id: order.id,
          orderCode: order.orderCode || "N/A",
          totalAmount: order.totalAmount,
          itemsCount: (order.orderDetails || []).length,
          createdAt: order.createdAt
        }))
        .slice(0, 7);

      setData({
        summary: {
          total_products: productsPage.totalElements || 0,
          total_orders: filteredOrders.length,
          total_users: usersPage.totalElements || 0,
          total_revenue: new Intl.NumberFormat("vi-VN").format(dayRevenue) + "₫",
          lowStockList: lowStock,
        },
        top_products: topProductsByRevenue.length > 0 ? topProductsByRevenue : [
          { name: "Chưa có bán", revenue: 0 }
        ],
        recentExports: transformedExports,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Lỗi khi tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Determine admin status from localStorage
    const storedAdmin = localStorage.getItem("adminUser");
    if (storedAdmin) {
      const user = JSON.parse(storedAdmin);
      setIsAdmin(user.role === "ADMIN");
    }
    fetchDashboardData(selectedDate);
  }, [selectedDate]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
      Đang cập nhật dữ liệu...
    </div>
  );

  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  const { summary, top_products, recentExports } = data;

  const cardStyle =
    "bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between transform hover:scale-105 transition duration-300 border border-gray-100";

  const currencyFormatter = (value) => new Intl.NumberFormat("vi-VN").format(value) + "₫";

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan Dashboard</h1>
          <p className="text-sm text-gray-500">Thống kê chuẩn siêu thị (Theo tiền & đơn vị)</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-600 ml-2">Xem ngày:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-none focus:ring-0 text-sm font-bold text-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6`}>
        {isAdmin && (
          <div className={cardStyle}>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Doanh thu ngày</p>
              <h2 className="text-2xl font-bold text-gray-800">{summary.total_revenue}</h2>
            </div>
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <DollarSign size={24} />
            </div>
          </div>
        )}

        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Đơn hàng mới</p>
            <h2 className="text-2xl font-bold text-gray-800">{summary.total_orders}</h2>
          </div>
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <ShoppingCart size={24} />
          </div>
        </div>

        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Tổng sản phẩm</p>
            <h2 className="text-2xl font-bold text-gray-800">{summary.total_products}</h2>
          </div>
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <Package size={24} />
          </div>
        </div>

        {isAdmin && (
          <div className={cardStyle}>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Khách hàng</p>
              <h2 className="text-2xl font-bold text-gray-800">{summary.total_users}</h2>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {/* Top Products Chart - Only for ADMIN */}
        {isAdmin && (
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" /> Top sản phẩm doanh thu cao
              </h2>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top_products}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}K`} />
                  <Tooltip
                    formatter={currencyFormatter}
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Low Stock List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Sắp hết hàng</h3>
              <p className="text-xs text-gray-500 mt-1">Kho hàng cần nhập thêm</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {summary.lowStockList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Package size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Kho hàng đang rất ổn định</p>
              </div>
            ) : (
              summary.lowStockList.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-gray-50 group">
                  <div className="max-w-[140px]">
                    <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-red-500 font-medium mt-0.5">Tồn: {formatQuantity(p.qty, p.saleType, p.unitLabel)}</p>
                  </div>
                  <Link
                    to={`/admin/inventory/import?productId=${p.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm"
                  >
                    <PlusCircle size={14} /> Nhập
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Exports - Grouped Summary Table for Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText size={20} className="text-red-500" /> Xuất kho hôm nay (Tổng quan đơn)
          </h2>
          <Link to="/admin/inventory/export" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1">
            Xem báo cáo chi tiết <TrendingUp size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mã đơn hàng</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Số lượng món</th>
                {isAdmin && <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Thành tiền</th>}
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Giờ xuất</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentExports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    <p className="text-sm italic">Không có giao dịch xuất kho</p>
                  </td>
                </tr>
              ) : (
                recentExports.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 transition group">
                    <td className="py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {exp.orderCode}
                      </span>
                    </td>
                    <td className="py-4 text-center text-gray-800 font-medium text-sm">
                      {exp.itemsCount} mặt hàng
                    </td>
                    {isAdmin && (
                      <td className="py-4 text-center font-bold text-green-600 text-sm">
                        {new Intl.NumberFormat("vi-VN").format(exp.totalAmount)}₫
                      </td>
                    )}
                    <td className="py-4 text-right text-xs text-gray-500">
                      {new Date(exp.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 text-right">
                      <Link to={`/admin/order/detail/${exp.id}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold uppercase">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;