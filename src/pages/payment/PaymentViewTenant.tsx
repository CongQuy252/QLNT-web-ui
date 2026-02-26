import { AlertCircle, CalendarDays } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';

import { PaymentStatus } from '@/constants/appConstants';

type InvoiceItem = {
  label: string;
  amount: number;
};

type Payment = {
  id: string;
  roomId: string;
  month: string;
  dueDate: string;
  status: PaymentStatus;
  paidDate?: string;
  notes?: string;
  items: InvoiceItem[];
};

export default function PaymentViewTenant() {
  const bankInfo = {
    bank: 'Vietcombank',
    accountNumber: '0123456789',
    accountName: 'NGUYEN VAN A',
  };
  const { paymentId } = useParams<{ paymentId: string }>();

  const payments: Payment[] = [
    {
      id: 'pay-001',
      roomId: 'Room 101',
      month: '2023-10',
      dueDate: '2023-10-05',
      status: PaymentStatus.PAID,
      paidDate: '2023-10-03',
      notes: 'Thanh toán qua chuyển khoản',
      items: [
        { label: 'Tiền phòng', amount: 4500000 },
        { label: 'Điện', amount: 500000 },
        { label: 'Nước', amount: 200000 },
        { label: 'Internet', amount: 100000 },
      ],
    },
    {
      id: 'pay-002',
      roomId: 'Room 101',
      month: '2023-11',
      dueDate: '2023-11-05',
      status: PaymentStatus.PENDING,
      notes: 'Chờ xác nhận',
      items: [
        { label: 'Tiền phòng', amount: 4500000 },
        { label: 'Điện', amount: 350000 },
        { label: 'Nước', amount: 150000 },
      ],
    },
  ];

  const invoice = payments.find((p) => p.id === paymentId);

  if (!invoice) {
    return <div className="text-center py-16 text-slate-500">Không tìm thấy hóa đơn</div>;
  }

  const total = invoice.items.reduce((s, i) => s + i.amount, 0);
  const qrContent = `
BANK: ${bankInfo.bank}
ACC: ${bankInfo.accountNumber}
AMOUNT: ${total}
NOTE: THANH TOAN HOA DON ${invoice.id}
`;
  const statusColor =
    invoice.status === PaymentStatus.PAID
      ? 'text-green-600'
      : invoice.status === PaymentStatus.OVERDUE
        ? 'text-red-600'
        : 'text-yellow-600';

  const statusText =
    invoice.status === PaymentStatus.PAID
      ? 'Đã thanh toán'
      : invoice.status === PaymentStatus.OVERDUE
        ? 'Quá hạn'
        : 'Chờ thanh toán';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Chi tiết hóa đơn</h1>
        <p className="text-slate-600 mt-1">
          Phòng: {invoice.roomId} • Tháng: {invoice.month}
        </p>
      </div>

      {/* STATUS */}
      <div className="border rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">Trạng thái</p>
          <p className={`font-semibold ${statusColor}`}>{statusText}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Hạn thanh toán</p>
          <p className="font-medium">{invoice.dueDate}</p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="border rounded-xl p-4 space-y-3">
        {invoice.items.map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className="text-slate-700">{item.label}</span>
            <span className="font-medium">{item.amount.toLocaleString()} VNĐ</span>
          </div>
        ))}

        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>Tổng cộng</span>
          <span>{total.toLocaleString()} VNĐ</span>
        </div>
      </div>

      {/* NOTE */}
      {invoice.notes && (
        <div className="bg-slate-50 border rounded-xl p-4 text-sm text-slate-600">
          Ghi chú: {invoice.notes}
        </div>
      )}

      {/* ALERT OVERDUE */}
      {invoice.status === PaymentStatus.OVERDUE && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          Hóa đơn đã quá hạn. Vui lòng thanh toán sớm.
        </div>
      )}

      {/* PAID DATE */}
      {invoice.paidDate && (
        <div className="flex items-center gap-2 text-green-600">
          <CalendarDays className="w-5 h-5" />
          Đã thanh toán ngày {invoice.paidDate}
        </div>
      )}

      {/* QR PAYMENT */}
      {invoice.status === PaymentStatus.PENDING && (
        <div className="border rounded-xl p-5 text-center space-y-4">
          <p className="font-semibold text-slate-700">Quét mã để thanh toán</p>

          <div className="flex justify-center">
            <QRCode value={qrContent} size={180} />
          </div>

          <div className="text-sm text-slate-600 space-y-1">
            <p>
              <b>Ngân hàng:</b> {bankInfo.bank}
            </p>
            <p>
              <b>Số tài khoản:</b> {bankInfo.accountNumber}
            </p>
            <p>
              <b>Chủ tài khoản:</b> {bankInfo.accountName}
            </p>
            <p>
              <b>Số tiền:</b> {total.toLocaleString()} VNĐ
            </p>
            <p>
              <b>Nội dung:</b> THANH TOÁN {invoice.id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
