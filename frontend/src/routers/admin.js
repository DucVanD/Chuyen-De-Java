// dashboard
import Dashboard from "../pages/admin/Dashboard";

// category
import ListCat from "../pages/admin/Category/ListCat";
import DelCat from "../pages/admin/Category/DelCat";
import AddCat from "../pages/admin/Category/AddCat";
import EditCat from "../pages/admin/Category/EditCat";
import TrashCat from "../pages/admin/Category/TrashCat";

// product
import ListProduct from "../pages/admin/Product/ListProduct";
import DelProduct from "../pages/admin/Product/DelProduct";
import EditProduct from "../pages/admin/Product/EditProduct";
import AddProduct from "../pages/admin/Product/AddProduct";
import TrashProduct from "../pages/admin/Product/TrashProduct";

// post
import ListPost from "../pages/admin/post/ListPost";
import EditPost from "../pages/admin/post/EditPost";
import AddPost from "../pages/admin/post/AddPost";

// page
import ListPage from "../pages/admin/post/ListPage";
import EditPage from "../pages/admin/post/EditPage";
import AddPage from "../pages/admin/post/AddPage";

// topic
import ListTopic from "../pages/admin/Topic/ListTopic";
import EditTopic from "../pages/admin/Topic/EditTopic";
import AddTopic from "../pages/admin/Topic/AddTopic";

// brand
import ListBrand from "../pages/admin/Brand/ListBrand";
import AddBrand from "../pages/admin/Brand/AddBrand";
import EditBrand from "../pages/admin/Brand/EditBrand";

// order
import ListOrder from "../pages/admin/Order/ListOrder";
import EditOrder from "../pages/admin/Order/EditOrder";
import OrderDetail from "../pages/admin/Order/OrderDetail";
import TrashOrder from "../pages/admin/Order/TrashOrder";


// user
import ListUser from "../pages/admin/UserAdmin/ListUser";
import UserDetail from "../pages/admin/UserAdmin/UserDetail";
import AddUser from "../pages/admin/UserAdmin/AddUser";
import EditUser from "../pages/admin/UserAdmin/EditUser";

// inventory
import Inventory from "../pages/admin/Inventory/ListInventory";
import FormNhapKho from "../pages/admin/Inventory/FormNhapKho";
import FormXuatKho from "../pages/admin/Inventory/FormXuatKho";
import FormDieuChinh from "../pages/admin/Inventory/FormDieuChinh";
import ListOrderExport from "../pages/admin/Inventory/ListOrderExport";

// employee 
import EmployeeManagement from "../pages/admin/EmployeeManagement/ListEmployee";

// Supplier
import ListSupplier from "../pages/admin/Supplier/ListSupplier";
import AddSupplier from "../pages/admin/Supplier/AddSupplier";
import EditSupplier from "../pages/admin/Supplier/EditSupplier";

// Voucher
import ListVoucher from "../pages/admin/Voucher/ListVoucher";
import AddVoucher from "../pages/admin/Voucher/AddVoucher";
import EditVoucher from "../pages/admin/Voucher/EditVoucher";


// Contact
import ListContact from "../pages/admin/Contact/ListContact";

// Customer
import ListCustomer from "../pages/admin/Customer/ListCustomer";


// định nghĩa các route cho trang admin
const AdminRoute = [
  { path: "dashboard", component: Dashboard },
  { path: "", component: Dashboard },

  // category
  // { path: "categories/:page?", component: ListCat },
  { path: "categories", component: ListCat },

  { path: "category/add", component: AddCat },
  { path: "category/delete", component: DelCat },
  { path: "category/edit/:id", component: EditCat },
  { path: "category/trash/:page?", component: TrashCat },

  // product
  { path: "products/:page?", component: ListProduct },
  { path: "product/add", component: AddProduct },
  { path: "product/edit/:id", component: EditProduct },
  { path: "product/trash/:page?", component: TrashProduct },

  // post
  { path: "posts/:page?", component: ListPost, role: "ADMIN" },
  { path: "post/add", component: AddPost, role: "ADMIN" },
  { path: "post/edit/:id", component: EditPost, role: "ADMIN" },

  // pages
  { path: "pages/:page?", component: ListPage, role: "ADMIN" },
  { path: "page/add", component: AddPage, role: "ADMIN" },
  { path: "page/edit/:id", component: EditPage, role: "ADMIN" },

  // topic
  { path: "topics/:page?", component: ListTopic, role: "ADMIN" },
  { path: "topic/add", component: AddTopic, role: "ADMIN" },
  { path: "topic/edit/:id", component: EditTopic, role: "ADMIN" },

  // brand
  { path: "brands/:page?", component: ListBrand, role: "ADMIN" },
  { path: "brand/add", component: AddBrand, role: "ADMIN" },
  { path: "brand/edit/:id", component: EditBrand, role: "ADMIN" },
  // order
  { path: "orders/:page?", component: ListOrder },
  { path: "order/edit/:id", component: EditOrder },
  { path: "order/detail/:id", component: OrderDetail },
  { path: "orders/trash", component: TrashOrder },

  // user
  { path: "users/:page?", component: ListUser, role: "ADMIN" },
  { path: "user/detail/:id", component: UserDetail, role: "ADMIN" },
  { path: "user/add", component: AddUser, role: "ADMIN" },
  { path: "user/edit/:id", component: EditUser, role: "ADMIN" },

  // employee 
  { path: "employees", component: EmployeeManagement, role: "ADMIN" },

  // supplier
  { path: "suppliers/:page?", component: ListSupplier, role: "ADMIN" },
  { path: "supplier/add", component: AddSupplier, role: "ADMIN" },
  { path: "supplier/edit/:id", component: EditSupplier, role: "ADMIN" },

  // voucher
  { path: "vouchers", component: ListVoucher },
  { path: "voucher/add", component: AddVoucher },
  { path: "voucher/edit/:id", component: EditVoucher },

  // inventory
  { path: "inventory", component: Inventory, role: "ADMIN" },
  { path: "inventory/import", component: FormNhapKho, role: "ADMIN" },
  { path: "inventory/export", component: ListOrderExport, role: "ADMIN" },
  { path: "inventory/adjust", component: FormDieuChinh, role: "ADMIN" },
  // Contact
  { path: "contacts", component: ListContact },

  // Customer
  { path: "customers", component: ListCustomer, role: "ADMIN" },
];

export default AdminRoute;
