import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import store from "./Redux/store"; // Moved to main.jsx

import Userroute from "./routers/user.js";
import LayoutUser from "./components/LayoutUser.jsx";
import Adminroute from "./routers/admin.js";
import LayoutAdmin from "./components/LayoutAdmin.jsx";
import AdminPrivateRoute from "./components/AdminPrivateRoute.jsx";
import AdminLogin from "./pages/admin/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserPrivateRoute from "./components/UserPrivateRoute.jsx";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "./Redux/cartSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* USER */}
        <Route path="/" element={<LayoutUser />}>
          {Userroute.map((router, index) => {
            const Page = router.component;
            const isPrivate = ["/profile", "/history-bought/:page?"].includes(router.path);

            if (isPrivate) {
              return (
                <Route
                  key={index}
                  path={router.path}
                  element={
                    <UserPrivateRoute>
                      <Page />
                    </UserPrivateRoute>
                  }
                />
              );
            }
            return <Route key={index} path={router.path} element={<Page />} />;
          })}
        </Route>

        {/* ADMIN LOGIN (Public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* FORGOT PASSWORD (Public) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ADMIN (Protected) */}
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <LayoutAdmin />
            </AdminPrivateRoute>
          }
        >
          {Adminroute.map((router, index) => {
            const Page = router.component;
            const allowedRoles = router.role ? [router.role] : ["ADMIN", "STAFF"];
            return (
              <Route
                key={index}
                path={router.path}
                element={
                  <AdminPrivateRoute requiredRoles={allowedRoles}>
                    <Page />
                  </AdminPrivateRoute>
                }
              />
            );
          })}
        </Route>
      </Routes>

      {/* ✅ ToastContainer đặt sau BrowserRouter để hoạt động toàn cục */}
      <ToastContainer
        position="top-right"
        autoClose={1500} // thời gian toast hiển thị 0.8s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
