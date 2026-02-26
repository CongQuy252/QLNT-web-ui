import { queryClient } from '@/lib/reactQuery';
import { CreditCard } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

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
import { useMobile } from '@/hooks/useMobile';
import CreateInvoiceDialog from '@/pages/payment/components/CreatePaymentDialog';
import PaymentCard from '@/pages/payment/components/PaymentCard';
import PaymentSummary from '@/pages/payment/components/PaymentSummary';
import {
  getAllTenants,
  getPaymentsByOwner,
  getPaymentsByTenant,
  getRoomById,
  getTenantById,
  maxItemPerPage,
} from '@/pages/payment/paymentConstants';

export default function Payment() {
  const navigator = useNavigate();
  const isMobile = useMobile();
  const { show, hide } = useLoading();
  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId, !!userId);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    navigator(Path.login, { replace: true });
  }, [navigator]);

  useEffect(() => {
    if (isLoading) {
      show();
    } else {
      hide();
    }
  }, [hide, isLoading, show]);

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      handleLogout();
    }
  }, [isLoading, isError, user, handleLogout]);

  if (!user) {
    return null;
  }

  const payments =
    user.role === UserRole.admin ? getPaymentsByOwner() : getPaymentsByTenant(user._id);

  const allTenants = getAllTenants();

  const filteredPayments = payments.filter((payment) => {
    const tenant = getTenantById(payment.tenantId);
    const matchesSearch =
      tenant?.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      payment.month.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / maxItemPerPage);
  const startIndex = (currentPage - 1) * maxItemPerPage;
  const endIndex = startIndex + maxItemPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
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
                {/* <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Chọn người thuê</label>
                  <select
                    value={newInvoice.tenantId}
                    onChange={(e) => handleSelectTenant(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">-- Chọn người thuê --</option>
                    {allTenants.map((tenant) => (
                      <option key={tenant.user._id} value={tenant.user._id}>
                        {tenant.user.name}
                      </option>
                    ))}
                  </select>
                </div>

                {newInvoice.roomId && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600">Phòng:</p>
                    <p className="text-base font-semibold text-slate-900">
                      {getRoomById(newInvoice.roomId)
                        ? `${getRoomById(newInvoice.roomId)?.number} - Tòa ${
                            getRoomById(newInvoice.roomId)?.building
                          }`
                        : '-'}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tháng thanh toán</label>
                    <Input
                      type="month"
                      value={newInvoice.month}
                      onChange={(e) => setNewInvoice({ ...newInvoice, month: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Hạn thanh toán</label>
                    <Input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Số tiền (VNĐ)</label>
                  <Input
                    type="number"
                    min="0"
                    step="100000"
                    value={newInvoice.amount}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Ghi chú</label>
                  <Textarea
                    placeholder="Ghi chú thêm (tùy chọn)"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Button
                    variant="outline"
                    className="flex-1 text-slate-700 border-slate-300 bg-transparent"
                    onClick={() => setIsInvoiceDialogOpen(false)}
                  >
                    Huỷ
                  </Button>
                  <Button
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={handleCreateInvoice}
                  >
                    Tạo hoá đơn
                  </Button>
                </div> */}
                <CreateInvoiceDialog
                  tenants={allTenants}
                  getRoomById={getRoomById}
                  onSubmit={(invoice) => {
                    console.log('Invoice created:', invoice);
                    setIsInvoiceDialogOpen(false);
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
          <PaymentCard key={payment.id} payment={payment} />
        ))}
      </div>

      {/* Pagination */}
      {filteredPayments.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-slate-600">
            {startIndex + 1} - {Math.min(endIndex, filteredPayments.length)} /{' '}
            {filteredPayments.length}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>

            <span className="text-sm text-slate-600">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {filteredPayments.length === 0 && (
        <div className="py-12 text-center">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy khoản thanh toán nào phù hợp</p>
        </div>
      )}
      {/* </Card> */}
    </div>
  );
}
