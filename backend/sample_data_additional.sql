-- =====================================================
-- SQL SCRIPT: DỮ LIỆU BỔ SUNG - NHÀ CUNG CẤP, VOUCHER, TOPIC, POST
-- =====================================================
-- Database: chuyendejava
-- =====================================================

-- =====================================================
-- 1. NHÀ CUNG CẤP (SUPPLIERS)
-- =====================================================
INSERT INTO suppliers (supplier_code, name, email, phone, address, status, created_at, updated_at) VALUES
('SUP001', 'Công ty TNHH Thực phẩm Sạch Đà Lạt', 'dalat@freshfood.vn', '0283456789', '123 Đường Trần Hưng Đạo, Phường 1, Đà Lạt, Lâm Đồng', 1, NOW(), NOW()),
('SUP002', 'Công ty CP Thực phẩm Vissan', 'contact@vissan.com.vn', '0287654321', '420 Đường Nguyễn Văn Công, Phường 3, Gò Vấp, TP.HCM', 1, NOW(), NOW()),
('SUP003', 'Công ty TNHH Hải sản Cà Mau', 'info@camauseafood.vn', '0290123456', '56 Đường Lý Thường Kiệt, Phường 5, Cà Mau', 1, NOW(), NOW()),
('SUP004', 'Công ty CP Gạo Trung An', 'sales@trungan.com.vn', '0275987654', '789 Quốc lộ 1A, Mỹ Tho, Tiền Giang', 1, NOW(), NOW()),
('SUP005', 'Nhà phân phối Coca-Cola Việt Nam', 'vn.sales@coca-cola.com', '0281234567', '15 Đường Tân Trào, Phường Tân Phú, Quận 7, TP.HCM', 1, NOW(), NOW()),
('SUP006', 'Công ty TNHH Sữa Vinamilk', 'supplier@vinamilk.com.vn', '0288765432', '10 Đường Tân Cảng, Phường 25, Bình Thạnh, TP.HCM', 1, NOW(), NOW()),
('SUP007', 'Công ty CP Bánh kẹo Kinh Đô', 'contact@kinhdo.com.vn', '0283456123', '52 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM', 1, NOW(), NOW()),
('SUP008', 'Nhà phân phối Nongshim Việt Nam', 'vn@nongshim.com', '0287891234', '88 Đường Pasteur, Phường Bến Nghé, Quận 1, TP.HCM', 1, NOW(), NOW());

-- =====================================================
-- 2. VOUCHER
-- =====================================================
-- Voucher giảm theo phần trăm
INSERT INTO vouchers (voucher_code, name, discount_type, discount_value, max_discount, min_order_amount, usage_limit, used_count, start_date, end_date, status, created_by, updated_by, created_at, updated_at) VALUES
('WELCOME10', 'Giảm 10% cho khách hàng mới', 'PERCENTAGE', 10, 50000, 200000, 100, 0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1, 1, NOW(), NOW()),
('SALE20', 'Giảm 20% đơn hàng từ 500K', 'PERCENTAGE', 20, 100000, 500000, 200, 0, '2026-01-15 00:00:00', '2026-02-28 23:59:59', 1, 1, 1, NOW(), NOW()),
('MEGA30', 'Siêu sale 30% đơn từ 1 triệu', 'PERCENTAGE', 30, 300000, 1000000, 50, 0, '2026-01-20 00:00:00', '2026-01-31 23:59:59', 1, 1, 1, NOW(), NOW()),
('VIP15', 'Giảm 15% cho khách VIP', 'PERCENTAGE', 15, 200000, 300000, NULL, 0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1, 1, NOW(), NOW());

-- Voucher giảm tiền cố định
INSERT INTO vouchers (voucher_code, name, discount_type, discount_value, max_discount, min_order_amount, usage_limit, used_count, start_date, end_date, status, created_by, updated_by, created_at, updated_at) VALUES
('FREESHIP', 'Miễn phí vận chuyển', 'FIXED_AMOUNT', 30000, NULL, 150000, 500, 0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1, 1, NOW(), NOW()),
('SAVE50K', 'Giảm 50K cho đơn từ 300K', 'FIXED_AMOUNT', 50000, NULL, 300000, 300, 0, '2026-01-10 00:00:00', '2026-03-31 23:59:59', 1, 1, 1, NOW(), NOW()),
('FLASH100K', 'Flash sale giảm 100K', 'FIXED_AMOUNT', 100000, NULL, 800000, 100, 0, '2026-01-25 00:00:00', '2026-01-25 23:59:59', 1, 1, 1, NOW(), NOW()),
('TET2026', 'Voucher Tết giảm 200K', 'FIXED_AMOUNT', 200000, NULL, 1500000, 150, 0, '2026-01-20 00:00:00', '2026-02-15 23:59:59', 1, 1, 1, NOW(), NOW());

-- =====================================================
-- 3. TOPIC (CHỦ ĐỀ BÀI VIẾT)
-- =====================================================
INSERT INTO topics (name, slug, description, status, created_at, updated_at) VALUES
('Tin tức', 'tin-tuc', 'Tin tức mới nhất về cửa hàng và sản phẩm', 1, NOW(), NOW()),
('Khuyến mãi', 'khuyen-mai', 'Các chương trình khuyến mãi hấp dẫn', 1, NOW(), NOW()),
('Mẹo vặt', 'meo-vat', 'Mẹo vặt cuộc sống, nấu ăn, bảo quản thực phẩm', 1, NOW(), NOW()),
('Sức khỏe', 'suc-khoe', 'Kiến thức về dinh dưỡng và sức khỏe', 1, NOW(), NOW()),
('Công thức nấu ăn', 'cong-thuc-nau-an', 'Các công thức nấu ăn ngon và dễ làm', 1, NOW(), NOW());

-- =====================================================
-- 4. POST (BÀI VIẾT)
-- =====================================================

-- Bài viết loại POST (tin tức)
INSERT INTO posts (topic_id, title, slug, image, description, content, post_type, status, created_at, updated_at) VALUES
(1, 'Khai trương cửa hàng thực phẩm sạch mới tại Quận 1', 'khai-truong-cua-hang-thuc-pham-sach-moi-tai-quan-1', NULL,
'Chúng tôi vui mừng thông báo khai trương chi nhánh mới tại trung tâm Quận 1 với nhiều ưu đãi hấp dẫn.',
'<h2>Khai trương cửa hàng mới</h2><p>Ngày 20/01/2026, cửa hàng thực phẩm sạch của chúng tôi chính thức khai trương chi nhánh mới tại số 123 Đường Nguyễn Huệ, Quận 1, TP.HCM.</p><h3>Ưu đãi khai trương:</h3><ul><li>Giảm 20% toàn bộ sản phẩm trong 3 ngày đầu</li><li>Tặng voucher 100K cho 100 khách hàng đầu tiên</li><li>Miễn phí giao hàng trong bán kính 5km</li></ul><p>Hãy đến và trải nghiệm không gian mua sắm hiện đại cùng sản phẩm chất lượng!</p>',
'POST', 1, NOW(), NOW()),

(2, 'Chương trình khuyến mãi Tết 2026 - Giảm đến 30%', 'chuong-trinh-khuyen-mai-tet-2026', NULL,
'Đón Tết Bính Ngọ 2026 với chương trình khuyến mãi lớn nhất trong năm, giảm giá đến 30% nhiều sản phẩm.',
'<h2>Khuyến mãi Tết 2026</h2><p>Từ ngày 20/01 đến 15/02/2026, chúng tôi triển khai chương trình khuyến mãi Tết với nhiều ưu đãi hấp dẫn:</p><h3>Các sản phẩm khuyến mãi:</h3><ul><li>Thực phẩm tươi sống: Giảm 15-20%</li><li>Gạo, mì, thực phẩm khô: Giảm 10-15%</li><li>Bánh kẹo, đồ uống: Giảm 20-30%</li><li>Sữa và sản phẩm từ sữa: Giảm 15-25%</li></ul><p>Ngoài ra, mua từ 500K tặng voucher 50K, mua từ 1 triệu tặng voucher 200K!</p>',
'POST', 1, NOW(), NOW()),

(3, '5 mẹo bảo quản rau củ tươi lâu hơn', '5-meo-bao-quan-rau-cu-tuoi-lau-hon', NULL,
'Cách bảo quản rau củ đúng cách giúp giữ được độ tươi ngon và dinh dưỡng lâu hơn.',
'<h2>5 mẹo bảo quản rau củ</h2><p>Rau củ là nguồn dinh dưỡng quan trọng, nhưng dễ bị hỏng nếu không bảo quản đúng cách. Dưới đây là 5 mẹo giúp bạn:</p><ol><li><strong>Rửa sạch và làm khô:</strong> Trước khi cất vào tủ lạnh, rửa sạch rau củ và để ráo nước hoàn toàn.</li><li><strong>Sử dụng túi nilon có lỗ:</strong> Đựng rau trong túi nilon có lỗ thoáng để tránh ẩm mốc.</li><li><strong>Phân loại rau củ:</strong> Không nên để rau lá cùng củ quả vì chúng có độ ẩm khác nhau.</li><li><strong>Nhiệt độ phù hợp:</strong> Ngăn mát tủ lạnh (4-8°C) là nhiệt độ lý tưởng.</li><li><strong>Kiểm tra thường xuyên:</strong> Loại bỏ rau củ hỏng để tránh lây lan.</li></ol>',
'POST', 1, NOW(), NOW()),

(4, 'Lợi ích của việc ăn trái cây tươi mỗi ngày', 'loi-ich-cua-viec-an-trai-cay-tuoi-moi-ngay', NULL,
'Trái cây tươi cung cấp nhiều vitamin, khoáng chất và chất xơ tốt cho sức khỏe.',
'<h2>Tại sao nên ăn trái cây mỗi ngày?</h2><p>Trái cây tươi là nguồn cung cấp vitamin, khoáng chất và chất chống oxi hóa tự nhiên.</p><h3>Lợi ích chính:</h3><ul><li><strong>Tăng cường miễn dịch:</strong> Vitamin C trong cam, chanh giúp cơ thể chống lại bệnh tật.</li><li><strong>Cải thiện tiêu hóa:</strong> Chất xơ trong táo, chuối giúp hệ tiêu hóa hoạt động tốt hơn.</li><li><strong>Làm đẹp da:</strong> Chất chống oxi hóa giúp da khỏe mạnh, tươi trẻ.</li><li><strong>Kiểm soát cân nặng:</strong> Trái cây ít calo, nhiều nước, giúp no lâu.</li></ul><p>Hãy bổ sung ít nhất 2-3 loại trái cây mỗi ngày!</p>',
'POST', 1, NOW(), NOW()),

(5, 'Công thức nấu canh chua cá lóc đơn giản', 'cong-thuc-nau-canh-chua-ca-loc-don-gian', NULL,
'Món canh chua cá lóc thanh mát, dễ làm, phù hợp cho bữa cơm gia đình.',
'<h2>Canh chua cá lóc</h2><h3>Nguyên liệu:</h3><ul><li>Cá lóc: 500g</li><li>Cà chua: 2 quả</li><li>Dứa: 100g</li><li>Rau muống: 1 bó</li><li>Giá đỗ: 100g</li><li>Me, đường, nước mắm, hành tím, tỏi</li></ul><h3>Cách làm:</h3><ol><li>Cá lóc rửa sạch, cắt khúc vừa ăn, ướp gia vị.</li><li>Nấu nước me với cà chua, dứa.</li><li>Cho cá vào nấu chín, nêm nếm vừa ăn.</li><li>Thêm rau muống, giá đỗ, tắt bếp.</li><li>Múc ra tô, rắc hành phi lên trên.</li></ol><p>Món canh chua thanh mát, chua ngọt hài hòa, ăn kèm cơm nóng rất ngon!</p>',
'POST', 1, NOW(), NOW());

-- Bài viết loại PAGE (trang tĩnh)
INSERT INTO posts (topic_id, title, slug, image, description, content, post_type, status, created_at, updated_at) VALUES
(NULL, 'Giới thiệu về chúng tôi', 'gioi-thieu', NULL,
'Cửa hàng thực phẩm sạch uy tín, chất lượng, phục vụ cộng đồng từ năm 2020.',
'<h2>Về chúng tôi</h2><p>Cửa hàng thực phẩm sạch được thành lập từ năm 2020 với sứ mệnh mang đến cho khách hàng những sản phẩm thực phẩm tươi ngon, an toàn và chất lượng cao.</p><h3>Cam kết của chúng tôi:</h3><ul><li>100% sản phẩm có nguồn gốc rõ ràng</li><li>Kiểm tra chất lượng nghiêm ngặt</li><li>Giá cả hợp lý, minh bạch</li><li>Giao hàng nhanh chóng, đúng hẹn</li><li>Chăm sóc khách hàng tận tâm</li></ul><p>Chúng tôi tự hào là đối tác tin cậy của hàng nghìn gia đình Việt!</p>',
'PAGE', 1, NOW(), NOW()),

(NULL, 'Chính sách giao hàng', 'chinh-sach-giao-hang', NULL,
'Thông tin về chính sách giao hàng và phí vận chuyển.',
'<h2>Chính sách giao hàng</h2><h3>Khu vực giao hàng:</h3><p>Chúng tôi giao hàng toàn quốc với các hình thức:</p><ul><li>Giao hàng nội thành TP.HCM: 1-2 giờ</li><li>Giao hàng ngoại thành: 2-4 giờ</li><li>Giao hàng tỉnh: 1-3 ngày</li></ul><h3>Phí vận chuyển:</h3><ul><li>Đơn từ 300K: Miễn phí (nội thành)</li><li>Đơn dưới 300K: 30.000đ</li><li>Giao hàng tỉnh: Theo bảng giá vận chuyển</li></ul><h3>Lưu ý:</h3><p>Khách hàng vui lòng kiểm tra hàng trước khi thanh toán. Nếu có vấn đề, liên hệ ngay hotline: 1900 xxxx.</p>',
'PAGE', 1, NOW(), NOW()),

(NULL, 'Chính sách đổi trả', 'chinh-sach-doi-tra', NULL,
'Quy định về việc đổi trả sản phẩm và hoàn tiền.',
'<h2>Chính sách đổi trả</h2><h3>Điều kiện đổi trả:</h3><ul><li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li><li>Có hóa đơn mua hàng</li><li>Trong vòng 24 giờ kể từ khi nhận hàng</li></ul><h3>Các trường hợp được đổi trả:</h3><ul><li>Sản phẩm bị lỗi do nhà sản xuất</li><li>Giao sai sản phẩm</li><li>Sản phẩm hết hạn sử dụng</li><li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li></ul><h3>Quy trình đổi trả:</h3><ol><li>Liên hệ hotline: 1900 xxxx</li><li>Cung cấp thông tin đơn hàng và lý do đổi trả</li><li>Chúng tôi sẽ đến lấy hàng và giao hàng mới</li><li>Hoàn tiền trong vòng 3-5 ngày làm việc (nếu có)</li></ol>',
'PAGE', 1, NOW(), NOW());

-- =====================================================
-- KẾT THÚC SCRIPT BỔ SUNG
-- =====================================================
-- Tổng số bản ghi:
-- - Suppliers: 8 nhà cung cấp
-- - Vouchers: 8 voucher (4 PERCENTAGE + 4 FIXED_AMOUNT)
-- - Topics: 5 chủ đề
-- - Posts: 8 bài viết (5 POST + 3 PAGE)
-- =====================================================
