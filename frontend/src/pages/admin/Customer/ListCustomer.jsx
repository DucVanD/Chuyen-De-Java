import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaShoppingCart, FaDollarSign, FaClock } from "react-icons/fa";
import apiCustomerAdmin from "../../../api/admin/apiCustomerAdmin";

const ListCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await apiCustomerAdmin.getAll();
            setCustomers(data);
        } catch (err) {
            toast.error("Không thể tải danh sách khách hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };
console.log(customers);


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* HEADER */}
            <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b gap-4">
                <h3 className="text-2xl font-semibold text-gray-800">Danh sách khách hàng</h3>

                {/* SEARCH */}
                <div className="relative w-full md:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b text-gray-700 uppercase text-xs tracking-wider">
                                    <th className="py-3 px-4 text-left">Khách hàng</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">SĐT</th>
                                    <th className="py-3 px-4">Số đơn</th>
                                    <th className="py-3 px-4">Tổng chi</th>
                                    <th className="py-3 px-4">Đơn TB</th>
                                    <th className="py-3 px-4">Mua gần nhất</th>
                                    <th className="py-3 px-4">Trạng thái</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                            {/* CUSTOMER INFO */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={customer.avatar || "https://placehold.co/40"}
                                                        alt={customer.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{customer.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {customer.id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4 text-gray-600 text-xs">{customer.email}</td>
                                            <td className="py-3 px-4 text-gray-600">{customer.phone}</td>

                                            {/* STATISTICS */}
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-blue-600">
                                                    <FaShoppingCart size={14} />
                                                    <span className="font-semibold">{customer.totalOrders}</span>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-green-600">
                                                    <FaDollarSign size={14} />
                                                    <span className="font-semibold text-xs">{formatCurrency(customer.totalSpent)}</span>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4 text-center text-gray-600 text-xs">
                                                {formatCurrency(customer.averageOrderValue)}
                                            </td>

                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
                                                    <FaClock size={12} />
                                                    {formatDate(customer.lastOrderDate)}
                                                </div>
                                            </td>

                                            {/* STATUS */}
                                            <td className="py-3 px-4 text-center">
                                                {customer.status === "Active" ? (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                                                        Hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                                                        Khóa
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-10 text-center text-gray-400 italic">
                                            {searchTerm ? "Không tìm thấy khách hàng nào" : "Chưa có khách hàng nào"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* SUMMARY */}
                        {filteredCustomers.length > 0 && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Tổng khách hàng: </span>
                                        <span className="font-semibold text-indigo-600">{filteredCustomers.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Tổng đơn hàng: </span>
                                        <span className="font-semibold text-blue-600">
                                            {filteredCustomers.reduce((sum, c) => sum + (c.totalOrders || 0), 0)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Tổng doanh thu: </span>
                                        <span className="font-semibold text-green-600">
                                            {formatCurrency(filteredCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListCustomer;
