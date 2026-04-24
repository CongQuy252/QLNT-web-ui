import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getBuildings } from '@/api/building';
import { createExpense, deleteExpense, getExpenses } from '@/api/expense';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import type { Building } from '@/types/building';
import type { CreateExpenseInput, Expense } from '@/types/expense';

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { error, success } = useToast();

  const [newExpense, setNewExpense] = useState<CreateExpenseInput>({
    buildingId: '',
    electricityAmount: 0,
    waterAmount: 0,
    houseAmount: 0,
    livingFeeAmount: 0,
    otherFee: 0,
    expenseDate: new Date().toISOString().split('T')[0],
  });

  // Fetch buildings on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const buildingsData = await getBuildings();
        setBuildings(buildingsData);
      } catch {
        error('Lỗi khi tải danh sách tòa nhà');
      }
    };

    fetchBuildings();
  }, [error]);

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses({ limit: 100 });
        setExpenses(data.expenses);
      } catch {
        error('Lỗi khi tải danh sách chi phí');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [error]);

  const addExpense = async () => {
    if (!newExpense.buildingId) {
      error('Vui lòng chọn tòa nhà');
      return;
    }

    try {
      const createdExpense = await createExpense(newExpense);
      setExpenses([createdExpense, ...expenses]);
      success('Tạo chi phí thành công');
      setNewExpense({
        buildingId: '',
        electricityAmount: 0,
        waterAmount: 0,
        houseAmount: 0,
        livingFeeAmount: 0,
        otherFee: 0,
        expenseDate: new Date().toISOString().split('T')[0],
      });
      setIsDialogOpen(false);
    } catch {
      error('Lỗi khi tạo chi phí');
    }
  };

  const deleteExpenseItem = async (id: string) => {
    if (!id) {
      error('Không tìm thấy ID chi phí để xóa');
      return;
    }

    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      success('Xóa chi phí thành công');
    } catch (err) {
      console.error('Delete expense error:', err);
      error('Lỗi khi xóa chi phí');
    }
  };

  const calculateTotals = () => {
    if (!expenses || !Array.isArray(expenses)) {
      return { total: 0 };
    }
    return {
      total: expenses.reduce(
        (sum, expense) =>
          sum +
          expense.electricityAmount +
          expense.waterAmount +
          expense.houseAmount +
          expense.livingFeeAmount +
          expense.otherFee,
        0,
      ),
    };
  };

  const totals = calculateTotals();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl space-y-4">
        {/* Total Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Tổng Chi Phí:</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {formatCurrency(totals.total)}
            </div>
          </div>
        </div>

        {/* Header with Add Button */}
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Thêm Chi Phí</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
              <div className="flex flex-col max-h-[90vh]">
                <div className="sticky top-0 z-10 border-b py-2">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Thêm chi phí</DialogTitle>
                  </DialogHeader>
                </div>

                <div className="overflow-y-auto space-y-2 pb-2">
                  {/* Building and Date - Same row on desktop, separate on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Building Select */}
                    <div className="space-y-2 ">
                      <label className="text-sm font-medium text-gray-700">Tòa nhà</label>
                      <Select
                        value={newExpense.buildingId}
                        onValueChange={(value) =>
                          setNewExpense({ ...newExpense, buildingId: value })
                        }
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Chọn tòa nhà" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.map((building) => (
                            <SelectItem key={building._id} value={building._id}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Ngày</label>
                      <Input
                        type="date"
                        value={newExpense.expenseDate}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, expenseDate: e.target.value })
                        }
                        className="h-10 w-full"
                      />
                    </div>
                  </div>

                  {/* Electricity Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tiền điện</label>
                    <Input
                      type="number"
                      value={newExpense.electricityAmount}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          electricityAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Số tiền điện"
                      className="h-10 w-full"
                    />
                  </div>

                  {/* Water Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tiền nước</label>
                    <Input
                      type="number"
                      value={newExpense.waterAmount}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          waterAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Số tiền nước"
                      className="h-10 w-full"
                    />
                  </div>

                  {/* House Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tiền nhà</label>
                    <Input
                      type="number"
                      value={newExpense.houseAmount}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          houseAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Số tiền nhà"
                      className="h-10 w-full"
                    />
                  </div>

                  {/* Living Fee Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phí sinh hoạt</label>
                    <Input
                      type="number"
                      value={newExpense.livingFeeAmount}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          livingFeeAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Phí sinh hoạt"
                      className="h-10 w-full"
                    />
                  </div>

                  {/* Other Fee Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phí khác</label>
                    <Input
                      type="number"
                      value={newExpense.otherFee}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, otherFee: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Phí khác"
                      className="h-10 w-full"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4 pb-8">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button onClick={addExpense} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Tạo chi phí
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Danh sách Chi phí</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Tòa Nhà
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Ngày
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Tiền Điện
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Tiền Nước
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Tiền Nhà
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Phí Sinh Hoạt
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Phí Khác
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Số Tiền
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="text-center py-8 text-gray-500 text-sm">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : !expenses || expenses.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-8 text-gray-500 text-sm">
                        Không có dữ liệu chi phí
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => {
                      return (
                        <tr
                          key={expense._id || 'temp-' + Math.random()}
                          className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-800 text-sm font-medium">
                            <div className="max-w-[100px] truncate">
                              {expense.buildingId?.name || '-'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            {new Date(expense.expenseDate).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-red-600 font-medium">
                            {formatCurrency(expense.electricityAmount)}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-red-600 font-medium">
                            {formatCurrency(expense.waterAmount)}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-red-600 font-medium">
                            {formatCurrency(expense.houseAmount)}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-red-600 font-medium">
                            {formatCurrency(expense.livingFeeAmount)}
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-red-600 font-medium">
                            {formatCurrency(expense.otherFee)}
                          </td>
                          <td className="py-3 px-4 text-right text-sm font-bold text-blue-600">
                            {formatCurrency(
                              expense.electricityAmount +
                                expense.waterAmount +
                                expense.houseAmount +
                                expense.livingFeeAmount +
                                expense.otherFee,
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => deleteExpenseItem(expense._id)}
                              className="inline-flex items-center justify-center p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                              aria-label="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
