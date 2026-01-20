import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaTrash, FaReply, FaCheckCircle, FaClock, FaSync, FaTimesCircle, FaExclamationTriangle, FaCopy } from "react-icons/fa";
import apiContactAdmin from "../../../api/admin/apiContactAdmin";
import { Link } from "react-router-dom";

const ListContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho Modal Phản hồi
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  // Mappings cho UI
  const statusLabels = {
    OPEN: { text: "Mới tiếp nhận", color: "bg-blue-100 text-blue-700", icon: <FaClock /> },
    IN_PROGRESS: { text: "Đang xử lý", color: "bg-yellow-100 text-yellow-700", icon: <FaSync /> },
    RESOLVED: { text: "Đã giải quyết", color: "bg-green-100 text-green-700", icon: <FaCheckCircle /> },
    REJECTED: { text: "Từ chối", color: "bg-red-100 text-red-700", icon: <FaTimesCircle /> },
  };

  const typeLabels = {
    CANCEL: { text: "Hủy đơn", color: "bg-red-50 text-red-600 border-red-200" },
    CHANGE_ADDRESS: { text: "Đổi địa chỉ", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    PRODUCT_ISSUE: { text: "Lỗi SP", color: "bg-orange-50 text-orange-600 border-orange-200" },
    DELAY: { text: "Giao chậm", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
    GENERAL: { text: "Tổng quát", color: "bg-gray-50 text-gray-600 border-gray-200" },
  };

  /* ================= LOAD DATA ================= */
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await apiContactAdmin.getAll();
      setContacts(data);
    } catch {
      toast.error("Lỗi tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);


  console.log(contacts);


  /* ================= ACTIONS ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa liên hệ này?")) return;
    try {
      await apiContactAdmin.delete(id);
      toast.success("Đã xóa liên hệ");
      setContacts(contacts.filter((c) => c.id !== id));
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  // Mở Modal xem chi tiết và trả lời
  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setReplyText(contact.replyContent || ""); // Nếu đã trả lời thì hiện nội dung cũ
    setShowModal(true);
  };

  // Gửi phản hồi
  const handleSendReply = async () => {
    if (!replyText.trim()) return toast.warning("Vui lòng nhập nội dung phản hồi");

    setSending(true);
    try {
      const updatedData = {
        ...selectedContact,
        replyContent: replyText,
        status: "RESOLVED", // Cập nhật trạng thái thành Đã giải quyết
      };

      await apiContactAdmin.update(selectedContact.id, updatedData);

      toast.success("Đã gửi phản hồi thành công");
      setShowModal(false);
      fetchContacts(); // Reload lại danh sách để cập nhật trạng thái
    } catch {
      toast.error("Gửi phản hồi thất bại");
    } finally {
      setSending(false);
    }
  };

  /* ================= HELPER UI ================= */
  const StatusBadge = ({ status }) => {
    const config = statusLabels[status] || statusLabels.OPEN;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center w-fit mx-auto gap-1 ${config.color}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      {/* HEADER */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Hộp thư liên hệ</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý phản hồi và ý kiến khách hàng</p>
      </div>

      {/* TABLE */}
      <div className="p-6">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Đang tải...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-center">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                  <th className="py-3 px-4 text-left">Mã Ticket</th>
                  <th className="py-3 px-4 text-left">Người gửi</th>
                  <th className="py-3 px-4 text-left">Nội dung</th>
                  <th className="py-3 px-4 text-left">Loại yêu cầu</th>
                  <th className="py-3 px-4">Đơn hàng</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.length > 0 ? (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      {/* Cột Mã Ticket */}
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            {c.ticketCode}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(c.ticketCode);
                              toast.success("Đã copy mã ticket!");
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy mã"
                          >
                            <FaCopy size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Cột Người gửi */}
                      <td className="py-3 px-4 text-left">
                        <div className="font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                        <div className="text-xs text-gray-400">{c.phone}</div>
                      </td>

                      {/* Cột Nội dung */}
                      <td className="py-3 px-4 text-left max-w-xs truncate" title={c.title}>
                        <div className="font-medium text-gray-800">{c.title}</div>
                        <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("vi-VN")}</div>
                      </td>

                      {/* Cột Loại yêu cầu */}
                      <td className="py-3 px-4 text-left">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold w-fit ${typeLabels[c.type]?.color || typeLabels.GENERAL.color}`}>
                            {typeLabels[c.type]?.text || c.type}
                          </span>
                          {c.priority === "URGENT" && (
                            <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold uppercase">
                              <FaExclamationTriangle /> Khẩn cấp
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Cột Đơn hàng */}
                      <td className="py-3 px-4 font-mono text-xs">
                        {c.orderId ? (
                          <Link
                            to={`/admin/order/edit/${c.orderId}`}
                            onClick={() => localStorage.setItem("fromContactsPage", "true")}
                            className="text-indigo-600 hover:underline"
                          >
                            #{c.orderId}
                          </Link>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Cột Trạng thái */}
                      <td className="py-3 px-4">
                        <StatusBadge status={c.status} />
                      </td>

                      {/* Cột Hành động */}
                      <td className="py-3 px-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleOpenModal(c)}
                            className="text-blue-600 hover:text-blue-800 transition-colors tooltip"
                            title="Xem & Trả lời"
                          >
                            {c.status === "RESOLVED" ? <FaEye size={18} /> : <FaReply size={18} />}
                          </button>

                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Xóa"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400 italic">
                      Chưa có liên hệ nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL PHẢN HỒI ================= */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Chi tiết liên hệ</h3>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                    {selectedContact.ticketCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedContact.ticketCode);
                      toast.success("Đã copy mã ticket!");
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy mã"
                  >
                    <FaCopy size={12} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Từ: {selectedContact.name} ({selectedContact.email})</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              {/* Thông tin Ticket */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${typeLabels[selectedContact.type]?.color || typeLabels.GENERAL.color}`}>
                  Loại: {typeLabels[selectedContact.type]?.text || selectedContact.type}
                </span>
                {selectedContact.orderId && (
                  <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Đơn hàng: #{selectedContact.orderId}
                  </span>
                )}
                <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${selectedContact.priority === 'URGENT' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  Ưu tiên: {selectedContact.priority}
                </span>
              </div>

              {/* Nội dung khách gửi */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm font-bold text-gray-700 mb-1">Chủ đề: {selectedContact.title}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{selectedContact.content}</p>
              </div>

              {/* Phần trả lời */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung phản hồi (Admin)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32 text-sm"
                  placeholder="Nhập nội dung trả lời..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium"
              >
                Đóng
              </button>
              <button
                onClick={handleSendReply}
                disabled={sending}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                {sending ? "Đang gửi..." : <><FaReply /> Gửi phản hồi</>}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ListContact;