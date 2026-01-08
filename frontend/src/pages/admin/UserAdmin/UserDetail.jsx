import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiUser from "../../../api/apiUser";
import { FaEdit, FaTrash, FaArrowLeft, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaUserTag, FaShoppingCart, FaHistory, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { imageURL } from "../../../api/config";
import { toast } from "react-toastify";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);

  const fetchUser = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiUser.getUserIdWithParams(id, `page=${page}`);
      if (res.status) {
        setUser(res.data);
        setOrders(res.data.orders || []);
        setPagination(res.data.pagination || { current_page: 1, last_page: 1 });
      }
    } catch (err) {
      console.error("Lỗi tải user:", err);
      toast.error("Không thể tải thông tin thành viên này!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchUser(page);
    }
  };

  const statusLabels = {
    1: { text: "Chờ xác nhận", color: "bg-amber-100 text-amber-700 border-amber-200" },
    2: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700 border-blue-200" },
    3: { text: "Đóng gói", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    4: { text: "Đang giao", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    5: { text: "Thành công", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    6: { text: "Hoàn trả", color: "bg-rose-100 text-rose-700 border-rose-200" },
    7: { text: "Đã hủy", color: "bg-slate-100 text-slate-700 border-slate-200" },
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-bold tracking-tight">Đang truy xuất hồ sơ thành viên...</p>
    </div>
  );

  if (!user) return (
    <div className="p-10 text-center">
      <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 inline-block">
        <FaUserCircle size={60} className="mx-auto text-slate-200 mb-4" />
        <p className="text-slate-400 font-bold text-lg italic">Hồ sơ không tồn tại hoặc đã bị gỡ bỏ.</p>
        <button onClick={() => navigate("/admin/users")} className="mt-6 text-indigo-600 font-bold hover:underline">Về danh sách người dùng</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-50 shadow-sm shadow-indigo-100">
            <img
              className="w-full h-full object-cover"
              src={`${imageURL}/avatar/${user.avatar}`}
              alt={user.name}
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user.name + "&background=6366f1&color=fff"; }}
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">ID: #{user.id}</span>
              {user.status === 1 ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Hoạt động</span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Tạm khóa</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/user/edit/${user.id}`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-sm"
          >
            <FaEdit /> Hiệu chỉnh hồ sơ
          </Link>
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all text-sm"
          >
            <FaArrowLeft /> Trở về
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Information Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FaEnvelope className="text-indigo-600" /> Dữ liệu liên hệ
            </h4>
            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <FaPhone size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số điện thoại</span>
                  <span className="text-sm font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{user.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <FaEnvelope size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hòm thư điện tử</span>
                  <span className="text-sm font-black text-slate-700 truncate group-hover:text-indigo-600 transition-colors">{user.email}</span>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mt-1">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa chỉ giao hàng mặc định</span>
                  <span className="text-sm font-black text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">{user.address || 'Chưa cung cấp địa chỉ'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Analytics */}
          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 text-white relative overflow-hidden">
            <h4 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-6">Phân tích hành vi</h4>
            <div className="grid grid-cols-2 gap-y-6 relative z-10">
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><FaUserTag size={10} /> Định danh</p>
                <p className="text-sm font-black text-indigo-300">@{user.username}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><FaIdCard size={10} /> Phân quyền</p>
                <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5">{user.roles}</span>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Tổng đơn</p>
                <p className="text-2xl font-black">{user.summary?.total_orders || 0}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Sản lượng</p>
                <p className="text-2xl font-black">{user.summary?.total_products || 0}</p>
              </div>
            </div>
            <FaHistory className="absolute -left-8 -bottom-8 text-white/5" size={150} />
          </div>
        </div>

        {/* Orders History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <FaShoppingCart className="text-indigo-600" /> Lịch sử mua hàng
              </h4>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">Gần nhất</span>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white text-left">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã đơn</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">SLSP</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thanh toán</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{order.order_code}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{order.created_at}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-600 text-xs">
                          {order.total_items}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-sm font-black text-slate-800">{order.total_amount?.toLocaleString()} đ</span>
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{order.payment}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusLabels[order.status]?.color || 'bg-slate-100 text-slate-500'}`}>
                            {statusLabels[order.status]?.text || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            to={`/admin/orderDetail/${order.id}`}
                            className="p-2 text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow border border-transparent hover:border-slate-100 inline-block"
                            title="Xem đơn hàng"
                          >
                            <FaEye size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">
                        <FaBoxOpen size={40} className="mx-auto mb-3 opacity-10" />
                        Thành viên này chưa thực hiện bất kỳ giao dịch nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Area */}
            {pagination.last_page > 1 && (
              <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Trang {pagination.current_page} / {pagination.last_page}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() => goToPage(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
