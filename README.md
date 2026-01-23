# 🛒 Siêu Thị Mini - Hệ Thống Quản Lý Siêu Thị Thông Minh

Chào mừng bạn đến với dự án **Siêu Thị Mini**. Đây là một ứng dụng thương mại điện tử toàn diện được xây dựng với kiến trúc hiện đại, tích hợp Trí tuệ nhân tạo (AI) và các cổng thanh toán trực tuyến hàng đầu.

## 🏗 Kiến trúc hệ thống

Dự án được chia thành 2 phần chính:
- **Backend**: Spring Boot (Java), MySQL/PostgreSQL, Spring Security (JWT).
- **Frontend**: React (Vite), Tailwind CSS, Redux Toolkit.

---

## 🌟 Tính năng chính

### 1. Dành cho Khách hàng
- **Mua sắm thông minh**: Tìm kiếm, lọc sản phẩm, giỏ hàng mượt mà.
- **Chatbot AI (Gemini)**: Hỗ trợ tìm kiếm sản phẩm và giải đáp thắc mắc bằng ngôn ngữ tự nhiên.
- **Thanh toán đa dạng**: Tích hợp cổng thanh toán **VNPay** và COD (Thanh toán khi nhận hàng).
- **Quản lý tài khoản**: Đăng ký, đăng nhập, theo dõi lịch sử đơn hàng.

### 2. Dành cho Quản trị (Admin & Staff)
- **Dashboard Thống kê**: Biểu đồ doanh thu, thống kê đơn hàng và khách hàng.
- **Quản lý danh mục**: Sản phẩm, Danh mục, Thương hiệu, Nhà cung cấp.
- **Bộ máy nhân sự**: Quản lý nhân viên với phân quyền chi tiết (**ADMIN** vs **STAFF**).
- **Voucher & Khuyến mãi**: Tạo và quản lý mã giảm giá theo thời gian và số lượng.

---

## 🛠 Công nghệ sử dụng

| Lớp | Công nghệ |
|-----|-----------|
| **Backend** | Spring Boot, Hibernate (JPA), JWT, Java Mail, Cloudinary SDK |
| **Frontend** | ReactJS, Vite, Tailwind CSS, Axios, React-Toastify |
| **Database** | MySQL (Development), PostgreSQL (Production/Render) |
| **AI** | Google Gemini API (Generative AI) |
| **Payment** | VNPay Sandbox |

---

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- JDK 17+
- Node.js 18+
- MySQL hoặc PostgreSQL

### 2. Chạy Backend
```bash
cd backend
mvn install
mvn spring-boot:run
```
*Lưu ý: Cấu hình DB và API Keys trong `src/main/resources/application.properties`.*

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Cấu trúc thư mục
```bash
.
├── backend/            # Mã nguồn Spring Boot
│   ├── src/main/java/  # Logic xử lý chính (Controller, Service, Repository)
│   ├── src/test/       # Unit Tests (43 test cases)
│   └── pom.xml         # Quản lý dependencies
├── frontend/           # Mã nguồn React
│   ├── src/pages/      # Các trang giao diện
│   ├── src/api/        # Cấu hình gọi API
│   └── package.json    # Quản lý dependencies
└── docs/               # Tài liệu dự án
```

---

## 📄 Tài liệu tham khảo thêm
- [Hướng dẫn Backend](file:///d:/Learn/Chuyen-De-Java/backend/README.md)
- [Hướng dẫn Frontend](file:///d:/Learn/Chuyen-De-Java/frontend/README.md)
- [Báo cáo Unit Test](file:///d:/Learn/Chuyen-De-Java/backend/src/test/README.md)

---

> [!NOTE]  
> Dự án được phát triển dưới dạng đồ án chuyên đề Java. Mọi thắc mắc vui lòng liên hệ đội ngũ phát triển.
