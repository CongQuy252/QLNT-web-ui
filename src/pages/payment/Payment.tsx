import { queryClient } from '@/lib/reactQuery';
import { CreditCard } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { useCreatePaymentMutation, useDeletePaymentMutation, useGetPaymentsQuery } from '@/api/payment';
import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LocalStorageKey, Path, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import { useMobile } from '@/hooks/useMobile';
import PaymentCard from '@/pages/payment/components/PaymentCard';
import PaymentDialogWrapper from '@/pages/payment/components/PaymentDialogWrapper';
import PaymentSummary from '@/pages/payment/components/PaymentSummary';
import { maxItemPerPage } from '@/pages/payment/paymentConstants';

export default function Payment() {
  const navigator = useNavigate();
  const isMobile = useMobile();
  const { show, hide } = useLoading();
  const { success } = useToast();
  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId, !!userId);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  const { data: paymentsData, isLoading: paymentsLoading } = useGetPaymentsQuery(
    currentPage,
    maxItemPerPage,
    searchTerm,
    filterStatus === 'all' ? '' : filterStatus,
    !!userId && !isLoading && !isError && !!user,
  );

  const createPaymentMutation = useCreatePaymentMutation();

  const deletePaymentMutation = useDeletePaymentMutation();

  const payments = paymentsData?.payments || [];
  const pagination = paymentsData?.pagination;

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    navigator(Path.login, { replace: true });
  }, [navigator]);

  useEffect(() => {
    if (isLoading || paymentsLoading) {
      show();
    } else {
      hide();
    }
  }, [hide, isLoading, paymentsLoading, show]);

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      handleLogout();
    }
  }, [isLoading, isError, user, handleLogout]);

  if (!user) {
    return null;
  }

  // Remove client-side filtering since API handles it
  const paginatedPayments = payments;

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate statistics
  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    paid: payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pending: payments
      .filter((p) => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">QL thanh toán</h1>
          <p className="text-slate-600 mt-2">
            {user.role === UserRole.admin
              ? 'Theo dõi tất cả các khoản thanh toán'
              : 'Thông tin thanh toán của bạn'}
          </p>
        </div>
        {user.role === UserRole.admin && (
          <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                <FaFileInvoiceDollar className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-w-none rounded-none flex flex-col">
              <DialogHeader className="border-b px-4 py-3">
                <DialogTitle>Lập hóa đơn mới</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-4 p-0.5">
                <PaymentDialogWrapper
                  onSubmit={async (invoice) => {
                    try {
                      await createPaymentMutation.mutateAsync(invoice);
                      setIsInvoiceDialogOpen(false);
                      // Optionally show success message or refresh
                    } catch (error) {
                      console.error('Error creating payment:', error);
                    }
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <PaymentSummary stats={stats} />

      {/* Filter */}
      <div className={`${isMobile ? 'flex flex-col md:flex-row' : 'block'} gap-4 mt-3 w-full`}>
        <div className={`${isMobile ? 'relative flex-1' : 'w-full block mb-3'}`}>
          <Input
            placeholder="Tìm kiếm ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="peer"
          />
          <div
            className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2
                  opacity-0 peer-focus:opacity-100
                  transition-all duration-200
                  bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap"
          >
            Nhập mã hoá đơn để tìm kiếm
            <div
              className="absolute left-1/2 top-full -translate-x-1/2
                    border-6 border-transparent border-t-gray-900"
            ></div>
          </div>
        </div>
        <div className="flex gap-2 mb-5 w-full overflow-x-auto">
          {(['all', 'paid', 'pending', 'overdue'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              className={
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 border-slate-300'
              }
            >
              {status === 'all' && 'Tất cả'}
              {status === 'paid' && 'Đã thanh toán'}
              {status === 'pending' && 'Chờ thanh toán'}
              {status === 'overdue' && 'Quá hạn'}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {paginatedPayments.map((payment) => (
          <PaymentCard
            key={payment._id}
            payment={payment}
            onDelete={(id) => deletePaymentMutation.mutate(id, { onSuccess: () => success('Xóa thanh toán thành công') })}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && payments.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-slate-600">
            {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || !pagination.hasPrev}
            >
              Trước
            </Button>

            <span className="text-sm text-slate-600">
              {pagination.page} / {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages || !pagination.hasNext}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {payments.length === 0 && !paymentsLoading && (
        <div className="py-12 text-center">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy khoản thanh toán nào phù hợp</p>
        </div>
      )}
      {/* </Card> */}
    </div>
  );
}
