// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiTopic from "../../../api/apiTopic";

// const AddTopic = () => {
//   const navigate = useNavigate();

//   const [topic, setTopic] = useState({
//     name: "",
//     description: "",
//     status: 1,
//   });

//   // ✅ Xử lý thay đổi input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTopic({ ...topic, [name]: value });
//   };

//   // ✅ Submit form thêm mới
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await apiTopic.addTopic(topic);
//       if (res.status) {
//         alert("Thêm chủ đề thành công!");
//         navigate("/admin/topics/1");
//       } else {
//         alert("Thêm thất bại!");
//       }
//     } catch (error) {
//       console.error("Lỗi khi thêm chủ đề:", error);
//       alert("Không thể thêm chủ đề.");
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       {/* Header */}
//       <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
//         <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
//           Thêm chủ đề mới
//         </h3>
//         <button
//           onClick={() => navigate("/admin/topics/1")}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-200"
//         >
//           <i className="fas fa-arrow-left mr-2"></i> Về danh sách
//         </button>
//       </div>

//       {/* Form */}
//       <div className="p-6">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Thông tin chủ đề */}
//             <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
//               <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
//                 Thông tin chủ đề
//               </h4>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tên chủ đề
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={topic.name}
//                   onChange={handleChange}
//                   className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Nhập tên chủ đề"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mô tả
//                 </label>
//                 <textarea
//                   name="description"
//                   value={topic.description}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Nhập mô tả chủ đề"
//                 ></textarea>
//               </div>
//             </div>

//             {/* Thiết lập hiển thị */}
//             <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
//               <h4 className="text-lg font-semibold text-indigo-700 mb-4 pb-2 border-b border-indigo-200">
//                 Thiết lập hiển thị
//               </h4>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Trạng thái
//                 </label>
//                 <select
//                   name="status"
//                   value={topic.status}
//                   onChange={handleChange}
//                   className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="1">Xuất bản</option>
//                   <option value="0">Không xuất bản</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
//               >
//                 <i className="fas fa-plus mr-2"></i> Thêm chủ đề
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTopic;



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiTopic from "../../../api/apiTopic"; // Đảm bảo đúng đường dẫn
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTopic = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: 1,
  });

  const generateSlug = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
      .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-")
      .replace(/^-+/, "").replace(/-+$/, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: name === "status" ? Number(value) : value };
      if (name === "name") updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ GỌI ĐÚNG HÀM 'create' đã định nghĩa trong apiTopic.js
      await apiTopic.create(formData);
      toast.success("✅ Thêm chủ đề thành công!");
      setTimeout(() => navigate("/admin/topics"), 1500);
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("❌ Lỗi kết nối hoặc Backend chưa mở CORS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded shadow-md p-6">
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-bold">Thêm chủ đề mới</h3>
          <Link to="/admin/topics" className="bg-gray-500 text-white px-4 py-2 rounded">Trở về</Link>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Tên chủ đề</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Slug</label>
              <input name="slug" value={formData.slug} className="w-full border p-2 rounded bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block mb-1 font-medium">Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows="3" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
                <option value={1}>Xuất bản</option>
                <option value={0}>Chưa xuất bản</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded font-bold">
              {loading ? "Đang lưu..." : "LƯU CHỦ ĐỀ"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AddTopic;