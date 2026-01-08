import { useState, useEffect } from "react";
import apiDashboard from "../../api/apiDashbroad";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchDashboard = async (date = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = date
        ? await apiDashboard.reportByDate(date)
        : await apiDashboard.summary();

      if (res && res.status) {
        setData(res.data);
      } else {
        setError("Không có dữ liệu dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối bộ máy phân tích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Đang khởi tạo báo cáo quản trị...</p>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl inline-block border border-rose-100">
        <AlertTriangle className="mx-auto mb-2" size={32} />
        <p className="font-bold">{error}</p>
        <button onClick={() => fetchDashboard()} className="mt-4 text-sm underline font-medium">Thử lại ngay</button>
      </div>
    </div>
  );

  const summary = data.summary || {};
  const analytics = data.analytics || {};
  const topProducts = data.top_products || [];
  const lowStockList = summary.LowStockList || summary.lowStockList || [];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" /> Báo cáo tổng quan
          </h3>
          <p className="text-slate-500 text-sm mt-1">Theo dõi hoạt động kinh doanh và hiệu năng bán hàng</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
          <Calendar className="text-slate-400" size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              fetchDashboard(e.target.value);
            }}
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <DollarSign className="text-indigo-400" />
              </div>
              <span className="flex items-center text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ArrowUpRight size={12} className="mr-1" /> {data.comparison?.revenue_vs_yesterday ?? "+12%"}
              </span>
            </div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Tổng doanh thu</p>
            <h2 className="text-3xl font-black tracking-tight">{summary.total_revenue ?? "0₫"}</h2>
          </div>
          <DollarSign className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform duration-500" size={120} />
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <ShoppingCart />
            </div>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Đơn hàng mới</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{summary.total_orders ?? 0}</h2>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Package />
            </div>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Kho hàng hóa</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{summary.total_products ?? 0}</h2>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
              <Users />
            </div>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Khách hàng</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{summary.total_users ?? 0}</h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-bold text-slate-800">Hiệu năng sản phẩm</h4>
              <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Sản lượng bán chạy nhất trong kỳ</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div> SL bán ra
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  interval={0}
                  height={50}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    color: '#fff',
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px' }}
                />
                <Bar dataKey="quantity_sold" radius={[8, 8, 8, 8]} barSize={40}>
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          {/* Low Stock Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <h4 className="font-bold text-slate-800">Cảnh báo tồn kho</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Ngưỡng ≤ 20</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
              {lowStockList.length > 0 ? (
                lowStockList.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-50 hover:border-slate-100 transition-all group">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-700 truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold">Mã: #{p.id}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${Number(p.qty) <= 3 ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}>
                        {p.qty} SP
                      </div>
                      <Link to="/admin/inventory/import" className="p-1.5 text-indigo-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-200 transition-all opacity-0 group-hover:opacity-100">
                        <Package size={14} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <Star className="text-slate-100 mx-auto mb-2" size={40} />
                  <p className="text-slate-400 text-sm font-medium italic">Không có cảnh báo</p>
                </div>
              )}
            </div>

            <Link to="/admin/inventory" className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-2xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
              <Search size={14} /> Kiểm tra toàn bộ kho
            </Link>
          </div>

          {/* Secondary Metrics */}
          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
            <h4 className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-4">Chỉ số bổ sung</h4>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Tỉ lệ chuyển đổi</p>
                <p className="text-xl font-black">{analytics.conversion_rate ?? "0%"}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Đơn vị trung bình</p>
                <p className="text-xl font-black">{summary.average_order_value ?? "0₫"}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Thành viên mới</p>
                <p className="text-xl font-black">+{summary.new_users ?? 0}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Lượt truy cập</p>
                <p className="text-xl font-black">{analytics.visits ?? 0}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
