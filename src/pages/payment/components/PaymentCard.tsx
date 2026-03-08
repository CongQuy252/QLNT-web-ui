/* eslint-disable @typescript-eslint/no-explicit-any */
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
import type { Payment } from '@/types/payment';
import { formatCurrency, formatDate } from '@/utils/utils';

interface PaymentCardProps {
  payment: Payment;
  onDelete?: (id: string) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const user = { role: 1 };

  const { data: tenant } = useGetTenantByIdQuery(payment.tenantId, true);

  // Normalize roomId to handle both string and object cases
  const normalizedRoomId =
    typeof payment.roomId === 'string'
      ? payment.roomId
      : (payment.roomId as any)?._id || payment.roomId;

  const { data: roomData } = useGetRoomByIdQuery(normalizedRoomId);
  const room = roomData?.room;

  const navigate = useNavigate();
  const handleGoDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/payments/${payment._id}`); // nhớ check đúng field id
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
            {user.role === UserRole.admin && (
              <p className="text-sm text-slate-500">{tenant?.userId.name}</p>
            )}

            <p className="font-semibold text-slate-900">
              {room
                ? `${room.number} (Tòa ${(room.buildingId as any)?.name || room.buildingId})`
                : '-'}
            </p>

            <p className="text-sm text-slate-500">
              Tháng {payment.month} • {formatCurrency(payment.amount)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium text-nowrap ${getStatusBadge(
                payment.status,
              )}`}
            >
              {getStatusLabel(payment.status)}
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
              <span className="font-medium">{formatDate(payment.dueDate)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Số tiền</span>
              <span className="font-semibold">{formatCurrency(payment.amount)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Ghi chú</span>
              <span className="text-right">
                {payment.paidDate && payment.status === 'paid'
                  ? `Thanh toán ngày ${formatDate(payment.paidDate)}`
                  : payment.notes || '-'}
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
