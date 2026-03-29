import { Download } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { bulkCreateInvoices, getBuildings, getInvoicePreview } from '@/api/invoice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function InvoicePage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Direct API calls instead of hook
  const [invoiceData, setInvoiceData] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    buildingId: 'all',
  });

  // Debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Fetch buildings
  const fetchBuildings = useCallback(async () => {
    try {
      const data = await getBuildings();
      setBuildings(data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    }
  }, []);

  // Fetch invoice preview
  const fetchInvoicePreview = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getInvoicePreview(filters.month, filters.year);
      setInvoiceData(data);
    } catch (error) {
      console.error('Error fetching invoice preview:', error);
      setInvoiceData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.month, filters.year]);

  // Debounced filter update
  const debouncedUpdateFilters = useCallback(debounce(setFilters, 500), [debounce]);

  // Initial fetch
  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  useEffect(() => {
    fetchInvoicePreview();
  }, [fetchInvoicePreview]);

  // Update filters with debounce
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      debouncedUpdateFilters((prev: typeof filters) => ({ ...prev, ...newFilters }));
    },
    [debouncedUpdateFilters],
  );

  // Immediate filter update
  const updateFiltersImmediate = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev: typeof filters) => ({ ...prev, ...newFilters }));
  }, []);

  // Refetch function
  const refetchInvoice = useCallback(() => {
    fetchInvoicePreview();
  }, [fetchInvoicePreview]);

  const handleSelectRow = (roomId: string) => {
    setSelectedRows((prev) =>
      prev.includes(roomId) ? prev.filter((item) => item !== roomId) : [...prev, roomId],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(Array.isArray(invoiceData) ? invoiceData.map((item) => item.roomId) : []);
    } else {
      setSelectedRows([]);
    }
  };

  const handleExport = async () => {
    const data = Array.isArray(invoiceData) ? invoiceData : [];
    const selected = data.filter((item) => selectedRows.includes(item.roomId));

    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một phòng');
      return;
    }

    // Filter only eligible rooms (canCreateInvoice = true)
    const eligibleRooms = selected.filter((item) => item.canCreateInvoice);

    if (eligibleRooms.length === 0) {
      alert('Không có phòng nào phù hợp để tạo hóa đơn. Vui lòng kiểm tra lại các phòng đã chọn.');
      return;
    }

    if (eligibleRooms.length < selected.length) {
      const ineligibleCount = selected.length - eligibleRooms.length;
      const confirmCreate = confirm(
        `Chỉ có ${eligibleRooms.length} phòng phù hợp để tạo hóa đơn (${ineligibleCount} phòng không phù hợp sẽ bị bỏ qua). Bạn có muốn tiếp tục?`,
      );
      if (!confirmCreate) return;
    }

    try {
      setLoading(true);
      const roomIds = eligibleRooms.map((item) => item.roomId);
      const result = await bulkCreateInvoices(roomIds, filters.month, filters.year);

      console.log('Bulk create result:', result);

      // Show success message
      if (result.created > 0) {
        alert(
          `Đã tạo thành công ${result.created} hóa đơn${result.failed.length > 0 ? `, ${result.failed.length} hóa đơn thất bại` : ''}`,
        );

        // Clear selection and refresh data
        setSelectedRows([]);

        // Refresh data using React Query
        refetchInvoice();
      } else {
        alert('Không tạo được hóa đơn nào. Vui lòng kiểm tra lại các phòng đã chọn.');
      }

      // Show failed rooms if any
      if (result.failed && result.failed.length > 0) {
        console.log('Failed rooms:', result.failed);
      }
    } catch (error) {
      console.error('Error creating invoices:', error);
      alert('Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const data = Array.isArray(invoiceData) ? invoiceData : [];

  // Calculate eligible rooms count for button
  const eligibleSelectedCount = data
    .filter((item) => selectedRows.includes(item.roomId))
    .filter((item) => item.canCreateInvoice).length;

  const filteredData =
    filters.buildingId === 'all' || !filters.buildingId
      ? data // Show all data when 'all' is selected or no building selected
      : data.filter((item) => {
          const selectedBuildingName = buildings.find(
            (b: any) => b._id === filters.buildingId,
          )?.name;
          return item.buildingName === selectedBuildingName;
        });

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <h1 className="text-balance text-3xl font-bold tracking-tight">Tạo hóa đơn</h1>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-32">
              <Select
                value={filters.month.toString()}
                onValueChange={(value) => updateFilters({ month: parseInt(value) })}
              >
                <SelectTrigger className="w-full border-2 border-black">
                  <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      Tháng {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-32">
              <Select
                value={filters.year.toString()}
                onValueChange={(value) => updateFilters({ year: parseInt(value) })}
              >
                <SelectTrigger className="w-full border-2 border-black">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64">
              <Select
                value={filters.buildingId}
                onValueChange={(value) => updateFilters({ buildingId: value })}
              >
                <SelectTrigger className="w-full border-2 border-black">
                  <SelectValue placeholder="Chọn tòa nhà" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tòa nhà</SelectItem>
                  {buildings.map((building: any) => (
                    <SelectItem key={building._id} value={building._id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleExport}
            className="w-full bg-black text-white hover:bg-gray-900 sm:w-auto"
            size="lg"
            disabled={loading || eligibleSelectedCount === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {loading
              ? 'Đang tạo...'
              : `Tạo hóa đơn ${eligibleSelectedCount > 0 ? `(${eligibleSelectedCount})` : ''}`}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-black">
          <Table>
            <TableHeader className="bg-blue-100">
              <TableRow className="border-b border-black">
                <TableHead className="w-12 border-r border-black text-center">
                  <Checkbox
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Chọn tất cả"
                  />
                </TableHead>
                <TableHead className="w-32 border-r border-black font-bold text-black">
                  Tên toà nhà
                </TableHead>
                <TableHead className="w-24 border-r border-black font-bold text-black">
                  Tên phòng
                </TableHead>
                <TableHead className="w-32 border-r border-black text-right font-bold text-black">
                  Tiền phòng
                </TableHead>
                <TableHead className="w-32 border-r border-black text-right font-bold text-black">
                  Tiền điện
                </TableHead>
                <TableHead className="w-32 border-r border-black text-right font-bold text-black">
                  Tiền nước
                </TableHead>
                <TableHead className="w-32 border-r border-black text-right font-bold text-black">
                  Tiền gửi xe
                </TableHead>
                <TableHead className="w-32 border-r border-black text-right font-bold text-black">
                  Tiền internet
                </TableHead>
                <TableHead className="w-32 border-r border-black text-right font-bold text-black">
                  Phí dịch vụ
                </TableHead>
                <TableHead className="w-32 text-right font-bold text-black">Phí khác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item: any) => (
                  <TableRow key={item.roomId} className="border-b border-black">
                    <TableCell className="w-12 border-r border-black text-center">
                      <Checkbox
                        checked={selectedRows.includes(item.roomId)}
                        onCheckedChange={() => handleSelectRow(item.roomId)}
                        disabled={!item.canCreateInvoice}
                        title={item.error || 'Không thể tạo hóa đơn'}
                        aria-label={`Chọn ${item.roomName}`}
                      />
                    </TableCell>
                    <TableCell className="w-32 border-r border-black">
                      {item.buildingName}
                    </TableCell>
                    <TableCell className="w-24 border-r border-black">{item.roomName}</TableCell>
                    <TableCell className="w-32 border-r border-black text-right">
                      {formatCurrency(item.rentAmount || 0)}
                    </TableCell>
                    <TableCell className="w-32 border-r border-black text-right">
                      {item.canCreateInvoice ? formatCurrency(item.electricityCost || 0) : '-'}
                    </TableCell>
                    <TableCell className="w-32 border-r border-black text-right">
                      {item.canCreateInvoice ? formatCurrency(item.waterCost || 0) : '-'}
                    </TableCell>
                    <TableCell className="w-32 border-r border-black text-right">
                      {formatCurrency(item.parkingFee || 0)}
                    </TableCell>
                    <TableCell className="w-32 border-r border-black text-right">
                      {formatCurrency(item.internetFee || 0)}
                    </TableCell>
                    <TableCell className="w-32 border-r border-black text-right">
                      {formatCurrency(item.serviceFee || 0)}
                    </TableCell>
                    <TableCell className="w-32 text-right">
                      {formatCurrency(item.otherFee || 0)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Info text */}
        <p className="mt-4 text-sm text-gray-600">Đã chọn {selectedRows.length} phòng</p>
      </div>
    </main>
  );
}
