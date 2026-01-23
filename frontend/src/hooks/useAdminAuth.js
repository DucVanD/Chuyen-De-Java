import { useState, useEffect } from "react";
import apiAdmin from "../api/apiAdmin";

export default function useAdminAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("adminUser");
    if (!user) {
      setLoading(false);
      return;
    }

    apiAdmin
      .getUsers() // Tạm dùng getUsers để check quyền nếu không có getMe
      .then(() => {
        setAdmin(JSON.parse(user));
      })
      .catch(() => {
        localStorage.removeItem("adminUser");
      })
      .finally(() => setLoading(false));
  }, []);

  return { admin, loading };
}
