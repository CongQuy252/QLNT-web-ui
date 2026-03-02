/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/room';
import { UserRole } from '@/constants/appConstants';
import { getStatusBadge, getStatusLabel } from '@/pages/payment/paymentConstants';
import type { Payment } from '@/types/payment';
import type { GetUserResponse } from '@/types/user';
import { formatCurrency, formatDate } from '@/utils/utils';

interface PaymentCardProps {
  payment: Payment;
  user: GetUserResponse;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment, user }) => {
  const [expanded, setExpanded] = useState(false);

  const normalizedRoomId =
    typeof payment.roomId === 'string'
      ? payment.roomId
      : (payment.roomId as any)?._id || payment.roomId;

  const { data: roomData } = useGetRoomByIdQuery(normalizedRoomId);
  const room = roomData?.room;

  const navigate = useNavigate();
  const handleGoDetail = () => {
    navigate(`/payments/${payment._id}`); // nhớ check đúng field id
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm gap-3 mb-4">
      {/* HEADER */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50"
      >
        <div onClick={handleGoDetail} className="cursor-pointer flex-1">
          {user.role === UserRole.admin && <p className="text-sm text-slate-500">{user.name}</p>}

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

          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

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
  );
};

export default PaymentCard;
