USE hienstore;

-- Delete old data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_images;
TRUNCATE TABLE product_variants;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

-- Categories
INSERT INTO categories (name, slug, description, image_url, is_active) VALUES 
('Áo Thun', 'ao-thun', 'Áo thun nam nữ cao cấp', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop', 1),
('Áo Khoác', 'ao-khoac', 'Áo khoác thời trang mùa đông', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop', 1),
('Quần Jean', 'quan-jean', 'Quần Jean ống rộng, skinny', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop', 1);

-- Products
INSERT INTO products (category_id, name, slug, description, base_price, is_published, created_at, updated_at) VALUES 
(1, 'Áo Thun Basic Cotton HienStore', 'ao-thun-basic-cotton', 'Chất liệu 100% cotton thoáng mát, thấm hút mồ hôi tốt. Phù hợp mặc đi chơi, đi học.', 150000, 1, NOW(), NOW()),
(1, 'Áo Thun Oversize Streetwear', 'ao-thun-oversize-streetwear', 'Form rộng thoải mái, phong cách đường phố cực chất.', 180000, 1, NOW(), NOW()),
(2, 'Áo Khoác Bomber Nam', 'ao-khoac-bomber-nam', 'Áo khoác bomber giữ ấm cực tốt, form vừa vặn.', 350000, 1, NOW(), NOW()),
(3, 'Quần Jean Ống Rộng Nữ', 'quan-jean-ong-rong-nu', 'Hack dáng cực đỉnh, dễ phối đồ.', 280000, 1, NOW(), NOW());

-- Product Variants
INSERT INTO product_variants (product_id, sku, color, size, price, stock_quantity) VALUES 
(1, 'AT-BSC-TRANG-M', 'Trắng', 'M', 150000, 50),
(1, 'AT-BSC-TRANG-L', 'Trắng', 'L', 150000, 50),
(1, 'AT-BSC-DEN-M', 'Đen', 'M', 150000, 30),
(2, 'AT-OVS-DEN-XL', 'Đen', 'XL', 180000, 40),
(3, 'AK-BMB-XANH-L', 'Xanh Rêu', 'L', 350000, 20),
(4, 'QJ-OR-XANH-S', 'Xanh Nhạt', 'S', 280000, 15),
(4, 'QJ-OR-XANH-M', 'Xanh Nhạt', 'M', 280000, 20);

-- Product Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES 
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop', 1),
(2, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop', 1),
(3, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop', 1),
(4, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop', 1);
