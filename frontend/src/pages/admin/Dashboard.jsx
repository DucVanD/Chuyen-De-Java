import { useState, useEffect } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  AlertTriangle,
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

// Dữ liệu giả lập (Mock Data)
const MOCK_DATA = {
  summary: {
    total_products: 156,
    total_orders: 842,
    total_users: 2450,
    total_revenue: "250.000.000₫",
    new_users: 45,
    average_order_value: "350.000₫",
    lowStockList: [
      { id: "SP001", name: "Áo Thun Basic Trắng", qty: 2 },
      { id: "SP004", name: "Quần Jeans SlimFit", qty: 5 },
      { id: "SP012", name: "Mũ Lưỡi Trai Đen", qty: 12 },
      { id: "SP008", name: "Tất Cổ Cao (Set)", qty: 18 },
    ],
  },
  analytics: {
    conversion_rate: "4.8%",
    visits: 15400,
  },
  top_products: [
    { name: "Áo Khoác Gió", quantity_sold: 120 },
    { name: "Giày Sneaker", quantity_sold: 98 },
    { name: "Balo Laptop", quantity_sold: 85 },
    { name: "Kính Mát", quantity_sold: 64 },
    { name: "Thắt Lưng Da", quantity_sold: 50 },
  ],
  period: "27/12/2025",
  comparison: {
    revenue_vs_yesterday: "+15%",
  },
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // Hàm giả lập gọi API
  const fetchDashboard = async (date = "") => {
    setLoading(true);
    setError(null);

    // Giả lập độ trễ mạng (500ms)
    setTimeout(() => {
      // Trong thực tế, bạn sẽ filter dữ liệu theo 'date' ở đây
      console.log("Đang lấy dữ liệu cho ngày:", date || "Hôm nay");
      
      setData(MOCK_DATA);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
      Đang tải dữ liệu...
    </div>
  );
  
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!data) return <p className="p-10 text-center">Không có dữ liệu</p>;

  const summary = data.summary || {};
  const analytics = data.analytics || {};
  const topProducts = data.top_products || [];
  const lowStockList = summary.LowStockList || summary.lowStockList || [];

  const cardStyle =
    "bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between transform hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer";
  const iconBox =
    "p-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md";

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 min-h-screen">
      {/* Date picker */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan Dashboard</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            fetchDashboard(e.target.value);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm bg-white"
        />
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {/* Sản phẩm */}
        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-sm font-medium">Sản phẩm</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.total_products ?? 0}
            </h2>
          </div>
          <div className={iconBox}>
            <Package size={24} />
          </div>
        </div>

        {/* Đơn hàng */}
        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-sm font-medium">Đơn hàng</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.total_orders ?? 0}
            </h2>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 text-white shadow-md">
            <ShoppingCart size={24} />
          </div>
        </div>

        {/* Khách hàng */}
        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-sm font-medium">Khách hàng</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {summary.total_users ?? 0}
            </h2>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 text-white shadow-md">
            <Users size={24} />
          </div>
        </div>

        {/* Doanh thu */}
        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-sm font-medium">Doanh thu</p>
            <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
              {summary.total_revenue ?? "0₫"}
            </h2>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 text-white shadow-md">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Tỷ lệ chuyển đổi */}
        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-sm font-medium">Chuyển đổi</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {analytics.conversion_rate ?? "0%"}
            </h2>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white shadow-md">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Bán chạy nhất */}
        <div className={cardStyle}>
          <div>
            <p className="text-gray-500 text-sm font-medium">Top 1</p>
            <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[100px]" title={topProducts[0]?.name}>
              {topProducts.length > 0 ? topProducts[0].name : "N/A"}
            </h2>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-white shadow-md">
            <Star size={24} />
          </div>
        </div>
      </div>

      {/* Top products chart + Low stock list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600"/> Top sản phẩm bán chạy
          </h2>
          {topProducts.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6b7280', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6b7280', fontSize: 12}}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      padding: "12px"
                    }}
                  />
                  <Bar 
                    dataKey="quantity_sold" 
                    fill="url(#colorGradient)" 
                    radius={[6, 6, 0, 0]} 
                    barSize={50}
                  >
                     {/* Define gradient directly inside SVG context if needed, otherwise use solid color */}
                  </Bar>
                   {/* Fallback fill if gradient defs not used */}
                   <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-600">Chưa có dữ liệu sản phẩm bán chạy.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Sắp hết hàng</h3>
              <p className="text-xs text-gray-500 mt-1">
                {lowStockList.length} sản phẩm cần nhập thêm
              </p>
            </div>
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600 animate-pulse">
              <AlertTriangle size={20} />
            </div>
          </div>

          {lowStockList.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">Kho hàng ổn định!</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {lowStockList.map((p) => (
                <div
                  key={p.id}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">ID: {p.id}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        Number(p.qty) <= 3
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Còn: {p.qty}
                    </span>

                    <button
                      className="text-xs text-indigo-600 font-medium hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Nhập ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Small summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="h-10 w-1 bg-indigo-500 rounded-full"></div>
             <div>
                <h4 className="text-sm text-gray-500 uppercase tracking-wide">Dữ liệu tính đến</h4>
                <p className="font-bold text-xl text-gray-800">{data.period}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full md:w-auto">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Người đăng ký mới</p>
              <p className="font-bold text-lg text-gray-800">{summary.new_users ?? 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Giá trị TB/Đơn</p>
              <p className="font-bold text-lg text-indigo-600">{summary.average_order_value ?? "0₫"}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Lượt truy cập</p>
              <p className="font-bold text-lg text-gray-800">{analytics.visits ?? 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">So với hôm qua</p>
              <p className="font-bold text-lg text-emerald-500">{data.comparison?.revenue_vs_yesterday ?? "0%"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;