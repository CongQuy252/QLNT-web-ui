import { queryClient } from '@/lib/reactQuery';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetPaymentByIdQuery, useUpdatePaymentMutation } from '@/api/payment';
import { useToast } from '@/hooks/useToast';
import { useGetRoomByIdQuery } from '@/api/room';
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
    getPaymentByIdQuery.data?.roomId ?? '',
    !!getPaymentByIdQuery.data?.roomId,
  );

  const getTenantById = useUserQuery(
    getPaymentByIdQuery.data?.tenantId,
    !!getPaymentByIdQuery.data?.tenantId,
  );

  const updatePaymentMutation = useUpdatePaymentMutation();
  const { success } = useToast();

  const handleMarkAsPaid = () => {
    if (!paymentId) return;

    updatePaymentMutation.mutate(
      {
        id: paymentId,
        data: {
          status: PaymentStatus.PAID,
          paidDate: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          success('Đã cập nhật trạng thái thanh toán');
          queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
        },
      },
    );
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
              {payment?.electricityAmount !== undefined && payment.electricityAmount > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền điện</p>
                    <p className="text-sm text-slate-600">
                      CSĐ cũ: {payment?.electricityPrevious} | CSĐ mới:{' '}
                      {payment?.electricityCurrent} | Giá:{' '}
                      {formatCurrency(room?.electricityUnitPrice || 0)}/kWh
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
                      {formatCurrency(payment?.electricityAmount ?? 0)}
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
                      {formatCurrency(room?.waterUnitPrice ?? 0)}
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
              {payment?.parkingFeeAmount !== undefined && payment?.parkingFeeAmount > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền gửi xe</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(room?.parkingFee ?? 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.parkingFeeAmount)}
                    </p>
                  </td>
                </tr>
              )}

              {/* Internet */}
              {payment?.internetFeeAmount !== undefined && payment?.internetFeeAmount > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền internet</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(room?.internetFee ?? 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.internetFeeAmount ?? 0)}
                    </p>
                  </td>
                </tr>
              )}

              {payment?.serviceFeeAmount !== undefined && payment?.serviceFeeAmount > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Tiền internet</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">
                      {formatCurrency(room?.serviceFee ?? 0)}
                    </p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-medium text-slate-900">1</p>
                  </td>
                  <td className="text-right py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(payment?.serviceFeeAmount)}
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

              {payment?.notes !== undefined && payment?.notes.length > 0 && (
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">Ghi chú</p>
                    <p className="font-medium text-slate-900">{payment?.notes}</p>
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
              <span className="text-sm">{formatCurrency(payment?.rentAmount || 0)}</span>
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
                  {formatCurrency(payment?.electricityAmount || 0)}
                </p>

                <p>Đơn giá: {formatCurrency(room?.electricityUnitPrice || 0)} / kWh</p>
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
                  {formatCurrency(payment.waterAmount || 0)}
                </p>

                <p>Đơn giá: {formatCurrency(room?.waterUnitPrice || 0)} / m³</p>
              </div>
            </div>
          )}

          {payment?.internetFeeAmount !== undefined && payment?.internetFeeAmount > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền internet</span>
                <span className="text-sm">{formatCurrency(payment.internetFeeAmount)} / tháng</span>
              </div>
            </div>
          )}

          {payment?.serviceFeeAmount !== undefined && payment?.serviceFeeAmount > 0 && (
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tiền dịch vụ</span>
                <span className="text-sm">{formatCurrency(payment.serviceFeeAmount)} / tháng</span>
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
          {payment?.notes && (
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-slate-600 mt-1">{payment.notes}</p>
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
