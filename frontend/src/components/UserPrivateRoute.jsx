import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UserPrivateRoute({ children }) {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.info("Vui lòng đăng nhập để tiếp tục!", {
                toastId: "user-auth-required",
            });
            navigate("/registered", { replace: true });
        }
    }, [user, navigate]);

    if (!user) return null;

    return children;
}
