import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/utils';

interface RevenueRow {
  id: string;
  date: string;
  description: string;
  revenue: number;
  expense: number;
}

export default function Dashboard() {
  const [open, setOpen] = useState(false);
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
  ]);

  const [newRow, setNewRow] = useState({
    date: '',
    description: '',
    revenue: '',
    expense: '',
  });

  const addRow = () => {
    if (newRow.date && newRow.description && newRow.revenue && newRow.expense) {
      setRows([
        {
          id: Date.now().toString(),
          date: newRow.date,
          description: newRow.description,
          revenue: parseFloat(newRow.revenue),
          expense: parseFloat(newRow.expense),
        },
        ...rows,
      ]);
      setNewRow({ date: '', description: '', revenue: '', expense: '' });
    }
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const totals = {
    revenue: rows.reduce((s, r) => s + r.revenue, 0),
    expense: rows.reduce((s, r) => s + r.expense, 0),
  };

  const profit = totals.revenue - totals.expense;

  const Form = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <Input
        type="date"
        value={newRow.date}
        onChange={(e) => setNewRow({ ...newRow, date: e.target.value })}
      />
      <Input
        value={newRow.description}
        onChange={(e) => setNewRow({ ...newRow, description: e.target.value })}
        placeholder="Mô tả"
      />
      <Input
        type="number"
        value={newRow.revenue}
        onChange={(e) => setNewRow({ ...newRow, revenue: e.target.value })}
        placeholder="Thu"
      />
      <Input
        type="number"
        value={newRow.expense}
        onChange={(e) => setNewRow({ ...newRow, expense: e.target.value })}
        placeholder="Chi"
      />
      <div className="sticky bottom-0 bg-background pt-3 pb-4 border-t flex gap-3 justify-center">
        <Button variant="outline" onClick={() => setOpen(false)} className="w-40">
          Huỷ
        </Button>

        <Button
          onClick={() => {
            addRow();
            setOpen(false);
          }}
          className="w-40"
        >
          Tạo
        </Button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* DESKTOP FORM */}
        <div className="hidden md:block">
          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Thêm Ghi Chép Mới</CardTitle>
            </CardHeader>
            <CardContent>
              <Form />
            </CardContent>
          </Card>
        </div>

        {/* MOBILE BUTTON + DIALOG */}
        <div className="md:hidden mb-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Thêm record mới</Button>
            </DialogTrigger>

            <DialogContent className="fixed inset-0 w-screen h-screen max-w-none translate-x-0 translate-y-0 rounded-none p-4">
              <DialogHeader className="sticky top-0 bg-background z-10 pb-2">
                <DialogTitle>Thêm Ghi Chép</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-3 overflow-y-auto">
                <Form />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE (SCROLL MOBILE) */}
        <Card className="p-2">
          <CardContent className="px-0">
            <div className="max-h-80 overflow-auto">
              <table className="w-full min-w-[700px]">
                <thead className="sticky top-0 bg-background z-10 shadow-sm">
                  <tr className="border-b">
                    <th className="text-left px-4 py-3">Tháng</th>
                    <th className="text-left px-4 py-3">Mô tả</th>
                    <th className="text-right px-4 py-3">Thu</th>
                    <th className="text-right px-4 py-3">Chi</th>
                    <th className="text-right px-4 py-3">Lãi</th>
                    <th className="text-center px-4 py-3">Xóa</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => {
                    const rowProfit = row.revenue - row.expense;

                    return (
                      <tr key={row.id} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {new Date(row.date).toLocaleDateString('vi-VN', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">{row.description}</td>
                        <td className="px-4 py-3 text-right text-green-600">
                          {formatCurrency(row.revenue)}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600">
                          {formatCurrency(row.expense)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right ${
                            rowProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(rowProfit)}
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded"
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

        {/* TOTAL */}
        <div className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm">
            <div></div>
            <div className="font-semibold">Tổng</div>
            <div className="text-green-600 text-right font-bold">
              {formatCurrency(totals.revenue)}
            </div>
            <div className="text-red-600 text-right font-bold">
              {formatCurrency(totals.expense)}
            </div>
            <div
              className={`text-right font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            >
              {formatCurrency(profit)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
