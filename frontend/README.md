# 🛒 Siêu Thị Mini - Frontend Admin & Customer

Dự án Frontend được xây dựng bằng **React + Vite**, cung cấp giao diện quản trị (Admin) và cửa hàng (Customer) hiện đại, mượt mà.

## 🚀 Tính năng nổi bật

- **Dashboard Admin**: Quản lý toàn diện Sản phẩm, Danh mục, Đơn hàng, Voucher.
- **Phân quyền người dùng**: Hệ thống Authorization chi tiết cho ADMIN và STAFF.
- **Thanh toán trực tuyến**: Tích hợp cổng thanh toán VNPay.
- **Hỗ trợ khách hàng AI**: Chatbot thông minh sử dụng Google Gemini AI.
- **Responsive Design**: Tương thích hoàn hảo trên mọi thiết bị (Mobile, Tablet, Desktop).
- **Tìm kiếm & Lọc**: Hệ thống lọc sản phẩm và bài viết nâng cao.

## 🛠 Công nghệ sử dụng

- **Core**: React 18, Vite.
- **Styling**: Tailwind CSS (Lucide Icons, FontAwesome).
- **State Management**: Redux Toolkit.
- **API Client**: Axios.
- **Notifications**: React-Toastify.
- **Authentication**: JWT (JSON Web Token).

## 📦 Cài đặt & Chạy ứng dụng

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```
2. **Cấu hình môi trường**:
   - Tạo file `.env` (dựa trên `.env.example`) và điền các URL API Backend.
3. **Chạy ở chế độ Development**:
   ```bash
   npm run dev
   ```
4. **Build sản xuất**:
   ```bash
   npm run build
   ```

## 🏗 Cấu trúc thư mục

- `src/api`: Cấu hình Axios và các module gọi API.
- `src/components`: Các component dùng chung (Layout, Sidebar, Navbar).
- `src/pages`: Giao diện chính phân theo từng module quản lý.
- `src/routers`: Cấu hình routing cho ứng dụng.
- `src/Redux`: Quản lý logic global state.
