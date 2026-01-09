-- Script để update database thủ công (nếu cần)
-- Hibernate sẽ tự động thêm column unit_label vì đang dùng ddl-auto=update

-- 1. Update existing products: đổi PACKAGE → UNIT
UPDATE products 
SET sale_type = 'UNIT' 
WHERE sale_type = 'PACKAGE';

-- 2. Set unitLabel mặc định cho sản phẩm đã có
UPDATE products 
SET unit_label = 'cái' 
WHERE sale_type = 'UNIT' AND unit_label IS NULL;

UPDATE products 
SET unit_label = 'phần' 
WHERE sale_type = 'WEIGHT' AND unit_label IS NULL;

-- ✅ DONE
