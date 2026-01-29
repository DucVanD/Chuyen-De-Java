import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiCartAdmin from "../../../api/admin/apiCartAdmin";

const ListCart = () => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            const response = await apiCartAdmin.getAll();
            setCarts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch carts:", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Giỏ hàng</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-4 rounded-l-md">ID</th>
                            <th className="py-3 px-4">Khách hàng</th>
                            <th className="py-3 px-4">Số lượng item</th>
                            <th className="py-3 px-4">Ngày tạo</th>
                            <th className="py-3 px-4 rounded-r-md">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {carts.length > 0 ? (
                            carts.map((cart) => (
                                <tr key={cart.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{cart.id}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                                                {cart.user?.name ? cart.user.name.charAt(0) : "U"}
                                            </div>
                                            <span>{cart.user?.name || `User #${cart.user?.id}`}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-xs font-semibold">
                                            {cart.items?.length || 0} sản phẩm
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{new Date(cart.createdAt).toLocaleDateString("vi-VN")}</td>
                                    <td className="py-3 px-4">
                                        <Link
                                            to={`/admin/cart/detail/${cart.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium transition duration-150"
                                        >
                                            <i className="fas fa-eye mr-1"></i> Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    Chưa có giỏ hàng nào được tạo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListCart;
