import { queryClient } from '@/lib/reactQuery';
import { CreditCard } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { useGetBuildingQueries } from '@/api/building';
import { useDeleteInvoice, useGetInvoiceById, useGetInvoices } from '@/api/invoice';
import { useExportInvoices } from '@/api/payment';
import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LocalStorageKey, Path, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import { maxItemPerPage } from '@/pages/payment/paymentConstants';
import type { Invoice, Pagination } from '@/types/invoice';
import { formatCurrency } from '@/utils/utils';

export default function Payment() {
  const navigator = useNavigate();
  const { show, hide } = useLoading();
  const { success, error } = useToast();
  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;
  const { mutateAsync: exportInvoices } = useExportInvoices();
  const { data: buildings } = useGetBuildingQueries();

  const { data: user, isLoading: isLoadingUserQuery, isError } = useUserQuery(userId, !!userId);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const { data: searchedInvoice, isLoading: isSearching } = useGetInvoiceById(
    debouncedSearch,
    !!debouncedSearch,
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const defaultPaginate: Pagination = useMemo(
    () => ({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: maxItemPerPage,
      hasNextPage: false,
      hasPrevPage: false,
    }),
    [],
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<Pagination>(defaultPaginate);

  const { mutateAsync: deleteInvoiceMutate } = useDeleteInvoice();

  const {
    data,
    error: invoiceError,
    isLoading,
  } = useGetInvoices({
    page: currentPage,
    limit: maxItemPerPage,
    status: filterStatus === 'all' ? undefined : filterStatus.toLowerCase(),
    buildingId: selectedBuilding === 'all' ? undefined : selectedBuilding,
  });

  const displayInvoices = useMemo(() => {
    if (!debouncedSearch) {
      return invoices;
    }

    return searchedInvoice ? [searchedInvoice] : [];
  }, [debouncedSearch, invoices, searchedInvoice]);

  useEffect(() => {
    if (data && data.invoices) {
      setInvoices(data.invoices);
      setPagination(data.pagination ?? defaultPaginate);
    } else {
      setInvoices([]);
      setPagination(defaultPaginate);
    }
  }, [data, defaultPaginate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  useEffect(() => {
    if (invoiceError) {
      error(invoiceError?.message);
      return;
    }
  }, [error, invoiceError]);

  const handleDeleteInvoice = useCallback(
    async (invoiceId: string) => {
      try {
        await deleteInvoiceMutate(invoiceId).then(() => {
          success('Xóa hóa đơn thành công');
        });
      } catch (err) {
        console.error('Error deleting invoice:', err);
        error('Xóa thất bại');
      }
    },
    [deleteInvoiceMutate, success, error],
  );

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    navigator(Path.login, { replace: true });
  }, [navigator]);

  useEffect(() => {
    if (isLoadingUserQuery || isLoading || isSearching) {
      show();
    } else {
      hide();
    }
  }, [hide, isLoading, isLoadingUserQuery, isSearching, show]);

  useEffect(() => {
    if (!isLoadingUserQuery && (isError || !user)) {
      handleLogout();
    }
  }, [isLoadingUserQuery, isError, user, handleLogout]);

  if (!user) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectRow = (invoiceId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(invoiceId)) {
        newSet.delete(invoiceId);
      } else {
        newSet.add(invoiceId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === displayInvoices.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(displayInvoices.map((invoice: Invoice) => invoice._id)));
    }
  };

  const handleRowClick = (invoiceId: string) => {
    navigator(`/payments/${invoiceId}`);
  };

  const handleExportPdf = async () => {
    if (selectedRows.size === 0) {
      error('Vui lòng chọn ít nhất một hóa đơn để xuất PDF');
      return;
    }

    try {
      show();
      const blobData = await exportInvoices(Array.from(selectedRows));
      const blob = new Blob([blobData], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payments_export_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      success('Xuất PDF thành công!');
    } catch {
      error('Lỗi khi xuất PDF');
    } finally {
      hide();
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
      <div className="flex flex-col gap-4 mt-3 w-full mb-3">
        <div className="relative w-full">
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
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-6 border-transparent border-t-gray-900"></div>
          </div>
        </div>

        <Select value={selectedBuilding} onValueChange={(value) => setSelectedBuilding(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tòa nhà" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Tất cả tòa nhà</SelectItem>

            {buildings?.data?.map((building) => (
              <SelectItem key={building._id} value={building._id}>
                {building.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex gap-2 overflow-x-auto">
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
          <Button
            onClick={handleExportPdf}
            disabled={selectedRows.size === 0}
            className="whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Xuất PDF ({selectedRows.size})
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {displayInvoices && displayInvoices.length > 0 ? (
          <Table className="border border-slate-200">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 border-r border-slate-200">
                  <Checkbox
                    checked={
                      selectedRows.size === displayInvoices.length && displayInvoices.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="border-r border-slate-200">Phòng - Tòa nhà</TableHead>
                <TableHead className="border-r border-slate-200">Người thuê</TableHead>
                <TableHead className="border-r border-slate-200">Kỳ thanh toán</TableHead>
                <TableHead className="border-r border-slate-200">Số tiền</TableHead>
                <TableHead className="border-r border-slate-200">Trạng thái</TableHead>
                <TableHead className="border-r border-slate-200">Hạn thanh toán</TableHead>
                {user.role === UserRole.admin && <TableHead>Thao tác</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayInvoices.map((invoice: Invoice) => (
                <TableRow
                  key={invoice._id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => handleRowClick(invoice._id)}
                >
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    className="border-r border-slate-200"
                  >
                    <Checkbox
                      checked={selectedRows.has(invoice._id)}
                      onCheckedChange={() => handleSelectRow(invoice._id)}
                    />
                  </TableCell>
                  <TableCell className="border-r border-slate-200">
                    <div>
                      <p className="font-medium">{invoice.roomId?.number}</p>
                      <p className="text-sm text-slate-500">
                        {invoice.roomId?.buildingId?.name || '-'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="border-r border-slate-200">
                    <div>
                      <p className="font-medium">
                        {invoice.tenantInfo?.name ||
                          invoice.roomId?.members?.find((m) => m.isRepresentative)?.name ||
                          invoice.roomId?.members?.[0]?.name ||
                          '-'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {invoice.tenantInfo?.phone ||
                          invoice.roomId?.members?.find((m) => m.isRepresentative)?.phone ||
                          invoice.roomId?.members?.[0]?.phone ||
                          '-'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="border-r border-slate-200">
                    Tháng {invoice.month}/{invoice.year}
                  </TableCell>
                  <TableCell className="font-semibold border-r border-slate-200">
                    {formatCurrency(invoice.totalAmount)}
                  </TableCell>
                  <TableCell className="border-r border-slate-200">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'unpaid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {invoice.status === 'paid'
                        ? 'Đã thanh toán'
                        : invoice.status === 'unpaid'
                          ? 'Chưa thanh toán'
                          : invoice.status === 'overdue'
                            ? 'Quá hạn'
                            : invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="border-r border-slate-200">
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('vi-VN') : '-'}
                  </TableCell>
                  {user.role === UserRole.admin && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInvoice(invoice._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-slate-500">
            {isLoading
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
      {pagination && displayInvoices.length > 0 && (
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

      {displayInvoices.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy khoản thanh toán nào phù hợp</p>
        </div>
      )}
    </div>
  );
}
