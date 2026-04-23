'use client';

import { Building2, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type DashboardSummary, getDashboardSummary } from '@/api/paymentTransaction';
import { useToast } from '@/hooks/useToast';

export default function DashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { error } = useToast();

  // Fetch dashboard summary data from API
  const fetchDashboardSummary = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardSummary(selectedMonth, selectedYear);
      setSummary(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching dashboard summary:', err);
      error(err.response?.data?.message || 'Lỗi khi tải dữ liệu tổng quan');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchDashboardSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Month options
  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  // Year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Báo cáo tài chính</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <label className="flex flex-col gap-1 sm:gap-2">
            <span className="text-xs font-medium text-gray-600 hidden sm:block">Chọn tháng</span>
            <select
              className="border p-2 rounded-lg bg-white shadow-sm w-full sm:w-auto"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              aria-label="Chọn tháng"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 sm:gap-2">
            <span className="text-xs font-medium text-gray-600 hidden sm:block">Chọn năm</span>
            <select
              className="border p-2 rounded-lg bg-white shadow-sm w-full sm:w-auto"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              aria-label="Chọn năm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">
                Tổng Doanh Thu
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                {formatCurrency(summary?.summary.totalRevenue || 0)}
              </h3>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-full text-green-600">
              <TrendingUp size={20} className="sm:size-24" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">
                Tổng Chi Phí
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                {formatCurrency(summary?.summary.totalExpense || 0)}
              </h3>
            </div>
            <div className="bg-red-100 p-2 sm:p-3 rounded-full text-red-600">
              <TrendingDown size={20} className="sm:size-24" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">
                Lợi Nhuận ròng
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
                {formatCurrency(summary?.summary.profit || 0)}
              </h3>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full text-blue-600">
              <DollarSign size={20} className="sm:size-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <Building2 size={18} className="sm:size-20 text-gray-400" />
            <span className="truncate">Chi tiết theo tòa nhà</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 sm:p-4 font-semibold text-gray-600 text-xs sm:text-sm">
                    Tên tòa nhà
                  </th>
                  <th className="p-3 sm:p-4 font-semibold text-gray-600 text-xs sm:text-sm text-right">
                    Doanh thu
                  </th>
                  <th className="p-3 sm:p-4 font-semibold text-gray-600 text-xs sm:text-sm text-right">
                    Chi phí
                  </th>
                  <th className="p-3 sm:p-4 font-semibold text-gray-600 text-xs sm:text-sm text-right">
                    Lợi nhuận
                  </th>
                  <th className="p-3 sm:p-4 font-semibold text-gray-600 text-xs sm:text-sm text-center">
                    Hiệu suất
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500 text-sm">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : !summary ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500 text-sm">
                      Không có dữ liệu tổng quan
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Combine revenue and expense data by building */}
                    {(() => {
                      const buildingMap = new Map();

                      // Add revenue data
                      summary.revenueByBuilding.forEach((rev) => {
                        buildingMap.set(rev.buildingId, {
                          id: rev.buildingId,
                          name: rev.buildingName,
                          revenue: rev.totalAmount,
                          expense: 0,
                        });
                      });

                      // Add expense data
                      summary.expenseByBuilding.forEach((exp) => {
                        if (buildingMap.has(exp.buildingId)) {
                          const existing = buildingMap.get(exp.buildingId);
                          existing.expense = exp.totalAmount;
                        } else {
                          buildingMap.set(exp.buildingId, {
                            id: exp.buildingId,
                            name: exp.buildingName,
                            revenue: 0,
                            expense: exp.totalAmount,
                          });
                        }
                      });

                      return Array.from(buildingMap.values()).map((building) => ({
                        ...building,
                        profit: building.revenue - building.expense,
                      }));
                    })().map((building) => (
                      <tr key={building.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 sm:p-4 font-medium text-gray-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                          {building.name}
                        </td>
                        <td className="p-3 sm:p-4 text-green-600 text-sm sm:text-base text-right font-medium">
                          +{formatCurrency(building.revenue)}
                        </td>
                        <td className="p-3 sm:p-4 text-red-600 text-sm sm:text-base text-right font-medium">
                          -{formatCurrency(building.expense)}
                        </td>
                        <td className="p-3 sm:p-4 font-bold text-gray-800 text-sm sm:text-base text-right">
                          {formatCurrency(building.profit)}
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px] sm:w-24 mx-auto">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${building.revenue > 0 ? (building.profit / building.revenue) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
