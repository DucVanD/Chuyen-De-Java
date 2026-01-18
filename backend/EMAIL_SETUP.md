# Hướng dẫn cấu hình Email cho chức năng Quên mật khẩu

## Bước 1: Tạo Gmail App Password

1. Truy cập [Google Account Security](https://myaccount.google.com/security)
2. Bật **2-Step Verification** (Xác minh 2 bước)
3. Sau khi bật 2FA, quay lại Security page
4. Tìm mục **App passwords** (Mật khẩu ứng dụng)
5. Chọn **Mail** và **Windows Computer** (hoặc Other)
6. Google sẽ tạo một mật khẩu 16 ký tự (ví dụ: `abcd efgh ijkl mnop`)
7. **LƯU LẠI** mật khẩu này

## Bước 2: Tạo file .env trong backend

1. Mở thư mục `backend`
2. Tạo file mới tên `.env` (không có phần mở rộng)
3. Thêm nội dung sau:

```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
```

**Thay thế**:
- `your-email@gmail.com` → Email Gmail của bạn
- `abcd efgh ijkl mnop` → App Password vừa tạo (GIỮ NGUYÊN dấu cách)

## Bước 3: Cấu hình IDE (IntelliJ IDEA / Eclipse)

### IntelliJ IDEA:
1. Mở **Run** → **Edit Configurations**
2. Chọn Spring Boot Application
3. Trong tab **Environment variables**, thêm:
   ```
   MAIL_USERNAME=your-email@gmail.com;MAIL_PASSWORD=abcd efgh ijkl mnop
   ```
4. Click **Apply** → **OK**

### Eclipse:
1. Right-click project → **Run As** → **Run Configurations**
2. Tab **Environment** → **New**
3. Thêm từng biến:
   - Name: `MAIL_USERNAME`, Value: `your-email@gmail.com`
   - Name: `MAIL_PASSWORD`, Value: `abcd efgh ijkl mnop`
4. Click **Apply**

## Bước 4: Kiểm tra cấu hình

1. Restart backend server
2. Kiểm tra console không có lỗi về email configuration
3. Test endpoint `/api/auth/forgot-password` với Postman:

```json
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

## Lưu ý bảo mật

✅ **ĐÚNG**:
- File `.env` đã được thêm vào `.gitignore`
- Không commit file `.env` lên Git
- Sử dụng App Password, không dùng mật khẩu Gmail thật

❌ **SAI**:
- Hardcode email/password vào `application.properties`
- Commit file `.env` lên GitHub
- Chia sẻ App Password cho người khác

## Khắc phục sự cố

### Lỗi: "535-5.7.8 Username and Password not accepted"
→ Kiểm tra lại App Password, đảm bảo không có ký tự thừa

### Lỗi: "Could not connect to SMTP host"
→ Kiểm tra firewall/antivirus có chặn port 587 không

### Email không gửi được
→ Kiểm tra Gmail có bật "Less secure app access" (nếu cần)

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console log của backend
2. Gmail Security settings
3. Environment variables đã load chưa
