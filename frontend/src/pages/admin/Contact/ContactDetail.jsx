import { useParams, Link } from "react-router-dom";

const ContactDetail = () => {
  const { id } = useParams();

  // DATA GIẢ LẬP (sau này gọi API theo id)
  const contact = {
    id,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0901234567",
    message: "Tôi muốn hỏi về tình trạng đơn hàng.",
    status: "Chưa phản hồi",
    createdAt: "2025-03-20 10:30",
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold mb-6">
        Chi tiết liên hệ #{contact.id}
      </h1>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <Item label="Họ tên" value={contact.name} />
        <Item label="Email" value={contact.email} />
        <Item label="SĐT" value={contact.phone} />
        <Item label="Ngày gửi" value={contact.createdAt} />

        <div>
          <p className="text-sm text-gray-500 mb-1">Nội dung</p>
          <div className="bg-gray-50 p-3 rounded border">
            {contact.message}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-xs font-semibold">
            {contact.status}
          </span>
        </div>

        <div className="flex gap-3 pt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Đánh dấu đã phản hồi
          </button>

          <Link
            to="/admin/contacts"
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Quay lại
          </Link>
        </div>
      </div>
    </div>
  );
};

const Item = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="col-span-2 font-medium">{value}</p>
  </div>
);

export default ContactDetail;
