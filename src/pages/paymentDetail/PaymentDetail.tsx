import { queryClient } from '@/lib/reactQuery';
import { AlertCircle, Check, Clock } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetPaymentByIdQuery } from '@/api/payment';
import { useGetRoomByIdQuery } from '@/api/room';
import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocalStorageKey, Path, PaymentStatus, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import PaymentEditDialog from '@/pages/paymentDetail/PaymentEditDialog';
import { formatCurrency } from '@/utils/utils';

export default function PaymentDetail() {
  const { paymentId } = useParams();
  const navigator = useNavigate();
  const { show, hide } = useLoading();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId, !!userId);
  const getPaymentByIdQuery = useGetPaymentByIdQuery(paymentId, !!paymentId);
  const getRoomById = useGetRoomByIdQuery(
    getPaymentByIdQuery.data?.roomId,
    !!getPaymentByIdQuery.data?.roomId,
  );

  const getTenantById = useUserQuery(
    getPaymentByIdQuery.data?.tenantId,
    !!getPaymentByIdQuery.data?.tenantId,
  );

  const handleMarkAsPaid = () => {
    console.log();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-4 border-b border-slate-200">
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
                    Phòng {room?.number} - Tòa {room?.buildingId?.name}
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
              {payment?.parkingFee !== undefined && payment?.parkingFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền gửi xe</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(payment?.parkingFee)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.parkingFee)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Internet */}
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

              {payment?.serviceFee !== undefined && payment.serviceFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền internet</p>
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

              {payment?.otherFee !== undefined && payment.otherFee > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền khác</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">{formatCurrency(payment.otherFee)}</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment.otherFee)}
                    </p>
                  </td>
                </tr>
              )}

              {payment?.note !== undefined && payment.note.length > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Ghi chú</p>
                    <p className="font-medium text-slate-900">{payment.note}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 mb-4">
          {/* Tiền phòng */}
          <div className="p-4 border rounded-lg bg-slate-50">
            <div className="flex justify-between font-semibold">
              <span className="text-sm">Tiền cọc {payment?.month}</span>
              <span className="text-sm">{formatCurrency(payment?.roomFee || 0)}</span>
            </div>
          </div>

          {/* Điện */}
          {payment && payment?.electricityAmount > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền điện</span>
                <span className="text-sm">{formatCurrency(payment?.electricityAmount)}</span>
              </div>

              <div className="text-xs text-slate-600 mt-1 space-y-1">
                <p>
                  {(payment?.electricityCurrent || 0) - (payment?.electricityPrevious || 0)} kWh ×{' '}
                  {formatCurrency(payment?.electricityUnitPrice || 0)}
                </p>

                <p>Đơn giá: {formatCurrency(payment?.electricityUnitPrice || 0)} / kWh</p>
              </div>
            </div>
          )}

          {/* Nước */}
          {payment && payment.waterAmount > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền nước</span>
                <span className="text-sm">{formatCurrency(payment.waterAmount)}</span>
              </div>

              <div className="text-xs text-slate-600 mt-1 space-y-1">
                <p>
                  {payment.waterCurrent - payment.waterPrevious} m³ ×{' '}
                  {formatCurrency(payment.waterUnitPrice || 0)}
                </p>

                <p>Đơn giá: {formatCurrency(payment.waterUnitPrice || 0)} / m³</p>
              </div>
            </div>
          )}

          {payment?.internetFee !== undefined && payment.internetFee > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền internet</span>
                <span className="text-sm">{formatCurrency(payment.internetFee)} / tháng</span>
              </div>
            </div>
          )}

          {payment?.serviceFee !== undefined && payment.serviceFee > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền dịch vụ</span>
                <span className="text-sm">{formatCurrency(payment.serviceFee)} / tháng</span>
              </div>
            </div>
          )}

          {payment?.otherFee !== undefined && payment.otherFee > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền khác</span>
                <span className="text-sm">{formatCurrency(payment.otherFee)}</span>
              </div>
            </div>
          )}

          {/* Note */}
          {payment?.note && (
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-slate-600 mt-1">{payment.note}</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="flex justify-end pb-8 border-b border-slate-200">
          <div className="w-full md:w-64">
            <div className="flex justify-between mb-2 pb-2 border-b border-slate-200">
              <span className="text-slate-600 text-sm">Tổng tiền:</span>
              <span className="font-semibold text-slate-900 text-sm">
                {formatCurrency(payment?.amount ?? 0)}
              </span>
            </div>
            <div className=" mt-2 flex justify-between">
              <span className="text-lg font-bold text-slate-900">Cần thanh toán:</span>
              <span className="text-xl font-bold text-red-500">
                {formatCurrency(payment?.amount ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {payment?.status !== PaymentStatus.PAID && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Quét mã QR để thanh toán</h3>

            <div className="p-4 border rounded-lg bg-white">
              <img
                src={`https://img.vietqr.io/image/970426-0358361511-JH8r4kY.jpg?amount=${payment?.amount ?? 0}&addInfo=${payment?.roomId}&accountName=Nguyen%20cong%20quy`}
                alt="QR Thanh toán"
                className="w-48 h-48 object-contain"
              />
            </div>

            <p className="text-sm text-slate-600 text-center">
              Nội dung chuyển khoản: <b>{payment?.roomId}</b>
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
            <Button
              variant="outline"
              className="gap-2 text-slate-700 border-slate-300 bg-transparent"
              onClick={() => setIsEditOpen(true)}
            >
              Chỉnh sửa hóa đơn
            </Button>
          </div>
        )}

        {payment?.status === PaymentStatus.PAID && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <span>Hoá đơn đã được thanh toán</span>
          </div>
        )}
      </Card>
      <PaymentEditDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        payment={payment}
        onSubmit={(data) => {
          console.log('Update payment:', data);
          // gọi mutation update API ở đây
        }}
      />
    </div>
  );
}
