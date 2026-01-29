# API Endpoints (Backend)

Generated: 2026-01-29

This file enumerates backend HTTP endpoints (method + path) found under `backend/src/main/java/com/example/backend/controller`.

---

## AuthController (/api/auth)
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- POST /api/auth/register
- POST /api/auth/forgot-password
- POST /api/auth/verify-code
- POST /api/auth/reset-password

## ChatController (/api/chat)
- POST /api/chat

## FileUploadController & CloudinaryController (/api/upload)
- POST /api/upload/category
- POST /api/upload/product
- POST /api/upload/brand
- POST /api/upload/user
- POST /api/upload/post
- POST /api/upload/image (admin - upload image with folder)
- DELETE /api/upload/image/{publicId} (admin)

## VNPayController (/api/vnpay)
- POST /api/vnpay/create-payment?orderId={orderId}
- GET  /api/vnpay/callback (VNPay return URL with query params)

## Voucher (user) (/api/vouchers)
- GET  /api/vouchers
- GET  /api/vouchers/active
- GET  /api/vouchers/{id}
- GET  /api/vouchers/code/{code}
- POST /api/vouchers (admin/staff)
- PUT  /api/vouchers/{id} (admin/staff)
- PUT  /api/vouchers/{id}/deactivate (admin/staff)

## AdminVoucher (/api/admin/vouchers)
- GET  /api/admin/vouchers
- GET  /api/admin/vouchers/{id}
- POST /api/admin/vouchers
- PUT  /api/admin/vouchers/{id}
- DELETE /api/admin/vouchers/{id}

## Topic (user) (/api/topic)
- GET /api/topic/all
- GET /api/topic/{id}

## AdminTopic (/api/admin/topic)
- GET /api/admin/topic
- GET /api/admin/topic/page
- GET /api/admin/topic/{id}
- POST /api/admin/topic
- PUT /api/admin/topic/{id}
- PUT /api/admin/topic/{id}/status
- DELETE /api/admin/topic/{id}

## UserController (/api/users)
- GET  /api/users (admin/staff)
- GET  /api/users/{id}
- POST /api/users (admin/staff) with `password` param
- PUT  /api/users/{id}
- PUT  /api/users/{id}/lock
- PUT  /api/users/{id}/unlock

## AdminUser (/api/admin/users)
- GET  /api/admin/users
- GET  /api/admin/users/page
- GET  /api/admin/users/{id}
- POST /api/admin/users (admin)
- PUT  /api/admin/users/{id} (admin)
- DELETE /api/admin/users/{id} (admin)
- PUT  /api/admin/users/{id}/lock
- PUT  /api/admin/users/{id}/unlock

## Brand (user) (/api/brands)
- GET  /api/brands
- GET  /api/brands/{id}
- POST /api/brands (admin/staff)
- PUT  /api/brands/{id} (admin/staff)
- DELETE /api/brands/{id} (admin/staff)

## AdminBrand (/api/admin/brands)
- GET  /api/admin/brands
- GET  /api/admin/brands/{id}
- POST /api/admin/brands
- PUT  /api/admin/brands/{id}
- DELETE /api/admin/brands/{id}

## Category (user) (/api/categories)
- GET  /api/categories
- GET  /api/categories/{id}
- GET  /api/categories/parents-with-children

## AdminCategory (/api/admin/categories)
- GET  /api/admin/categories
- GET  /api/admin/categories/page
- GET  /api/admin/categories/{id}
- POST /api/admin/categories
- PUT  /api/admin/categories/{id}
- PUT  /api/admin/categories/{id}/status
- DELETE /api/admin/categories/{id}

## Product (user) (/api/products)
- GET  /api/products (paged)
- GET  /api/products/{id}
- POST /api/products (admin/staff)
- PUT  /api/products/{id} (admin/staff)
- DELETE /api/products/{id} (admin/staff)
- GET  /api/products/search
- GET  /api/products/filter
- GET  /api/products/{id}/hateoas
- GET  /api/products/latest
- GET  /api/products/slug/{slug}
- GET  /api/products/home-categories
- GET  /api/products/{id}/related

## AdminProduct (/api/admin/products)
- GET  /api/admin/products
- GET  /api/admin/products/page
- GET  /api/admin/products/{id}
- GET  /api/admin/products/slug/{slug}
- GET  /api/admin/products/search
- GET  /api/admin/products/filter
- POST /api/admin/products
- PUT  /api/admin/products/{id}
- DELETE /api/admin/products/{id}
- GET  /api/admin/products/toggle-status/{id}

## Cart (user) (/api/cart)
- GET  /api/cart
- POST /api/cart/add?productId={productId}&quantity={quantity}
- PUT  /api/cart/update/{itemId}?quantity={quantity}
- DELETE /api/cart/remove/{itemId}
- DELETE /api/cart/clear

## AdminCart (/api/admin/carts)
- GET /api/admin/carts
- GET /api/admin/carts/{id}

## Order (user) (/api/orders)
- GET  /api/orders (admin/staff list)
- GET  /api/orders/{id}
- POST /api/orders
- PUT  /api/orders/{id}/status (admin/staff)
- PUT  /api/orders/{id}/cancel?reason={reason}
- GET  /api/orders/my-orders

## AdminOrder (/api/admin/orders)
- GET  /api/admin/orders
- GET  /api/admin/orders/page
- GET  /api/admin/orders/{id}
- PUT  /api/admin/orders/{id}/status
- DELETE /api/admin/orders/{id} (admin)
- GET  /api/admin/orders/trash (admin)
- POST /api/admin/orders/{id}/restore (admin)
- DELETE /api/admin/orders/{id}/permanent (admin)

## Post (user) (/api/post)
- GET /api/post/newest
- GET /api/post/all
- GET /api/post/slug/{slug}
- GET /api/post/{id}

## AdminPost (/api/admin/post)
- GET /api/admin/post
- GET /api/admin/post/page
- GET /api/admin/post/{id}
- POST /api/admin/post
- PUT /api/admin/post/{id}
- PUT /api/admin/post/{id}/status
- DELETE /api/admin/post/{id}

## Supplier (user) (/api/suppliers)
- GET  /api/suppliers
- GET  /api/suppliers/{id}
- POST /api/suppliers (admin/staff)
- PUT  /api/suppliers/{id} (admin/staff)
- DELETE /api/suppliers/{id} (admin/staff)

## AdminSupplier (/api/admin/suppliers)
- GET /api/admin/suppliers
- GET /api/admin/suppliers/page
- GET /api/admin/suppliers/{id}
- POST /api/admin/suppliers
- PUT /api/admin/suppliers/{id}
- DELETE /api/admin/suppliers/{id}

## Contact (admin) (/api/contacts)
- GET  /api/contacts
- POST /api/contacts
- GET  /api/contacts/{id}
- PUT  /api/contacts/{id}
- DELETE /api/contacts/{id}

## UserContact (/api/user/contacts)
- GET /api/user/contacts/order/{orderCode}

## AdminCustomer (/api/admin/customers)
- GET /api/admin/customers

## AdminStockMovement (/api/admin/stock-movements)
- GET /api/admin/stock-movements
- GET /api/admin/stock-movements/page
- GET /api/admin/stock-movements/{id}
- POST /api/admin/stock-movements
- GET /api/admin/stock-movements/last-import-price/{productId}
- GET /api/admin/stock-movements/last-supplier/{productId}
- GET /api/admin/stock-movements/by-type/{type}

