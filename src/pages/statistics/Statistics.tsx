import { useState } from 'react';

import { bulkUpsertMeterReadings } from '@/api/meterReading';
import { useRoomsWithMeterReadings } from '@/api/room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToastContainer } from '@/components/ui/toast/Toast';
import { useToast } from '@/hooks/useToast';
import type { BulkMeterReadingDto } from '@/types/meterReading';

import Dashboard from './components/Dashboard';
import MeterReadingTable from './components/Table';

const Statistics = () => {
  const [buildingInput, setBuildingInput] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [inputRoomNumber, setInputRoomNumber] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [activeTab, setActiveTab] = useState('table');
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<
    Record<string, { electricity: number; water: number }>
  >({});
  const { error: toastError, toasts, success } = useToast();

  const getMonthYearFromSelection = () => {
    const month = parseInt(selectedMonth) || currentMonth;
    const year = parseInt(selectedYear) || currentYear;
    return { month, year };
  };

  const { month, year } = getMonthYearFromSelection();

  const {
    data: roomsData,
    isLoading,
    error,
    refetch,
  } = useRoomsWithMeterReadings(
    month,
    year,
    {
      buildingName: selectedBuilding,
      roomNumber: selectedRoom,
    },
    {
      page: 1,
      limit: 50,
    },
  );

  const rooms = roomsData?.data || [];

  const handleInputChange = (roomId: string, field: 'electricity' | 'water', value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedValues((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: numValue,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const bulkData: BulkMeterReadingDto = {
        meterReadings: Object.entries(editedValues).map(([roomId, values]) => ({
          roomId,
          electricityReading: values.electricity,
          waterReading: values.water,
          month,
          year,
        })),
      };

      const result = await bulkUpsertMeterReadings(bulkData);

      if (result.errors && result.errors.length > 0) {
        toastError(result.errors.join(', '));
      } else {
        success('Lưu dữ liệu thành công.');
        setEditedValues({});
        setIsEditing(false);
        refetch();
      }
    } catch {
      toastError('Lưu thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Thống kê chỉ số điện nước</h1>

        <div className="bg-white rounded-lg shadow-md p-6 h-[615px]">
          <div className="w-full">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('table')}
                  className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none ${
                    activeTab === 'table'
                      ? 'text-blue-600 border-blue-500'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Danh sách chỉ số
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none ${
                    activeTab === 'dashboard'
                      ? 'text-blue-600 border-blue-500'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </button>
              </nav>
            </div>

            {activeTab === 'table' && (
              <div className="mt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                  <div className="flex items-end justify-between mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label className="w-36">Tìm theo room</Label>
                        <Input
                          type="text"
                          placeholder="Nhập tên phòng"
                          value={inputRoomNumber}
                          onChange={(e) => setInputRoomNumber(e.target.value)}
                          onBlur={() => setSelectedRoom(inputRoomNumber)}
                          className="w-64"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <Label className="w-36">Tìm theo tên tòa nhà</Label>
                        <Input
                          type="text"
                          placeholder="Nhập tên tòa nhà"
                          value={buildingInput}
                          onChange={(e) => setBuildingInput(e.target.value)}
                          onBlur={() => setSelectedBuilding(buildingInput)}
                          className="w-64"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="w-full sm:w-40">
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tháng" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Tháng {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full sm:w-32">
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = currentYear - 2 + i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {isEditing && (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setEditedValues({});
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
                      onClick={() => {
                        if (isEditing) {
                          handleSave();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                    >
                      {isEditing ? 'Lưu' : 'Edit'}
                    </Button>
                  </div>
                </div>

                <MeterReadingTable
                  rooms={rooms}
                  isLoading={isLoading}
                  error={error}
                  isEditing={isEditing}
                  editedValues={editedValues}
                  onChange={handleInputChange}
                  selectedMonth={parseInt(selectedMonth)}
                  selectedYear={parseInt(selectedYear)}
                />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="mt-6">
                <Dashboard />
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default Statistics;
