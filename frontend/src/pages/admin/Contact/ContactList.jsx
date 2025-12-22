import { Link } from "react-router-dom";

const ContactList = () => {
  // DATA GIẢ LẬP
  const contacts = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "a@gmail.com",
      status: "Chưa phản hồi",
      createdAt: "2025-03-20",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "b@gmail.com",
      status: "Đã phản hồi",
      createdAt: "2025-03-21",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Liên hệ khách hàng</h1>

      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-3 py-2">Tên</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Ngày gửi</th>
            <th className="border px-3 py-2">Trạng thái</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{c.name}</td>
              <td className="border px-3 py-2">{c.email}</td>
              <td className="border px-3 py-2">{c.createdAt}</td>
              <td className="border px-3 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    c.status === "Đã phản hồi"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="border px-3 py-2">
                {/* LINK SANG DETAIL */}
                <Link
                  to={`/admin/contacts/${c.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Xem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
