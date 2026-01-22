# 🧪 Unit Test Suite

## Tổng Quan

Dự án đã được bổ sung **43 unit tests** toàn diện cho các module quan trọng nhất.

## 📊 Test Coverage

| Module | File Test | Số Test Cases | Mô Tả |
|--------|-----------|---------------|-------|
| **Authentication** | `AuthControllerTest.java` | 10 | Login, Register, JWT validation |
| **User Management** | `UserServiceImplTest.java` | 15 | CRUD, validation, lock/unlock |
| **Order Management** | `OrderServiceImplTest.java` | 12 | Create, cancel, stock, voucher |
| **JWT Security** | `JwtServiceTest.java` | 6 | Token generation, validation |
| **TOTAL** | **4 files** | **43 tests** | - |

## 🚀 Chạy Tests

### Chạy tất cả tests:
```bash
mvn test
```

### Chạy một test class cụ thể:
```bash
mvn test -Dtest=AuthControllerTest
mvn test -Dtest=UserServiceImplTest
mvn test -Dtest=OrderServiceImplTest
mvn test -Dtest=JwtServiceTest
```

### Chạy với coverage report:
```bash
mvn test jacoco:report
```

## 📁 Cấu Trúc Test

```
src/test/
├── java/com/example/backend/
│   ├── controller/
│   │   └── AuthControllerTest.java          (10 tests)
│   ├── service/impl/
│   │   ├── UserServiceImplTest.java         (15 tests)
│   │   └── OrderServiceImplTest.java        (12 tests)
│   └── security/
│       └── JwtServiceTest.java              (6 tests)
└── resources/
    └── application-test.properties          (H2 config)
```

## ✅ Test Cases Chi Tiết

### AuthControllerTest (10 tests)
- ✅ Login với credentials hợp lệ
- ✅ Login thất bại với email sai
- ✅ Login thất bại với password sai
- ✅ JWT token được tạo hợp lệ
- ✅ Register thành công
- ✅ Register thất bại khi password không khớp
- ✅ Register thất bại với email trùng
- ✅ Register thất bại với phone trùng
- ✅ Role luôn là CUSTOMER khi register
- ✅ Password được mã hóa

### UserServiceImplTest (15 tests)
- ✅ Tạo user thành công
- ✅ Tạo user thất bại với email trùng
- ✅ Tạo user thất bại với phone trùng
- ✅ Lấy user theo ID
- ✅ Lấy user theo email
- ✅ Cập nhật user thành công
- ✅ Xóa user thành công
- ✅ Lock/Unlock user
- ✅ Lấy danh sách tất cả users

### OrderServiceImplTest (12 tests)
- ✅ Tạo order thành công
- ✅ Stock movement được ghi nhận
- ✅ Tạo order thất bại khi hết hàng
- ✅ Voucher usage được tăng
- ✅ Hủy order và hoàn stock
- ✅ Hủy order và hoàn voucher
- ✅ Không thể hủy order đã hoàn tất
- ✅ Stock movement khi hủy được ghi nhận
- ✅ Cập nhật trạng thái order
- ✅ COD hoàn tất tự động PAID

### JwtServiceTest (6 tests)
- ✅ Tạo JWT token
- ✅ Trích xuất email từ token
- ✅ Validate token hợp lệ
- ✅ Validate token không hợp lệ
- ✅ Trích xuất claims
- ✅ Kiểm tra token expiration

## 🔧 Cấu Hình Test

### Dependencies (pom.xml)
```xml
<!-- H2 Database for Testing -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>

<!-- Spring Security Test -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

### Test Database (application-test.properties)
- **Database:** H2 in-memory
- **Mode:** create-drop (tự động xóa sau mỗi test)
- **External Services:** Mocked (Cloudinary, Email, VNPay, Gemini AI)

## 🎯 Best Practices Được Áp Dụng

1. **@Transactional**: Mỗi test tự động rollback
2. **@BeforeEach**: Setup data trước mỗi test
3. **Isolated Tests**: Mỗi test độc lập, không phụ thuộc nhau
4. **Clear Naming**: Tên test mô tả rõ ràng mục đích
5. **Assertions**: Kiểm tra kỹ lưỡng kết quả

## 📈 Kết Quả Mong Đợi

Khi chạy `mvn test`, bạn sẽ thấy:
```
[INFO] Tests run: 43, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

## 🔜 Mở Rộng Trong Tương Lai

Các module chưa có test (có thể bổ sung sau):
- ProductServiceImpl
- VoucherServiceImpl
- VNPayServiceImpl
- GeminiServiceImpl (AI Chatbot)
- EmailService
- CloudinaryService

## 📝 Ghi Chú

- Tests sử dụng H2 in-memory database, không ảnh hưởng MySQL production
- Mỗi test chạy trong transaction riêng biệt và tự động rollback
- External services (Cloudinary, VNPay, Email) được mock trong test environment
