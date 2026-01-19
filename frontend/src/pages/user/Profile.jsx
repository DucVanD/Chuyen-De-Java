import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import { toast } from "react-toastify";
import apiUser from "../../api/user/apiUser";
import "react-toastify/dist/ReactToastify.css";
import { getImageUrl } from "../../api/config";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Redux/authSlice";
import { FaCamera, FaUserEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khởi tạo navigate

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!currentUser?.id) {
      toast.info("Vui lòng đăng nhập để xem thông tin hồ sơ!", { toastId: "profile-auth" });
      navigate("/registered");
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await apiUser.getById(currentUser.id);
        setUser(res);
      } catch (err) {
        console.error(err);
        toast.error("❌ Không thể tải thông tin người dùng");
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setUser({ ...user, avatar: file });
    }
  };

  const handleSave = async () => {
    try {
      let avatarUrl = user.avatar;
      let avatarPublicId = user.avatarPublicId;

      if (user.avatar instanceof File) {
        const formData = new FormData();
        formData.append("file", user.avatar);
        try {
          const uploadRes = await apiUser.uploadAvatar(formData);
          if (uploadRes && uploadRes.url) {
            avatarUrl = uploadRes.url;
            avatarPublicId = uploadRes.publicId;
          }
        } catch (uploadErr) {
          toast.error("❌ Lỗi khi upload ảnh đại diện!");
          return;
        }
      }

      const updatedData = {
        name: user.name,
        phone: user.phone || "",
        address: user.address || "",
        avatar: avatarUrl,
        avatarPublicId: avatarPublicId,
      };

      const res = await apiUser.update(user.id, updatedData);

      if (res) {
        toast.success("✅ Cập nhật hồ sơ thành công!");
        setIsEditing(false);
        setUser(res);
        dispatch(updateUser(res));
      } else {
        toast.warning("⚠️ Cập nhật thất bại!");
      }
    } catch (err) {
      // ... (Giữ nguyên logic xử lý lỗi của bạn)
      toast.error("❌ Đã xảy ra lỗi khi lưu!");
    }
  };

  // UI Loading Skeleton đơn giản
  if (!user)
    return (
      <div className="max-w-5xl mx-auto p-6 flex gap-6 animate-pulse">
        <div className="w-1/3 h-80 bg-gray-200 rounded-xl"></div>
        <div className="w-2/3 h-80 bg-gray-200 rounded-xl"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in-up">
      {/* Header trang */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Hồ sơ của bạn
        </h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* CỘT TRÁI: AVATAR CARD */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center sticky top-6">
            <div className="relative group mb-4">
              {/* Vòng tròn Avatar */}
              <div className="w-40 h-40 rounded-full p-1 border-2 border-dashed border-green-500/50">
                <img
                  src={avatarPreview ? avatarPreview : getImageUrl(user.avatar, "avatar")}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover shadow-sm"
                />
              </div>

              {/*  Icon Camera khi Edit */}
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <FaCamera className="text-white text-2xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>

            {/* Nút Toggle Chỉnh sửa */}
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setAvatarPreview(null); // Reset preview nếu hủy
              }}
              className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isEditing
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                }`}
            >
              {isEditing ? <><FaTimes /> Hủy bỏ</> : <><FaUserEdit /> Chỉnh sửa hồ sơ</>}
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: FORM THÔNG TIN */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 border-l-4 border-green-500 pl-3">
                Thông tin cá nhân
              </h3>
              {isEditing && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">Đang chỉnh sửa</span>}
            </div>


            <div className="space-y-5">
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <FaUser className="text-green-600" /> Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-xl border transition-all outline-none ${isEditing
                    ? "bg-white border-green-300 focus:ring-2 focus:ring-green-100 focus:border-green-500 text-gray-800"
                    : "bg-gray-50 border-transparent text-gray-600"
                    }`}
                />
              </div>

              {/* Email (Luôn disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <FaEnvelope className="text-green-600" /> Email
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full p-3 rounded-xl border border-transparent bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <FaPhone className="text-green-600" /> Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Nhập số điện thoại..." : "Chưa cập nhật"}
                  className={`w-full p-3 rounded-xl border transition-all outline-none ${isEditing
                    ? "bg-white border-green-300 focus:ring-2 focus:ring-green-100 focus:border-green-500 text-gray-800"
                    : "bg-gray-50 border-transparent text-gray-600"
                    }`}
                />
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" /> Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Nhập địa chỉ nhận hàng..." : "Chưa cập nhật"}
                  className={`w-full p-3 rounded-xl border transition-all outline-none ${isEditing
                    ? "bg-white border-green-300 focus:ring-2 focus:ring-green-100 focus:border-green-500 text-gray-800"
                    : "bg-gray-50 border-transparent text-gray-600"
                    }`}
                />
              </div>

              {/* Nút Lưu (Chỉ hiện khi Edit) */}
              {isEditing && (
                <div className="pt-4 animate-fade-in">
                  <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:from-green-700 hover:to-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    <FaSave /> Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;