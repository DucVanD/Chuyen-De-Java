import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { toast } from "react-toastify";

export default function useAddToCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = (product, quantity = 1) => {
    // Kiểm tra nếu sản phẩm không có tồn kho
    if (!product.qty || product.qty <= 0) {
      toast.info("Sản phẩm tạm hết hàng!", {
        position: "top-right",
        autoClose: 300,
      });
      return;
    }

    // Tìm sản phẩm trong giỏ hàng (nếu đã có)
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQty = existingItem ? existingItem.qty : 0;

    // TÍNH TOÁN GIỚI HẠN (portions/packages)
    const maxPortions = product.saleType === "WEIGHT"
      ? Math.floor(product.qty / (product.baseWeight || 1))
      : product.qty;

    // Nếu tổng > giới hạn → cảnh báo
    if (currentQty + quantity > maxPortions) {
      toast.warn(`Chỉ còn ${maxPortions} ${product.saleType === "WEIGHT" ? "phần" : "sản phẩm"} trong kho!`, {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    // Nếu hợp lệ → thêm vào giỏ
    dispatch(
      addToCart({
        ...product,
        qty: quantity,
        product_qty: maxPortions, // ✅ giới hạn theo phần (đối với WEIGHT) hoặc số lượng (đối với PACKAGE)
      })
    );

    const unitLabel = product.saleType === "WEIGHT" ? "phần" : (product.saleType === "PACKAGE" ? "gói" : "sản phẩm");
    toast.success(`🛒 Đã thêm ${quantity} ${unitLabel} "${product.name}" vào giỏ hàng!`, {
      position: "top-right",
      autoClose: 1000,
    });
  };

  return handleAddToCart;
}
