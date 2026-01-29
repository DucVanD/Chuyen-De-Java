# Project Features Report

Generated: 2026-01-29

## Summary

- Backend controllers found: 29
- Frontend pages found: 69 (in `frontend/src/pages`)
- Frontend API modules found: 32 (in `frontend/src/api`)

## Main high-level features (distinct)
1. Authentication (login/register/refresh/forgot/reset)
2. User profile & management
3. Products (list/search/filter/detail, admin CRUD)
4. Categories (user view, admin CRUD)
5. Brands (user view, admin CRUD)
6. Cart (add/update/remove/clear)
7. Orders (create, history, admin management, status updates, cancel, trash/restore)
8. VNPay payment integration (create link, callback)
9. Vouchers (list, apply, admin CRUD)
10. Posts / Blog (list, detail, admin)
11. Contacts (user submit, admin manage)
12. Suppliers management
13. Customers (admin view)
14. Inventory / Stock movements (import/export/adjust)
15. File upload / Cloudinary
16. Chat / AI chatbot
17. Admin panel / dashboard
18. Invoice generation / export

## Backend controllers (paths)
(Each controller is under `backend/src/main/java/com/example/backend/controller/...`)

- FileUploadController - `@RequestMapping("/api/upload")` (POST endpoints for category/product/brand/user/post uploads)
- CloudinaryController - `@RequestMapping("/api/upload")` (image upload/delete for admin)
- ChatController - `@RequestMapping("/api/chat")` (POST chat)
- AuthController - `@RequestMapping("/api/auth")` (POST login, refresh, logout, register, forgot/verify/reset)
- VoucherController (user) - `@RequestMapping("/api/vouchers")`
- AdminVoucherController - `@RequestMapping("/api/admin/vouchers")`
- VNPayController (user) - `@RequestMapping("/api/vnpay")` (POST /create-payment, GET /callback)
- AdminTopicController - `@RequestMapping("/api/admin/topic")`
- UserController - `@RequestMapping("/api/users")`
- AdminUserController - `@RequestMapping("/api/admin/users")`
- AdminSupplierController - `@RequestMapping("/api/admin/suppliers")`
- UserContactController - `@RequestMapping("/api/user/contacts")`
- AdminStockMovementController - `@RequestMapping("/api/admin/stock-movements")`
- TopicController (user) - `@RequestMapping("/api/topic")`
- AdminProductController - `@RequestMapping("/api/admin/products")`
- SupplierController (user) - `@RequestMapping("/api/suppliers")`
- AdminPostController - `@RequestMapping("/api/admin/post")`
- ProductController (user) - `@RequestMapping("/api/products")`
- AdminOrderController - `@RequestMapping("/api/admin/orders")`
- PostController (user) - `@RequestMapping("/api/post")`
- AdminCustomerController - `@RequestMapping("/api/admin/customers")`
- AdminContactController - `@RequestMapping("/api/contacts")`
- CategoryController (user) - `@RequestMapping("/api/categories")`
- CartController (user) - `@RequestMapping("/api/cart")`
- AdminCategoryController - `@RequestMapping("/api/admin/categories")`
- AdminCartController - `@RequestMapping("/api/admin/carts")`
- BrandController (user) - `@RequestMapping("/api/brands")`
- AdminBrandController - `@RequestMapping("/api/admin/brands")`
- OrderController (user) - `@RequestMapping("/api/orders")`

## Frontend pages (high-level groups)
(Listed under `frontend/src/pages` — includes user, admin, auth)

- User pages: About, VoucherInput, system, SearchProduct, request, Registered, Profile, Products, ProductItem, ProductByCat, PostDetail, post, PaymentSuccess, home, Contact, Checkout, Cart, Detail, HistoryBought, VoucherInput, etc. (~40+ files)
- Admin pages: Dashboard, AdminLogin, lots of admin subpages (Category, Brand, Supplier, Topic, Voucher, Product, Order, Inventory, Post, Customer, Contact, Cart admin, etc.) (~25+ files)
- Auth pages: ForgotPassword, Registered

(Full file listing in project available under `frontend/src/pages`.)

## Frontend API modules (quick list)
- `src/api/axios.js`, `axiosAdmin.js`, `config.js`
- `apiAuth.js`, `apiChat.js`, `apiUpload.js`
- `admin/*` APIs: `apiAdmin.js`, `apiBrandAdmin.js`, `apiCategoryAdmin.js`, `apiCartAdmin.js`, `apiContactAdmin.js`, `apiCustomerAdmin.js`, `apiOrderAdmin.js`, `apiPostAdmin.js`, `apiProductAdmin.js`, `apiStockAdmin.js`, `apiSupplierAdmin.js`, `apiTopicAdmin.js`, `apiUserAdmin.js`, `apiVoucherAdmin.js`
- `user/*` APIs: `apiBrand.js`, `apiCart.js`, `apiCategory.js`, `apiContact.js`, `apiContactUser.js`, `apiOrder.js`, `apiPost.js`, `apiProduct.js`, `apiSupplier.js`, `apiTopic.js`, `apiUser.js`, `apiVoucher.js`

## Notes & next actions you might want
- I can produce a CSV/JSON listing every endpoint (HTTP method + path) by parsing each controller method if you want an exhaustive API reference.
- I can also produce a mapping of frontend pages → APIs they call by scanning the codebase for API imports/usages.

---

