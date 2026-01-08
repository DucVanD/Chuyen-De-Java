import React, { useEffect, useState } from 'react';
import apiContact from '../../../api/apiContact';
import { FaEnvelope, FaUser, FaPhone, FaCommentAlt, FaEye, FaReply, FaTrash, FaCube } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ListContact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await apiContact.getAll();
            if (res && res.status) {
                setContacts(res.data);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Không thể tải danh sách liên hệ!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa lời nhắn này?")) {
            // Placeholder for delete logic
            toast.info("Tính năng xóa đang được cập nhật!");
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-8">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FaEnvelope className="text-indigo-600" /> Hộp thư hỗ trợ
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Quản lý và phản hồi các lời nhắn từ khách hàng</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin liên hệ</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nội dung tin nhắn</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4"><div className="h-12 bg-slate-50 rounded-lg"></div></td>
                                    </tr>
                                ))
                            ) : contacts.length > 0 ? (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shadow-sm">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{contact.name}</span>
                                                    <span className="text-[11px] text-slate-400 font-medium italic">ID: #{contact.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <FaEnvelope className="text-slate-300 text-[10px]" />
                                                    {contact.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold italic">
                                                    <FaPhone className="text-slate-300 text-[10px]" />
                                                    {contact.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="relative group/tooltip">
                                                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                                    "{contact.content}"
                                                </p>
                                                <div className="absolute z-10 hidden group-hover/tooltip:block bg-slate-800 text-white p-3 rounded-xl text-xs w-64 shadow-2xl -top-2 left-0 -translate-y-full border border-slate-700 pointer-events-none after:content-[''] after:absolute after:top-full after:left-5 after:border-8 after:border-transparent after:border-t-slate-800">
                                                    {contact.content}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                                                Chưa xử lý
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem chi tiết">
                                                    <FaEye size={18} />
                                                </button>
                                                <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Phản hồi">
                                                    <FaReply size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
                                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">
                                        <FaCommentAlt size={48} className="mx-auto mb-4 opacity-10" />
                                        Hộp thư hiện đang trống.
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

export default ListContact;
