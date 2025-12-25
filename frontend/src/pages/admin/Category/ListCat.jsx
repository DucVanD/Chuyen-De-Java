import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCategory from "../../../api/apiCategory"; // Import file vừa sửa
import { imageURL } from "../../../api/config";
import { FaPlus, FaTrash, FaEdit, FaEye } from "react-icons/fa"; // Bỏ Toggle tạm nếu chưa làm API toggle

const ListCat = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  // Tạm thời bỏ phân trang backend vì Spring Boot đang trả về List<All>
  // const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  // const [lastPage, setLastPage] = useState(1);

  // ✅ Hàm lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const data = await apiCategory.getAll(); // data lúc này là mảng []
      console.log("Danh mục lấy về:", data);
      // Kiểm tra xem data có phải là mảng không
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        // Phòng trường hợp bạn bọc trong ResponseEntity
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      toast.error("Không thể tải danh mục!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Xóa danh mục
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
    try {
      await apiCategory.delete(id);
      toast.success("Xóa thành công!");

      // Load lại danh sách
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại!");
    }
  };


  const categoryMap = Object.fromEntries(
    categories.map(cat => [cat.id, cat.name])
  );


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Danh sách danh mục
        </h3>
        <div className="flex space-x-3">
          <Link
            to="/admin/addCat"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center transition duration-200"
          >
            <FaPlus className="mr-2" /> Thêm mới
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ tự</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Chức năng</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-center">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{category.id}</td>

                    <td className="px-4 py-3 flex justify-center">
                      {/* Cần đảm bảo category.image trả về đúng tên file */}
                      <img
                        className="h-20 w-32 object-cover border border-gray-200 rounded-md"
                        src={category.image ? `${imageURL}/category/${category.image}` : 'https://placehold.co/100'}
                        alt={category.name}
                      />
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-800">{category.name}</td>


                    <td className="px-4 py-3 text-sm text-gray-800">
                      {category.parentId
                        ? `Con của ${categoryMap[category.parentId] || "Danh mục cha"}`
                        : "Danh mục cha"}
                    </td>



                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          to={`/admin/editcat/${category.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit className="text-lg" />
                        </Link>

                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Không có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListCat;