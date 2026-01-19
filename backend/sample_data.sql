-- =====================================================
-- SQL SCRIPT: TẠO DỮ LIỆU MẪU CHO HỆ THỐNG BÁN HÀNG
-- =====================================================
-- Bảng: categories, brands, products
-- Database: chuyendejava
-- =====================================================

-- =====================================================
-- 1. THÊM DỮ LIỆU DANH MỤC (CATEGORIES)
-- =====================================================

-- DANH MỤC CẤP 1
INSERT INTO categories (name, slug, image, description, status, created_at, updated_at) VALUES
('Thực phẩm tươi sống', 'thuc-pham-tuoi-song', NULL, 'Thực phẩm tươi sống hàng ngày', 1, NOW(), NOW()),
('Thực phẩm khô', 'thuc-pham-kho', NULL, 'Các loại thực phẩm khô, bảo quản lâu dài', 1, NOW(), NOW()),
('Đồ uống', 'do-uong', NULL, 'Các loại đồ uống giải khát', 1, NOW(), NOW()),
('Sữa', 'sua', NULL, 'Sữa và các sản phẩm từ sữa', 1, NOW(), NOW()),
('Bánh kẹo', 'banh-keo', NULL, 'Bánh kẹo và đồ ăn vặt', 1, NOW(), NOW()),
('Gia vị', 'gia-vi', NULL, 'Gia vị và nước chấm', 1, NOW(), NOW());

-- DANH MỤC CẤP 2 - Con của "Thực phẩm tươi sống" (parent_id = 1)
INSERT INTO categories (parent_id, name, slug, image, description, status, created_at, updated_at) VALUES
(1, 'Rau xanh', 'rau-xanh', NULL, 'Rau xanh tươi sạch', 1, NOW(), NOW()),
(1, 'Trái cây', 'trai-cay', NULL, 'Trái cây tươi ngon', 1, NOW(), NOW()),
(1, 'Thịt heo', 'thit-heo', NULL, 'Thịt heo tươi sạch', 1, NOW(), NOW()),
(1, 'Cá', 'ca', NULL, 'Cá tươi sống', 1, NOW(), NOW());

-- DANH MỤC CẤP 2 - Con của "Thực phẩm khô" (parent_id = 2)
INSERT INTO categories (parent_id, name, slug, image, description, status, created_at, updated_at) VALUES
(2, 'Gạo', 'gao', NULL, 'Gạo các loại', 1, NOW(), NOW()),
(2, 'Mì', 'mi', NULL, 'Mì ăn liền và mì khô', 1, NOW(), NOW());

-- DANH MỤC CẤP 2 - Con của "Đồ uống" (parent_id = 3)
INSERT INTO categories (parent_id, name, slug, image, description, status, created_at, updated_at) VALUES
(3, 'Nước ngọt', 'nuoc-ngot', NULL, 'Nước ngọt có gas', 1, NOW(), NOW()),
(3, 'Nước khoáng', 'nuoc-khoang', NULL, 'Nước khoáng thiên nhiên', 1, NOW(), NOW());

-- DANH MỤC CẤP 2 - Con của "Sữa" (parent_id = 4)
INSERT INTO categories (parent_id, name, slug, image, description, status, created_at, updated_at) VALUES
(4, 'Sữa tươi', 'sua-tuoi', NULL, 'Sữa tươi tiệt trùng', 1, NOW(), NOW()),
(4, 'Sữa bột', 'sua-bot', NULL, 'Sữa bột dinh dưỡng', 1, NOW(), NOW());

-- DANH MỤC CẤP 2 - Con của "Bánh kẹo" (parent_id = 5)
INSERT INTO categories (parent_id, name, slug, image, description, status, created_at, updated_at) VALUES
(5, 'Bánh quy', 'banh-quy', NULL, 'Bánh quy các loại', 1, NOW(), NOW()),
(5, 'Kẹo', 'keo', NULL, 'Kẹo ngọt các loại', 1, NOW(), NOW()),
(5, 'Snack', 'snack', NULL, 'Snack đồ ăn vặt', 1, NOW(), NOW());

-- DANH MỤC CẤP 2 - Con của "Gia vị" (parent_id = 6)
INSERT INTO categories (parent_id, name, slug, image, description, status, created_at, updated_at) VALUES
(6, 'Nước mắm', 'nuoc-mam', NULL, 'Nước mắm truyền thống', 1, NOW(), NOW()),
(6, 'Dầu ăn', 'dau-an', NULL, 'Dầu ăn thực vật', 1, NOW(), NOW());

-- =====================================================
-- 2. THÊM DỮ LIỆU THƯƠNG HIỆU (BRANDS)
-- =====================================================
INSERT INTO brands (name, slug, image, description, country, status, created_at, updated_at) VALUES
-- Thương hiệu Việt Nam
('Vinamilk', 'vinamilk', NULL, 'Thương hiệu sữa hàng đầu Việt Nam', 'Việt Nam', 1, NOW(), NOW()),
('TH True Milk', 'th-true-milk', NULL, 'Sữa tươi sạch TH', 'Việt Nam', 1, NOW(), NOW()),
('Chinsu', 'chinsu', NULL, 'Nước mắm và gia vị Chinsu', 'Việt Nam', 1, NOW(), NOW()),
('Kinh Đô', 'kinh-do', NULL, 'Bánh kẹo Kinh Đô', 'Việt Nam', 1, NOW(), NOW()),
('Highlands Coffee', 'highlands-coffee', NULL, 'Cà phê Highlands', 'Việt Nam', 1, NOW(), NOW()),
('Neptune', 'neptune', NULL, 'Dầu ăn Neptune', 'Việt Nam', 1, NOW(), NOW()),
('Gạo Hạt Ngọc Trời', 'gao-hat-ngoc-troi', NULL, 'Gạo ST25 cao cấp', 'Việt Nam', 1, NOW(), NOW()),
('Vissan', 'vissan', NULL, 'Thực phẩm chế biến Vissan', 'Việt Nam', 1, NOW(), NOW()),

-- Thương hiệu quốc tế
('Coca-Cola', 'coca-cola', NULL, 'Nước giải khát Coca-Cola', 'Mỹ', 1, NOW(), NOW()),
('Pepsi', 'pepsi', NULL, 'Nước giải khát Pepsi', 'Mỹ', 1, NOW(), NOW()),
('Nestlé', 'nestle', NULL, 'Thực phẩm và sữa Nestlé', 'Thụy Sĩ', 1, NOW(), NOW()),
('Orion', 'orion', NULL, 'Bánh kẹo Orion', 'Hàn Quốc', 1, NOW(), NOW()),
('Nongshim', 'nongshim', NULL, 'Mì ăn liền Nongshim', 'Hàn Quốc', 1, NOW(), NOW()),
('Lavie', 'lavie', NULL, 'Nước khoáng Lavie', 'Việt Nam', 1, NOW(), NOW()),
('Aquafina', 'aquafina', NULL, 'Nước tinh khiết Aquafina', 'Mỹ', 1, NOW(), NOW());

-- =====================================================
-- 3. THÊM DỮ LIỆU SẢN PHẨM (PRODUCTS)
-- =====================================================

-- ========== RAU XANH (category_id = 7) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(7, 7, 'Cải thảo Đà Lạt', 'cai-thao-da-lat', NULL, 
'Cải thảo tươi từ Đà Lạt', 
'<h3>Cải thảo Đà Lạt</h3><p>Cải thảo tươi ngon từ Đà Lạt, lá xanh mướt, giòn ngọt. Thích hợp nấu lẩu, xào hoặc làm kim chi.</p><ul><li>Xuất xứ: Đà Lạt</li><li>Bảo quản: Ngăn mát tủ lạnh</li><li>HSD: 5-7 ngày</li></ul>', 
500, 'WEIGHT', 'kg', 12000, 20000, 18000, 1, 1, NOW(), NOW()),

(7, 7, 'Rau muống', 'rau-muong', NULL, 
'Rau muống tươi xanh', 
'<h3>Rau muống</h3><p>Rau muống tươi, lá xanh mướt, giòn ngọt. Giàu chất xơ và vitamin.</p><ul><li>Xuất xứ: Việt Nam</li><li>Bảo quản: Ngăn mát tủ lạnh</li><li>HSD: 2-3 ngày</li></ul>', 
800, 'UNIT', 'bó', 3000, 5000, NULL, 1, 1, NOW(), NOW()),

(7, 7, 'Cà chua', 'ca-chua', NULL, 
'Cà chua tươi đỏ', 
'<h3>Cà chua</h3><p>Cà chua tươi, màu đỏ tự nhiên, giàu vitamin C và chất chống oxi hóa.</p><ul><li>Xuất xứ: Đà Lạt</li><li>Bảo quản: Ngăn mát tủ lạnh</li><li>HSD: 5-7 ngày</li></ul>', 
600, 'WEIGHT', 'kg', 15000, 25000, 22000, 1, 1, NOW(), NOW()),

(7, 7, 'Xà lách xoong', 'xa-lach-xoong', NULL, 
'Xà lách xoong tươi', 
'<h3>Xà lách xoong</h3><p>Xà lách xoong tươi, giòn ngọt, thích hợp làm salad hoặc ăn kèm.</p><ul><li>Xuất xứ: Đà Lạt</li><li>Bảo quản: Ngăn mát tủ lạnh</li><li>HSD: 3-5 ngày</li></ul>', 
400, 'UNIT', 'bó', 8000, 15000, NULL, 1, 1, NOW(), NOW());

-- ========== TRÁI CÂY (category_id = 8) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(8, 7, 'Cam sành', 'cam-sanh', NULL, 
'Cam sành Hà Giang', 
'<h3>Cam sành Hà Giang</h3><p>Cam sành ngọt thanh, ít hạt, giàu vitamin C.</p><ul><li>Xuất xứ: Hà Giang</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 1-2 tuần</li></ul>', 
800, 'WEIGHT', 'kg', 25000, 40000, 38000, 1, 1, NOW(), NOW()),

(8, 7, 'Táo Fuji', 'tao-fuji', NULL, 
'Táo Fuji nhập khẩu', 
'<h3>Táo Fuji</h3><p>Táo Fuji giòn ngọt, mọng nước, giàu dinh dưỡng.</p><ul><li>Xuất xứ: Nhật Bản</li><li>Bảo quản: Ngăn mát tủ lạnh</li><li>HSD: 2 tuần</li></ul>', 
500, 'WEIGHT', 'kg', 80000, 120000, 110000, 1, 1, NOW(), NOW()),

(8, 7, 'Chuối tiêu', 'chuoi-tieu', NULL, 
'Chuối tiêu Việt Nam', 
'<h3>Chuối tiêu</h3><p>Chuối tiêu thơm ngon, giàu kali và chất xơ.</p><ul><li>Xuất xứ: Việt Nam</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 3-5 ngày</li></ul>', 
1000, 'UNIT', 'nải', 15000, 25000, NULL, 1, 1, NOW(), NOW()),

(8, 7, 'Xoài cát Hòa Lộc', 'xoai-cat-hoa-loc', NULL, 
'Xoài cát Hòa Lộc', 
'<h3>Xoài cát Hòa Lộc</h3><p>Xoài cát Hòa Lộc thơm ngon, ngọt đậm, thịt vàng mịn.</p><ul><li>Xuất xứ: Tiền Giang</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 5-7 ngày</li></ul>', 
600, 'WEIGHT', 'kg', 40000, 60000, 55000, 1, 1, NOW(), NOW());

-- ========== THỊT HEO (category_id = 9) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(9, 8, 'Thịt ba chỉ heo', 'thit-ba-chi-heo', NULL, 
'Thịt ba chỉ heo tươi', 
'<h3>Thịt ba chỉ heo</h3><p>Thịt ba chỉ heo tươi, có vân mỡ đẹp, thích hợp nướng, kho hoặc luộc.</p><ul><li>Xuất xứ: Việt Nam</li><li>Bảo quản: Ngăn đông tủ lạnh</li><li>HSD: 3-5 ngày (mát), 1-2 tháng (đông)</li></ul>', 
300, 'WEIGHT', 'kg', 80000, 120000, 115000, 1, 1, NOW(), NOW()),

(9, 8, 'Thịt nạc vai heo', 'thit-nac-vai-heo', NULL, 
'Thịt nạc vai heo', 
'<h3>Thịt nạc vai heo</h3><p>Thịt nạc vai heo tươi, thịt mềm, ít mỡ, thích hợp xào, nướng.</p><ul><li>Xuất xứ: Việt Nam</li><li>Bảo quản: Ngăn đông tủ lạnh</li><li>HSD: 3-5 ngày (mát), 1-2 tháng (đông)</li></ul>', 
400, 'WEIGHT', 'kg', 90000, 130000, NULL, 1, 1, NOW(), NOW()),

(9, 8, 'Sườn non heo', 'suon-non-heo', NULL, 
'Sườn non heo tươi', 
'<h3>Sườn non heo</h3><p>Sườn non heo tươi, thịt mềm, thích hợp nướng, rim hoặc hấp.</p><ul><li>Xuất xứ: Việt Nam</li><li>Bảo quản: Ngăn đông tủ lạnh</li><li>HSD: 3-5 ngày (mát), 1-2 tháng (đông)</li></ul>', 
250, 'WEIGHT', 'kg', 100000, 150000, 145000, 1, 1, NOW(), NOW());

-- ========== CÁ (category_id = 10) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(10, 7, 'Cá rô phi', 'ca-ro-phi', NULL, 
'Cá rô phi tươi sống', 
'<h3>Cá rô phi</h3><p>Cá rô phi tươi sống, thịt trắng, ngọt, ít xương. Thích hợp chiên, nướng hoặc nấu canh.</p><ul><li>Xuất xứ: Việt Nam</li><li>Bảo quản: Ngăn đông tủ lạnh</li><li>HSD: 1-2 ngày (mát), 1-2 tháng (đông)</li></ul>', 
200, 'WEIGHT', 'kg', 40000, 60000, 55000, 1, 1, NOW(), NOW()),

(10, 7, 'Cá thu', 'ca-thu', NULL, 
'Cá thu tươi', 
'<h3>Cá thu</h3><p>Cá thu tươi, thịt chắc, giàu omega-3. Thích hợp kho, nướng hoặc chiên.</p><ul><li>Xuất xứ: Việt Nam</li><li>Bảo quản: Ngăn đông tủ lạnh</li><li>HSD: 1-2 ngày (mát), 1-2 tháng (đông)</li></ul>', 
150, 'WEIGHT', 'kg', 70000, 100000, NULL, 1, 1, NOW(), NOW()),

(10, 7, 'Cá hồi Na Uy', 'ca-hoi-na-uy', NULL, 
'Cá hồi Na Uy nhập khẩu', 
'<h3>Cá hồi Na Uy</h3><p>Cá hồi Na Uy cao cấp, thịt đỏ cam, giàu omega-3. Thích hợp làm sashimi, nướng hoặc hấp.</p><ul><li>Xuất xứ: Na Uy</li><li>Bảo quản: Ngăn đông tủ lạnh</li><li>HSD: 2-3 ngày (mát), 2-3 tháng (đông)</li></ul>', 
100, 'WEIGHT', 'kg', 250000, 350000, 330000, 1, 1, NOW(), NOW());

-- ========== GẠO (category_id = 11) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(11, 7, 'Gạo ST25', 'gao-st25', NULL, 
'Gạo ST25 cao cấp túi 5kg', 
'<h3>Gạo ST25</h3><p>Gạo ST25 đạt giải gạo ngon nhất thế giới, hạt dài, thơm ngon, dẻo mềm.</p><ul><li>Xuất xứ: Sóc Trăng</li><li>Trọng lượng: 5kg</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
500, 'UNIT', 'túi', 90000, 130000, 125000, 1, 1, NOW(), NOW()),

(11, 7, 'Gạo Jasmine', 'gao-jasmine', NULL, 
'Gạo Jasmine thơm túi 5kg', 
'<h3>Gạo Jasmine</h3><p>Gạo Jasmine thơm dẻo, hạt dài, trắng đẹp. Thích hợp cho cơm hàng ngày.</p><ul><li>Xuất xứ: Việt Nam</li><li>Trọng lượng: 5kg</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
800, 'UNIT', 'túi', 60000, 85000, NULL, 1, 1, NOW(), NOW()),

(11, 7, 'Gạo Nàng Hoa 9', 'gao-nang-hoa-9', NULL, 
'Gạo Nàng Hoa 9 túi 5kg', 
'<h3>Gạo Nàng Hoa 9</h3><p>Gạo Nàng Hoa 9 thơm ngon, dẻo mềm, hạt trắng đẹp.</p><ul><li>Xuất xứ: Việt Nam</li><li>Trọng lượng: 5kg</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
600, 'UNIT', 'túi', 50000, 75000, 70000, 1, 1, NOW(), NOW());

-- ========== MÌ (category_id = 12) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(12, 13, 'Mì Shin Ramyun', 'mi-shin-ramyun', NULL, 
'Mì cay Hàn Quốc Shin Ramyun gói 120g', 
'<h3>Mì Shin Ramyun</h3><p>Mì ăn liền Hàn Quốc Shin Ramyun vị cay đặc trưng, sợi mì dai ngon.</p><ul><li>Trọng lượng: 120g/gói</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
1000, 'UNIT', 'gói', 12000, 18000, NULL, 1, 1, NOW(), NOW()),

(12, 13, 'Mì Chapagetti', 'mi-chapagetti', NULL, 
'Mì Jjajang Hàn Quốc Chapagetti', 
'<h3>Mì Chapagetti</h3><p>Mì ăn liền Hàn Quốc vị Jjajang (tương đen), thơm ngon độc đáo.</p><ul><li>Trọng lượng: 140g/gói</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
800, 'UNIT', 'gói', 13000, 20000, 18000, 1, 1, NOW(), NOW()),

(12, 11, 'Mì trứng khô', 'mi-trung-kho', NULL, 
'Mì trứng khô gói 500g', 
'<h3>Mì trứng khô</h3><p>Mì trứng khô truyền thống, sợi mì dai, thơm mùi trứng. Thích hợp nấu phở, mì xào.</p><ul><li>Trọng lượng: 500g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 6 tháng</li></ul>', 
600, 'UNIT', 'gói', 15000, 25000, NULL, 1, 1, NOW(), NOW());

-- ========== NƯỚC NGỌT (category_id = 13) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(13, 9, 'Coca-Cola lon 330ml', 'coca-cola-lon-330ml', NULL, 
'Nước ngọt Coca-Cola lon 330ml', 
'<h3>Coca-Cola lon 330ml</h3><p>Nước giải khát có gas Coca-Cola, hương vị đặc trưng, sảng khoái.</p><ul><li>Thể tích: 330ml</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
1500, 'UNIT', 'lon', 8000, 12000, NULL, 1, 1, NOW(), NOW()),

(13, 10, 'Pepsi lon 330ml', 'pepsi-lon-330ml', NULL, 
'Nước ngọt Pepsi lon 330ml', 
'<h3>Pepsi lon 330ml</h3><p>Nước giải khát có gas Pepsi, vị ngọt thanh, sảng khoái.</p><ul><li>Thể tích: 330ml</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
1500, 'UNIT', 'lon', 8000, 12000, NULL, 1, 1, NOW(), NOW()),

(13, 9, 'Sprite lon 330ml', 'sprite-lon-330ml', NULL, 
'Nước ngọt Sprite lon 330ml', 
'<h3>Sprite lon 330ml</h3><p>Nước giải khát có gas Sprite, vị chanh tươi mát.</p><ul><li>Thể tích: 330ml</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
1500, 'UNIT', 'lon', 8000, 12000, NULL, 1, 1, NOW(), NOW()),

(13, 9, 'Fanta cam lon 330ml', 'fanta-cam-lon-330ml', NULL, 
'Nước ngọt Fanta cam lon 330ml', 
'<h3>Fanta cam lon 330ml</h3><p>Nước giải khát có gas Fanta vị cam, ngọt thanh, sảng khoái.</p><ul><li>Thể tích: 330ml</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
1200, 'UNIT', 'lon', 8000, 12000, NULL, 1, 1, NOW(), NOW());

-- ========== NƯỚC KHOÁNG (category_id = 14) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(14, 14, 'Nước khoáng Lavie 500ml', 'nuoc-khoang-lavie-500ml', NULL, 
'Nước khoáng thiên nhiên Lavie chai 500ml', 
'<h3>Nước khoáng Lavie</h3><p>Nước khoáng thiên nhiên Lavie, tinh khiết, giàu khoáng chất tự nhiên.</p><ul><li>Thể tích: 500ml</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
2000, 'UNIT', 'chai', 3000, 5000, NULL, 1, 1, NOW(), NOW()),

(14, 15, 'Nước tinh khiết Aquafina 500ml', 'nuoc-tinh-khiet-aquafina-500ml', NULL, 
'Nước tinh khiết Aquafina chai 500ml', 
'<h3>Nước tinh khiết Aquafina</h3><p>Nước tinh khiết Aquafina qua hệ thống lọc RO hiện đại, an toàn và sạch.</p><ul><li>Thể tích: 500ml</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
2000, 'UNIT', 'chai', 3000, 5000, NULL, 1, 1, NOW(), NOW()),

(14, 14, 'Nước khoáng Lavie 1.5L', 'nuoc-khoang-lavie-1-5l', NULL, 
'Nước khoáng thiên nhiên Lavie chai 1.5L', 
'<h3>Nước khoáng Lavie 1.5L</h3><p>Nước khoáng thiên nhiên Lavie chai lớn 1.5L, tiện lợi cho gia đình.</p><ul><li>Thể tích: 1.5L</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
1000, 'UNIT', 'chai', 6000, 10000, 9000, 1, 1, NOW(), NOW());

-- ========== SỮA TƯƠI (category_id = 15) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(15, 1, 'Sữa tươi Vinamilk 100% 1L', 'sua-tuoi-vinamilk-100-1l', NULL, 
'Sữa tươi tiệt trùng Vinamilk 100% không đường', 
'<h3>Sữa tươi Vinamilk 100%</h3><p>Sữa tươi tiệt trùng 100% từ sữa bò tươi nguyên chất, không đường, giàu canxi và protein.</p><ul><li>Thể tích: 1 lít</li><li>Bảo quản: Ngăn mát tủ lạnh sau khi mở</li><li>HSD: 6 tháng (chưa mở), 3-5 ngày (đã mở)</li></ul>', 
600, 'UNIT', 'hộp', 25000, 35000, 33000, 1, 1, NOW(), NOW()),

(15, 2, 'Sữa tươi TH True Milk 1L', 'sua-tuoi-th-true-milk-1l', NULL, 
'Sữa tươi sạch TH True Milk không đường', 
'<h3>Sữa tươi TH True Milk</h3><p>Sữa tươi sạch 100% từ trang trại TH, không chất bảo quản, giàu dinh dưỡng.</p><ul><li>Thể tích: 1 lít</li><li>Bảo quản: Ngăn mát tủ lạnh</li><li>HSD: 7 ngày</li></ul>', 
500, 'UNIT', 'hộp', 28000, 38000, 36000, 1, 1, NOW(), NOW()),

(15, 1, 'Sữa chua uống Vinamilk Probi', 'sua-chua-uong-vinamilk-probi', NULL, 
'Sữa chua uống Vinamilk Probi lốc 5 chai', 
'<h3>Sữa chua uống Vinamilk Probi</h3><p>Sữa chua uống có lợi khuẩn Probi, tốt cho hệ tiêu hóa. Lốc 5 chai x 65ml.</p><ul><li>Thể tích: 5 x 65ml</li><li>Bảo quản: Ngăn mát tủ lạnh</li><li>HSD: 30 ngày</li></ul>', 
800, 'UNIT', 'lốc', 18000, 25000, NULL, 1, 1, NOW(), NOW());

-- ========== SỮA BỘT (category_id = 16) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(16, 1, 'Sữa bột Vinamilk ColosBaby Gold 800g', 'sua-bot-vinamilk-colosbaby-gold-800g', NULL, 
'Sữa bột Vinamilk ColosBaby Gold cho trẻ 0-12 tháng', 
'<h3>Sữa bột ColosBaby Gold</h3><p>Sữa bột Vinamilk ColosBaby Gold với công thức IQ Plus, giúp phát triển trí não và tăng cường miễn dịch.</p><ul><li>Trọng lượng: 800g</li><li>Độ tuổi: 0-12 tháng</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
300, 'UNIT', 'lon', 200000, 280000, 270000, 1, 1, NOW(), NOW()),

(16, 11, 'Sữa bột Nestlé NAN Optipro 800g', 'sua-bot-nestle-nan-optipro-800g', NULL, 
'Sữa bột Nestlé NAN Optipro số 1', 
'<h3>Sữa bột NAN Optipro</h3><p>Sữa bột Nestlé NAN Optipro với công thức Optipro, giúp bé phát triển toàn diện.</p><ul><li>Trọng lượng: 800g</li><li>Độ tuổi: 0-6 tháng</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
250, 'UNIT', 'lon', 250000, 350000, 340000, 1, 1, NOW(), NOW()),

(16, 1, 'Sữa bột Vinamilk Dielac Alpha Gold 900g', 'sua-bot-vinamilk-dielac-alpha-gold-900g', NULL, 
'Sữa bột Vinamilk Dielac Alpha Gold số 4', 
'<h3>Sữa bột Dielac Alpha Gold</h3><p>Sữa bột Vinamilk Dielac Alpha Gold cho trẻ từ 2-6 tuổi, giúp tăng cường sức đề kháng.</p><ul><li>Trọng lượng: 900g</li><li>Độ tuổi: 2-6 tuổi</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
400, 'UNIT', 'lon', 180000, 250000, NULL, 1, 1, NOW(), NOW());

-- ========== BÁNH QUY (category_id = 17) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(17, 4, 'Bánh quy Cosy Marie', 'banh-quy-cosy-marie', NULL, 
'Bánh quy bơ Cosy Marie hộp 288g', 
'<h3>Bánh quy Cosy Marie</h3><p>Bánh quy bơ Cosy Marie giòn tan, thơm bơ, hộp 288g tiện lợi.</p><ul><li>Trọng lượng: 288g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
500, 'UNIT', 'hộp', 25000, 38000, 35000, 1, 1, NOW(), NOW()),

(17, 12, 'Bánh quy Oreo Original', 'banh-quy-oreo-original', NULL, 
'Bánh quy Oreo vị socola gói 133g', 
'<h3>Bánh quy Oreo</h3><p>Bánh quy Oreo với lớp kem vani giữa hai miếng bánh socola giòn tan.</p><ul><li>Trọng lượng: 133g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
600, 'UNIT', 'gói', 15000, 22000, NULL, 1, 1, NOW(), NOW()),

(17, 4, 'Bánh quy Cosy Choco Chip', 'banh-quy-cosy-choco-chip', NULL, 
'Bánh quy socola chip Cosy hộp 168g', 
'<h3>Bánh quy Cosy Choco Chip</h3><p>Bánh quy socola chip Cosy giòn tan, vị socola đậm đà.</p><ul><li>Trọng lượng: 168g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
400, 'UNIT', 'hộp', 20000, 30000, 28000, 1, 1, NOW(), NOW());

-- ========== KẸO (category_id = 18) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(18, 4, 'Kẹo mềm Alpenliebe', 'keo-mem-alpenliebe', NULL, 
'Kẹo mềm Alpenliebe vị sữa túi 120g', 
'<h3>Kẹo mềm Alpenliebe</h3><p>Kẹo mềm Alpenliebe vị sữa thơm ngon, mềm mịn.</p><ul><li>Trọng lượng: 120g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 18 tháng</li></ul>', 
800, 'UNIT', 'túi', 12000, 18000, NULL, 1, 1, NOW(), NOW()),

(18, 12, 'Kẹo dẻo Haribo Goldbears', 'keo-deo-haribo-goldbears', NULL, 
'Kẹo dẻo Haribo hình gấu túi 80g', 
'<h3>Kẹo dẻo Haribo</h3><p>Kẹo dẻo Haribo Goldbears hình gấu nhiều màu sắc, vị trái cây.</p><ul><li>Trọng lượng: 80g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 18 tháng</li></ul>', 
600, 'UNIT', 'túi', 15000, 25000, 23000, 1, 1, NOW(), NOW()),

(18, 4, 'Kẹo ngậm Halls', 'keo-ngam-halls', NULL, 
'Kẹo ngậm Halls vị bạc hà gói 33.5g', 
'<h3>Kẹo ngậm Halls</h3><p>Kẹo ngậm Halls vị bạc hà mát lạnh, giúp thông mũi, sảng khoái.</p><ul><li>Trọng lượng: 33.5g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
700, 'UNIT', 'gói', 8000, 12000, NULL, 1, 1, NOW(), NOW());

-- ========== SNACK (category_id = 19) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(19, 12, 'Snack khoai tây Pringles', 'snack-khoai-tay-pringles', NULL, 
'Snack khoai tây Pringles vị Original lon 107g', 
'<h3>Snack Pringles</h3><p>Snack khoai tây Pringles giòn rụm, vị tự nhiên, lon 107g tiện lợi.</p><ul><li>Trọng lượng: 107g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', 
500, 'UNIT', 'lon', 30000, 45000, 42000, 1, 1, NOW(), NOW()),

(19, 12, 'Snack Oishi Potato', 'snack-oishi-potato', NULL, 
'Snack khoai tây Oishi vị tảo biển gói 42g', 
'<h3>Snack Oishi Potato</h3><p>Snack khoai tây Oishi vị tảo biển giòn tan, thơm ngon.</p><ul><li>Trọng lượng: 42g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 9 tháng</li></ul>', 
1000, 'UNIT', 'gói', 5000, 8000, NULL, 1, 1, NOW(), NOW()),

(19, 12, 'Snack Swing lon 150g', 'snack-swing-lon-150g', NULL, 
'Snack khoai tây Swing vị tự nhiên lon 150g', 
'<h3>Snack Swing</h3><p>Snack khoai tây Swing giòn rụm, vị tự nhiên, lon 150g tiện lợi.</p><ul><li>Trọng lượng: 150g</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 6 tháng</li></ul>', 
600, 'UNIT', 'lon', 18000, 28000, NULL, 1, 1, NOW(), NOW());

-- ========== NƯỚC MẮM (category_id = 20) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(20, 3, 'Nước mắm Chinsu 500ml', 'nuoc-mam-chinsu-500ml', NULL, 
'Nước mắm Chinsu chai 500ml', 
'<h3>Nước mắm Chinsu</h3><p>Nước mắm Chinsu đạm đà, thơm ngon, độ đạm 40°N. Chai 500ml tiện dụng.</p><ul><li>Thể tích: 500ml</li><li>Độ đạm: 40°N</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
800, 'UNIT', 'chai', 15000, 25000, NULL, 1, 1, NOW(), NOW()),

(20, 3, 'Nước mắm Nam Ngư 650ml', 'nuoc-mam-nam-ngu-650ml', NULL, 
'Nước mắm Nam Ngư chai 650ml', 
'<h3>Nước mắm Nam Ngư</h3><p>Nước mắm Nam Ngư truyền thống, độ đạm 30°N, vị ngọt tự nhiên.</p><ul><li>Thể tích: 650ml</li><li>Độ đạm: 30°N</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
600, 'UNIT', 'chai', 20000, 32000, 30000, 1, 1, NOW(), NOW()),

(20, 3, 'Nước mắm Phú Quốc 500ml', 'nuoc-mam-phu-quoc-500ml', NULL, 
'Nước mắm Phú Quốc truyền thống', 
'<h3>Nước mắm Phú Quốc</h3><p>Nước mắm Phú Quốc nguyên chất, độ đạm 45°N, thơm đậm đà.</p><ul><li>Thể tích: 500ml</li><li>Độ đạm: 45°N</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 24 tháng</li></ul>', 
400, 'UNIT', 'chai', 35000, 50000, 48000, 1, 1, NOW(), NOW());

-- ========== DẦU ĂN (category_id = 21) ==========
INSERT INTO products (category_id, brand_id, name, slug, image, description, detail, qty, sale_type, unit_label, cost_price, sale_price, discount_price, status, updated_by, created_at, updated_at) VALUES
(21, 6, 'Dầu ăn Neptune Gold 1L', 'dau-an-neptune-gold-1l', NULL, 
'Dầu ăn Neptune Gold chai 1 lít', 
'<h3>Dầu ăn Neptune Gold</h3><p>Dầu ăn Neptune Gold từ đậu nành, giàu Omega 3-6-9, tốt cho sức khỏe.</p><ul><li>Thể tích: 1 lít</li><li>Bảo quản: Nơi khô ráo, thoáng mát, tránh ánh nắng</li><li>HSD: 24 tháng</li></ul>', 
600, 'UNIT', 'chai', 35000, 50000, 48000, 1, 1, NOW(), NOW()),

(21, 6, 'Dầu ăn Simply 1L', 'dau-an-simply-1l', NULL, 
'Dầu ăn Simply chai 1 lít', 
'<h3>Dầu ăn Simply</h3><p>Dầu ăn Simply tinh luyện từ đậu nành, trong suốt, không mùi.</p><ul><li>Thể tích: 1 lít</li><li>Bảo quản: Nơi khô ráo, thoáng mát, tránh ánh nắng</li><li>HSD: 24 tháng</li></ul>', 
700, 'UNIT', 'chai', 30000, 45000, NULL, 1, 1, NOW(), NOW()),

(21, 6, 'Dầu olive Extra Virgin 500ml', 'dau-olive-extra-virgin-500ml', NULL, 
'Dầu olive Extra Virgin nhập khẩu', 
'<h3>Dầu olive Extra Virgin</h3><p>Dầu olive Extra Virgin cao cấp nhập khẩu, giàu chất chống oxi hóa, tốt cho tim mạch.</p><ul><li>Thể tích: 500ml</li><li>Xuất xứ: Ý</li><li>Bảo quản: Nơi khô ráo, thoáng mát, tránh ánh nắng</li><li>HSD: 24 tháng</li></ul>', 
200, 'UNIT', 'chai', 120000, 180000, 170000, 1, 1, NOW(), NOW());

-- =====================================================
-- KẾT THÚC SCRIPT
-- =====================================================
-- Tổng số bản ghi đã thêm:
-- - Categories: 21 bản ghi (6 cấp 1 + 15 cấp 2)
-- - Brands: 15 bản ghi
-- - Products: 60 sản phẩm
-- =====================================================
