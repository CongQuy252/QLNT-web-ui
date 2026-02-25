import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { useState } from 'react';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/utils';

export interface PaymentSummaryProps {
  stats: {
    total: number;
    paid: number;
    pending: number;
  };
}

const PaymentSummary = ({ stats }: PaymentSummaryProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-white py-4 mt-4 mb-1">
      <div
        className="flex items-center justify-between px-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <p className="text-slate-900 font-semibold text-lg">Tổng quan thanh toán</p>
          <p className="text-slate-500 text-sm">{formatCurrency(stats.total)}</p>
        </div>

        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500" />
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Tổng tiền</p>
              <p className="text-base font-bold text-slate-900 mt-1">
                {formatCurrency(stats.total)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Đã nhận</p>
              <p className="text-base font-bold text-green-600 mt-1">
                {formatCurrency(stats.paid)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Chờ thanh toán</p>
              <p className="text-base font-bold text-orange-600 mt-1">
                {formatCurrency(stats.pending)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PaymentSummary;
