import { queryClient } from '@/lib/reactQuery';
import { AlertCircle, ArrowLeft, Check, Clock, Download, Edit, Printer } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { get } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetPaymentByIdQuery } from '@/api/payment';
import { useGetRoomByIdQuery } from '@/api/room';
import { useGetTenantQueries } from '@/api/tenant';
import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocalStorageKey, Path, PaymentStatus, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { formatCurrency } from '@/utils/utils';

export default function PaymentDetail() {
  const { paymentId } = useParams();
  const navigator = useNavigate();
  const { show, hide } = useLoading();
  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId, !!userId);
  const getPaymentByIdQuery = useGetPaymentByIdQuery(paymentId, !!paymentId);
  const getRoomById = useGetRoomByIdQuery(
    getPaymentByIdQuery.data?.roomId,
    !!getPaymentByIdQuery.data?.roomId,
  );
  // const getTenantById = useGetTenantQueries({ userId: getPaymentByIdQuery.data?.tenantId });
  const getTenantById = useUserQuery(
    getPaymentByIdQuery.data?.tenantId,
    !!getPaymentByIdQuery.data?.tenantId,
  );

  const [isMarkedAsPaid, setIsMarkedAsPaid] = useState(false);

  const handleMarkAsPaid = () => {
    setIsMarkedAsPaid(true);
  };

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    navigator(Path.login, { replace: true });
  }, [navigator]);

  useEffect(() => {
    if (
      isLoading &&
      getPaymentByIdQuery.isLoading &&
      getTenantById.isLoading &&
      getRoomById.isLoading
    ) {
      show();
    } else {
      hide();
    }
  }, [
    isLoading,
    show,
    hide,
    getPaymentByIdQuery.isLoading,
    getTenantById.isLoading,
    getRoomById.isLoading,
  ]);

  useEffect(() => {
    if (
      !isLoading &&
      !getPaymentByIdQuery.isLoading &&
      (isError || !user) &&
      (getPaymentByIdQuery.isError || !getPaymentByIdQuery.data) &&
      !getTenantById.isLoading &&
      (getTenantById.isError || getTenantById.data) &&
      !getRoomById.isLoading &&
      (getRoomById.isError || !getRoomById.data)
    ) {
      handleLogout();
    }
  }, [
    isLoading,
    getPaymentByIdQuery.isLoading,
    isError,
    user,
    handleLogout,
    getPaymentByIdQuery.isError,
    getPaymentByIdQuery.data,
    getTenantById.isLoading,
    getTenantById.isError,
    getTenantById.data,
    getRoomById.isLoading,
    getRoomById.isError,
    getRoomById.data,
  ]);

  const payment = useMemo(() => {
    return getPaymentByIdQuery.data;
  }, [getPaymentByIdQuery.data]);

  const tenant = useMemo(() => {
    return getTenantById.data;
  }, [getTenantById.data]);

  const room = useMemo(() => getRoomById.data?.room, [getRoomById.data?.room]);

  if (!user) {
    return null;
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'paid':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'overdue':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'overdue':
        return 'Quá hạn';
      default:
        return 'Không xác định';
    }
  };

  const invoiceNumber = `INV-${payment?._id.toUpperCase()}`;
  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2 text-slate-700 border-slate-300 bg-transparent"
          >
            <Download className="w-4 h-4" />
            Tải PDF
          </Button>
        </div>
      </div> */}

      {/* Invoice Card */}
      <Card className="bg-white p-8">
        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">QLNT</h1>
            <p className="text-slate-600 mt-2">Website quản lý phòng trọ</p>
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
                <span className="font-semibold text-slate-900">{today}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Kỳ thanh toán:</span>
                <span className="font-semibold text-slate-900">{payment?.month}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-3 mb-8 p-4 rounded-lg border-2 ${getStatusColor(payment?.status)}`}
        >
          {getStatusIcon(payment?.status)}
          <div>
            <p className="font-semibold text-slate-900">{getStatusText(payment?.status)}</p>
            {payment?.status === 'paid' && payment.paidDate && (
              <p className="text-sm text-slate-600">Thanh toán vào {payment.paidDate}</p>
            )}
            {payment?.status === 'overdue' && (
              <p className="text-sm text-slate-600">Hạn thanh toán: {payment.dueDate}</p>
            )}
            {payment?.status === 'pending' && (
              <p className="text-sm text-slate-600">Hạn thanh toán: {payment.dueDate}</p>
            )}
          </div>
        </div>

        {/* Tenant Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 pb-8 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase mb-4">Người thuê</h3>
            <div className="space-y-2">
              <p className="font-semibold text-slate-900">{tenant?.name}</p>
              <p className="text-sm text-slate-600">Email: {tenant?.email}</p>
              <p className="text-sm text-slate-600">Điện thoại: {tenant?.phone}</p>
              <p className="text-sm text-slate-600">CMND/CCCD: {tenant?.cccd}</p>
            </div>
          </div>

          {/* Room Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase mb-4">Thông tin phòng</h3>
            <div className="space-y-2">
              <p className="font-semibold text-slate-900">
                Phòng {room?.number} - Tòa {room?.buildingId?.name}
              </p>
              <p className="text-sm text-slate-600">Diện tích: {room?.area}m²</p>
              <p className="text-sm text-slate-600">Tầng: {room?.floor}</p>
              {/* <p className="text-sm text-slate-600">Ngày bắt đầu: {tenant?.moveInDate}</p> */}
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
                  <p className="font-medium text-slate-900">Tiền thuê phòng {payment?.month}</p>
                  <p className="text-sm text-slate-600">
                    Phòng {room?.number} - Tòa {room?.building}
                  </p>
                </td>
                <td className="text-right py-4 px-4">
                  <p className="font-medium text-slate-900">
                    {formatCurrency(payment?.roomFee || 0)}
                  </p>
                </td>
                <td className="text-right py-4 px-4">
                  <p className="font-medium text-slate-900">1</p>
                </td>
                <td className="text-right py-4 px-4">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(payment?.roomFee || 0)}
                  </p>
                </td>
              </tr>

              {/* Điện */}
              {payment?.electricityAmount !== undefined && payment.electricityAmount > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền điện</p>
                    <p className="text-sm text-slate-600">
                      CSĐ cũ: {payment?.electricityPrevious} | CSĐ mới:{' '}
                      {payment?.electricityCurrent} | Giá:{' '}
                      {formatCurrency(payment?.electricityUnitPrice || 0)}/kWh
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment?.electricityAmount || 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {(payment?.electricityCurrent || 0) - (payment?.electricityPrevious || 0)} kWh
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.electricityAmount || 0)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Nước */}
              {payment?.waterAmount !== undefined && payment.waterAmount > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền nước</p>
                    <p className="text-sm text-slate-600">
                      Lượng tiêu thụ: {payment.waterCurrent - payment.waterPrevious} m³
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment.waterUnitPrice)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment.waterAmount)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Gửi xe */}
              {payment?.serviceFee !== undefined && payment.serviceFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền gửi xe</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment.serviceFee)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment.serviceFee)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Rác */}
              {payment?.internetFee !== undefined && payment.internetFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền internet</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment.internetFee)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment.internetFee)}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4 mb-8">
          {/* Tiền phòng */}
          <div className="p-4 border rounded-lg bg-slate-50">
            <div className="flex justify-between font-semibold">
              <span>Tiền thuê phòng {payment?.month}</span>
              <span>{formatCurrency(payment?.roomFee || 0)}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Phòng {room?.number} - Tòa {room?.buildingId?.name}
            </p>
          </div>

          {/* Điện */}
          {payment && payment?.electricityAmount > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span>Tiền điện</span>
                <span>{formatCurrency(payment?.electricityAmount)}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {(payment?.electricityCurrent || 0) - (payment?.electricityPrevious || 0)} kWh ×{' '}
                {formatCurrency(payment?.electricityUnitPrice || 0)}
              </p>
            </div>
          )}

          {/* Nước */}
          {payment && payment.waterAmount > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span>Tiền nước</span>
                <span>{formatCurrency(payment.waterAmount)}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {payment.waterCurrent - payment.waterPrevious} m³
              </p>
            </div>
          )}

          {/* Dịch vụ khác tương tự */}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8 pb-8 border-b border-slate-200">
          <div className="w-full md:w-64">
            <div className="flex justify-between mb-2 pb-2 border-b border-slate-200">
              <span className="text-slate-600">Tổng tiền:</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(payment?.amount ?? 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-bold text-slate-900">Cần thanh toán:</span>
              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(payment?.amount ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {user.role === UserRole.admin && payment?.status !== PaymentStatus.PAID && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 gap-2"
              onClick={handleMarkAsPaid}
            >
              Đánh dấu đã thanh toán
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-slate-700 border-slate-300 bg-transparent"
            >
              Chỉnh sửa hóa đơn
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
