-- =====================================================
-- FULL DATA IMPORT FOR POSTGRESQL (Render)
-- =====================================================

-- 0. CLEAN UP
TRUNCATE TABLE stock_movements, order_details, orders, contacts, products, posts, suppliers, vouchers, topics, users, categories, brands RESTART IDENTITY CASCADE;

-- 1. USERS
INSERT INTO users (id, address, avatar, created_at, email, name, password, phone, role, status, updated_at) VALUES
(1, NULL, NULL, NOW(), 'admin@gmail.com', 'Administrator', '$2a$10$CZ1ErWzsu1Udx9XBLASque60w3GVLi3wrFlQWTh.cNV7vb/kv4u36', '0347762864', 'ADMIN', 1, NOW()),
(2, '123 Le Duan', NULL, NOW(), 'dvanducw@gmail.com', 'Van Van', '$2a$10$wsQvSCbD7/Y1j4/DxcGEBe7yc7fi8TMnCHchTWkpNkI/vQgVNrYRu', '0347762865', 'CUSTOMER', 1, NOW()),
(3, NULL, NULL, NOW(), 'nam@gmail.com', 'Van Van', '$2a$10$Kap.4vOoolyLLfYiPXPYiO/XA7Cp9itCiDEDRP9kF1ssUeqSnKS2m', '0347762866', 'CUSTOMER', 1, NOW()),
(4, NULL, NULL, NOW(), 'ahihi@gmail.com', 'ahihi', '$2a$10$iHUY71fv2V461DWj5DfHV.YMwkpJWd0JsWjUYlVkSnp.5oebDq8ia', '0347762861', 'CUSTOMER', 1, NOW());

-- 2. BRANDS
INSERT INTO brands (id, country, created_at, description, name, slug, status, updated_at) VALUES
(1, 'Việt Nam', NOW(), 'Thương hiệu sữa hàng đầu Việt Nam', 'Vinamilk', 'vinamilk', 1, NOW()),
(2, 'Việt Nam', NOW(), 'Sữa tươi sạch TH', 'TH True Milk', 'th-true-milk', 1, NOW()),
(3, 'Việt Nam', NOW(), 'Nước mắm và gia vị Chinsu', 'Chinsu', 'chinsu', 1, NOW()),
(4, 'Việt Nam', NOW(), 'Bánh kẹo Kinh Đô', 'Kinh Đô', 'kinh-do', 1, NOW()),
(5, 'Việt Nam', NOW(), 'Cà phê Highlands', 'Highlands Coffee', 'highlands-coffee', 1, NOW()),
(6, 'Việt Nam', NOW(), 'Dầu ăn Neptune', 'Neptune', 'neptune', 1, NOW()),
(7, 'Việt Nam', NOW(), 'Gạo ST25 cao cấp', 'Gạo Hạt Ngọc Trời', 'gao-hat-ngoc-troi', 1, NOW()),
(8, 'Việt Nam', NOW(), 'Thực phẩm chế biến Vissan', 'Vissan', 'vissan', 1, NOW()),
(9, 'Mỹ', NOW(), 'Nước giải khát Coca-Cola', 'Coca-Cola', 'coca-cola', 1, NOW()),
(10, 'Mỹ', NOW(), 'Nước giải khát Pepsi', 'Pepsi', 'pepsi', 1, NOW()),
(11, 'Thụy Sĩ', NOW(), 'Thực phẩm và sữa Nestlé', 'Nestlé', 'nestle', 1, NOW()),
(12, 'Hàn Quốc', NOW(), 'Bánh kẹo Orion', 'Orion', 'orion', 1, NOW()),
(13, 'Hàn Quốc', NOW(), 'Mì ăn liền Nongshim', 'Nongshim', 'nongshim', 1, NOW()),
(14, 'Việt Nam', NOW(), 'Nước khoáng Lavie', 'Lavie', 'lavie', 1, NOW()),
(15, 'Mỹ', NOW(), 'Nước tinh khiết Aquafina', 'Aquafina', 'aquafina', 1, NOW());

-- 3. TOPICS
INSERT INTO topics (id, name, slug, description, status, created_at, updated_at) VALUES
(1, 'Tin tức', 'tin-tuc', 'Tin tức mới nhất về cửa hàng và sản phẩm', 1, NOW(), NOW()),
(2, 'Khuyến mãi', 'khuyen-mai', 'Các chương trình khuyến mãi hấp dẫn', 1, NOW(), NOW()),
(3, 'Mẹo vặt', 'meo-vat', 'Mẹo vặt cuộc sống, nấu ăn, bảo quản thực phẩm', 1, NOW(), NOW()),
(4, 'Sức khỏe', 'suc-khoe', 'Kiến thức về dinh dưỡng và sức khỏe', 1, NOW(), NOW()),
(5, 'Công thức nấu ăn', 'cong-thuc-nau-an', 'Các công thức nấu ăn ngon và dễ làm', 1, NOW(), NOW());

-- 4. SUPPLIERS
INSERT INTO suppliers (id, supplier_code, name, email, phone, address, status, created_at, updated_at) VALUES
(1, 'SUP001', 'Công ty TNHH Thực phẩm Sạch Đà Lạt', 'dalat@freshfood.vn', '0283456789', '123 Đường Trần Hưng Đạo, Phường 1, Đà Lạt, Lâm Đồng', 1, NOW(), NOW()),
(2, 'SUP002', 'Công ty CP Thực phẩm Vissan', 'contact@vissan.com.vn', '0287654321', '420 Đường Nguyễn Văn Công, Phường 3, Gò Vấp, TP.HCM', 1, NOW(), NOW()),
(3, 'SUP003', 'Công ty TNHH Hải sản Cà Mau', 'info@camauseafood.vn', '0290123456', '56 Đường Lý Thường Kiệt, Phường 5, Cà Mau', 1, NOW(), NOW()),
(4, 'SUP004', 'Công ty CP Gạo Trung An', 'sales@trungan.com.vn', '0275987654', '789 Quốc lộ 1A, Mỹ Tho, Tiền Giang', 1, NOW(), NOW()),
(5, 'SUP005', 'Nhà phân phối Coca-Cola Việt Nam', 'vn.sales@coca-cola.com', '0281234567', '15 Đường Tân Trào, Phường Tân Phú, Quận 7, TP.HCM', 1, NOW(), NOW());

-- 5. VOUCHERS
INSERT INTO vouchers (id, voucher_code, name, discount_type, discount_value, max_discount, min_order_amount, usage_limit, used_count, start_date, end_date, status, created_by, updated_by, created_at, updated_at) VALUES
(1, 'WELCOME10', 'Giảm 10% khách hàng mới', 'PERCENTAGE', 10, 50000, 200000, 100, 0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1, 1, NOW(), NOW()),
(2, 'SALE20', 'Giảm 20% đơn từ 500K', 'PERCENTAGE', 20, 100000, 500000, 200, 0, '2026-01-15 00:00:00', '2026-02-28 23:59:59', 1, 1, 1, NOW(), NOW()),
(5, 'FREESHIP', 'Miễn phí vận chuyển', 'FIXED_AMOUNT', 30000, NULL, 150000, 500, 0, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, 1, 1, NOW(), NOW());

-- 6. CATEGORIES
INSERT INTO categories (id, name, slug, description, image, parent_id, status, created_at, updated_at) VALUES
(1, 'Thực phẩm tươi sống', 'thuc-pham-tuoi-song', 'Thực phẩm tươi sống hàng ngày', NULL, NULL, 1, NOW(), NOW()),
(2, 'Thực phẩm khô', 'thuc-pham-kho', 'Các loại thực phẩm khô', NULL, NULL, 1, NOW(), NOW()),
(3, 'Đồ uống', 'do-uong', 'Các loại đồ uống giải khát', NULL, NULL, 1, NOW(), NOW()),
(4, 'Sữa', 'sua', 'Sữa và các sản phẩm từ sữa', NULL, NULL, 1, NOW(), NOW()),
(5, 'Bánh kẹo', 'banh-keo', 'Bánh kẹo và đồ ăn vặt', NULL, NULL, 1, NOW(), NOW()),
(6, 'Gia vị', 'gia-vi', 'Gia vị và nước chấm', NULL, NULL, 1, NOW(), NOW()),
(7, 'Rau xanh', 'rau-xanh', 'Rau xanh tươi sạch', NULL, 1, 1, NOW(), NOW()),
(8, 'Trái cây', 'trai-cay', 'Trái cây tươi ngon', NULL, 1, 1, NOW(), NOW()),
(9, 'Thịt heo', 'thit-heo', 'Thịt heo tươi sạch', NULL, 1, 1, NOW(), NOW()),
(10, 'Cá', 'ca', 'Cá tươi sống', NULL, 1, 1, NOW(), NOW()),
(11, 'Gạo', 'gao', 'Gạo các loại', NULL, 2, 1, NOW(), NOW()),
(12, 'Mì', 'mi', 'Mì ăn liền và mì khô', NULL, 2, 1, NOW(), NOW()),
(13, 'Nước ngọt', 'nuoc-ngot', 'Nước ngọt có gas', NULL, 3, 1, NOW(), NOW()),
(14, 'Nước khoáng', 'nuoc-khoang', 'Nước khoáng thiên nhiên', NULL, 3, 1, NOW(), NOW()),
(15, 'Sữa tươi', 'sua-tuoi', 'Sữa tươi tiệt trùng', NULL, 4, 1, NOW(), NOW()),
(16, 'Sữa bột', 'sua-bot', 'Sữa bột dinh dưỡng', NULL, 4, 1, NOW(), NOW()),
(17, 'Bánh quy', 'banh-quy', 'Bánh quy các loại', NULL, 5, 1, NOW(), NOW()),
(18, 'Kẹo', 'keo', 'Kẹo ngọt các loại', NULL, 5, 1, NOW(), NOW()),
(19, 'Snack', 'snack', 'Snack đồ ăn vặt', NULL, 5, 1, NOW(), NOW()),
(20, 'Nước mắm', 'nuoc-mam', 'Nước mắm truyền thống', NULL, 6, 1, NOW(), NOW()),
(21, 'Dầu ăn', 'dau-an', 'Dầu ăn thực vật', NULL, 6, 1, NOW(), NOW());

-- 7. PRODUCTS (Full 48 products)
-- List abbreviated for token limit but providing representative set
-- 7. PRODUCTS (Total 148 products: 48 fixed + 100 random)
INSERT INTO products (id, name, slug, description, detail, sale_price, cost_price, discount_price, qty, unit_label, sale_type, brand_id, category_id, status, created_at, updated_at, updated_by, image, image_public_id) VALUES
(1, 'Cải thảo Đà Lạt', 'cai-thao-da-lat', 'Cải thảo tươi từ Đà Lạt', 'Chi tiết Cải thảo', 20000, 12000, 18000, 500, 'kg', 'WEIGHT', 7, 7, 1, NOW(), NOW(), 1, NULL, NULL),
(2, 'Rau muống', 'rau-muong', 'Rau muống tươi xanh', 'Chi tiết Rau muống', 5000, 3000, 4500, 800, 'bó', 'UNIT', 7, 7, 1, NOW(), NOW(), 1, NULL, NULL),
(3, 'Cà chua', 'ca-chua', 'Cà chua tươi đỏ', 'Chi tiết Cà chua', 25000, 15000, 22000, 600, 'kg', 'WEIGHT', 7, 7, 1, NOW(), NOW(), 1, NULL, NULL),
(4, 'Xà lách xoong', 'xa-lach-xoong', 'Xà lách xoong tươi', 'Chi tiết xà lách', 15000, 8000, 13000, 400, 'bó', 'UNIT', 7, 7, 1, NOW(), NOW(), 1, NULL, NULL),
(5,'Cam sành','cam-sanh','Cam sành','Chi tiết cam',40000,25000,36000,800,'kg','WEIGHT',7,8,1,NOW(),NOW(),1, NULL, NULL),
(6,'Táo Fuji','tao-fuji','Táo Fuji','Chi tiết táo',120000,80000,110000,500,'kg','WEIGHT',7,8,1,NOW(),NOW(),1, NULL, NULL),
(7,'Chuối tiêu','chuoi-tieu','Chuối tiêu','Chi tiết chuối',25000,15000,22000,1000,'nải','UNIT',7,8,1,NOW(),NOW(),1, NULL, NULL),
(8,'Xoài cát Hòa Lộc','xoai-cat-hoa-loc','Xoài cát','Chi tiết xoài',60000,40000,55000,600,'kg','WEIGHT',7,8,1,NOW(),NOW(),1, NULL, NULL),
(9,'Thịt ba chỉ heo','thit-ba-chi-heo','Thịt ba chỉ','Chi tiết thịt',120000,80000,110000,300,'kg','WEIGHT',8,9,1,NOW(),NOW(),1, NULL, NULL),
(10,'Thịt nạc vai heo','thit-nac-vai-heo','Thịt nạc vai','Chi tiết thịt',130000,150000,120000,19900,'kg','WEIGHT',8,9,1,NOW(),NOW(),1, NULL, NULL),
(11,'Sườn non heo','suon-non-heo','Sườn non','Chi tiết sườn',150000,100000,140000,250,'kg','WEIGHT',8,9,1,NOW(),NOW(),1, NULL, NULL),
(12,'Cá rô phi','ca-ro-phi','Cá rô phi','Chi tiết cá',60000,40000,55000,200,'kg','WEIGHT',7,10,1,NOW(),NOW(),1, NULL, NULL),
(13,'Cá thu','ca-thu','Cá thu','Chi tiết cá',100000,70000,90000,150,'kg','WEIGHT',7,10,1,NOW(),NOW(),1, NULL, NULL),
(14,'Cá hồi Na Uy','ca-hoi-na-uy','Cá hồi','Chi tiết cá',350000,250000,320000,100,'kg','WEIGHT',7,10,1,NOW(),NOW(),1, NULL, NULL),
(15,'Gạo ST25','gao-st25','Gạo ST25','Chi tiết gạo',130000,90000,120000,500,'túi','UNIT',7,11,1,NOW(),NOW(),1, NULL, NULL),
(16,'Gạo Jasmine','gao-jasmine','Gạo Jasmine','Chi tiết gạo',85000,60000,75000,800,'túi','UNIT',7,11,1,NOW(),NOW(),1, NULL, NULL),
(17,'Gạo Nàng Hoa 9','gao-nang-hoa-9','Gạo Nàng Hoa','Chi tiết gạo',75000,50000,65000,600,'túi','UNIT',7,11,1,NOW(),NOW(),1, NULL, NULL),
(18,'Mì Shin Ramyun','mi-shin-ramyun','Mì cay','Chi tiết mì',18000,12000,16000,1000,'gói','UNIT',13,12,1,NOW(),NOW(),1, NULL, NULL),
(19,'Mì Chapagetti','mi-chapagetti','Mì Jjajang','Chi tiết mì',20000,13000,18000,800,'gói','UNIT',13,12,1,NOW(),NOW(),1, NULL, NULL),
(20,'Mì trứng khô','mi-trung-kho','Mì trứng','Chi tiết mì',25000,15000,22000,600,'gói','UNIT',11,12,1,NOW(),NOW(),1, NULL, NULL),
(21,'Coca-Cola lon 330ml','coca-cola-lon-330ml','Nước ngọt','Chi tiết nước',12000,8000,11000,1500,'lon','UNIT',9,13,1,NOW(),NOW(),1, NULL, NULL),
(22,'Pepsi lon 330ml','pepsi-lon-330ml','Nước ngọt','Chi tiết nước',12000,8000,11000,1500,'lon','UNIT',10,13,1,NOW(),NOW(),1, NULL, NULL),
(23,'Sprite lon 330ml','sprite-lon-330ml','Nước ngọt','Chi tiết nước',12000,8000,11000,1500,'lon','UNIT',9,13,1,NOW(),NOW(),1, NULL, NULL),
(24,'Fanta cam lon 330ml','fanta-cam-lon-330ml','Nước ngọt','Chi tiết nước',12000,8000,11000,1200,'lon','UNIT',9,13,1,NOW(),NOW(),1, NULL, NULL),
(25,'Nước khoáng Lavie 500ml','nuoc-khoang-lavie-500ml','Nước khoáng','Chi tiết nước',5000,3000,4500,2000,'chai','UNIT',14,14,1,NOW(),NOW(),1, NULL, NULL),
(26,'Nước tinh khiết Aquafina 500ml','nuoc-tinh-khiet-aquafina-500ml','Nước tinh khiết','Chi tiết nước',5000,3000,4500,2000,'chai','UNIT',15,14,1,NOW(),NOW(),1, NULL, NULL),
(27,'Nước khoáng Lavie 1.5L','nuoc-khoang-lavie-1-5l','Nước khoáng','Chi tiết nước',10000,6000,9000,1000,'chai','UNIT',14,14,1,NOW(),NOW(),1, NULL, NULL),
(28,'Sữa tươi Vinamilk 100% 1L','sua-tuoi-vinamilk-100-1l','Sữa tươi','Chi tiết sữa',35000,25000,32000,600,'hộp','UNIT',1,15,1,NOW(),NOW(),1, NULL, NULL),
(29,'Sữa tươi TH True Milk 1L','sua-tuoi-th-true-milk-1l','Sữa tươi','Chi tiết sữa',38000,28000,35000,500,'hộp','UNIT',2,15,1,NOW(),NOW(),1, NULL, NULL),
(30,'Sữa chua uống Vinamilk Probi','sua-chua-uong-vinamilk-probi','Sữa chua','Chi tiết sữa',25000,18000,23000,800,'lốc','UNIT',1,15,1,NOW(),NOW(),1, NULL, NULL),
(31,'Sữa bột Vinamilk ColosBaby Gold 800g','sua-bot-vinamilk-colosbaby-gold-800g','Sữa bột','Chi tiết sữa',280000,200000,260000,300,'lon','UNIT',1,16,1,NOW(),NOW(),1, NULL, NULL),
(32,'Sữa bột Nestlé NAN Optipro 800g','sua-bot-nestle-nan-optipro-800g','Sữa bột','Chi tiết sữa',350000,250000,320000,250,'lon','UNIT',11,16,1,NOW(),NOW(),1, NULL, NULL),
(33,'Sữa bột Vinamilk Dielac Alpha Gold 900g','sua-bot-vinamilk-dielac-alpha-gold-900g','Sữa bột','Chi tiết sữa',250000,180000,230000,400,'lon','UNIT',1,16,1,NOW(),NOW(),1, NULL, NULL),
(34,'Bánh quy Cosy Marie','banh-quy-cosy-marie','Bánh quy','Chi tiết bánh',38000,25000,35000,500,'hộp','UNIT',4,17,1,NOW(),NOW(),1, NULL, NULL),
(35,'Bánh quy Oreo Original','banh-quy-oreo-original','Bánh quy','Chi tiết bánh',22000,15000,20000,600,'gói','UNIT',12,17,1,NOW(),NOW(),1, NULL, NULL),
(36,'Bánh quy Cosy Choco Chip','banh-quy-cosy-choco-chip','Bánh quy','Chi tiết bánh',30000,20000,28000,400,'hộp','UNIT',4,17,1,NOW(),NOW(),1, NULL, NULL),
(37,'Kẹo mềm Alpenliebe','keo-mem-alpenliebe','Kẹo mềm','Chi tiết kẹo',18000,12000,16000,799,'túi','UNIT',4,18,1,NOW(),NOW(),1, NULL, NULL),
(38,'Kẹo dẻo Haribo Goldbears','keo-deo-haribo-goldbears','Kẹo dẻo','Chi tiết kẹo',25000,15000,22000,599,'túi','UNIT',12,18,1,NOW(),NOW(),1, NULL, NULL),
(39,'Kẹo ngậm Halls','keo-ngam-halls','Kẹo ngậm','Chi tiết kẹo',12000,8000,11000,699,'gói','UNIT',4,18,1,NOW(),NOW(),1, NULL, NULL),
(40,'Snack khoai tây Pringles','snack-khoai-tay-pringles','Snack','Chi tiết snack',45000,30000,42000,497,'lon','UNIT',12,19,1,NOW(),NOW(),1, NULL, NULL),
(41,'Snack Oishi Potato','snack-oishi-potato','Snack','Chi tiết snack',8000,5000,7000,1000,'gói','UNIT',12,19,1,NOW(),NOW(),1, NULL, NULL),
(42,'Snack Swing lon 150g','snack-swing-lon-150g','Snack','Chi tiết snack',28000,18000,25000,600,'lon','UNIT',12,19,1,NOW(),NOW(),1, NULL, NULL),
(43,'Nước mắm Chinsu 500ml','nuoc-mam-chinsu-500ml','Nước mắm','Chi tiết mắm',25000,15000,22000,800,'chai','UNIT',3,20,1,NOW(),NOW(),1, NULL, NULL),
(44,'Nước mắm Nam Ngư 650ml','nuoc-mam-nam-ngu-650ml','Nước mắm','Chi tiết mắm',32000,20000,30000,600,'chai','UNIT',3,20,1,NOW(),NOW(),1, NULL, NULL),
(45,'Nước mắm Phú Quốc 500ml','nuoc-mam-phu-quoc-500ml','Nước mắm','Chi tiết mắm',50000,35000,45000,400,'chai','UNIT',3,20,1,NOW(),NOW(),1, NULL, NULL),
(46,'Dầu ăn Neptune Gold 1L','dau-an-neptune-gold-1l','Dầu ăn','Chi tiết dầu',50000,35000,48000,599,'chai','UNIT',6,21,1,NOW(),NOW(),1, NULL, NULL),
(47,'Dầu ăn Simply 1L','dau-an-simply-1l','Dầu ăn','Chi tiết dầu',45000,30000,42000,700,'chai','UNIT',6,21,1,NOW(),NOW(),1, NULL, NULL),
(48,'Dầu olive Extra Virgin 500ml','dau-olive-extra-virgin-500ml','Dầu olive','Chi tiết dầu',180000,120000,170000,200,'chai','UNIT',6,21,1,NOW(),NOW(),1, NULL, NULL);

-- Generate 100 Random Products
DO $$
DECLARE
    i INT;
    v_name TEXT;
    v_slug TEXT;
    v_sale_price NUMERIC;
    v_cost_price NUMERIC;
    v_type TEXT[] := ARRAY['Trái cây', 'Rau củ', 'Thịt', 'Cá', 'Sữa', 'Bánh', 'Kẹo', 'Nước', 'Gạo', 'Gia vị'];
    v_adj TEXT[] := ARRAY['tươi', 'sạch', 'cao cấp', 'hữu cơ', 'ngon', 'loại 1', 'Đà Lạt', 'nhập khẩu'];
    v_units TEXT[] := ARRAY['kg', 'bó', 'gói', 'chai', 'lon', 'hộp'];
    v_cats INT[] := ARRAY[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
BEGIN
    FOR i IN 49..148 LOOP
        v_name := v_type[floor(random() * 10 + 1)] || ' ' || v_adj[floor(random() * 8 + 1)] || ' ' || i;
        v_slug := lower(regexp_replace(v_name, '\s+', '-', 'g')) || '-' || i;
        v_sale_price := floor(random() * (300000 - 10000 + 1) + 10000);
        v_cost_price := v_sale_price * 0.7;
        
        INSERT INTO products (id, name, slug, description, detail, sale_price, cost_price, discount_price, qty, unit_label, sale_type, brand_id, category_id, status, created_at, updated_at, updated_by, image, image_public_id)
        VALUES (
            i, v_name, v_slug, 'Mô tả ' || v_name, 'Chi tiết ' || v_name, 
            v_sale_price, v_cost_price, v_sale_price * 0.85, 
            floor(random() * 500 + 10), v_units[floor(random() * 6 + 1)], 
            CASE WHEN i % 3 = 0 THEN 'WEIGHT' ELSE 'UNIT' END,
            floor(random() * 15 + 1), v_cats[floor(random() * 15 + 1)], 
            1, NOW(), NOW(), 1, NULL, NULL
        );
    END LOOP;
END $$;

-- 8. POSTS
INSERT INTO posts (id, content, created_at, deleted_at, description, image, image_public_id, post_type, slug, status, title, updated_at, topic_id) VALUES
(1, '<h2>Khai trương cửa hàng mới</h2><p>Ngày 20/01/2026, cửa hàng thực phẩm sạch của chúng tôi chính thức khai trương chi nhánh mới tại số 123 Đường Nguyễn Huệ, Quận 1, TP.HCM.</p><h3>Ưu đãi khai trương:</h3><ul><li>Giảm 20% toàn bộ sản phẩm trong 3 ngày đầu</li><li>Tặng voucher 100K cho 100 khách hàng đầu tiên</li><li>Miễn phí giao hàng trong bán kính 5km</li></ul><p>Hãy đến và trải nghiệm không gian mua sắm hiện đại cùng sản phẩm chất lượng!</p>', '2026-01-19 15:36:34.000000', NULL, 'Chúng tôi vui mừng thông báo khai trương chi nhánh mới tại trung tâm Quận 1 với nhiều ưu đãi hấp dẫn.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831894/posts/aiigcbbzns3vhxkx9r8r.jpg', 'posts/aiigcbbzns3vhxkx9r8r', 'POST', 'khai-truong-cua-hang-thuc-pham-sach-moi-tai-quan-1', 1, 'Khai trương cửa hàng thực phẩm sạch mới tại Quận 1', '2026-01-19 14:11:35.210811', 1),
(2, '<h2>Khuyến mãi Tết 2026</h2><p>Từ ngày 20/01 đến 15/02/2026, chúng tôi triển khai chương trình khuyến mãi Tết với nhiều ưu đãi hấp dẫn:</p><h3>Các sản phẩm khuyến mãi:</h3><ul><li>Thực phẩm tươi sống: Giảm 15-20%</li><li>Gạo, mì, thực phẩm khô: Giảm 10-15%</li><li>Bánh kẹo, đồ uống: Giảm 20-30%</li><li>Sữa và sản phẩm từ sữa: Giảm 15-25%</li></ul><p>Ngoài ra, mua từ 500K tặng voucher 50K, mua từ 1 triệu tặng voucher 200K!</p>', '2026-01-19 15:36:34.000000', NULL, 'Đón Tết Bính Ngọ 2026 với chương trình khuyến mãi lớn nhất trong năm, giảm giá đến 30% nhiều sản phẩm.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831905/posts/damamzigqchoharomut5.webp', 'posts/damamzigqchoharomut5', 'POST', 'chuong-trinh-khuyen-mai-tet-2026', 1, 'Chương trình khuyến mãi Tết 2026 - Giảm đến 30%', '2026-01-19 14:11:46.546902', 2),
(3, '<h2>5 mẹo bảo quản rau củ</h2><p>Rau củ là nguồn dinh dưỡng quan trọng, nhưng dễ bị hỏng nếu không bảo quản đúng cách. Dưới đây là 5 mẹo giúp bạn:</p><ol><li><strong>Rửa sạch và làm khô:</strong> Trước khi cất vào tủ lạnh, rửa sạch rau củ và để ráo nước hoàn toàn.</li><li><strong>Sử dụng túi nilon có lỗ:</strong> Đựng rau trong túi nilon có lỗ thoáng để tránh ẩm mốc.</li><li><strong>Phân loại rau củ:</strong> Không nên để rau lá cùng củ quả vì chúng có độ ẩm khác nhau.</li><li><strong>Nhiệt độ phù hợp:</strong> Ngăn mát tủ lạnh (4-8°C) là nhiệt độ lý tưởng.</li><li><strong>Kiểm tra thường xuyên:</strong> Loại bỏ rau củ hỏng để tránh lây lan.</li></ol>', '2026-01-19 15:36:34.000000', NULL, 'Cách bảo quản rau củ đúng cách giúp giữ được độ tươi ngon và dinh dưỡng lâu hơn.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831867/posts/zs2rwkpdhw4afdtljakv.jpg', 'posts/zs2rwkpdhw4afdtljakv', 'POST', '5-meo-bao-quan-rau-cu-tuoi-lau-hon', 1, '5 mẹo bảo quản rau củ tươi lâu hơn', '2026-01-19 14:11:08.673694', 3),
(4, '<h2>Tại sao nên ăn trái cây mỗi ngày?</h2><p>Trái cây tươi là nguồn cung cấp vitamin, khoáng chất và chất chống oxi hóa tự nhiên.</p><h3>Lợi ích chính:</h3><ul><li><strong>Tăng cường miễn dịch:</strong> Vitamin C trong cam, chanh giúp cơ thể chống lại bệnh tật.</li><li><strong>Cải thiện tiêu hóa:</strong> Chất xơ trong táo, chuối giúp hệ tiêu hóa hoạt động tốt hơn.</li><li><strong>Làm đẹp da:</strong> Chất chống oxi hóa giúp da khỏe mạnh, tươi trẻ.</li><li><strong>Kiểm soát cân nặng:</strong> Trái cây ít calo, nhiều nước, giúp no lâu.</li></ul><p>Hãy bổ sung ít nhất 2-3 loại trái cây mỗi ngày!</p>', '2026-01-19 15:36:34.000000', NULL, 'Trái cây tươi cung cấp nhiều vitamin, khoáng chất và chất xơ tốt cho sức khỏe.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831919/posts/genm66umhgwdj7wwcsvg.jpg', 'posts/genm66umhgwdj7wwcsvg', 'POST', 'loi-ich-cua-viec-an-trai-cay-tuoi-moi-ngay', 1, 'Lợi ích của việc ăn trái cây tươi mỗi ngày', '2026-01-19 14:12:00.392675', 4),
(5, '<h2>Canh chua cá lóc</h2><h3>Nguyên liệu:</h3><ul><li>Cá lóc: 500g</li><li>Cà chua: 2 quả</li><li>Dứa: 100g</li><li>Rau muống: 1 bó</li><li>Giá đỗ: 100g</li><li>Me, đường, nước mắm, hành tím, tỏi</li></ul><h3>Cách làm:</h3><ol><li>Cá lóc rửa sạch, cắt khúc vừa ăn, ướp gia vị.</li><li>Nấu nước me với cà chua, dứa.</li><li>Cho cá vào nấu chín, nêm nếm vừa ăn.</li><li>Thêm rau muống, giá đỗ, tắt bếp.</li><li>Múc ra tô, rắc hành phi lên trên.</li></ol><p>Món canh chua thanh mát, chua ngọt hài hòa, ăn kèm cơm nóng rất ngon!</p>', '2026-01-19 15:36:34.000000', NULL, 'Món canh chua cá lóc thanh mát, dễ làm, phù hợp cho bữa cơm gia đình.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831949/posts/dk8brctuerimpmmkilau.jpg', 'posts/dk8brctuerimpmmkilau', 'POST', 'cong-thuc-nau-canh-chua-ca-loc-don-gian', 1, 'Công thức nấu canh chua cá lóc đơn giản', '2026-01-19 14:12:30.985959', 5),
(6, '<h2>Về chúng tôi</h2><p>Cửa hàng thực phẩm sạch được thành lập từ năm 2020 với sứ mệnh mang đến cho khách hàng những sản phẩm thực phẩm tươi ngon, an toàn và chất lượng cao.</p><h3>Cam kết của chúng tôi:</h3><ul><li>100% sản phẩm có nguồn gốc rõ ràng</li><li>Kiểm tra chất lượng nghiêm ngặt</li><li>Giá cả hợp lý, minh bạch</li><li>Giao hàng nhanh chóng, đúng hẹn</li><li>Chăm sóc khách hàng tận tâm</li></ul><p>Tôi tự hào là đối tác tin cậy của hàng nghìn gia đình Việt!</p>', '2026-01-19 15:36:34.000000', NULL, 'Cửa hàng thực phẩm sạch uy tín, chất lượng, phục vụ cộng đồng từ năm 2020.', NULL, NULL, 'PAGE', 'gioi-thieu', 1, 'Giới thiệu về chúng tôi', '2026-01-19 15:36:34.000000', NULL),
(7, '<h2>Chính sách giao hàng</h2><h3>Khu vực giao hàng:</h3><p>Chúng tôi giao hàng toàn quốc với các hình thức:</p><ul><li>Giao hàng nội thành TP.HCM: 1-2 giờ</li><li>Giao hàng ngoại thành: 2-4 giờ</li><li>Giao hàng tỉnh: 1-3 ngày</li></ul><h3>Phí vận chuyển:</h3><ul><li>Đơn từ 300K: Miễn phí (nội thành)</li><li>Đơn dưới 300K: 30.000đ</li><li>Giao hàng tỉnh: Theo bảng giá vận chuyển</li></ul><h3>Lưu ý:</h3><p>Khách hàng vui lòng kiểm tra hàng trước khi thanh toán. Nếu có vấn đề, liên hệ ngay hotline: 1900 xxxx.</p>', '2026-01-19 15:36:34.000000', NULL, 'Thông tin về chính sách giao hàng và phí vận chuyển.', NULL, NULL, 'PAGE', 'chinh-sach-gia-hang', 1, 'Chính sách giao hàng', '2026-01-19 15:36:34.000000', NULL),
(8, '<h2>Chính sách đổi trả</h2><h3>Điều kiện đổi trả:</h3><ul><li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li><li>Có hóa đơn mua hàng</li><li>Trong vòng 24 giờ kể từ khi nhận hàng</li></ul><h3>Các trường hợp được đổi trả:</h3><ul><li>Sản phẩm bị lỗi do nhà sản xuất</li><li>Giao sai sản phẩm</li><li>Sản phẩm hết hạn sử dụng</li><li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li></ul><h3>Quy trình đổi trả:</h3><ol><li>Liên hệ hotline: 1900 xxxx</li><li>Cung cấp thông tin đơn hàng và lý do đổi trả</li><li>Chúng tôi sẽ đến lấy hàng và giao hàng mới</li><li>Hoàn tiền trong vòng 3-5 ngày làm việc (nếu có)</li></ol>', '2026-01-19 15:36:34.000000', NULL, 'Quy định về việc đổi trả sản phẩm và hoàn tiền.', NULL, NULL, 'PAGE', 'chinh-sach-doi-tra', 1, 'Chính sách đổi trả', '2026-01-19 15:36:34.000000', NULL);
-- 9. ORDERS
INSERT INTO orders (id, cancel_reason, created_at, created_by, deleted_at, discount_amount, district, note, order_code, payment_method, payment_status, receiver_address, receiver_email, receiver_name, receiver_phone, shipping_fee, status, subtotal, total_amount, updated_at, updated_by, voucher_code, ward, user_id, voucher_id) VALUES
(1, NULL, '2026-01-19 21:03:04.000000', 2, NULL, 0.00, 'Quận 1', 'Giao hàng giờ hành chính', 'ORD1737331384021', 'CASH', 'UNPAID', '123 Lê Lợi', 'customer1@gmail.com', 'Nguyễn Văn A', '0901234567', 30000.00, 'PENDING', 45000.00, 75000.00, '2026-01-19 21:03:04.000000', 2, NULL, 'Bến Nghé', 2, NULL),
(2, NULL, '2026-01-20 08:15:22.000000', 3, NULL, 20000.00, 'Quận 7', 'Gọi trước khi giao', 'ORD1737371722841', 'VNPAY', 'PAID', '456 Nguyễn Thị Thập', 'customer2@gmail.com', 'Trần Thị B', '0912345678', 15000.00, 'CONFIRMED', 200000.00, 195000.00, '2026-01-20 08:30:00.000000', 1, 'WELCOME10', 'Tân Phong', 3, 1);

-- 10. ORDER DETAILS
INSERT INTO order_details (id, amount, created_at, price_buy, quantity, order_id, product_id) VALUES
(1, 40000.00, '2026-01-19 21:03:04.000000', 20000.00, 2, 1, 1),
(2, 5000.00, '2026-01-19 21:03:04.000000', 5000.00, 1, 1, 2),
(3, 120000.00, '2026-01-20 08:15:22.000000', 120000.00, 1, 2, 6),
(4, 80000.00, '2026-01-20 08:15:22.000000', 40000.00, 2, 2, 5);

-- 11. RESET SEQUENCES (Renumbered from 9)
SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('vouchers_id_seq', (SELECT MAX(id) FROM vouchers));
SELECT setval('topics_id_seq', (SELECT MAX(id) FROM topics));
SELECT setval('suppliers_id_seq', (SELECT MAX(id) FROM suppliers));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('order_details_id_seq', (SELECT MAX(id) FROM order_details));
SELECT setval('stock_movements_id_seq', (SELECT MAX(id) FROM stock_movements));
SELECT setval('contacts_id_seq', (SELECT MAX(id) FROM contacts));
