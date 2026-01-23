# Test Cases cho Chức năng Đăng nhập & Đăng ký

Tài liệu này tổng hợp các kịch bản kiểm thử (Test Cases) cho chức năng Đăng nhập và Đăng ký dựa trên mã nguồn hiện tại của ứng dụng.

## 1. Chức năng Đăng nhập (Login)

### A. Kiểm thử Hợp lệ (Positive Cases)
| ID | Tên Test Case | Mô tả các bước | Kết quả Mong đợi |
| :--- | :--- | :--- | :--- |
| LG-01 | Đăng nhập thành công với vai trò CUSTOMER | Nhập Email và Mật khẩu chính xác của một tài khoản khách hàng. Nhấn "Đăng nhập". | Đăng nhập thành công, hiển thị thông báo "Đăng nhập thành công!", chuyển hướng về trang chủ. |

### B. Kiểm thử Không hợp lệ & Ràng buộc (Negative Cases)
| ID | Tên Test Case | Mô tả các bước | Kết quả Mong đợi |
| :--- | :--- | :--- | :--- |
| LG-02 | Để trống Email | Để trống trường Email, nhập mật khẩu. Nhấn "Đăng nhập". | Hiển thị thông báo "Email không được để trống". |
| LG-03 | Email không đúng định dạng | Nhập email thiếu @ hoặc sai định dạng (ví dụ: `abc@com`). | Hiển thị thông báo "Email không đúng định dạng". |
| LG-04 | Để trống Mật khẩu | Nhập Email hợp lệ, để trống trường Mật khẩu. | Hiển thị thông báo "Mật khẩu không được để trống". |
| LG-05 | Đăng nhập với tài khoản ADMIN/STAFF | Dùng tài khoản có role ADMIN hoặc STAFF để đăng nhập vào trang người dùng. | Hiển thị thông báo "Tài khoản không dành cho trang người dùng". |
| LG-06 | Sai thông tin mật khẩu | Nhập Email đúng nhưng mật khẩu sai. | Hiển thị thông báo lỗi từ hệ thống (ví dụ: "Sai email hoặc mật khẩu"). |
| LG-07 | Mật khẩu ngắn hơn 6 ký tự | Nhập mật khẩu < 6 ký tự. | (Backend validate) Trả về lỗi "Mật khẩu tối thiểu 6 ký tự". |

---

## 2. Chức năng Đăng ký (Register)

### A. Kiểm thử Hợp lệ (Positive Cases)
| ID | Tên Test Case | Mô tả các bước | Kết quả Mong đợi |
| :--- | :--- | :--- | :--- |
| RG-01 | Đăng ký thành công | Điền đầy đủ: Họ tên, Email hợp lệ, SĐT (10 số, đầu số VN), Mật khẩu (>=6 ký tự, có hoa & thường). | Thông báo "Đăng ký thành công!", tự động đăng nhập và chuyển hướng về trang chủ. |

### B. Kiểm thử Không hợp lệ & Ràng buộc (Negative Cases)
| ID | Tên Test Case | Mô tả các bước | Kết quả Mong đợi |
| :--- | :--- | :--- | :--- |
| RG-02 | Để trống các trường bắt buộc | Nhấn "Đăng ký" khi chưa điền thông tin. | Hiển thị lỗi tương ứng: "Họ và tên/Email/SĐT/Mật khẩu không được để trống". |
| RG-03 | Xác nhận mật khẩu không khớp | Nhập mật khẩu và xác nhận mật khẩu khác nhau. | Hiển thị thông báo "Mật khẩu và xác nhận không khớp!". |
| RG-04 | Số điện thoại không hợp lệ | Nhập SĐT không bắt đầu bằng 03, 05, 07, 08, 09 hoặc không đủ 10 số. | Hiển thị thông báo "Số điện thoại không hợp lệ" (từ backend). |
| RG-05 | Email đã tồn tại | Sử dụng Email đã có trong hệ thống để đăng ký. | Hiển thị thông báo lỗi trùng lặp từ hệ thống. |
| RG-06 | Độ mạnh mật khẩu (Backend) | Nhập mật khẩu >= 6 ký tự nhưng không có chữ HOA hoặc không có chữ thường. | Trả về lỗi "Mật khẩu phải tối thiểu 6 ký tự, có chữ hoa và chữ thường". |

---

## 3. Các chức năng Giao diện khác
- [ ] **Hiện/Ẩn mật khẩu:** Kiểm tra icon con mắt để xem mật khẩu có hiển thị/ẩn đúng không.
- [ ] **Xóa nhanh nội dung:** Kiểm tra nút "X" ở các trường input có xóa sạch text không.
- [ ] **Liên kết Quên mật khẩu:** Kiểm tra link "Quên mật khẩu?" có dẫn đến trang `forgot-password` không.
