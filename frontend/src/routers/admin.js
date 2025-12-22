// ================= DASHBOARD =================
import Dashboard from "../pages/admin/Dashboard";

// ================= CATEGORY =================
import ListCat from "../pages/admin/Category/ListCat";
import DelCat from "../pages/admin/Category/DelCat";
import AddCat from "../pages/admin/Category/AddCat";
import EditCat from "../pages/admin/Category/EditCat";
import TrashCat from "../pages/admin/Category/TrashCat";

// ================= PRODUCT =================
import ListProduct from "../pages/admin/Product/ListProduct";
import DelProduct from "../pages/admin/Product/DelProduct";
import EditProduct from "../pages/admin/Product/Editproduct";
import AddProduct from "../pages/admin/Product/AddProduct";
import TrashProduct from "../pages/admin/Product/TrashProduct";

// ================= POST =================
import ListPost from "../pages/admin/post/ListPost";
import EditPost from "../pages/admin/post/EditPost";
import AddPost from "../pages/admin/post/AddPost";

// ================= TOPIC =================
import ListTopic from "../pages/admin/Topic/ListTopic";
import EditTopic from "../pages/admin/Topic/EditTopic";
import AddTopic from "../pages/admin/Topic/Addtopic";

// ================= BRAND =================
import ListBrand from "../pages/admin/Brand/listBrand";

// ================= ORDER =================
import ListOrder from "../pages/admin/Order/listOrder";
import EditOrder from "../pages/admin/Order/EditOrder";
import OrderDetail from "../pages/admin/Order/detailOrder";

// ================= USER =================
import ListUser from "../pages/admin/UserAdmin/ListUser";
import UserDetail from "../pages/admin/UserAdmin/UserDetail";

// ================= INVENTORY =================
import Inventory from "../pages/admin/Inventory/ListInventory";
import FormNhapKho from "../pages/admin/Inventory/FormNhapKho";
import FormXuatKho from "../pages/admin/Inventory/FormXuatKho";
import FormDieuChinh from "../pages/admin/Inventory/FormDieuChinh";

// ================= EMPLOYEE =================
import EmployeeManagement from "../pages/admin/EmployeeManagement/EmployeeManagement";

// ================= VOUCHER =================
import VoucherManagement from "../pages/admin/Voucher/VoucherManagement";

// ================= CONTACT ✅ =================
import ContactList from "../pages/admin/Contact/ContactList";
import ContactDetail from "../pages/admin/Contact/ContactDetail";

// ================= ROUTES =================
const AdminRoute = [
  // dashboard
  { path: "dashboard", component: Dashboard },
  { path: "", component: Dashboard },

  // category
  { path: "categories/:page?", component: ListCat },
  { path: "addCat", component: AddCat },
  { path: "delCat", component: DelCat },
  { path: "editCat/:id", component: EditCat },
  { path: "trashCat/:page?", component: TrashCat },

  // product
  { path: "products/:page?", component: ListProduct },
  { path: "addProduct", component: AddProduct },
  { path: "editProduct/:id", component: EditProduct },
  { path: "trashProduct/:page?", component: TrashProduct },

  // post
  { path: "posts/:page?", component: ListPost },
  { path: "addPost", component: AddPost },
  { path: "editPost/:id", component: EditPost },

  // topic
  { path: "topics/:page?", component: ListTopic },
  { path: "addTopic", component: AddTopic },
  { path: "editTopic/:id", component: EditTopic },

  // brand
  { path: "brands/:page?", component: ListBrand },

  // order
  { path: "orders/:page?", component: ListOrder },
  { path: "editOrder/:id", component: EditOrder },
  { path: "orderDetail/:id", component: OrderDetail },

  // user
  { path: "users/:page?", component: ListUser },
  { path: "userDetail/:id", component: UserDetail },

  // employee
  { path: "employees", component: EmployeeManagement },

  // voucher
  { path: "vouchers", component: VoucherManagement },

  // contact ✅
  { path: "contacts", component: ContactList },
  { path: "contacts/:id", component: ContactDetail },

  // inventory
  { path: "inventory", component: Inventory },
  { path: "inventory/import", component: FormNhapKho },
  { path: "inventory/export", component: FormXuatKho },
  { path: "inventory/adjust", component: FormDieuChinh },
];

export default AdminRoute;
