-- =====================================================
-- MIGRATION SCRIPT: MYSQL TO POSTGRESQL (Render)
-- FROM: sieuthimini.sql
-- =====================================================

-- 1. CLEAN UP CURRENT DATA (Optional - Be careful)
-- TRUNCATE TABLE order_details RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE stock_movements RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE products RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE brands RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE post_topic RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE posts RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE topics RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE vouchers RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE password_reset_tokens RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE contacts RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE users RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE suppliers RESTART IDENTITY CASCADE;

-- 2. INSERT BRANDS
INSERT INTO brands (id, country, created_at, deleted_at, description, image, image_public_id, name, slug, status, updated_at) VALUES
(1, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Thương hiệu sữa hàng đầu Việt Nam', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768842551/brands/hp4g1bzz1i3nzij4v2ih.jpg', 'brands/hp4g1bzz1i3nzij4v2ih', 'Vinamilk', 'vinamilk', 1, '2026-01-19 17:09:14.031717'),
(2, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Sữa tươi sạch TH', NULL, NULL, 'TH True Milk', 'th-true-milk', 1, '2026-01-19 15:15:58.000000'),
(3, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Nước mắm và gia vị Chinsu', NULL, NULL, 'Chinsu', 'chinsu', 1, '2026-01-19 15:15:58.000000'),
(4, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Bánh kẹo Kinh Đô', NULL, NULL, 'Kinh Đô', 'kinh-do', 1, '2026-01-19 15:15:58.000000'),
(5, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Cà phê Highlands', NULL, NULL, 'Highlands Coffee', 'highlands-coffee', 1, '2026-01-19 15:15:58.000000'),
(6, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Dầu ăn Neptune', NULL, NULL, 'Neptune', 'neptune', 1, '2026-01-19 15:15:58.000000'),
(7, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Gạo ST25 cao cấp', NULL, NULL, 'Gạo Hạt Ngọc Trời', 'gao-hat-ngoc-troi', 1, '2026-01-19 15:15:58.000000'),
(8, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Thực phẩm chế biến Vissan', NULL, NULL, 'Vissan', 'vissan', 1, '2026-01-19 15:15:58.000000'),
(9, 'Mỹ', '2026-01-19 15:15:58.000000', NULL, 'Nước giải khát Coca-Cola', NULL, NULL, 'Coca-Cola', 'coca-cola', 1, '2026-01-19 15:15:58.000000'),
(10, 'Mỹ', '2026-01-19 15:15:58.000000', NULL, 'Nước giải khát Pepsi', NULL, NULL, 'Pepsi', 'pepsi', 1, '2026-01-19 15:15:58.000000'),
(11, 'Thụy Sĩ', '2026-01-19 15:15:58.000000', NULL, 'Thực phẩm và sữa Nestlé', NULL, NULL, 'Nestlé', 'nestle', 1, '2026-01-19 15:15:58.000000'),
(12, 'Hàn Quốc', '2026-01-19 15:15:58.000000', NULL, 'Bánh kẹo Orion', NULL, NULL, 'Orion', 'orion', 1, '2026-01-19 15:15:58.000000'),
(13, 'Hàn Quốc', '2026-01-19 15:15:58.000000', NULL, 'Mì ăn liền Nongshim', NULL, NULL, 'Nongshim', 'nongshim', 1, '2026-01-19 15:15:58.000000'),
(14, 'Việt Nam', '2026-01-19 15:15:58.000000', NULL, 'Nước khoáng Lavie', NULL, NULL, 'Lavie', 'lavie', 1, '2026-01-19 15:15:58.000000'),
(15, 'Mỹ', '2026-01-19 15:15:58.000000', NULL, 'Nước tinh khiết Aquafina', NULL, NULL, 'Aquafina', 'aquafina', 1, '2026-01-19 15:15:58.000000');

-- 3. INSERT CATEGORIES
INSERT INTO categories (id, created_at, deleted_at, description, image, image_public_id, name, slug, status, updated_at, parent_id) VALUES
(1, '2026-01-19 15:15:57.000000', NULL, 'Thực phẩm tươi sống hàng ngày', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768815371/categories/bdp9zqyfpitxkw3w99wv.png', 'categories/bdp9zqyfpitxkw3w99wv', 'Thực phẩm tươi sống', 'thuc-pham-tuoi-song', 1, '2026-01-19 09:36:13.897980', NULL),
(2, '2026-01-19 15:15:57.000000', NULL, 'Các loại thực phẩm khô, bảo quản lâu dài', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816256/categories/urtectbv4s7sm17ryasp.png', 'categories/urtectbv4s7sm17ryasp', 'Thực phẩm khô', 'thuc-pham-kho', 1, '2026-01-19 10:00:10.434687', NULL),
(3, '2026-01-19 15:15:57.000000', NULL, 'Các loại đồ uống giải khát', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768832091/categories/dxdj9ggwh59aga2srxev.png', 'categories/dxdj9ggwh59aga2srxev', 'Đồ uống', 'do-uong', 1, '2026-01-19 14:14:53.314968', NULL),
(4, '2026-01-19 15:15:57.000000', NULL, 'Sữa và các sản phẩm từ sữa', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768832052/categories/cb1m9yis06fnsysvlby5.jpg', 'categories/cb1m9yis06fnsysvlby5', 'Sữa', 'sua', 1, '2026-01-19 14:14:14.228605', NULL),
(5, '2026-01-19 15:15:57.000000', NULL, 'Bánh kẹo và đồ ăn vặt', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768832001/categories/vl8zph1lsrcsntp4wiy6.png', 'categories/vl8zph1lsrcsntp4wiy6', 'Bánh kẹo', 'banh-keo', 1, '2026-01-19 14:13:24.258200', NULL),
(6, '2026-01-19 15:15:57.000000', NULL, 'Gia vị và nước chấm', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768837763/categories/k8idkzfc6pciie5uofon.jpg', 'categories/k8idkzfc6pciie5uofon', 'Gia vị', 'gia-vi', 1, '2026-01-19 15:49:29.670157', NULL),
(7, '2026-01-19 15:15:57.000000', NULL, 'Rau xanh tươi sạch', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768815350/categories/wqsrs9rurowfo9awimi1.png', 'categories/wqsrs9rurowfo9awimi1', 'Rau xanh', 'rau-xanh', 1, '2026-01-19 09:35:54.939473', 1),
(8, '2026-01-19 15:15:57.000000', NULL, 'Trái cây tươi ngon', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768815385/categories/armiqdcubddhrxwykzz0.png', 'categories/armiqdcubddhrxwykzz0', 'Trái cây', 'trai-cay', 1, '2026-01-19 09:36:28.539670', 1),
(9, '2026-01-19 15:15:57.000000', NULL, 'Thịt heo tươi sạch', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768815688/categories/jjjk237qr1myk691qeml.png', 'categories/jjjk237qr1myk691qeml', 'Thịt heo', 'thit-heo', 1, '2026-01-19 09:41:32.030760', 1),
(10, '2026-01-19 15:15:57.000000', NULL, 'Cá tươi sống', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816122/categories/uikxir2tre1tuyn1dc2g.png', 'categories/uikxir2tre1tuyn1dc2g', 'Cá', 'ca', 1, '2026-01-19 09:48:43.401276', 1),
(11, '2026-01-19 15:15:57.000000', NULL, 'Gạo các loại', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816338/categories/kaiolbfsowqvlcgrwh9y.png', 'categories/kaiolbfsowqvlcgrwh9y', 'Gạo', 'gao', 1, '2026-01-19 09:52:20.234901', 2),
(12, '2026-01-19 15:15:57.000000', NULL, 'Mì ăn liền và mì khô', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816622/categories/zsznv2ubmrv0eg06vn4u.png', 'categories/zsznv2ubmrv0eg06vn4u', 'Mì', 'mi', 1, '2026-01-19 09:59:37.451759', 2),
(13, '2026-01-19 15:15:57.000000', NULL, 'Nước ngọt có gas', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816219/categories/qg7qnygcgqzvwef63eur.png', 'categories/qg7qnygcgqzvwef63eur', 'Nước ngọt', 'nuoc-ngot', 1, '2026-01-19 09:50:20.484781', 3),
(14, '2026-01-19 15:15:57.000000', NULL, 'Nước khoáng thiên nhiên', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816229/categories/wweac8ayei2gvaj2alz5.png', 'categories/wweac8ayei2gvaj2alz5', 'Nước khoáng', 'nuoc-khoang', 1, '2026-01-19 09:50:30.078624', 3),
(15, '2026-01-19 15:15:58.000000', NULL, 'Sữa tươi tiệt trùng', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816435/categories/mw8u3onhxkvwohtouzgm.png', 'categories/mw8u3onhxkvwohtouzgm', 'Sữa tươi', 'sua-tuoi', 1, '2026-01-19 09:53:57.071158', 4),
(16, '2026-01-19 15:15:58.000000', NULL, 'Sữa bột dinh dưỡng', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816449/categories/kdrkty6vzosltotbq0ys.png', 'categories/kdrkty6vzosltotbq0ys', 'Sữa bột', 'sua-bot', 1, '2026-01-19 09:54:10.510202', 4),
(17, '2026-01-19 15:15:58.000000', NULL, 'Bánh quy các loại', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816534/categories/mghdu4usogmjgr3xsr1w.png', 'categories/mghdu4usogmjgr3xsr1w', 'Bánh quy', 'banh-quy', 1, '2026-01-19 09:55:35.351902', 5),
(18, '2026-01-19 15:15:58.000000', NULL, 'Kẹo ngọt các loại', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816462/categories/hjvklxjdveswdcs0rerq.png', 'categories/hjvklxjdveswdcs0rerq', 'Kẹo', 'keo', 1, '2026-01-19 09:54:23.501167', 5),
(19, '2026-01-19 15:15:58.000000', NULL, 'Snack đồ ăn vặt', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768816849/categories/rxbq96blmow10nfzrnes.png', 'categories/rxbq96blmow10nfzrnes', 'Snack', 'snack', 1, '2026-01-19 10:00:50.788534', 5),
(20, '2026-01-19 15:15:58.000000', NULL, 'Nước mắm truyền thống', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817014/categories/oma4qa81wzauy0oqipqi.png', 'categories/oma4qa81wzauy0oqipqi', 'Nước mắm', 'nuoc-mam', 1, '2026-01-19 10:03:35.283323', 6),
(21, '2026-01-19 15:15:58.000000', NULL, 'Dầu ăn thực vật', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817033/categories/zrkez2mjddqcryn352pw.png', 'categories/zrkez2mjddqcryn352pw', 'Dầu ăn', 'dau-an', 1, '2026-01-19 10:04:04.650871', 6);

-- 4. INSERT TOPICS
INSERT INTO topics (id, created_at, deleted_at, description, name, slug, status, updated_at) VALUES
(1, '2026-01-19 15:36:34.000000', NULL, 'Tin tức mới nhất về cửa hàng và sản phẩm', 'Tin tức', 'tin-tuc', 1, '2026-01-19 15:36:34.000000'),
(2, '2026-01-19 15:36:34.000000', NULL, 'Các chương trình khuyến mãi hấp dẫn', 'Khuyến mãi', 'khuyen-mai', 1, '2026-01-19 15:36:34.000000'),
(3, '2026-01-19 15:36:34.000000', NULL, 'Mẹo vặt cuộc sống, nấu ăn, bảo quản thực phẩm', 'Mẹo vặt', 'meo-vat', 1, '2026-01-19 15:36:34.000000'),
(4, '2026-01-19 15:36:34.000000', NULL, 'Kiến thức về dinh dưỡng và sức khỏe', 'Sức khỏe', 'suc-khoe', 1, '2026-01-19 15:36:34.000000'),
(5, '2026-01-19 15:36:34.000000', NULL, 'Các công thức nấu ăn ngon và dễ làm', 'Công thức nấu ăn', 'cong-thuc-nau-an', 1, '2026-01-19 15:36:34.000000');

-- 5. INSERT POSTS
INSERT INTO posts (id, content, created_at, deleted_at, description, image, image_public_id, post_type, slug, status, title, updated_at, topic_id) VALUES
(1, '<h2>Khai trương cửa h&agrave;ng mới</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', '...', '...', 'POST', 'khai-truong-cua-hang-thuc-pham-sach-moi-tai-quan-1', 1, 'Khai trương cửa hàng thực phẩm sạch mới tại Quận 1', '2026-01-19 14:11:35.210811', 1),
(2, '<h2>Khuyến m&atilde;i Tết 2026</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', '...', '...', 'POST', 'chuong-trinh-khuyen-mai-tet-2026', 1, 'Chương trình khuyến mãi Tết 2026 - Giảm đến 30%', '2026-01-19 14:11:46.546902', 2),
(3, '<h2>5 mẹo bảo quản rau củ</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', '...', '...', 'POST', '5-meo-bao-quan-rau-cu-tuoi-lau-hon', 1, '5 mẹo bảo quản rau củ tươi lâu hơn', '2026-01-19 14:11:08.673694', 3),
(4, '<h2>Tại sao n&ecirc;n ăn tr&aacute;i c&acirc;y mỗi ng&agrave;y?</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', '...', '...', 'POST', 'loi-ich-cua-viec-an-trai-cay-tuoi-moi-ngay', 1, 'Lợi ích của việc ăn trái cây tươi mỗi ngày', '2026-01-19 14:12:00.392675', 4),
(5, '<h2>Canh chua c&aacute; l&oacute;c</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', '...', '...', 'POST', 'cong-thuc-nau-canh-chua-ca-loc-don-gian', 1, 'Công thức nấu canh chua cá lóc đơn giản', '2026-01-19 14:12:30.985959', 5),
(6, '<h2>Về chúng tôi</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', NULL, NULL, 'PAGE', 'gioi-thieu', 1, 'Giới thiệu về chúng tôi', '2026-01-19 15:36:34.000000', NULL),
(7, '<h2>Chính sách giao hàng</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', NULL, NULL, 'PAGE', 'chinh-sach-giao-hang', 1, 'Chính sách giao hàng', '2026-01-19 15:36:34.000000', NULL),
(8, '<h2>Chính sách đổi trả</h2>...', '2026-01-19 15:36:34.000000', NULL, '...', NULL, NULL, 'PAGE', 'chinh-sach-doi-tra', 1, 'Chính sách đổi trả', '2026-01-19 15:36:34.000000', NULL);

-- 6. INSERT USERS
INSERT INTO users (id, address, avatar, avatar_public_id, created_at, deleted_at, email, email_verified_at, name, password, phone, role, status, updated_at) VALUES
(1, NULL, NULL, NULL, '2026-01-19 08:19:23.548064', NULL, 'admin@gmail.com', NULL, 'Administrator', '$2a$10$CZ1ErWzsu1Udx9XBLASque60w3GVLi3wrFlQWTh.cNV7vb/kv4u36', '0347762864', 'ADMIN', 1, '2026-01-19 08:19:23.548064'),
(2, '123 Le Duan', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768847413/users/avatar/a4cgdel5sqkaqggpar8a.jpg', 'users/avatar/a4cgdel5sqkaqggpar8a', '2026-01-19 08:20:00.447874', NULL, 'dvanducw@gmail.com', NULL, 'Van Van', '$2a$10$wsQvSCbD7/Y1j4/DxcGEBe7yc7fi8TMnCHchTWkpNkI/vQgVNrYRu', '0347762865', 'CUSTOMER', 1, '2026-01-21 12:18:03.979679'),
(3, NULL, NULL, NULL, '2026-01-21 08:02:29.342664', NULL, 'nam@gmail.com', NULL, 'Van Van', '$2a$10$Kap.4vOoolyLLfYiPXPYiO/XA7Cp9itCiDEDRP9kF1ssUeqSnKS2m', '0347762866', 'CUSTOMER', 1, '2026-01-21 08:02:29.342664'),
(4, NULL, NULL, NULL, '2026-01-21 08:07:09.388926', NULL, 'ahihi@gmail.com', NULL, 'ahihi', '$2a$10$iHUY71fv2V461DWj5DfHV.YMwkpJWd0JsWjUYlVkSnp.5oebDq8ia', '0347762861', 'CUSTOMER', 1, '2026-01-21 08:07:09.388926');

-- 7. INSERT VOUCHERS
INSERT INTO vouchers (id, created_at, created_by, deleted_at, discount_type, discount_value, end_date, max_discount, min_order_amount, name, start_date, status, updated_at, updated_by, usage_limit, used_count, voucher_code) VALUES
(1, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 10.00, '2026-12-31 23:59:59.000000', 50000.00, 200000.00, 'Giảm 10% cho khách hàng mới', '2026-01-01 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 100, 0, 'WELCOME10'),
(2, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 20.00, '2026-02-28 23:59:59.000000', 100000.00, 500000.00, 'Giảm 20% đơn hàng từ 500K', '2026-01-15 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 200, 0, 'SALE20'),
(3, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 30.00, '2026-01-31 23:59:59.000000', 300000.00, 1000000.00, 'Siêu sale 30% đơn từ 1 triệu', '2026-01-20 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 50, 0, 'MEGA30'),
(4, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 15.00, '2026-12-31 23:59:59.000000', 200000.00, 300000.00, 'Giảm 15% cho khách VIP', '2026-01-01 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, NULL, 0, 'VIP15'),
(5, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 30000.00, '2026-12-31 23:59:59.000000', NULL, 150000.00, 'Miễn phí vận chuyển', '2026-01-01 00:00:00.000000', 1, '2026-01-19 19:25:29.979381', 2, 500, 1, 'FREESHIP'),
(6, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 50000.00, '2026-03-31 23:59:59.000000', NULL, 300000.00, 'Giảm 50K cho đơn từ 300K', '2026-01-10 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 300, 0, 'SAVE50K'),
(7, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 100000.00, '2026-01-25 23:59:59.000000', NULL, 800000.00, 'Flash sale giảm 100K', '2026-01-25 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 100, 0, 'FLASH100K'),
(8, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 200000.00, '2026-02-15 23:59:59.000000', NULL, 1500000.00, 'Voucher Tết giảm 200K', '2026-01-20 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 150, 0, 'TET2026');

-- 8. INSERT PRODUCTS
INSERT INTO products (id, base_weight, cost_price, created_at, deleted_at, description, detail, discount_price, image, image_public_id, locked_qty, name, qty, sale_price, sale_type, slug, status, unit_label, updated_at, updated_by, brand_id, category_id) VALUES
(1, 502, 12000.00, '2026-01-19 15:15:58.000000', NULL, 'Cải thảo tươi từ Đà Lạt', '...', 18000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831814/products/nfuhvcnvf816h0nujlvm.jpg', 'products/nfuhvcnvf816h0nujlvm', NULL, 'Cải thảo Đà Lạt', 500, 20000.00, 'WEIGHT', 'cai-thao-da-lat', 1, 'kg', '2026-01-19 14:10:18.319300', 1, 7, 7),
-- (Thêm tương tự cho các sản phẩm khác từ dòng 276...)
(46, NULL, 35000.00, '2026-01-19 15:15:58.000000', NULL, '...', '...', 48000.00, '...', '...', NULL, 'Dầu ăn Neptune Gold 1L', 599, 50000.00, 'UNIT', 'dau-an-neptune-gold-1l', 1, 'chai', '2026-01-19 19:25:29.983587', 2, 6, 21);

-- 9. INSERT ORDERS
INSERT INTO orders (id, cancel_reason, created_at, created_by, deleted_at, discount_amount, district, note, order_code, payment_method, payment_status, receiver_address, receiver_email, receiver_name, receiver_phone, shipping_fee, status, subtotal, total_amount, updated_at, updated_by, voucher_code, ward, user_id, voucher_id) VALUES
(1, NULL, '2026-01-19 19:25:29.919234', 2, NULL, 30000.00, 'Quận 3', '', 'ORD-20260120-228540', 'VNPAY', 'PAID', '123 Le Duan', 'dvanducw@gmail.com', 'Van Van', '0347762865', 0.00, 'COMPLETED', 252000.00, 222000.00, '2026-01-19 19:30:09.775111', 1, 'FREESHIP', 'Phường 1', 2, 5),
(2, NULL, '2026-01-19 19:33:33.796719', 2, NULL, 0.00, 'Quận 3', '', 'ORD-20260120-032617', 'COD', 'UNPAID', '123 Le Duan gg', 'dvanducw@gmail.com', 'Van Van', '0347762865', 0.00, 'CONFIRMED', 30000.00, 30000.00, '2026-01-20 13:27:39.154389', 1, NULL, 'Phường 2', 2, NULL),
(4, NULL, '2026-01-20 07:59:10.814645', 2, NULL, 0.00, 'Tân Bình', '', 'ORD-20260120-858115', 'VNPAY', 'PAID', '40/1 Phước Long B quận 9', 'dvanducw@gmail.com', 'Van Van', '0347762865', 0.00, 'SHIPPING', 65000.00, 65000.00, '2026-01-20 13:28:18.845443', 1, NULL, 'Phường 6', 2, NULL);

-- 10. INSERT ORDER DETAILS
INSERT INTO order_details (id, amount, created_at, price_buy, quantity, order_id, product_id) VALUES
(1, 48000.00, '2026-01-19 19:25:29.947036', 48000.00, 1, 1, 46),
(2, 84000.00, '2026-01-19 19:25:29.954128', 42000.00, 2, 1, 40),
(3, 120000.00, '2026-01-19 19:25:29.956336', 120000.00, 1, 1, 10);

-- 11. RESET SEQUENCES (IMPORTANT)
SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('order_details_id_seq', (SELECT MAX(id) FROM order_details));
SELECT setval('vouchers_id_seq', (SELECT MAX(id) FROM vouchers));
SELECT setval('topics_id_seq', (SELECT MAX(id) FROM topics));
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));
