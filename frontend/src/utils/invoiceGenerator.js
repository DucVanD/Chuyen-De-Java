/**
 * Invoice/Receipt Generator Utility
 * Generates proper sales receipts with correct business logic
 */

export const generateSalesReceipt = (order, currentUser) => {
  // Track print count
  const printKey = `order_${order.id}_print_count`;
  const printCount = parseInt(localStorage.getItem(printKey) || '0');
  const isReprint = printCount > 0;
  localStorage.setItem(printKey, (printCount + 1).toString());

  // Get creator info from order (người tạo đơn)
  const creatorName = order.createdByName || 'Khách hàng (Hệ thống)';
  const creatorEmail = order.createdByEmail ? ` (${order.createdByEmail})` : '';

  // Get processing staff info (Người chốt đơn/xử lý cuối)
  const processorName = order.updatedByName || 'Chưa có thông tin';
  const processorEmail = order.updatedByEmail ? ` (${order.updatedByEmail})` : '';

  // Get current user info (người in phiếu)
  const printerName = currentUser?.name || currentUser?.username || 'N/A';
  const printerId = currentUser?.id || 'AUTO';

  // Determine receipt type based on payment status
  const isPaid = order.paymentStatus === 'PAID';
  const isCOD = order.paymentMethod === 'COD';
  const isOnlinePayment = order.paymentMethod === 'VNPAY' || order.paymentMethod === 'BANK';

  // Receipt title logic
  let receiptTitle = '';
  let receiptSubtitle = '';

  if (isPaid) {
    receiptTitle = 'PHIẾU BÁN HÀNG';
    receiptSubtitle = '(Không phải hóa đơn GTGT)';
  } else if (isCOD) {
    receiptTitle = 'PHIẾU XÁC NHẬN ĐƠN HÀNG ONLINE';
    receiptSubtitle = '(Thanh toán khi nhận hàng)';
  } else {
    receiptTitle = 'PHIẾU XÁC NHẬN ĐƠN HÀNG';
    receiptSubtitle = '(Chờ thanh toán)';
  }

  // Validate totals before printing
  const calculatedSubtotal = order.orderDetails.reduce((sum, detail) => sum + detail.amount, 0);
  const expectedTotal = calculatedSubtotal - (order.discountAmount || 0) + (order.shippingFee || 0);

  if (Math.abs(expectedTotal - order.totalAmount) > 0.01) {
    throw new Error('Lỗi tính toán tổng tiền! Không thể in phiếu.');
  }

  // Current timestamp for print time
  const printTime = new Date().toLocaleString('vi-VN');
  const orderCreatedTime = new Date(order.createdAt).toLocaleString('vi-VN');

  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${receiptTitle} #${order.orderCode}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: #f5f5f5;
        }
        .receipt-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .print-status {
          text-align: right;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 10px;
        }
        .reprint-warning {
          color: #dc2626;
          font-weight: 600;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #4F46E5;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #4F46E5;
          font-size: 26px;
          margin-bottom: 5px;
        }
        .header .subtitle {
          color: #666;
          font-size: 13px;
          font-style: italic;
        }
        .store-info {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        .store-info h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .store-info p {
          color: #6b7280;
          font-size: 12px;
          line-height: 1.6;
        }
        .transaction-info {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px 15px;
          margin-bottom: 20px;
        }
        .transaction-info p {
          font-size: 12px;
          color: #92400e;
          margin: 4px 0;
        }
        .transaction-info strong {
          color: #78350f;
        }
        .info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-box {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
        }
        .info-box h3 {
          color: #374151;
          font-size: 13px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        .info-box p {
          color: #6b7280;
          font-size: 12px;
          line-height: 1.6;
          margin: 5px 0;
        }
        .info-box strong {
          color: #111827;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        thead {
          background: #4F46E5;
          color: white;
        }
        th {
          padding: 10px 8px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 12px;
        }
        tbody tr:hover {
          background: #f9fafb;
        }
        .text-right {
          text-align: right;
        }
        .totals {
          margin-top: 20px;
          border-top: 2px solid #e5e7eb;
          padding-top: 15px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13px;
        }
        .total-row.grand-total {
          font-size: 18px;
          font-weight: bold;
          color: #4F46E5;
          border-top: 2px solid #4F46E5;
          padding-top: 12px;
          margin-top: 8px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #dbeafe; color: #1e40af; }
        .status-shipping { background: #ccfbf1; color: #115e59; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px dashed #d1d5db;
        }
        .footer-notice {
          background: #fef2f2;
          border: 1px solid #fecaca;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
        }
        .footer-notice p {
          color: #991b1b;
          font-size: 11px;
          line-height: 1.5;
          margin: 3px 0;
        }
        .footer-contact {
          text-align: center;
          color: #9ca3af;
          font-size: 11px;
          line-height: 1.6;
        }
        
        @media print {
          body { background: white; padding: 0; }
          .receipt-container { box-shadow: none; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="print-status">
          ${isReprint
      ? `<span class="reprint-warning">⚠️ BẢN IN LẠI LẦN ${printCount + 1}</span>`
      : '<span>✓ BẢN GỐC</span>'}
        </div>

        <div class="header">
          <h1>${receiptTitle}</h1>
          <p class="subtitle">${receiptSubtitle}</p>
          <p style="margin-top: 8px; font-size: 13px;">
            Mã đơn: <strong>${order.orderCode}</strong>
          </p>
        </div>

        <div class="store-info">
          <h2>🏪 CỬA HÀNG SIÊU THỊ MINI</h2>
          <p><strong>Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
          <p><strong>Hotline:</strong> 1900-xxxx | <strong>Email:</strong> support@example.com</p>
        </div>

        <div class="transaction-info">
          <p><strong>Người tạo đơn:</strong> ${creatorName}${creatorEmail}</p>
          <p><strong>Nhân viên chốt:</strong> ${processorName}${processorEmail}</p>
          <p><strong>Người in phiếu:</strong> ${printerName} (${printerId === 'AUTO' ? 'Hệ thống tự động' : 'Mã NV: ' + printerId})</p>
          <p><strong>Thời điểm in phiếu:</strong> ${printTime}</p>
          <p><strong>Ngày đặt hàng:</strong> ${orderCreatedTime}</p>
        </div>

        <div class="info-section">
          <div class="info-box">
            <h3>Thông tin người nhận</h3>
            <p><strong>Họ tên:</strong> ${order.receiverName}</p>
            <p><strong>Số điện thoại:</strong> ${order.receiverPhone}</p>
            <p><strong>Email:</strong> ${order.receiverEmail || 'N/A'}</p>
            <p><strong>Địa chỉ:</strong> ${order.receiverAddress}, ${order.ward}, ${order.district}</p>
          </div>
          <div class="info-box">
            <h3>Thông tin giao dịch</h3>
            <p><strong>Trạng thái đơn:</strong> 
              <span class="status-badge status-${order.status.toLowerCase()}">
                ${order.status === 'PENDING' ? 'Chờ xử lý' :
      order.status === 'CONFIRMED' ? 'Đã xác nhận' :
        order.status === 'SHIPPING' ? 'Đang giao' :
          order.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
              </span>
            </p>
            <p><strong>Hình thức TT:</strong> ${isCOD ? 'COD (Tiền mặt khi nhận)' :
      order.paymentMethod === 'VNPAY' ? 'VNPay' : 'Chuyển khoản'
    }</p>
            <p><strong>Trạng thái TT:</strong> ${order.paymentStatus === 'PAID' ? '✅ Đã thanh toán' :
      order.paymentStatus === 'UNPAID' ? '⏳ Chưa thanh toán' :
        order.paymentStatus === 'REFUNDED' ? '💰 Đã hoàn tiền' : '❌ Thất bại'
    }</p>
            ${order.note ? `<p><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px;">STT</th>
              <th>Sản phẩm</th>
              <th class="text-right" style="width: 100px;">Đơn giá</th>
              <th class="text-right" style="width: 120px;">Số lượng</th>
              <th class="text-right" style="width: 100px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderDetails.map((detail, index) => {
      // Validate line total
      const lineTotal = detail.priceBuy * detail.quantity;
      const displayAmount = detail.amount;

      const unitInfo = detail.product?.saleType === 'WEIGHT'
        ? (() => {
          const totalGrams = detail.quantity * (detail.product?.baseWeight || 0);
          const formattedWeight = totalGrams >= 1000
            ? (totalGrams / 1000).toFixed(1).replace(/\.0$/, '') + ' kg'
            : totalGrams + ' g';
          return `${detail.quantity} ${detail.product?.unitLabel || 'phần'}<br><small style="color: #6b7280;">(${formattedWeight} - Cân tại quầy)</small>`;
        })()
        : `${detail.quantity} ${detail.product?.unitLabel || 'đơn vị'}`;

      return `
              <tr>
                <td>${index + 1}</td>
                <td>${detail.product?.name || 'N/A'}</td>
                <td class="text-right">${detail.priceBuy.toLocaleString('vi-VN')} đ</td>
                <td class="text-right">${unitInfo}</td>
                <td class="text-right">${displayAmount.toLocaleString('vi-VN')} đ</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Tạm tính:</span>
            <span>${order.subtotal.toLocaleString('vi-VN')} đ</span>
          </div>
          ${order.discountAmount > 0 ? `
            <div class="total-row" style="color: #059669;">
              <span>Giảm giá ${order.voucherCode ? '(' + order.voucherCode + ')' : ''}:</span>
              <span>-${order.discountAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          ` : ''}
          <div class="total-row">
            <span>Phí vận chuyển:</span>
            <span>${(order.shippingFee || 0).toLocaleString('vi-VN')} đ</span>
          </div>
          <div class="total-row grand-total">
            <span>TỔNG ${isPaid ? 'ĐÃ THANH TOÁN' : 'CẦN THANH TOÁN'}:</span>
            <span>${order.totalAmount.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        <div class="footer">
          <div class="footer-notice">
            <p><strong>⚠️ LƯU Ý QUAN TRỌNG:</strong></p>
            ${isPaid
      ? '<p>• Vui lòng kiểm tra hàng hóa và số tiền trước khi rời quầy</p>'
      : '<p>• Vui lòng kiểm tra thông tin đơn hàng khi nhận hàng</p>'
    }
            <p>• Phiếu này ${isPaid ? 'xác nhận giao dịch đã hoàn tất' : 'chỉ là xác nhận đơn đặt hàng'}</p>
            <p>• ${isPaid ? 'Không phải hóa đơn GTGT' : 'Chưa phải chứng từ thanh toán'}</p>
            <p>• Khối lượng sản phẩm cân (nếu có) được ghi nhận tại thời điểm đặt hàng</p>
            <p>• Mọi khiếu nại vui lòng liên hệ trong vòng 24h kể từ ${isPaid ? 'thời điểm mua' : 'khi nhận hàng'}</p>
          </div>
          <div class="footer-contact">
            <p><strong>Cảm ơn quý khách!</strong></p>
            <p>Hotline: 1900-xxxx | Email: support@example.com</p>
            <p style="margin-top: 8px; font-size: 10px; color: #d1d5db;">
              In lúc: ${printTime} | Mã phiếu: ${order.orderCode}
            </p>
          </div>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="background: #4F46E5; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 10px;">
            🖨️ In phiếu
          </button>
          <button onclick="window.close()" style="background: #6b7280; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
            ✖️ Đóng
          </button>
        </div>
      </div>
    </body>
    </html>
  `;

  return invoiceHTML;
};
