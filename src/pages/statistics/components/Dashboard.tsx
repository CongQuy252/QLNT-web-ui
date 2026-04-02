'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RevenueRow {
  id: string;
  date: string;
  description: string;
  revenue: number;
  expense: number;
}

export default function Dashboard() {
  const [rows, setRows] = useState<RevenueRow[]>([
    {
      id: '1',
      date: '2024-03-15',
      description: 'Bán hàng tháng 3',
      revenue: 15000000,
      expense: 4500000,
    },
    {
      id: '2',
      date: '2024-02-15',
      description: 'Bán hàng tháng 2',
      revenue: 12500000,
      expense: 3500000,
    },
    {
      id: '3',
      date: '2024-01-15',
      description: 'Bán hàng tháng 1',
      revenue: 10800000,
      expense: 3200000,
    },
    {
      id: '4',
      date: '2023-12-15',
      description: 'Bán hàng tháng 12',
      revenue: 18500000,
      expense: 5500000,
    },
    {
      id: '5',
      date: '2023-11-15',
      description: 'Bán hàng tháng 11',
      revenue: 14200000,
      expense: 4200000,
    },
    {
      id: '6',
      date: '2023-11-15',
      description: 'Bán hàng tháng 12',
      revenue: 14200000,
      expense: 4200000,
    },

    {
      id: '7',
      date: '2023-11-15',
      description: 'Bán hàng tháng 12',
      revenue: 14200000,
      expense: 4200000,
    },
  ]);

  const [newRow, setNewRow] = useState({
    date: Date.now().toString(),
    description: '',
    revenue: '',
    expense: '',
  });

  const addRow = () => {
    if (newRow.date && newRow.description && newRow.revenue && newRow.expense) {
      const row: RevenueRow = {
        id: Date.now().toString(),
        date: newRow.date,
        description: newRow.description,
        revenue: parseFloat(newRow.revenue),
        expense: parseFloat(newRow.expense),
      };
      setRows([row, ...rows]);
      setNewRow({ date: '', description: '', revenue: '', expense: '' });
    }
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const calculateTotals = () => {
    return {
      revenue: rows.reduce((sum, row) => sum + row.revenue, 0),
      expense: rows.reduce((sum, row) => sum + row.expense, 0),
    };
  };

  const totals = calculateTotals();
  const profit = totals.revenue - totals.expense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <main className="max-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Thêm Ghi Chép Mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              <Input
                type="date"
                value={newRow.date}
                onChange={(e) => setNewRow({ ...newRow, date: e.target.value })}
                placeholder="Ngày"
              />
              <Input
                value={newRow.description}
                onChange={(e) => setNewRow({ ...newRow, description: e.target.value })}
                placeholder="Mô tả (ví dụ: Bán hàng tháng 3)"
              />
              <Input
                type="number"
                value={newRow.revenue}
                onChange={(e) => setNewRow({ ...newRow, revenue: e.target.value })}
                placeholder="Tổng thu nhập"
              />
              <Input
                type="number"
                value={newRow.expense}
                onChange={(e) => setNewRow({ ...newRow, expense: e.target.value })}
                placeholder="Tổng chi phí"
              />
              <Button onClick={addRow} className="w-full">
                Tạo bản ghi mới
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="p-2 pr-0">
          <CardContent className="px-0">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background z-10 shadow-sm">
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Tháng</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Mô Tả</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Doanh Thu
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Chi Phí</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Lợi Nhuận
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const rowProfit = row.revenue - row.expense;
                    return (
                      <tr
                        key={row.id}
                        className="border-t border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-foreground text-sm font-medium">
                          {new Date(row.date).toLocaleDateString('vi-VN', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-foreground text-sm">{row.description}</td>
                        <td className="py-3 px-4 text-right text-sm text-green-600 font-medium">
                          {formatCurrency(row.revenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-red-600 font-medium">
                          {formatCurrency(row.expense)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right text-sm font-medium ${rowProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}
                        >
                          {formatCurrency(rowProfit)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="inline-flex items-center justify-center p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                            aria-label="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="pt-4">
          <div className="grid grid-cols-6 gap-4 text-sm">
            <div></div>
            <div className="font-semibold text-foreground">Tổng Cộng</div>
            <div className="text-right font-bold text-green-600">
              {formatCurrency(totals.revenue)}
            </div>
            <div className="text-right font-bold text-red-600">
              {formatCurrency(totals.expense)}
            </div>
            <div
              className={`text-right font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            >
              {formatCurrency(profit)}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </main>
  );
}
