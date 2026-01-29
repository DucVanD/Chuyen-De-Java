# Siêu Thị Mini

Ứng dụng thương mại điện tử (e‑commerce) đa chức năng: mua sắm, quản trị, thanh toán VNPay và hỗ trợ AI.

Thư mục chính:

- `backend/` — Spring Boot API và business logic
- `frontend/` — React (Vite) SPA

## Tính năng chính

- Authentication: đăng ký, đăng nhập, logout, refresh token, quên mật khẩu.
- User: profile, lịch sử đơn hàng, quản lý địa chỉ.
- Sản phẩm: danh sách, tìm kiếm, lọc, chi tiết.
- Giỏ hàng: thêm, sửa, xóa, xóa toàn bộ.
- Đơn hàng: tạo đơn, thay đổi trạng thái, hủy, lịch sử, xuất hoá đơn.
- Thanh toán: tích hợp VNPay (tạo link, callback xử lý kết quả).
- Voucher: tạo/ap dụng mã giảm giá.
- Bài viết / Blog: quản lý post, topic.
- Quản trị (Admin/Staff): CRUD sản phẩm, danh mục, thương hiệu, nhà cung cấp, đơn hàng, khách hàng, voucher, post, inventory.
- Inventory: nhập/xuất/điều chỉnh tồn kho.
- Upload: upload ảnh (Cloudinary), xóa ảnh.
- Chat AI: chatbot hỗ trợ.

## Công nghệ

- Backend: Java, Spring Boot, Spring Security, Spring Data JPA
- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, Axios
- DB: MySQL / PostgreSQL
- Storage: Cloudinary
- Payment: VNPay

## Yêu cầu

- JDK 17+
- Node.js 18+
- Maven 3+
- MySQL hoặc PostgreSQL

## Cài đặt & chạy (local)

1) Backend

```bash
cd backend
# chỉnh file cấu hình DB và các keys trong src/main/resources/application.properties
mvn clean install
mvn spring-boot:run
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Biến môi trường (ví dụ)

- Backend (`application.properties`):
  - `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`
  - `vnpay.*` (cấu hình VNPay)
  - `cloudinary.*` (Cloudinary keys)

- Frontend (`.env`):
  - `VITE_API_URL=http://localhost:8080/api`

## Lệnh hữu ích

- Chạy backend (maven): `mvn spring-boot:run` (từ `backend/`)
- Build jar: `mvn clean package`
- Chạy frontend: `npm run dev` (từ `frontend/`)
- Build frontend: `npm run build`

## Debug nhanh

- Lỗi 405 (Method Not Allowed) khi truy cập `/api/vnpay/create-payment`: endpoint này là `POST` — tránh mở trực tiếp URL bằng trình duyệt (GET). Sử dụng client gửi POST hoặc frontend gọi `createVnpayPayment`.
- Lỗi CORS: kiểm tra `CorsConfig` trong backend và header `withCredentials`/cookies từ frontend.

## Tài liệu nội bộ & mở rộng

- Controllers (backend): `backend/src/main/java/com/example/backend/controller`
- Pages (frontend): `frontend/src/pages`
- API wrappers: `frontend/src/api`

Tôi có thể giúp tạo file chi tiết `ENDPOINTS.md` (tất cả endpoints) hoặc `FRONTEND_API_MAP.md` (ánh xạ trang→API). Trả lời "Endpoints" hoặc "Mapping" để tôi sinh file tương ứng.

---

© Dự án học thuật — sử dụng nội bộ.
