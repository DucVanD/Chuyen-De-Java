import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiCartAdmin from "../../../api/admin/apiCartAdmin";
import { imageURL, getImageUrl } from "../../../api/config";

const CartDetail = () => {
    const { id } = useParams();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCartDetail();
    }, [id]);

    const fetchCartDetail = async () => {
        try {
            const response = await apiCartAdmin.getById(id);
            setCart(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch cart detail:", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
    if (!cart) return <div className="text-center mt-10">Không tìm thấy giỏ hàng.</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chi tiết Giỏ hàng #{cart.id}</h1>
                <Link to="/admin/carts" className="text-gray-500 hover:text-gray-700">
                    <i className="fas fa-arrow-left mr-1"></i> Quay lại
                </Link>
            </div>

            <div className="mb-8 p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Thông tin Khách hàng</h2>
                <p><strong>Tên:</strong> {cart.user?.name || "N/A"}</p>
                <p><strong>Email:</strong> {cart.user?.email || "N/A"}</p>
                <p><strong>Số điện thoại:</strong> {cart.user?.phone || "N/A"}</p>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">Danh sách sản phẩm</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <th className="py-3 px-4 rounded-l-md">Sản phẩm</th>
                            <th className="py-3 px-4">Hình ảnh</th>
                            <th className="py-3 px-4">Đơn giá</th>
                            <th className="py-3 px-4">Số lượng</th>
                            <th className="py-3 px-4 rounded-r-md">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {cart.items?.map((item) => {
                            const finalPrice = item.product?.discountPrice > 0 && item.product?.discountPrice < item.product?.salePrice
                                ? item.product.discountPrice
                                : item.product?.salePrice;
                            const hasDiscount = item.product?.discountPrice > 0 && item.product?.discountPrice < item.product?.salePrice;

                            return (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="py-3 px-4 font-medium">{item.product?.name}</td>
                                    <td className="py-3 px-4">
                                        <img
                                            src={getImageUrl(item.product?.image, 'product')}
                                            alt={item.product?.name}
                                            className="w-16 h-16 object-cover rounded border border-gray-200"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/64'}
                                        />
                                    </td>
                                    <td className="py-3 px-4">
                                        {hasDiscount ? (
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{finalPrice?.toLocaleString()} đ</span>
                                                <span className="text-xs text-gray-400 line-through">{item.product?.salePrice?.toLocaleString()} đ</span>
                                            </div>
                                        ) : (
                                            <span>{item.product?.salePrice?.toLocaleString()} đ</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">{item.quantity}</td>
                                    <td className="py-3 px-4 font-bold text-indigo-600">
                                        {(finalPrice * item.quantity).toLocaleString()} đ
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-50 font-semibold text-gray-700">
                            <td colSpan="4" className="py-4 px-4 text-right">Tổng tiền hàng:</td>
                            <td className="py-4 px-4 text-indigo-600 text-lg">
                                {cart.items?.reduce((sum, item) => {
                                    const finalPrice = item.product?.discountPrice > 0 && item.product?.discountPrice < item.product?.salePrice
                                        ? item.product.discountPrice
                                        : item.product?.salePrice;
                                    return sum + (finalPrice * item.quantity);
                                }, 0).toLocaleString()} đ
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default CartDetail;
