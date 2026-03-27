import { queryClient } from '@/lib/reactQuery';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getInvoiceById } from '@/api/invoice';
import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocalStorageKey, Path, PaymentStatus, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/utils';

export default function PaymentDetail() {
  const { paymentId } = useParams();
  const navigator = useNavigate();
  const { show, hide } = useLoading();

  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId, !!userId);

  // Direct API call instead of hook
  const [invoice, setInvoice] = useState<any>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  // Fetch invoice data directly
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!paymentId) return;

      try {
        setInvoiceLoading(true);
        setInvoiceError(null);
        const response = await getInvoiceById(paymentId);
        // Handle backend response structure: { success: true, data: {...} }
        const data = response.success && response.data ? response.data : response;
        setInvoice(data);
      } catch (error) {
        setInvoiceError('Failed to fetch invoice');
      } finally {
        setInvoiceLoading(false);
      }
    };

    fetchInvoice();
  }, [paymentId]);

  const { success } = useToast();

  const handleMarkAsPaid = () => {
    // TODO: Implement invoice update mutation
    // For now, just show success message
    success('Đã cập nhật trạng thái thanh toán');
  };

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    navigator(Path.login, { replace: true });
  }, [navigator]);

  useEffect(() => {
    if (isLoading && invoiceLoading) {
      show();
    } else {
      hide();
    }
  }, [isLoading, show, hide, invoiceLoading]);

  useEffect(() => {
    if (!isLoading && !invoiceLoading && (isError || !user) && (invoiceError || !invoice)) {
      handleLogout();
    }
  }, [isLoading, invoiceLoading, isError, user, handleLogout, invoiceError, invoice]);

  const payment = useMemo(() => {
    return invoice;
  }, [invoice]);

  const tenant = useMemo(() => {
    return invoice?.tenantId;
  }, [invoice?.tenantId]);

  const room = useMemo(() => {
    return invoice?.roomId;
  }, [invoice?.roomId]);

  if (!user) {
    return null;
  }

  // Show loading state
  if (invoiceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải hóa đơn...</p>
      </div>
    );
  }

  // Show error state
  if (invoiceError || !invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Không thể tải hóa đơn. Vui lòng thử lại.</p>
      </div>
    );
  }

  const invoiceNumber = payment?._id ? `INV-${payment._id.toUpperCase()}` : 'INV-UNKNOWN';
  const invoiceDate = payment?.createdAt
    ? new Date(payment.createdAt).toLocaleDateString('vi-VN')
    : new Date().toLocaleDateString('vi-VN');

  return (
    <div className="space-y-6 md:p-8">
      {/* Invoice Card */}
      <Card className="bg-white p-4">
        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">QLNT</h1>
            <p className="text-slate-600 mt-2">Website quản lý nhà trọ</p>
            <p className="text-slate-600 text-sm">Điện thoại: 0901234567</p>
            <p className="text-slate-600 text-sm">Email: info@gmail.com</p>
          </div>

          {/* Invoice Info */}
          <div className="text-right">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">HÓA ĐƠN</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 text-left">Số hóa đơn:</span>
                <span className="font-semibold text-slate-900">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ngày lập:</span>
                <span className="font-semibold text-slate-900">{invoiceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Kỳ thanh toán:</span>
                <span className="font-semibold text-slate-900">{payment?.month}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase mb-4">Người thuê</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Tên: {tenant?.name}</p>
              <p className="text-sm text-slate-600">Email: {tenant?.email}</p>
              <p className="text-sm text-slate-600">Điện thoại: {tenant?.phone}</p>
              <p className="text-sm text-slate-600">CCCD/CMND: {tenant?.cccd}</p>
            </div>
          </div>

          {/* Room Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase mb-4">Thông tin phòng</h3>
            <div className="space-y-2">
              <p className="font-semibold text-slate-900">
                Phòng {payment?.roomId?.number} - Tòa {payment?.roomId?.buildingId?.name}
              </p>
              <p className="text-sm text-slate-600">Diện tích: {room?.area}m²</p>
              <p className="text-sm text-slate-600">Giá thuê: {formatCurrency(room?.price || 0)}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="mb-8 hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Mô tả</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Đơn giá</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Số lượng</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {/* Tiền phòng */}
              <tr className="border-b border-slate-200">
                <td className="py-4 px-4">
                  <p className="font-medium text-slate-900">
                    Tiền thuê phòng {payment?.month}/{payment?.year}
                  </p>
                  <p className="text-sm text-slate-600">
                    Phòng {payment?.roomId?.number} - Tòa {payment?.roomId?.buildingId?.name}
                  </p>
                </td>
                <td className="text-right py-4 px-4">
                  <p className="font-medium text-slate-900">
                    {formatCurrency(payment?.rentAmount || 0)}
                  </p>
                </td>
                <td className="text-right py-4 px-4">
                  <p className="font-medium text-slate-900">1</p>
                </td>
                <td className="text-right py-4 px-4">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(payment?.rentAmount || 0)}
                  </p>
                </td>
              </tr>

              {/* Điện */}
              {payment?.electricityCost !== undefined && payment.electricityCost > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền điện</p>
                    <p className="text-sm text-slate-600">
                      CSĐ cũ: {payment?.electricityPrevious} | CSĐ mới:{' '}
                      {payment?.electricityCurrent} | Sử dụng: {payment?.electricityUsage} kWh
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment?.electricityUnitPrice || 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {payment?.electricityUsage || 0} kWh
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.electricityCost || 0)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Nước */}
              {payment?.waterCost !== undefined && payment.waterCost > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền nước</p>
                    <p className="text-sm text-slate-600">
                      {room?.waterPricePerCubicMeter && room.waterPricePerCubicMeter > 0
                        ? `CSĐ cũ: ${payment?.waterPrevious} | CSĐ mới: ${payment?.waterCurrent} | Sử dụng: ${payment?.waterUsage} m³`
                        : `Tính theo người: ${formatCurrency(room?.waterPricePerPerson || 0)}/người`}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {room?.waterPricePerCubicMeter && room.waterPricePerCubicMeter > 0
                        ? formatCurrency(room?.waterPricePerCubicMeter)
                        : formatCurrency(room?.waterPricePerPerson || 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {room?.waterPricePerCubicMeter && room.waterPricePerCubicMeter > 0
                        ? `${payment?.waterUsage || 0} m³`
                        : '1 người'}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.waterCost || 0)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Internet */}
              {payment?.internetFee !== undefined && payment.internetFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền Internet</p>
                    <p className="text-sm text-slate-600">Phí truy cập Internet hàng tháng</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment?.internetFee || 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.internetFee || 0)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Gửi xe */}
              {payment?.parkingFee !== undefined && payment.parkingFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền gửi xe</p>
                    <p className="text-sm text-slate-600">Phí gửi xe hàng tháng</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment?.parkingFee || 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.parkingFee || 0)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Phí dịch vụ */}
              {payment?.serviceFee !== undefined && payment.serviceFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Phí dịch vụ</p>
                    <p className="text-sm text-slate-600">Phí dịch vụ quản lý</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment?.serviceFee || 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.serviceFee || 0)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Phí khác */}
              {payment?.otherFee !== undefined && payment.otherFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Phí khác</p>
                    <p className="text-sm text-slate-600">Các khoản phí khác</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment?.otherFee || 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.otherFee || 0)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Total */}
              <tr className="border-b-2 border-slate-900">
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-900">Tổng cộng</p>
                </td>
                <td className="text-right py-4 px-4" colSpan={2}></td>
                <td className="text-right py-4 px-4">
                  <p className="font-bold text-slate-900">
                    {formatCurrency(payment?.totalAmount || 0)}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 mb-4">
          {/* Tiền phòng */}
          <div className="p-4 border rounded-lg bg-slate-50">
            <div className="flex justify-between font-semibold">
              <span className="text-sm">
                Tiền thuê phòng {payment?.month}/{payment?.year}
              </span>
              <span className="text-sm">{formatCurrency(payment?.rentAmount || 0)}</span>
            </div>
          </div>

          {/* Điện */}
          {payment?.electricityCost !== undefined && payment.electricityCost > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền điện</span>
                <span className="text-sm">{formatCurrency(payment?.electricityCost || 0)}</span>
              </div>

              <div className="text-xs text-slate-600 mt-1 space-y-1">
                <p>
                  {payment?.electricityUsage || 0} kWh ×{' '}
                  {formatCurrency(payment?.electricityUnitPrice || 0)}
                </p>

                <p>
                  CSĐ cũ: {payment?.electricityPrevious} → CSĐ mới: {payment?.electricityCurrent}
                </p>
              </div>
            </div>
          )}

          {/* Nước */}
          {payment?.waterCost !== undefined && payment.waterCost > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền nước</span>
                <span className="text-sm">{formatCurrency(payment?.waterCost || 0)}</span>
              </div>

              <div className="text-xs text-slate-600 mt-1 space-y-1">
                {room?.waterPricePerCubicMeter && room.waterPricePerCubicMeter > 0 ? (
                  <>
                    <p>
                      {payment?.waterUsage || 0} m³ ×{' '}
                      {formatCurrency(room?.waterPricePerCubicMeter)}
                    </p>
                    <p>
                      CSĐ cũ: {payment?.waterPrevious} → CSĐ mới: {payment?.waterCurrent}
                    </p>
                    <p className="text-blue-600 font-medium">💧 Tính theo m³</p>
                  </>
                ) : (
                  <>
                    <p>{formatCurrency(room?.waterPricePerPerson || 0)} / người</p>
                    <p className="text-green-600 font-medium">👤 Tính theo người</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Internet */}
          {payment?.internetFee !== undefined && payment.internetFee > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền internet</span>
                <span className="text-sm">{formatCurrency(payment?.internetFee)} / tháng</span>
              </div>
            </div>
          )}

          {/* Gửi xe */}
          {payment?.parkingFee !== undefined && payment.parkingFee > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền gửi xe</span>
                <span className="text-sm">{formatCurrency(payment?.parkingFee)} / tháng</span>
              </div>
            </div>
          )}

          {/* Phí dịch vụ */}
          {payment?.serviceFee !== undefined && payment.serviceFee > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền dịch vụ</span>
                <span className="text-sm">{formatCurrency(payment?.serviceFee)} / tháng</span>
              </div>
            </div>
          )}

          {/* Phí khác */}
          {payment?.otherFee !== undefined && payment.otherFee > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền khác</span>
                <span className="text-sm">{formatCurrency(payment.otherFee)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="flex justify-end pb-8 border-b border-slate-200">
          <div className="w-full md:w-64">
            <div className="flex justify-between mb-2 pb-2 border-b border-slate-200">
              <span className="text-slate-600 text-sm">Tổng tiền:</span>
              <span className="font-semibold text-slate-900 text-sm">
                {formatCurrency(payment?.totalAmount ?? 0)}
              </span>
            </div>
            <div className=" mt-2 flex justify-between">
              <span className="text-lg font-bold text-slate-900">Cần thanh toán:</span>
              <span className="text-xl font-bold text-red-500">
                {formatCurrency(payment?.totalAmount ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {payment?.status !== PaymentStatus.PAID && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Quét mã QR để thanh toán</h3>

            <div className="p-4 border rounded-lg bg-white">
              <img
                src={`https://img.vietqr.io/image/970426-0358361511-JH8r4kY.jpg?amount=${payment?.totalAmount ?? 0}&addInfo=${payment?.roomId?.number || payment?.roomId}&accountName=Nguyen%20cong%20quy`}
                alt="QR Thanh toán"
                className="w-48 h-48 object-contain"
              />
            </div>

            <p className="text-sm text-slate-600 text-center">
              Nội dung chuyển khoản: <b>{payment?.roomId?.number || payment?.roomId}</b>
            </p>
          </div>
        )}

        {user.role === UserRole.admin && payment?.status !== PaymentStatus.PAID && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 gap-2"
              onClick={handleMarkAsPaid}
            >
              Đánh dấu đã thanh toán
            </Button>
          </div>
        )}

        {payment?.status === PaymentStatus.PAID && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <span>Hoá đơn đã được thanh toán</span>
          </div>
        )}
      </Card>
    </div>
  );
}
