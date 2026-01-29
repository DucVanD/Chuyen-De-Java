-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for sieuthimini
CREATE DATABASE IF NOT EXISTS `sieuthimini` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sieuthimini`;

-- Dumping structure for table sieuthimini.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpnhnc9urm6fro7oseu9vka70q` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.brands: ~15 rows (approximately)
INSERT INTO `brands` (`id`, `country`, `created_at`, `deleted_at`, `description`, `image`, `image_public_id`, `name`, `slug`, `status`, `updated_at`) VALUES
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

-- Dumping structure for table sieuthimini.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoul14ho7bctbefv8jywp5v3i2` (`slug`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.categories: ~21 rows (approximately)
INSERT INTO `categories` (`id`, `created_at`, `deleted_at`, `description`, `image`, `image_public_id`, `name`, `slug`, `status`, `updated_at`, `parent_id`) VALUES
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

-- Dumping structure for table sieuthimini.contacts
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` int DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reply_content` text COLLATE utf8mb4_unicode_ci,
  `status` enum('IN_PROGRESS','OPEN','REJECTED','RESOLVED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('CANCEL','CHANGE_ADDRESS','DELAY','GENERAL','PRODUCT_ISSUE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `ticket_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKm6o2skt2f7rtgqy3xs7841gl7` (`ticket_code`),
  KEY `FKna8bddygr3l3kq1imghgcskt8` (`user_id`),
  CONSTRAINT `FKna8bddygr3l3kq1imghgcskt8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.contacts: ~2 rows (approximately)
INSERT INTO `contacts` (`id`, `content`, `created_at`, `deleted_at`, `email`, `name`, `order_id`, `phone`, `priority`, `reply_content`, `status`, `title`, `type`, `updated_at`, `updated_by`, `user_id`, `ticket_code`) VALUES
	(1, 'Yêu cầu đổi địa chỉ. Địa chỉ mới: 40/1 Phước Long B quận 9', '2026-01-20 08:33:54.117534', NULL, 'dvanducw@gmail.com', 'Van Van', 4, '0347762865', 'NORMAL', 'ok\n', 'RESOLVED', 'Hỗ trợ đơn hàng ORD-20260120-858115', 'CHANGE_ADDRESS', '2026-01-20 13:28:09.237314', 1, 2, ''),
	(2, 'Khách hàng yêu cầu đổi địa chỉ nhận hàng từ "123 Le Duan" sang "Đ147 40/1 Phước long b"', '2026-01-20 09:00:50.791786', NULL, 'dvanducw@gmail.com', 'Van Van', 2, '0347762865', 'NORMAL', 'đã xác nhận thay đổi cho khách hàng', 'RESOLVED', 'Hỗ trợ đơn hàng ORD-20260120-032617', 'CHANGE_ADDRESS', '2026-01-20 09:01:31.154959', 1, 2, 'CS-20260120-0002');

-- Dumping structure for table sieuthimini.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cancel_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `discount_amount` decimal(38,2) NOT NULL,
  `district` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` enum('BANK','COD','VNPAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('FAILED','PAID','REFUNDED','UNPAID') COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receiver_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_fee` decimal(38,2) NOT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','PENDING','SHIPPING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(38,2) NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `voucher_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int NOT NULL,
  `voucher_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKdhk2umg8ijjkg4njg6891trit` (`order_code`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  KEY `FKdimvsocblb17f45ikjr6xn1wj` (`voucher_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKdimvsocblb17f45ikjr6xn1wj` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.orders: ~4 rows (approximately)
INSERT INTO `orders` (`id`, `cancel_reason`, `created_at`, `created_by`, `deleted_at`, `discount_amount`, `district`, `note`, `order_code`, `payment_method`, `payment_status`, `receiver_address`, `receiver_email`, `receiver_name`, `receiver_phone`, `shipping_fee`, `status`, `subtotal`, `total_amount`, `updated_at`, `updated_by`, `voucher_code`, `ward`, `user_id`, `voucher_id`) VALUES
	(1, NULL, '2026-01-19 19:25:29.919234', 2, NULL, 30000.00, 'Quận 3', '', 'ORD-20260120-228540', 'VNPAY', 'PAID', '123 Le Duan', 'dvanducw@gmail.com', 'Van Van', '0347762865', 0.00, 'COMPLETED', 252000.00, 222000.00, '2026-01-19 19:30:09.775111', 1, 'FREESHIP', 'Phường 1', 2, 5),
	(2, NULL, '2026-01-19 19:33:33.796719', 2, NULL, 0.00, 'Quận 3', '', 'ORD-20260120-032617', 'COD', 'UNPAID', '123 Le Duan gg', 'dvanducw@gmail.com', 'Van Van', '0347762865', 0.00, 'CONFIRMED', 30000.00, 30000.00, '2026-01-20 13:27:39.154389', 1, NULL, 'Phường 2', 2, NULL),
	(3, 'Hủy thanh toán VNPay - Mã lỗi: 24', '2026-01-19 19:40:57.341924', 2, NULL, 0.00, 'Gò Vấp', '', 'ORD-20260120-836536', 'VNPAY', 'UNPAID', '123 Le Duan', 'dvanducw@gmail.com', 'Van Van', '0347762865', 0.00, 'CANCELLED', 65000.00, 65000.00, '2026-01-19 19:41:09.458725', 2, NULL, 'Phường 5', 2, NULL),
	(4, NULL, '2026-01-20 07:59:10.814645', 2, NULL, 0.00, 'Tân Bình', '', 'ORD-20260120-858115', 'VNPAY', 'PAID', '40/1 Phước Long B quận 9', 'dvanducw@gmail.com', 'Van Van', '0347762865', 0.00, 'SHIPPING', 65000.00, 65000.00, '2026-01-20 13:28:18.845443', 1, NULL, 'Phường 6', 2, NULL);

-- Dumping structure for table sieuthimini.order_details
CREATE TABLE IF NOT EXISTS `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(38,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `price_buy` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  KEY `FK4q98utpd73imf4yhttm3w0eax` (`product_id`),
  CONSTRAINT `FK4q98utpd73imf4yhttm3w0eax` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.order_details: ~9 rows (approximately)
INSERT INTO `order_details` (`id`, `amount`, `created_at`, `price_buy`, `quantity`, `order_id`, `product_id`) VALUES
	(1, 48000.00, '2026-01-19 19:25:29.947036', 48000.00, 1, 1, 46),
	(2, 84000.00, '2026-01-19 19:25:29.954128', 42000.00, 2, 1, 40),
	(3, 120000.00, '2026-01-19 19:25:29.956336', 120000.00, 1, 1, 10),
	(4, 12000.00, '2026-01-19 19:33:33.807587', 12000.00, 1, 2, 39),
	(5, 18000.00, '2026-01-19 19:33:33.810114', 18000.00, 1, 2, 37),
	(6, 23000.00, '2026-01-19 19:40:57.355461', 23000.00, 1, 3, 38),
	(7, 42000.00, '2026-01-19 19:40:57.357462', 42000.00, 1, 3, 40),
	(8, 23000.00, '2026-01-20 07:59:10.876807', 23000.00, 1, 4, 38),
	(9, 42000.00, '2026-01-20 07:59:10.880386', 42000.00, 1, 4, 40);

-- Dumping structure for table sieuthimini.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.password_reset_tokens: ~1 rows (approximately)

-- Dumping structure for table sieuthimini.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `post_type` enum('PAGE','POST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `topic_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqmmso8qxjpbxwegdtp0l90390` (`slug`),
  KEY `FKrfchr8dax0kfngvvkbteh5n7h` (`topic_id`),
  CONSTRAINT `FKrfchr8dax0kfngvvkbteh5n7h` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.posts: ~8 rows (approximately)
INSERT INTO `posts` (`id`, `content`, `created_at`, `deleted_at`, `description`, `image`, `image_public_id`, `post_type`, `slug`, `status`, `title`, `updated_at`, `topic_id`) VALUES
	(1, '<h2>Khai trương cửa h&agrave;ng mới</h2>\n<p>Ng&agrave;y 20/01/2026, cửa h&agrave;ng thực phẩm sạch của ch&uacute;ng t&ocirc;i ch&iacute;nh thức khai trương chi nh&aacute;nh mới tại số 123 Đường Nguyễn Huệ, Quận 1, TP.HCM.</p>\n<h3>Ưu đ&atilde;i khai trương:</h3>\n<ul>\n<li>Giảm 20% to&agrave;n bộ sản phẩm trong 3 ng&agrave;y đầu</li>\n<li>Tặng voucher 100K cho 100 kh&aacute;ch h&agrave;ng đầu ti&ecirc;n</li>\n<li>Miễn ph&iacute; giao h&agrave;ng trong b&aacute;n k&iacute;nh 5km</li>\n</ul>\n<p>H&atilde;y đến v&agrave; trải nghiệm kh&ocirc;ng gian mua sắm hiện đại c&ugrave;ng sản phẩm chất lượng!</p>', '2026-01-19 15:36:34.000000', NULL, 'Chúng tôi vui mừng thông báo khai trương chi nhánh mới tại trung tâm Quận 1 với nhiều ưu đãi hấp dẫn.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831894/posts/aiigcbbzns3vhxkx9r8r.jpg', 'posts/aiigcbbzns3vhxkx9r8r', 'POST', 'khai-truong-cua-hang-thuc-pham-sach-moi-tai-quan-1', 1, 'Khai trương cửa hàng thực phẩm sạch mới tại Quận 1', '2026-01-19 14:11:35.210811', 1),
	(2, '<h2>Khuyến m&atilde;i Tết 2026</h2>\n<p>Từ ng&agrave;y 20/01 đến 15/02/2026, ch&uacute;ng t&ocirc;i triển khai chương tr&igrave;nh khuyến m&atilde;i Tết với nhiều ưu đ&atilde;i hấp dẫn:</p>\n<h3>C&aacute;c sản phẩm khuyến m&atilde;i:</h3>\n<ul>\n<li>Thực phẩm tươi sống: Giảm 15-20%</li>\n<li>Gạo, m&igrave;, thực phẩm kh&ocirc;: Giảm 10-15%</li>\n<li>B&aacute;nh kẹo, đồ uống: Giảm 20-30%</li>\n<li>Sữa v&agrave; sản phẩm từ sữa: Giảm 15-25%</li>\n</ul>\n<p>Ngo&agrave;i ra, mua từ 500K tặng voucher 50K, mua từ 1 triệu tặng voucher 200K!</p>', '2026-01-19 15:36:34.000000', NULL, 'Đón Tết Bính Ngọ 2026 với chương trình khuyến mãi lớn nhất trong năm, giảm giá đến 30% nhiều sản phẩm.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831905/posts/damamzigqchoharomut5.webp', 'posts/damamzigqchoharomut5', 'POST', 'chuong-trinh-khuyen-mai-tet-2026', 1, 'Chương trình khuyến mãi Tết 2026 - Giảm đến 30%', '2026-01-19 14:11:46.546902', 2),
	(3, '<h2>5 mẹo bảo quản rau củ</h2>\n<p>Rau củ l&agrave; nguồn dinh dưỡng quan trọng, nhưng dễ bị hỏng nếu kh&ocirc;ng bảo quản đ&uacute;ng c&aacute;ch. Dưới đ&acirc;y l&agrave; 5 mẹo gi&uacute;p bạn:</p>\n<ol>\n<li><strong>Rửa sạch v&agrave; l&agrave;m kh&ocirc;:</strong> Trước khi cất v&agrave;o tủ lạnh, rửa sạch rau củ v&agrave; để r&aacute;o nước ho&agrave;n to&agrave;n.</li>\n<li><strong>Sử dụng t&uacute;i nilon c&oacute; lỗ:</strong> Đựng rau trong t&uacute;i nilon c&oacute; lỗ tho&aacute;ng để tr&aacute;nh ẩm mốc.</li>\n<li><strong>Ph&acirc;n loại rau củ:</strong> Kh&ocirc;ng n&ecirc;n để rau l&aacute; c&ugrave;ng củ quả v&igrave; ch&uacute;ng c&oacute; độ ẩm kh&aacute;c nhau.</li>\n<li><strong>Nhiệt độ ph&ugrave; hợp:</strong> Ngăn m&aacute;t tủ lạnh (4-8&deg;C) l&agrave; nhiệt độ l&yacute; tưởng.</li>\n<li><strong>Kiểm tra thường xuy&ecirc;n:</strong> Loại bỏ rau củ hỏng để tr&aacute;nh l&acirc;y lan.</li>\n</ol>', '2026-01-19 15:36:34.000000', NULL, 'Cách bảo quản rau củ đúng cách giúp giữ được độ tươi ngon và dinh dưỡng lâu hơn.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831867/posts/zs2rwkpdhw4afdtljakv.jpg', 'posts/zs2rwkpdhw4afdtljakv', 'POST', '5-meo-bao-quan-rau-cu-tuoi-lau-hon', 1, '5 mẹo bảo quản rau củ tươi lâu hơn', '2026-01-19 14:11:08.673694', 3),
	(4, '<h2>Tại sao n&ecirc;n ăn tr&aacute;i c&acirc;y mỗi ng&agrave;y?</h2>\n<p>Tr&aacute;i c&acirc;y tươi l&agrave; nguồn cung cấp vitamin, kho&aacute;ng chất v&agrave; chất chống oxi h&oacute;a tự nhi&ecirc;n.</p>\n<h3>Lợi &iacute;ch ch&iacute;nh:</h3>\n<ul>\n<li><strong>Tăng cường miễn dịch:</strong> Vitamin C trong cam, chanh gi&uacute;p cơ thể chống lại bệnh tật.</li>\n<li><strong>Cải thiện ti&ecirc;u h&oacute;a:</strong> Chất xơ trong t&aacute;o, chuối gi&uacute;p hệ ti&ecirc;u h&oacute;a hoạt động tốt hơn.</li>\n<li><strong>L&agrave;m đẹp da:</strong> Chất chống oxi h&oacute;a gi&uacute;p da khỏe mạnh, tươi trẻ.</li>\n<li><strong>Kiểm so&aacute;t c&acirc;n nặng:</strong> Tr&aacute;i c&acirc;y &iacute;t calo, nhiều nước, gi&uacute;p no l&acirc;u.</li>\n</ul>\n<p>H&atilde;y bổ sung &iacute;t nhất 2-3 loại tr&aacute;i c&acirc;y mỗi ng&agrave;y!</p>', '2026-01-19 15:36:34.000000', NULL, 'Trái cây tươi cung cấp nhiều vitamin, khoáng chất và chất xơ tốt cho sức khỏe.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831919/posts/genm66umhgwdj7wwcsvg.jpg', 'posts/genm66umhgwdj7wwcsvg', 'POST', 'loi-ich-cua-viec-an-trai-cay-tuoi-moi-ngay', 1, 'Lợi ích của việc ăn trái cây tươi mỗi ngày', '2026-01-19 14:12:00.392675', 4),
	(5, '<h2>Canh chua c&aacute; l&oacute;c</h2>\n<h3>Nguy&ecirc;n liệu:</h3>\n<ul>\n<li>C&aacute; l&oacute;c: 500g</li>\n<li>C&agrave; chua: 2 quả</li>\n<li>Dứa: 100g</li>\n<li>Rau muống: 1 b&oacute;</li>\n<li>Gi&aacute; đỗ: 100g</li>\n<li>Me, đường, nước mắm, h&agrave;nh t&iacute;m, tỏi</li>\n</ul>\n<h3>C&aacute;ch l&agrave;m:</h3>\n<ol>\n<li>C&aacute; l&oacute;c rửa sạch, cắt kh&uacute;c vừa ăn, ướp gia vị.</li>\n<li>Nấu nước me với c&agrave; chua, dứa.</li>\n<li>Cho c&aacute; v&agrave;o nấu ch&iacute;n, n&ecirc;m nếm vừa ăn.</li>\n<li>Th&ecirc;m rau muống, gi&aacute; đỗ, tắt bếp.</li>\n<li>M&uacute;c ra t&ocirc;, rắc h&agrave;nh phi l&ecirc;n tr&ecirc;n.</li>\n</ol>\n<p>M&oacute;n canh chua thanh m&aacute;t, chua ngọt h&agrave;i h&ograve;a, ăn k&egrave;m cơm n&oacute;ng rất ngon!</p>', '2026-01-19 15:36:34.000000', NULL, 'Món canh chua cá lóc thanh mát, dễ làm, phù hợp cho bữa cơm gia đình.', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831949/posts/dk8brctuerimpmmkilau.jpg', 'posts/dk8brctuerimpmmkilau', 'POST', 'cong-thuc-nau-canh-chua-ca-loc-don-gian', 1, 'Công thức nấu canh chua cá lóc đơn giản', '2026-01-19 14:12:30.985959', 5),
	(6, '<h2>Về chúng tôi</h2><p>Cửa hàng thực phẩm sạch được thành lập từ năm 2020 với sứ mệnh mang đến cho khách hàng những sản phẩm thực phẩm tươi ngon, an toàn và chất lượng cao.</p><h3>Cam kết của chúng tôi:</h3><ul><li>100% sản phẩm có nguồn gốc rõ ràng</li><li>Kiểm tra chất lượng nghiêm ngặt</li><li>Giá cả hợp lý, minh bạch</li><li>Giao hàng nhanh chóng, đúng hẹn</li><li>Chăm sóc khách hàng tận tâm</li></ul><p>Chúng tôi tự hào là đối tác tin cậy của hàng nghìn gia đình Việt!</p>', '2026-01-19 15:36:34.000000', NULL, 'Cửa hàng thực phẩm sạch uy tín, chất lượng, phục vụ cộng đồng từ năm 2020.', NULL, NULL, 'PAGE', 'gioi-thieu', 1, 'Giới thiệu về chúng tôi', '2026-01-19 15:36:34.000000', NULL),
	(7, '<h2>Chính sách giao hàng</h2><h3>Khu vực giao hàng:</h3><p>Chúng tôi giao hàng toàn quốc với các hình thức:</p><ul><li>Giao hàng nội thành TP.HCM: 1-2 giờ</li><li>Giao hàng ngoại thành: 2-4 giờ</li><li>Giao hàng tỉnh: 1-3 ngày</li></ul><h3>Phí vận chuyển:</h3><ul><li>Đơn từ 300K: Miễn phí (nội thành)</li><li>Đơn dưới 300K: 30.000đ</li><li>Giao hàng tỉnh: Theo bảng giá vận chuyển</li></ul><h3>Lưu ý:</h3><p>Khách hàng vui lòng kiểm tra hàng trước khi thanh toán. Nếu có vấn đề, liên hệ ngay hotline: 1900 xxxx.</p>', '2026-01-19 15:36:34.000000', NULL, 'Thông tin về chính sách giao hàng và phí vận chuyển.', NULL, NULL, 'PAGE', 'chinh-sach-giao-hang', 1, 'Chính sách giao hàng', '2026-01-19 15:36:34.000000', NULL),
	(8, '<h2>Chính sách đổi trả</h2><h3>Điều kiện đổi trả:</h3><ul><li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li><li>Có hóa đơn mua hàng</li><li>Trong vòng 24 giờ kể từ khi nhận hàng</li></ul><h3>Các trường hợp được đổi trả:</h3><ul><li>Sản phẩm bị lỗi do nhà sản xuất</li><li>Giao sai sản phẩm</li><li>Sản phẩm hết hạn sử dụng</li><li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li></ul><h3>Quy trình đổi trả:</h3><ol><li>Liên hệ hotline: 1900 xxxx</li><li>Cung cấp thông tin đơn hàng và lý do đổi trả</li><li>Chúng tôi sẽ đến lấy hàng và giao hàng mới</li><li>Hoàn tiền trong vòng 3-5 ngày làm việc (nếu có)</li></ol>', '2026-01-19 15:36:34.000000', NULL, 'Quy định về việc đổi trả sản phẩm và hoàn tiền.', NULL, NULL, 'PAGE', 'chinh-sach-doi-tra', 1, 'Chính sách đổi trả', '2026-01-19 15:36:34.000000', NULL);

-- Dumping structure for table sieuthimini.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `base_weight` int DEFAULT NULL,
  `cost_price` decimal(38,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_price` decimal(38,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locked_qty` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` int DEFAULT NULL,
  `sale_price` decimal(38,2) NOT NULL,
  `sale_type` enum('UNIT','WEIGHT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int DEFAULT NULL,
  `unit_label` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` int NOT NULL,
  `brand_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKostq1ec3toafnjok09y9l7dox` (`slug`),
  KEY `FKa3a4mpsfdf4d2y6r8ra3sc8mv` (`brand_id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKa3a4mpsfdf4d2y6r8ra3sc8mv` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.products: ~48 rows (approximately)
INSERT INTO `products` (`id`, `base_weight`, `cost_price`, `created_at`, `deleted_at`, `description`, `detail`, `discount_price`, `image`, `image_public_id`, `locked_qty`, `name`, `qty`, `sale_price`, `sale_type`, `slug`, `status`, `unit_label`, `updated_at`, `updated_by`, `brand_id`, `category_id`) VALUES
	(1, 502, 12000.00, '2026-01-19 15:15:58.000000', NULL, 'Cải thảo tươi từ Đà Lạt', '<h3>Cải thảo Đ&agrave; Lạt</h3>\n<p>Cải thảo tươi ngon từ Đ&agrave; Lạt, l&aacute; xanh mướt, gi&ograve;n ngọt. Th&iacute;ch hợp nấu lẩu, x&agrave;o hoặc l&agrave;m kim chi.</p>\n<ul>\n<li>Xuất xứ: Đ&agrave; Lạt</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh</li>\n<li>HSD: 5-7 ng&agrave;y</li>\n</ul>', 18000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831814/products/nfuhvcnvf816h0nujlvm.jpg', 'products/nfuhvcnvf816h0nujlvm', NULL, 'Cải thảo Đà Lạt', 500, 20000.00, 'WEIGHT', 'cai-thao-da-lat', 1, 'kg', '2026-01-19 14:10:18.319300', 1, 7, 7),
	(2, NULL, 3000.00, '2026-01-19 15:15:58.000000', NULL, 'Rau muống tươi xanh', '<h3>Rau muống</h3>\n<p>Rau muống tươi, l&aacute; xanh mướt, gi&ograve;n ngọt. Gi&agrave;u chất xơ v&agrave; vitamin.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh</li>\n<li>HSD: 2-3 ng&agrave;y</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831783/products/tqvrltbd9hkk8r6xlirh.jpg', 'products/tqvrltbd9hkk8r6xlirh', NULL, 'Rau muống', 800, 5000.00, 'UNIT', 'rau-muong', 1, 'bó', '2026-01-19 14:09:46.184826', 1, 7, 7),
	(3, 500, 15000.00, '2026-01-19 15:15:58.000000', NULL, 'Cà chua tươi đỏ', '<h3>C&agrave; chua</h3>\n<p>C&agrave; chua tươi, m&agrave;u đỏ tự nhi&ecirc;n, gi&agrave;u vitamin C v&agrave; chất chống oxi h&oacute;a.</p>\n<ul>\n<li>Xuất xứ: Đ&agrave; Lạt</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh</li>\n<li>HSD: 5-7 ng&agrave;y</li>\n</ul>', 22000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831751/products/dritafq2jbvrk8yi4z96.jpg', 'products/dritafq2jbvrk8yi4z96', NULL, 'Cà chua', 600, 25000.00, 'WEIGHT', 'ca-chua', 1, 'kg', '2026-01-19 14:09:19.807710', 1, 7, 7),
	(4, NULL, 8000.00, '2026-01-19 15:15:58.000000', NULL, 'Xà lách xoong tươi', '<h3>X&agrave; l&aacute;ch xoong</h3>\n<p>X&agrave; l&aacute;ch xoong tươi, gi&ograve;n ngọt, th&iacute;ch hợp l&agrave;m salad hoặc ăn k&egrave;m.</p>\n<ul>\n<li>Xuất xứ: Đ&agrave; Lạt</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh</li>\n<li>HSD: 3-5 ng&agrave;y</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831739/products/ey8lubeeqsmnyh5smru6.jpg', 'products/ey8lubeeqsmnyh5smru6', NULL, 'Xà lách xoong', 400, 15000.00, 'UNIT', 'xa-lach-xoong', 1, 'bó', '2026-01-19 14:09:01.680766', 1, 7, 7),
	(5, 500, 25000.00, '2026-01-19 15:15:58.000000', NULL, 'Cam sành Hà Giang', '<h3>Cam s&agrave;nh H&agrave; Giang</h3>\n<p>Cam s&agrave;nh ngọt thanh, &iacute;t hạt, gi&agrave;u vitamin C.</p>\n<ul>\n<li>Xuất xứ: H&agrave; Giang</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 1-2 tuần</li>\n</ul>', 38000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831696/products/jgifscf7ddl6haf3rmcl.jpg', 'products/jgifscf7ddl6haf3rmcl', NULL, 'Cam sành', 800, 40000.00, 'WEIGHT', 'cam-sanh', 1, 'kg', '2026-01-19 14:08:35.717926', 1, 7, 8),
	(6, 500, 80000.00, '2026-01-19 15:15:58.000000', NULL, 'Táo Fuji nhập khẩu', '<h3>T&aacute;o Fuji</h3>\n<p>T&aacute;o Fuji gi&ograve;n ngọt, mọng nước, gi&agrave;u dinh dưỡng.</p>\n<ul>\n<li>Xuất xứ: Nhật Bản</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh</li>\n<li>HSD: 2 tuần</li>\n</ul>', 110000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831679/products/wmlpi1o8asdiaywgbtlm.jpg', 'products/wmlpi1o8asdiaywgbtlm', NULL, 'Táo Fuji', 500, 120000.00, 'WEIGHT', 'tao-fuji', 1, 'kg', '2026-01-19 14:08:04.965008', 1, 7, 8),
	(7, NULL, 15000.00, '2026-01-19 15:15:58.000000', NULL, 'Chuối tiêu Việt Nam', '<h3>Chuối ti&ecirc;u</h3>\n<p>Chuối ti&ecirc;u thơm ngon, gi&agrave;u kali v&agrave; chất xơ.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 3-5 ng&agrave;y</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831644/products/b1ijs6vnj2jjr9iaykvd.jpg', 'products/b1ijs6vnj2jjr9iaykvd', NULL, 'Chuối tiêu', 1000, 25000.00, 'UNIT', 'chuoi-tieu', 1, 'nải', '2026-01-19 14:07:27.312956', 1, 7, 8),
	(8, 300, 40000.00, '2026-01-19 15:15:58.000000', NULL, 'Xoài cát Hòa Lộc', '<h3>Xo&agrave;i c&aacute;t H&ograve;a Lộc</h3>\n<p>Xo&agrave;i c&aacute;t H&ograve;a Lộc thơm ngon, ngọt đậm, thịt v&agrave;ng mịn.</p>\n<ul>\n<li>Xuất xứ: Tiền Giang</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 5-7 ng&agrave;y</li>\n</ul>', 55000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831626/products/dgu7sxxu1awkz5g2iw7p.jpg', 'products/dgu7sxxu1awkz5g2iw7p', NULL, 'Xoài cát Hòa Lộc', 600, 60000.00, 'WEIGHT', 'xoai-cat-hoa-loc', 1, 'kg', '2026-01-19 14:07:14.420043', 1, 7, 8),
	(9, 500, 80000.00, '2026-01-19 15:15:58.000000', NULL, 'Thịt ba chỉ heo tươi', '<h3>Thịt ba chỉ heo</h3>\n<p>Thịt ba chỉ heo tươi, c&oacute; v&acirc;n mỡ đẹp, th&iacute;ch hợp nướng, kho hoặc luộc.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Bảo quản: Ngăn đ&ocirc;ng tủ lạnh</li>\n<li>HSD: 3-5 ng&agrave;y (m&aacute;t), 1-2 th&aacute;ng (đ&ocirc;ng)</li>\n</ul>', 115000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831589/products/beh7pkynu6xqcjo4vwhf.jpg', 'products/beh7pkynu6xqcjo4vwhf', NULL, 'Thịt ba chỉ heo', 300, 120000.00, 'WEIGHT', 'thit-ba-chi-heo', 1, 'kg', '2026-01-19 14:06:32.686206', 1, 8, 9),
	(10, 500, 150000.00, '2026-01-19 15:15:58.000000', NULL, 'Thịt nạc vai heo', '<h3>Thịt nạc vai heo</h3>\n<p>Thịt nạc vai heo tươi, thịt mềm, &iacute;t mỡ, th&iacute;ch hợp x&agrave;o, nướng.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Bảo quản: Ngăn đ&ocirc;ng tủ lạnh</li>\n<li>HSD: 3-5 ng&agrave;y (m&aacute;t), 1-2 th&aacute;ng (đ&ocirc;ng)</li>\n</ul>', 120000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831566/products/azfqzalzhvwgvmyy8q2f.jpg', 'products/azfqzalzhvwgvmyy8q2f', NULL, 'Thịt nạc vai heo', 19900, 130000.00, 'WEIGHT', 'thit-nac-vai-heo', 1, 'kg', '2026-01-19 19:25:29.986103', 2, 8, 9),
	(11, 500, 100000.00, '2026-01-19 15:15:58.000000', NULL, 'Sườn non heo tươi', '<h3>Sườn non heo</h3>\n<p>Sườn non heo tươi, thịt mềm, th&iacute;ch hợp nướng, rim hoặc hấp.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Bảo quản: Ngăn đ&ocirc;ng tủ lạnh</li>\n<li>HSD: 3-5 ng&agrave;y (m&aacute;t), 1-2 th&aacute;ng (đ&ocirc;ng)</li>\n</ul>', 145000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831536/products/jkopgelprfqs3uqh2hit.jpg', 'products/jkopgelprfqs3uqh2hit', NULL, 'Sườn non heo', 250, 150000.00, 'WEIGHT', 'suon-non-heo', 1, 'kg', '2026-01-19 14:05:44.986461', 1, 8, 9),
	(12, 500, 40000.00, '2026-01-19 15:15:58.000000', NULL, 'Cá rô phi tươi sống', '<h3>C&aacute; r&ocirc; phi</h3>\n<p>C&aacute; r&ocirc; phi tươi sống, thịt trắng, ngọt, &iacute;t xương. Th&iacute;ch hợp chi&ecirc;n, nướng hoặc nấu canh.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Bảo quản: Ngăn đ&ocirc;ng tủ lạnh</li>\n<li>HSD: 1-2 ng&agrave;y (m&aacute;t), 1-2 th&aacute;ng (đ&ocirc;ng)</li>\n</ul>', 55000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831494/products/rsqmkibxl3zngaa27cfk.jpg', 'products/rsqmkibxl3zngaa27cfk', NULL, 'Cá rô phi', 200, 60000.00, 'WEIGHT', 'ca-ro-phi', 1, 'kg', '2026-01-19 14:04:58.242738', 1, 7, 10),
	(13, 500, 70000.00, '2026-01-19 15:15:58.000000', NULL, 'Cá thu tươi', '<h3>C&aacute; thu</h3>\n<p>C&aacute; thu tươi, thịt chắc, gi&agrave;u omega-3. Th&iacute;ch hợp kho, nướng hoặc chi&ecirc;n.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Bảo quản: Ngăn đ&ocirc;ng tủ lạnh</li>\n<li>HSD: 1-2 ng&agrave;y (m&aacute;t), 1-2 th&aacute;ng (đ&ocirc;ng)</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831450/products/uitbbjd173tdkqz9a1l4.jpg', 'products/uitbbjd173tdkqz9a1l4', NULL, 'Cá thu', 150, 100000.00, 'WEIGHT', 'ca-thu', 1, 'kg', '2026-01-19 14:04:16.469267', 1, 7, 10),
	(14, 500, 250000.00, '2026-01-19 15:15:58.000000', NULL, 'Cá hồi Na Uy nhập khẩu', '<h3>C&aacute; hồi Na Uy</h3>\n<p>C&aacute; hồi Na Uy cao cấp, thịt đỏ cam, gi&agrave;u omega-3. Th&iacute;ch hợp l&agrave;m sashimi, nướng hoặc hấp.</p>\n<ul>\n<li>Xuất xứ: Na Uy</li>\n<li>Bảo quản: Ngăn đ&ocirc;ng tủ lạnh</li>\n<li>HSD: 2-3 ng&agrave;y (m&aacute;t), 2-3 th&aacute;ng (đ&ocirc;ng)</li>\n</ul>', 330000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831353/products/blrm24qb5usxs0hzfmiq.jpg', 'products/blrm24qb5usxs0hzfmiq', NULL, 'Cá hồi Na Uy', 100, 350000.00, 'WEIGHT', 'ca-hoi-na-uy', 1, 'kg', '2026-01-19 14:02:43.606182', 1, 7, 10),
	(15, NULL, 90000.00, '2026-01-19 15:15:58.000000', NULL, 'Gạo ST25 cao cấp túi 5kg', '<h3>Gạo ST25</h3>\n<p>Gạo ST25 đạt giải gạo ngon nhất thế giới, hạt d&agrave;i, thơm ngon, dẻo mềm.</p>\n<ul>\n<li>Xuất xứ: S&oacute;c Trăng</li>\n<li>Trọng lượng: 5kg</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', 125000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831327/products/lyb5welrqcizzaggexq9.jpg', 'products/lyb5welrqcizzaggexq9', NULL, 'Gạo ST25', 500, 130000.00, 'UNIT', 'gao-st25', 1, 'túi', '2026-01-19 14:02:10.289466', 1, 7, 11),
	(16, NULL, 60000.00, '2026-01-19 15:15:58.000000', NULL, 'Gạo Jasmine thơm túi 5kg', '<h3>Gạo Jasmine</h3>\n<p>Gạo Jasmine thơm dẻo, hạt d&agrave;i, trắng đẹp. Th&iacute;ch hợp cho cơm h&agrave;ng ng&agrave;y.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Trọng lượng: 5kg</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831285/products/rcwwocfsamzvggvruhlq.jpg', 'products/rcwwocfsamzvggvruhlq', NULL, 'Gạo Jasmine', 800, 85000.00, 'UNIT', 'gao-jasmine', 1, 'túi', '2026-01-19 14:01:27.566068', 1, 7, 11),
	(17, NULL, 50000.00, '2026-01-19 15:15:58.000000', NULL, 'Gạo Nàng Hoa 9 túi 5kg', '<h3>Gạo N&agrave;ng Hoa 9</h3>\n<p>Gạo N&agrave;ng Hoa 9 thơm ngon, dẻo mềm, hạt trắng đẹp.</p>\n<ul>\n<li>Xuất xứ: Việt Nam</li>\n<li>Trọng lượng: 5kg</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', 70000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831248/products/icfojgexbxexlrpqnskf.jpg', 'products/icfojgexbxexlrpqnskf', NULL, 'Gạo Nàng Hoa 9', 600, 75000.00, 'UNIT', 'gao-nang-hoa-9', 1, 'túi', '2026-01-19 14:00:51.316629', 1, 7, 11),
	(18, NULL, 12000.00, '2026-01-19 15:15:58.000000', NULL, 'Mì cay Hàn Quốc Shin Ramyun gói 120g', '<h3>M&igrave; Shin Ramyun</h3>\n<p>M&igrave; ăn liền H&agrave;n Quốc Shin Ramyun vị cay đặc trưng, sợi m&igrave; dai ngon.</p>\n<ul>\n<li>Trọng lượng: 120g/g&oacute;i</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831214/products/hiw3i6uwv2l3q3deiaov.jpg', 'products/hiw3i6uwv2l3q3deiaov', NULL, 'Mì Shin Ramyun', 1000, 18000.00, 'UNIT', 'mi-shin-ramyun', 1, 'gói', '2026-01-19 14:00:17.440291', 1, 13, 12),
	(19, NULL, 13000.00, '2026-01-19 15:15:58.000000', NULL, 'Mì Jjajang Hàn Quốc Chapagetti', '<h3>M&igrave; Chapagetti</h3>\n<p>M&igrave; ăn liền H&agrave;n Quốc vị Jjajang (tương đen), thơm ngon độc đ&aacute;o.</p>\n<ul>\n<li>Trọng lượng: 140g/g&oacute;i</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', 18000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831171/products/dndqmnzm1jp01kbbtgjh.jpg', 'products/dndqmnzm1jp01kbbtgjh', NULL, 'Mì Chapagetti', 800, 20000.00, 'UNIT', 'mi-chapagetti', 1, 'gói', '2026-01-19 13:59:32.669248', 1, 13, 12),
	(20, NULL, 15000.00, '2026-01-19 15:15:58.000000', NULL, 'Mì trứng khô gói 500g', '<h3>M&igrave; trứng kh&ocirc;</h3>\n<p>M&igrave; trứng kh&ocirc; truyền thống, sợi m&igrave; dai, thơm m&ugrave;i trứng. Th&iacute;ch hợp nấu phở, m&igrave; x&agrave;o.</p>\n<ul>\n<li>Trọng lượng: 500g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 6 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831064/products/f1yv4igzibujq373fffw.jpg', 'products/f1yv4igzibujq373fffw', NULL, 'Mì trứng khô', 600, 25000.00, 'UNIT', 'mi-trung-kho', 1, 'gói', '2026-01-19 13:57:48.172474', 1, 11, 12),
	(21, NULL, 8000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước ngọt Coca-Cola lon 330ml', '<h3>Coca-Cola lon 330ml</h3>\n<p>Nước giải kh&aacute;t c&oacute; gas Coca-Cola, hương vị đặc trưng, sảng kho&aacute;i.</p>\n<ul>\n<li>Thể t&iacute;ch: 330ml</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831042/products/txobagzy1f1rsfq5x6a8.jpg', 'products/txobagzy1f1rsfq5x6a8', NULL, 'Coca-Cola lon 330ml', 1500, 12000.00, 'UNIT', 'coca-cola-lon-330ml', 1, 'lon', '2026-01-19 13:57:24.295857', 1, 9, 13),
	(22, NULL, 8000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước ngọt Pepsi lon 330ml', '<h3>Pepsi lon 330ml</h3>\n<p>Nước giải kh&aacute;t c&oacute; gas Pepsi, vị ngọt thanh, sảng kho&aacute;i.</p>\n<ul>\n<li>Thể t&iacute;ch: 330ml</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768831001/products/pzwxziuyd6inln9uvhbq.jpg', 'products/pzwxziuyd6inln9uvhbq', NULL, 'Pepsi lon 330ml', 1500, 12000.00, 'UNIT', 'pepsi-lon-330ml', 1, 'lon', '2026-01-19 13:56:44.830805', 1, 10, 13),
	(23, NULL, 8000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước ngọt Sprite lon 330ml', '<h3>Sprite lon 330ml</h3><p>Nước giải khát có gas Sprite, vị chanh tươi mát.</p><ul><li>Thể tích: 330ml</li><li>Bảo quản: Nơi khô ráo, thoáng mát</li><li>HSD: 12 tháng</li></ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830970/products/xd7euvr7prqwqab4o3rl.jpg', 'products/xd7euvr7prqwqab4o3rl', NULL, 'Sprite lon 330ml', 1500, 12000.00, 'UNIT', 'sprite-lon-330ml', 1, 'lon', '2026-01-19 13:56:13.240428', 1, 9, 13),
	(24, NULL, 8000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước ngọt Fanta cam lon 330ml', '<h3>Fanta cam lon 330ml</h3>\n<p>Nước giải kh&aacute;t c&oacute; gas Fanta vị cam, ngọt thanh, sảng kho&aacute;i.</p>\n<ul>\n<li>Thể t&iacute;ch: 330ml</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830935/products/hum9mwcjbu38f4oszujy.jpg', 'products/hum9mwcjbu38f4oszujy', NULL, 'Fanta cam lon 330ml', 1200, 12000.00, 'UNIT', 'fanta-cam-lon-330ml', 1, 'lon', '2026-01-19 13:55:37.686334', 1, 9, 13),
	(25, NULL, 3000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước khoáng thiên nhiên Lavie chai 500ml', '<h3>Nước kho&aacute;ng Lavie</h3>\n<p>Nước kho&aacute;ng thi&ecirc;n nhi&ecirc;n Lavie, tinh khiết, gi&agrave;u kho&aacute;ng chất tự nhi&ecirc;n.</p>\n<ul>\n<li>Thể t&iacute;ch: 500ml</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830876/products/prx1f3uerodwr3tcatqo.jpg', 'products/prx1f3uerodwr3tcatqo', NULL, 'Nước khoáng Lavie 500ml', 2000, 5000.00, 'UNIT', 'nuoc-khoang-lavie-500ml', 1, 'chai', '2026-01-19 13:54:39.149471', 1, 14, 14),
	(26, NULL, 3000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước tinh khiết Aquafina chai 500ml', '<h3>Nước tinh khiết Aquafina</h3>\n<p>Nước tinh khiết Aquafina qua hệ thống lọc RO hiện đại, an to&agrave;n v&agrave; sạch.</p>\n<ul>\n<li>Thể t&iacute;ch: 500ml</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830845/products/rslmq4taqtxk42auljbi.jpg', 'products/rslmq4taqtxk42auljbi', NULL, 'Nước tinh khiết Aquafina 500ml', 2000, 5000.00, 'UNIT', 'nuoc-tinh-khiet-aquafina-500ml', 1, 'chai', '2026-01-19 13:54:11.751059', 1, 15, 14),
	(27, NULL, 6000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước khoáng thiên nhiên Lavie chai 1.5L', '<h3>Nước kho&aacute;ng Lavie 1.5L</h3>\n<p>Nước kho&aacute;ng thi&ecirc;n nhi&ecirc;n Lavie chai lớn 1.5L, tiện lợi cho gia đ&igrave;nh.</p>\n<ul>\n<li>Thể t&iacute;ch: 1.5L</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', 9000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830826/products/fhebqvaexng984bshkzc.jpg', 'products/fhebqvaexng984bshkzc', NULL, 'Nước khoáng Lavie 1.5L', 1000, 10000.00, 'UNIT', 'nuoc-khoang-lavie-1-5l', 1, 'chai', '2026-01-19 13:53:47.662769', 1, 14, 14),
	(28, NULL, 25000.00, '2026-01-19 15:15:58.000000', NULL, 'Sữa tươi tiệt trùng Vinamilk 100% không đường', '<h3>Sữa tươi Vinamilk 100%</h3>\n<p>Sữa tươi tiệt tr&ugrave;ng 100% từ sữa b&ograve; tươi nguy&ecirc;n chất, kh&ocirc;ng đường, gi&agrave;u canxi v&agrave; protein.</p>\n<ul>\n<li>Thể t&iacute;ch: 1 l&iacute;t</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh sau khi mở</li>\n<li>HSD: 6 th&aacute;ng (chưa mở), 3-5 ng&agrave;y (đ&atilde; mở)</li>\n</ul>', 33000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830800/products/fpebnhz9bg6opswkuiao.jpg', 'products/fpebnhz9bg6opswkuiao', NULL, 'Sữa tươi Vinamilk 100% 1L', 600, 35000.00, 'UNIT', 'sua-tuoi-vinamilk-100-1l', 1, 'hộp', '2026-01-19 13:53:23.157265', 1, 1, 15),
	(29, NULL, 28000.00, '2026-01-19 15:15:58.000000', NULL, 'Sữa tươi sạch TH True Milk không đường', '<h3>Sữa tươi TH True Milk</h3>\n<p>Sữa tươi sạch 100% từ trang trại TH, kh&ocirc;ng chất bảo quản, gi&agrave;u dinh dưỡng.</p>\n<ul>\n<li>Thể t&iacute;ch: 1 l&iacute;t</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh</li>\n<li>HSD: 7 ng&agrave;y</li>\n</ul>', 36000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830747/products/f0ip87uvfcskvomjkvku.jpg', 'products/f0ip87uvfcskvomjkvku', NULL, 'Sữa tươi TH True Milk 1L', 500, 38000.00, 'UNIT', 'sua-tuoi-th-true-milk-1l', 1, 'hộp', '2026-01-19 13:52:28.598083', 1, 2, 15),
	(30, NULL, 18000.00, '2026-01-19 15:15:58.000000', NULL, 'Sữa chua uống Vinamilk Probi lốc 5 chai', '<h3>Sữa chua uống Vinamilk Probi</h3>\n<p>Sữa chua uống c&oacute; lợi khuẩn Probi, tốt cho hệ ti&ecirc;u h&oacute;a. Lốc 5 chai x 65ml.</p>\n<ul>\n<li>Thể t&iacute;ch: 5 x 65ml</li>\n<li>Bảo quản: Ngăn m&aacute;t tủ lạnh</li>\n<li>HSD: 30 ng&agrave;y</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830722/products/gditmahjqtrbozmrfgzp.jpg', 'products/gditmahjqtrbozmrfgzp', NULL, 'Sữa chua uống Vinamilk Probi', 800, 25000.00, 'UNIT', 'sua-chua-uong-vinamilk-probi', 1, 'lốc', '2026-01-19 13:52:04.919469', 1, 1, 15),
	(31, NULL, 200000.00, '2026-01-19 15:15:58.000000', NULL, 'Sữa bột Vinamilk ColosBaby Gold cho trẻ 0-12 tháng', '<h3>Sữa bột ColosBaby Gold</h3>\n<p>Sữa bột Vinamilk ColosBaby Gold với c&ocirc;ng thức IQ Plus, gi&uacute;p ph&aacute;t triển tr&iacute; n&atilde;o v&agrave; tăng cường miễn dịch.</p>\n<ul>\n<li>Trọng lượng: 800g</li>\n<li>Độ tuổi: 0-12 th&aacute;ng</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', 270000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830699/products/zzqgmtdnsna28ldydmws.jpg', 'products/zzqgmtdnsna28ldydmws', NULL, 'Sữa bột Vinamilk ColosBaby Gold 800g', 300, 280000.00, 'UNIT', 'sua-bot-vinamilk-colosbaby-gold-800g', 1, 'lon', '2026-01-19 13:51:41.067113', 1, 1, 16),
	(32, NULL, 250000.00, '2026-01-19 15:15:58.000000', NULL, 'Sữa bột Nestlé NAN Optipro số 1', '<h3>Sữa bột NAN Optipro</h3>\n<p>Sữa bột Nestl&eacute; NAN Optipro với c&ocirc;ng thức Optipro, gi&uacute;p b&eacute; ph&aacute;t triển to&agrave;n diện.</p>\n<ul>\n<li>Trọng lượng: 800g</li>\n<li>Độ tuổi: 0-6 th&aacute;ng</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', 340000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830677/products/iscnghq46w1blu2bqcbh.jpg', 'products/iscnghq46w1blu2bqcbh', NULL, 'Sữa bột Nestlé NAN Optipro 800g', 250, 350000.00, 'UNIT', 'sua-bot-nestle-nan-optipro-800g', 1, 'lon', '2026-01-19 13:51:19.280586', 1, 11, 16),
	(33, NULL, 180000.00, '2026-01-19 15:15:58.000000', NULL, 'Sữa bột Vinamilk Dielac Alpha Gold số 4', '<h3>Sữa bột Dielac Alpha Gold</h3>\n<p>Sữa bột Vinamilk Dielac Alpha Gold cho trẻ từ 2-6 tuổi, gi&uacute;p tăng cường sức đề kh&aacute;ng.</p>\n<ul>\n<li>Trọng lượng: 900g</li>\n<li>Độ tuổi: 2-6 tuổi</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830647/products/hwiuyfih6szz3dsk8yli.jpg', 'products/hwiuyfih6szz3dsk8yli', NULL, 'Sữa bột Vinamilk Dielac Alpha Gold 900g', 400, 250000.00, 'UNIT', 'sua-bot-vinamilk-dielac-alpha-gold-900g', 1, 'lon', '2026-01-19 13:50:52.995618', 1, 1, 16),
	(34, NULL, 25000.00, '2026-01-19 15:15:58.000000', NULL, 'Bánh quy bơ Cosy Marie hộp 288g', '<h3>B&aacute;nh quy Cosy Marie</h3>\n<p>B&aacute;nh quy bơ Cosy Marie gi&ograve;n tan, thơm bơ, hộp 288g tiện lợi.</p>\n<ul>\n<li>Trọng lượng: 288g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', 35000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830581/products/xv8t6xq4yynfwil7sshh.jpg', 'products/xv8t6xq4yynfwil7sshh', NULL, 'Bánh quy Cosy Marie', 500, 38000.00, 'UNIT', 'banh-quy-cosy-marie', 1, 'hộp', '2026-01-19 13:49:44.618141', 1, 4, 17),
	(35, NULL, 15000.00, '2026-01-19 15:15:58.000000', NULL, 'Bánh quy Oreo vị socola gói 133g', '<h3>B&aacute;nh quy Oreo</h3>\n<p>B&aacute;nh quy Oreo với lớp kem vani giữa hai miếng b&aacute;nh socola gi&ograve;n tan.</p>\n<ul>\n<li>Trọng lượng: 133g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830465/products/w2tci8j5mtsbbceusydv.jpg', 'products/w2tci8j5mtsbbceusydv', NULL, 'Bánh quy Oreo Original', 600, 22000.00, 'UNIT', 'banh-quy-oreo-original', 1, 'gói', '2026-01-19 13:47:48.991522', 1, 12, 17),
	(36, NULL, 20000.00, '2026-01-19 15:15:58.000000', NULL, 'Bánh quy socola chip Cosy hộp 168g', '<h3>B&aacute;nh quy Cosy Choco Chip</h3>\n<p>B&aacute;nh quy socola chip Cosy gi&ograve;n tan, vị socola đậm đ&agrave;.</p>\n<ul>\n<li>Trọng lượng: 168g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', 28000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830129/products/gaybxbwmuij62goid9ng.jpg', 'products/gaybxbwmuij62goid9ng', NULL, 'Bánh quy Cosy Choco Chip', 400, 30000.00, 'UNIT', 'banh-quy-cosy-choco-chip', 1, 'hộp', '2026-01-19 13:42:12.237118', 1, 4, 17),
	(37, NULL, 12000.00, '2026-01-19 15:15:58.000000', NULL, 'Kẹo mềm Alpenliebe vị sữa túi 120g', '<h3>Kẹo mềm Alpenliebe</h3>\n<p>Kẹo mềm Alpenliebe vị sữa thơm ngon, mềm mịn.</p>\n<ul>\n<li>Trọng lượng: 120g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 18 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830082/products/w7jjp8rkya2tn2iutd8k.jpg', 'products/w7jjp8rkya2tn2iutd8k', NULL, 'Kẹo mềm Alpenliebe', 799, 18000.00, 'UNIT', 'keo-mem-alpenliebe', 1, 'túi', '2026-01-19 19:33:33.817806', 2, 4, 18),
	(38, NULL, 15000.00, '2026-01-19 15:15:58.000000', NULL, 'Kẹo dẻo Haribo hình gấu túi 80g', '<h3>Kẹo dẻo Haribo</h3>\n<p>Kẹo dẻo Haribo Goldbears h&igrave;nh gấu nhiều m&agrave;u sắc, vị tr&aacute;i c&acirc;y.</p>\n<ul>\n<li>Trọng lượng: 80g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 18 th&aacute;ng</li>\n</ul>', 23000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830057/products/krirebzfen3wrkos16va.jpg', 'products/krirebzfen3wrkos16va', NULL, 'Kẹo dẻo Haribo Goldbears', 599, 25000.00, 'UNIT', 'keo-deo-haribo-goldbears', 1, 'túi', '2026-01-20 07:59:10.918956', 2, 12, 18),
	(39, NULL, 8000.00, '2026-01-19 15:15:58.000000', NULL, 'Kẹo ngậm Halls vị bạc hà gói 33.5g', '<h3>Kẹo ngậm Halls</h3>\n<p>Kẹo ngậm Halls vị bạc h&agrave; m&aacute;t lạnh, gi&uacute;p th&ocirc;ng mũi, sảng kho&aacute;i.</p>\n<ul>\n<li>Trọng lượng: 33.5g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768830031/products/duav3simbw2eatoi5rq9.jpg', 'products/duav3simbw2eatoi5rq9', NULL, 'Kẹo ngậm Halls', 699, 12000.00, 'UNIT', 'keo-ngam-halls', 1, 'gói', '2026-01-19 19:33:33.816755', 2, 4, 18),
	(40, NULL, 30000.00, '2026-01-19 15:15:58.000000', NULL, 'Snack khoai tây Pringles vị Original lon 107g', '<h3>Snack Pringles</h3>\n<p>Snack khoai t&acirc;y Pringles gi&ograve;n rụm, vị tự nhi&ecirc;n, lon 107g tiện lợi.</p>\n<ul>\n<li>Trọng lượng: 107g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 12 th&aacute;ng</li>\n</ul>', 42000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768829950/products/tpvjrliodnlp3nyaa2ub.jpg', 'products/tpvjrliodnlp3nyaa2ub', NULL, 'Snack khoai tây Pringles', 497, 45000.00, 'UNIT', 'snack-khoai-tay-pringles', 1, 'lon', '2026-01-20 07:59:10.922714', 2, 12, 19),
	(41, NULL, 5000.00, '2026-01-19 15:15:58.000000', NULL, 'Snack khoai tây Oishi vị tảo biển gói 42g', '<h3>Snack Oishi Potato</h3>\n<p>Snack khoai t&acirc;y Oishi vị tảo biển gi&ograve;n tan, thơm ngon.</p>\n<ul>\n<li>Trọng lượng: 42g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 9 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817428/products/njscvaaxf9974ddjig8q.jpg', 'products/njscvaaxf9974ddjig8q', NULL, 'Snack Oishi Potato', 1000, 8000.00, 'UNIT', 'snack-oishi-potato', 1, 'gói', '2026-01-19 10:10:29.392393', 1, 12, 19),
	(42, NULL, 18000.00, '2026-01-19 15:15:58.000000', NULL, 'Snack khoai tây Swing vị tự nhiên lon 150g', '<h3>Snack Swing</h3>\n<p>Snack khoai t&acirc;y Swing gi&ograve;n rụm, vị tự nhi&ecirc;n, lon 150g tiện lợi.</p>\n<ul>\n<li>Trọng lượng: 150g</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 6 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817404/products/pia7mszyfsriptm7bnbi.jpg', 'products/pia7mszyfsriptm7bnbi', NULL, 'Snack Swing lon 150g', 600, 28000.00, 'UNIT', 'snack-swing-lon-150g', 1, 'lon', '2026-01-19 10:10:05.735916', 1, 12, 19),
	(43, NULL, 15000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước mắm Chinsu chai 500ml', '<h3>Nước mắm Chinsu</h3>\n<p>Nước mắm Chinsu đạm đ&agrave;, thơm ngon, độ đạm 40&deg;N. Chai 500ml tiện dụng.</p>\n<ul>\n<li>Thể t&iacute;ch: 500ml</li>\n<li>Độ đạm: 40&deg;N</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817378/products/fuhk8aj2jopvdj8gusv6.jpg', 'products/fuhk8aj2jopvdj8gusv6', NULL, 'Nước mắm Chinsu 500ml', 800, 25000.00, 'UNIT', 'nuoc-mam-chinsu-500ml', 1, 'chai', '2026-01-19 10:09:40.098627', 1, 3, 20),
	(44, NULL, 20000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước mắm Nam Ngư chai 650ml', '<h3>Nước mắm Nam Ngư</h3>\n<p>Nước mắm Nam Ngư truyền thống, độ đạm 30&deg;N, vị ngọt tự nhi&ecirc;n.</p>\n<ul>\n<li>Thể t&iacute;ch: 650ml</li>\n<li>Độ đạm: 30&deg;N</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', 30000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817327/products/fm50esp8jnaxdi4pkcsf.jpg', 'products/fm50esp8jnaxdi4pkcsf', NULL, 'Nước mắm Nam Ngư 650ml', 600, 32000.00, 'UNIT', 'nuoc-mam-nam-ngu-650ml', 1, 'chai', '2026-01-19 10:08:48.565108', 1, 3, 20),
	(45, NULL, 35000.00, '2026-01-19 15:15:58.000000', NULL, 'Nước mắm Phú Quốc truyền thống', '<h3>Nước mắm Ph&uacute; Quốc</h3>\n<p>Nước mắm Ph&uacute; Quốc nguy&ecirc;n chất, độ đạm 45&deg;N, thơm đậm đ&agrave;.</p>\n<ul>\n<li>Thể t&iacute;ch: 500ml</li>\n<li>Độ đạm: 45&deg;N</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', 48000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817305/products/yho03awjtz8fi2u4qqbj.jpg', 'products/yho03awjtz8fi2u4qqbj', NULL, 'Nước mắm Phú Quốc 500ml', 400, 50000.00, 'UNIT', 'nuoc-mam-phu-quoc-500ml', 1, 'chai', '2026-01-19 10:08:26.614445', 1, 3, 20),
	(46, NULL, 35000.00, '2026-01-19 15:15:58.000000', NULL, 'Dầu ăn Neptune Gold chai 1 lít', '<h3>Dầu ăn Neptune Gold</h3>\n<p>Dầu ăn Neptune Gold từ đậu n&agrave;nh, gi&agrave;u Omega 3-6-9, tốt cho sức khỏe.</p>\n<ul>\n<li>Thể t&iacute;ch: 1 l&iacute;t</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t, tr&aacute;nh &aacute;nh nắng</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', 48000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817275/products/x15hm43ydsvi9rkmppbj.jpg', 'products/x15hm43ydsvi9rkmppbj', NULL, 'Dầu ăn Neptune Gold 1L', 599, 50000.00, 'UNIT', 'dau-an-neptune-gold-1l', 1, 'chai', '2026-01-19 19:25:29.983587', 2, 6, 21),
	(47, NULL, 30000.00, '2026-01-19 15:15:58.000000', NULL, 'Dầu ăn Simply chai 1 lít', '<h3>Dầu ăn Simply</h3>\n<p>Dầu ăn Simply tinh luyện từ đậu n&agrave;nh, trong suốt, kh&ocirc;ng m&ugrave;i.</p>\n<ul>\n<li>Thể t&iacute;ch: 1 l&iacute;t</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t, tr&aacute;nh &aacute;nh nắng</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', NULL, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817244/products/e9k9sf2ug8wbc8d3uj00.jpg', 'products/e9k9sf2ug8wbc8d3uj00', NULL, 'Dầu ăn Simply 1L', 700, 45000.00, 'UNIT', 'dau-an-simply-1l', 1, 'chai', '2026-01-19 10:07:27.048497', 1, 6, 21),
	(48, NULL, 120000.00, '2026-01-19 15:15:58.000000', NULL, 'Dầu olive Extra Virgin nhập khẩu', '<h3>Dầu olive Extra Virgin</h3>\n<p>Dầu olive Extra Virgin cao cấp nhập khẩu, gi&agrave;u chất chống oxi h&oacute;a, tốt cho tim mạch.</p>\n<ul>\n<li>Thể t&iacute;ch: 500ml</li>\n<li>Xuất xứ: &Yacute;</li>\n<li>Bảo quản: Nơi kh&ocirc; r&aacute;o, tho&aacute;ng m&aacute;t, tr&aacute;nh &aacute;nh nắng</li>\n<li>HSD: 24 th&aacute;ng</li>\n</ul>', 170000.00, 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768817200/products/exfbg3xhjlkboyeknhuj.jpg', 'products/exfbg3xhjlkboyeknhuj', NULL, 'Dầu olive Extra Virgin 500ml', 200, 180000.00, 'UNIT', 'dau-olive-extra-virgin-500ml', 1, 'chai', '2026-01-19 10:06:58.241477', 1, 6, 21);

-- Dumping structure for table sieuthimini.stock_movements
CREATE TABLE IF NOT EXISTS `stock_movements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `current_stock` int NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `movement_type` enum('ADJUSTMENT','IN','OUT','RETURN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(38,2) DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK82mrlg9h36kaw5kn90fliqu0b` (`order_id`),
  KEY `FKjcaag8ogfjxpwmqypi1wfdaog` (`product_id`),
  KEY `FKg3vi019n2im5betynd3cfqjuq` (`supplier_id`),
  CONSTRAINT `FK82mrlg9h36kaw5kn90fliqu0b` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKg3vi019n2im5betynd3cfqjuq` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `FKjcaag8ogfjxpwmqypi1wfdaog` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.stock_movements: ~8 rows (approximately)
INSERT INTO `stock_movements` (`id`, `created_at`, `created_by`, `current_stock`, `deleted_at`, `movement_type`, `note`, `quantity`, `unit_price`, `order_id`, `product_id`, `supplier_id`) VALUES
	(1, '2026-01-19 18:52:50.839989', 1, 20400, NULL, 'IN', '', 20000, 150000.00, NULL, 10, 2),
	(2, '2026-01-19 19:25:29.927034', 2, 599, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-228540', 1, 48000.00, 1, 46, NULL),
	(3, '2026-01-19 19:25:29.934084', 2, 498, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-228540', 2, 42000.00, 1, 40, NULL),
	(4, '2026-01-19 19:25:29.939275', 2, 19900, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-228540', 500, 120000.00, 1, 10, NULL),
	(5, '2026-01-19 19:33:33.801376', 2, 699, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-032617', 1, 12000.00, 2, 39, NULL),
	(6, '2026-01-19 19:33:33.805910', 2, 799, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-032617', 1, 18000.00, 2, 37, NULL),
	(7, '2026-01-19 19:40:57.349891', 2, 599, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-836536', 1, 23000.00, 3, 38, NULL),
	(8, '2026-01-19 19:40:57.353042', 2, 497, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-836536', 1, 42000.00, 3, 40, NULL),
	(9, '2026-01-20 07:59:10.863116', 2, 599, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-858115', 1, 23000.00, 4, 38, NULL),
	(10, '2026-01-20 07:59:10.872166', 2, 497, NULL, 'OUT', 'Xuất kho đơn hàng: ORD-20260120-858115', 1, 42000.00, 4, 40, NULL);

-- Dumping structure for table sieuthimini.suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `supplier_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqlclyj0vn5vwtb86objyhmlkx` (`supplier_code`),
  UNIQUE KEY `UKq5uvp89ra4ksaty5ghyaw4kjr` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.suppliers: ~8 rows (approximately)
INSERT INTO `suppliers` (`id`, `address`, `created_at`, `deleted_at`, `email`, `name`, `phone`, `status`, `supplier_code`, `updated_at`) VALUES
	(1, '123 Đường Trần Hưng Đạo, Phường 1, Đà Lạt, Lâm Đồng', '2026-01-19 15:36:34.000000', NULL, 'dalat@freshfood.vn', 'Công ty TNHH Thực phẩm Sạch Đà Lạt', '0283456789', 1, 'SUP001', '2026-01-19 15:36:34.000000'),
	(2, '420 Đường Nguyễn Văn Công, Phường 3, Gò Vấp, TP.HCM', '2026-01-19 15:36:34.000000', NULL, 'contact@vissan.com.vn', 'Công ty CP Thực phẩm Vissan', '0287654321', 1, 'SUP002', '2026-01-19 15:36:34.000000'),
	(3, '56 Đường Lý Thường Kiệt, Phường 5, Cà Mau', '2026-01-19 15:36:34.000000', NULL, 'info@camauseafood.vn', 'Công ty TNHH Hải sản Cà Mau', '0290123456', 1, 'SUP003', '2026-01-19 15:36:34.000000'),
	(4, '789 Quốc lộ 1A, Mỹ Tho, Tiền Giang', '2026-01-19 15:36:34.000000', NULL, 'sales@trungan.com.vn', 'Công ty CP Gạo Trung An', '0275987654', 1, 'SUP004', '2026-01-19 15:36:34.000000'),
	(5, '15 Đường Tân Trào, Phường Tân Phú, Quận 7, TP.HCM', '2026-01-19 15:36:34.000000', NULL, 'vn.sales@coca-cola.com', 'Nhà phân phối Coca-Cola Việt Nam', '0281234567', 1, 'SUP005', '2026-01-19 15:36:34.000000'),
	(6, '10 Đường Tân Cảng, Phường 25, Bình Thạnh, TP.HCM', '2026-01-19 15:36:34.000000', NULL, 'supplier@vinamilk.com.vn', 'Công ty TNHH Sữa Vinamilk', '0288765432', 1, 'SUP006', '2026-01-19 15:36:34.000000'),
	(7, '52 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM', '2026-01-19 15:36:34.000000', NULL, 'contact@kinhdo.com.vn', 'Công ty CP Bánh kẹo Kinh Đô', '0283456123', 1, 'SUP007', '2026-01-19 15:36:34.000000'),
	(8, '88 Đường Pasteur, Phường Bến Nghé, Quận 1, TP.HCM', '2026-01-19 15:36:34.000000', NULL, 'vn@nongshim.com', 'Nhà phân phối Nongshim Việt Nam', '0287891234', 1, 'SUP008', '2026-01-19 15:36:34.000000');

-- Dumping structure for table sieuthimini.topics
CREATE TABLE IF NOT EXISTS `topics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4qhffgl9q3dcuu7nviv5f0cbf` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.topics: ~5 rows (approximately)
INSERT INTO `topics` (`id`, `created_at`, `deleted_at`, `description`, `name`, `slug`, `status`, `updated_at`) VALUES
	(1, '2026-01-19 15:36:34.000000', NULL, 'Tin tức mới nhất về cửa hàng và sản phẩm', 'Tin tức', 'tin-tuc', 1, '2026-01-19 15:36:34.000000'),
	(2, '2026-01-19 15:36:34.000000', NULL, 'Các chương trình khuyến mãi hấp dẫn', 'Khuyến mãi', 'khuyen-mai', 1, '2026-01-19 15:36:34.000000'),
	(3, '2026-01-19 15:36:34.000000', NULL, 'Mẹo vặt cuộc sống, nấu ăn, bảo quản thực phẩm', 'Mẹo vặt', 'meo-vat', 1, '2026-01-19 15:36:34.000000'),
	(4, '2026-01-19 15:36:34.000000', NULL, 'Kiến thức về dinh dưỡng và sức khỏe', 'Sức khỏe', 'suc-khoe', 1, '2026-01-19 15:36:34.000000'),
	(5, '2026-01-19 15:36:34.000000', NULL, 'Các công thức nấu ăn ngon và dễ làm', 'Công thức nấu ăn', 'cong-thuc-nau-an', 1, '2026-01-19 15:36:34.000000');

-- Dumping structure for table sieuthimini.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` datetime(6) DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','CUSTOMER','STAFF') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `address`, `avatar`, `avatar_public_id`, `created_at`, `deleted_at`, `email`, `email_verified_at`, `name`, `password`, `phone`, `role`, `status`, `updated_at`) VALUES
	(1, NULL, NULL, NULL, '2026-01-19 08:19:23.548064', NULL, 'admin@gmail.com', NULL, 'Administrator', '$2a$10$CZ1ErWzsu1Udx9XBLASque60w3GVLi3wrFlQWTh.cNV7vb/kv4u36', '0347762864', 'ADMIN', 1, '2026-01-19 08:19:23.548064'),
	(2, '123 Le Duan', 'https://res.cloudinary.com/dh42pzbxa/image/upload/v1768847413/users/avatar/a4cgdel5sqkaqggpar8a.jpg', 'users/avatar/a4cgdel5sqkaqggpar8a', '2026-01-19 08:20:00.447874', NULL, 'dvanducw@gmail.com', NULL, 'Van Van', '$2a$10$wsQvSCbD7/Y1j4/DxcGEBe7yc7fi8TMnCHchTWkpNkI/vQgVNrYRu', '0347762865', 'CUSTOMER', 1, '2026-01-21 12:18:03.979679'),
	(3, NULL, NULL, NULL, '2026-01-21 08:02:29.342664', NULL, 'nam@gmail.com', NULL, 'Van Van', '$2a$10$Kap.4vOoolyLLfYiPXPYiO/XA7Cp9itCiDEDRP9kF1ssUeqSnKS2m', '0347762866', 'CUSTOMER', 1, '2026-01-21 08:02:29.342664'),
	(4, NULL, NULL, NULL, '2026-01-21 08:07:09.388926', NULL, 'ahihi@gmail.com', NULL, 'ahihi', '$2a$10$iHUY71fv2V461DWj5DfHV.YMwkpJWd0JsWjUYlVkSnp.5oebDq8ia', '0347762861', 'CUSTOMER', 1, '2026-01-21 08:07:09.388926');

-- Dumping structure for table sieuthimini.vouchers
CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `discount_type` enum('FIXED_AMOUNT','PERCENTAGE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(38,2) NOT NULL,
  `end_date` datetime(6) NOT NULL,
  `max_discount` decimal(38,2) DEFAULT NULL,
  `min_order_amount` decimal(38,2) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` datetime(6) NOT NULL,
  `status` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT NULL,
  `voucher_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhvqsc8qffpt5okjmyot3a4b77` (`voucher_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sieuthimini.vouchers: ~8 rows (approximately)
INSERT INTO `vouchers` (`id`, `created_at`, `created_by`, `deleted_at`, `discount_type`, `discount_value`, `end_date`, `max_discount`, `min_order_amount`, `name`, `start_date`, `status`, `updated_at`, `updated_by`, `usage_limit`, `used_count`, `voucher_code`) VALUES
	(1, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 10.00, '2026-12-31 23:59:59.000000', 50000.00, 200000.00, 'Giảm 10% cho khách hàng mới', '2026-01-01 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 100, 0, 'WELCOME10'),
	(2, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 20.00, '2026-02-28 23:59:59.000000', 100000.00, 500000.00, 'Giảm 20% đơn hàng từ 500K', '2026-01-15 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 200, 0, 'SALE20'),
	(3, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 30.00, '2026-01-31 23:59:59.000000', 300000.00, 1000000.00, 'Siêu sale 30% đơn từ 1 triệu', '2026-01-20 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 50, 0, 'MEGA30'),
	(4, '2026-01-19 15:36:34.000000', 1, NULL, 'PERCENTAGE', 15.00, '2026-12-31 23:59:59.000000', 200000.00, 300000.00, 'Giảm 15% cho khách VIP', '2026-01-01 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, NULL, 0, 'VIP15'),
	(5, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 30000.00, '2026-12-31 23:59:59.000000', NULL, 150000.00, 'Miễn phí vận chuyển', '2026-01-01 00:00:00.000000', 1, '2026-01-19 19:25:29.979381', 2, 500, 1, 'FREESHIP'),
	(6, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 50000.00, '2026-03-31 23:59:59.000000', NULL, 300000.00, 'Giảm 50K cho đơn từ 300K', '2026-01-10 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 300, 0, 'SAVE50K'),
	(7, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 100000.00, '2026-01-25 23:59:59.000000', NULL, 800000.00, 'Flash sale giảm 100K', '2026-01-25 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 100, 0, 'FLASH100K'),
	(8, '2026-01-19 15:36:34.000000', 1, NULL, 'FIXED_AMOUNT', 200000.00, '2026-02-15 23:59:59.000000', NULL, 1500000.00, 'Voucher Tết giảm 200K', '2026-01-20 00:00:00.000000', 1, '2026-01-19 15:36:34.000000', 1, 150, 0, 'TET2026');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
