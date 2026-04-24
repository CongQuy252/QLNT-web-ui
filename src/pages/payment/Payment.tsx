/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from '@/lib/reactQuery';
import { CreditCard } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { deleteInvoice, getInvoices } from '@/api/invoice';
import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocalStorageKey, Path, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/useToast';
import PaymentCard from '@/pages/payment/components/PaymentCard';
import { maxItemPerPage } from '@/pages/payment/paymentConstants';

export default function Payment() {
  const navigator = useNavigate();
  const isMobile = useMobile();
  const { show, hide } = useLoading();
  const { success } = useToast();
  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId, !!userId);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Direct API call instead of hook
  const [invoices, setInvoices] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [_, setInvoicesError] = useState<string | null>(null);

  // Fetch invoices data directly
  const fetchInvoices = useCallback(async () => {
    try {
      setInvoicesLoading(true);
      setInvoicesError(null);

      const params = {
        page: currentPage,
        limit: maxItemPerPage,
        status: filterStatus === 'all' ? undefined : filterStatus.toLowerCase(),
      };

      const response = await getInvoices(params);

      // Handle backend response structure
      if (response && response.invoices) {
        setInvoices(response.invoices);
        setPagination(
          response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: response.invoices.length,
            itemsPerPage: maxItemPerPage,
            hasNextPage: false,
            hasPrevPage: false,
          },
        );
      } else {
        setInvoices([]);
        setPagination(null);
      }
    } catch (error) {
      setInvoicesError('Failed to fetch invoices');
      setInvoices([]);
      setPagination(null);
    } finally {
      setInvoicesLoading(false);
    }
  }, [currentPage, filterStatus]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  // Initial fetch and when filters change
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDeleteInvoice = useCallback(
    async (invoiceId: string) => {
      try {
        await deleteInvoice(invoiceId);
        success('Xóa hóa đơn thành công');
        fetchInvoices(); // Refresh data
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchInvoices],
  );

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    navigator(Path.login, { replace: true });
  }, [navigator]);

  useEffect(() => {
    if (isLoading || invoicesLoading) {
      show();
    } else {
      hide();
    }
  }, [hide, isLoading, invoicesLoading, show]);

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      handleLogout();
    }
  }, [isLoading, isError, user, handleLogout]);

  if (!user) {
    return null;
  }

  // Remove client-side filtering since API handles it
  const paginatedInvoices = invoices;

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          <Button
            onClick={() => navigator(`/${Path.createpayment}`)}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
          >
            <FaFileInvoiceDollar className="w-4 h-4" />
          </Button>
        )}
      </div>

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
          {(['all', 'paid', 'unpaid', 'overdue'] as const).map((status) => (
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
              {status === 'unpaid' && 'Chưa thanh toán'}
              {status === 'overdue' && 'Quá hạn'}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {paginatedInvoices.length > 0 ? (
          paginatedInvoices.map((invoice: any) => (
            <PaymentCard key={invoice._id} payment={invoice} onDelete={handleDeleteInvoice} />
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            {invoicesLoading
              ? 'Đang tải...'
              : `Không tìm thấy hóa đơn nào cho trạng thái: ${
                  filterStatus === 'all'
                    ? 'Tất cả'
                    : filterStatus === 'paid'
                      ? 'Đã thanh toán'
                      : filterStatus === 'unpaid'
                        ? 'Chưa thanh toán'
                        : filterStatus === 'overdue'
                          ? 'Quá hạn'
                          : filterStatus
                }`}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && invoices.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-slate-600">
            {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} /{' '}
            {pagination.totalItems}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || !pagination.hasPrevPage}
            >
              Trước
            </Button>

            <span className="text-sm text-slate-600">
              {currentPage} / {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages || !pagination.hasNextPage}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {invoices.length === 0 && !invoicesLoading && (
        <div className="py-12 text-center">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy khoản thanh toán nào phù hợp</p>
        </div>
      )}
      {/* </Card> */}
    </div>
  );
}
