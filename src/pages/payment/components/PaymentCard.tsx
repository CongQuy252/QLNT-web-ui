import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { UserRole } from '@/constants/appConstants';
import {
  getRoomById,
  getStatusBadge,
  getStatusLabel,
  getTenantById,
} from '@/pages/payment/paymentConstants';
import type { Payment } from '@/types/payment';
import { formatCurrency } from '@/utils/utils';

interface PaymentCardProps {
  payment: Payment;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
  const [expanded, setExpanded] = useState(false);

  const user = { role: 1 };

  const tenant = getTenantById(payment.tenantId);
  const room = getRoomById(payment.roomId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm gap-3 mb-4">
      {/* HEADER */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50"
      >
        <div>
          {user.role === UserRole.admin && <p className="text-sm text-slate-500">{tenant?.name}</p>}

          <p className="font-semibold text-slate-900">
            {room ? `${room.number} (Tòa ${room.building})` : '-'}
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
            <span className="font-medium">{payment.dueDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Số tiền</span>
            <span className="font-semibold">{formatCurrency(payment.amount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Ghi chú</span>
            <span className="text-right">
              {payment.paidDate && payment.status === 'paid'
                ? `Thanh toán ngày ${payment.paidDate}`
                : payment.notes || '-'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;
