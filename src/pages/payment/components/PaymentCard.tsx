import { ChevronDown, ChevronUp, Trash } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/room';
import { useGetTenantByIdQuery } from '@/api/tenant';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserRole } from '@/constants/appConstants';
import { getStatusBadge, getStatusLabel } from '@/pages/payment/paymentConstants';
import type { Invoice } from '@/types/invoice';
import type { Payment } from '@/types/payment';
import { formatCurrency, formatDate } from '@/utils/utils';

interface PaymentCardProps {
  payment: Payment | Invoice;
  onDelete?: (id: string) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const user = { role: 1 };

  // Handle both Payment and Invoice structures
  const isInvoice = 'tenantId' in payment && typeof payment.tenantId === 'object';

  // Get tenant and room IDs for queries
  const tenantIdForQuery = isInvoice
    ? (payment as Invoice).tenantId._id
    : (payment as Payment).tenantId;

  const roomIdForQuery = isInvoice ? (payment as Invoice).roomId._id : (payment as Payment).roomId;

  // Always call hooks at the top level
  const { data: tenant } = useGetTenantByIdQuery(tenantIdForQuery, true);
  const { data: roomData } = useGetRoomByIdQuery(roomIdForQuery);

  // Get tenant info
  let tenantName = '-';
  if (isInvoice) {
    const invoice = payment as Invoice;
    tenantName = invoice.tenantId.fullName;
  } else {
    tenantName = tenant?.userId.name || '-';
  }

  // Get room info
  let roomNumber = '-';
  let buildingName = '-';
  const room = roomData?.room;
  if (room) {
    roomNumber = room.number;
    buildingName = typeof room.buildingId === 'object' ? room.buildingId.name : room.buildingId;
  } else if (isInvoice) {
    const invoice = payment as Invoice;
    roomNumber = invoice.roomId.number;
    buildingName = invoice.roomId.buildingId.name;
  }

  // Get amount and month/year
  let amount = 0;
  let monthYear = '';

  if (isInvoice) {
    const invoice = payment as Invoice;
    amount = invoice.totalAmount;
    monthYear = `Tháng ${invoice.month}/${invoice.year}`;
  } else {
    const paymentData = payment as Payment;
    amount = paymentData.amount;
    monthYear = `Tháng ${paymentData.month}`;
  }

  // Get status
  const status = payment.status;

  // Get dates
  const dueDate = isInvoice ? (payment as Invoice).dueDate : (payment as Payment).dueDate;
  const paidDate = isInvoice ? (payment as Invoice).paidDate : (payment as Payment).paidDate;
  const notes = isInvoice ? undefined : (payment as Payment).notes;

  const navigate = useNavigate();
  const handleGoDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/payments/${payment._id}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm gap-3 mb-4">
        {/* HEADER */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50 cursor-pointer"
        >
          <div onClick={handleGoDetail} className="cursor-pointer flex-1">
            {user.role === UserRole.admin && <p className="text-sm text-slate-500">{tenantName}</p>}

            <p className="font-semibold text-slate-900">
              {roomNumber && buildingName ? `${roomNumber} (Tòa ${buildingName})` : '-'}
            </p>

            <p className="text-sm text-slate-500">
              {monthYear} • {formatCurrency(amount)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium text-nowrap ${getStatusBadge(
                status,
              )}`}
            >
              {getStatusLabel(status)}
            </span>

            {user.role === UserRole.admin && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent expanding
                  setIsConfirmOpen(true);
                }}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                title="Xóa thanh toán"
              >
                <Trash size={16} />
              </button>
            )}

            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {/* BODY */}
        {expanded && (
          <div className="border-t border-slate-100 px-4 py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Hạn thanh toán</span>
              <span className="font-medium">{dueDate ? formatDate(dueDate) : '-'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Số tiền</span>
              <span className="font-semibold">{formatCurrency(amount)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Ghi chú</span>
              <span className="text-right">
                {paidDate && status === 'paid'
                  ? `Thanh toán ngày ${formatDate(paidDate)}`
                  : notes || '-'}
              </span>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa thanh toán này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.(payment._id);
                setIsConfirmOpen(false);
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentCard;
