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
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(currentYear.toString()); // Default to current year
  const [activeTab, setActiveTab] = useState('table');
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<
    Record<string, { electricity: number; water: number }>
  >({});
  const { error: toastError, toasts } = useToast();

  // Get month and year from selected dropdowns
  const getMonthYearFromSelection = () => {
    const month = parseInt(selectedMonth) || currentMonth;
    const year = parseInt(selectedYear) || currentYear;
    return { month, year };
  };

  const { month, year } = getMonthYearFromSelection();

  // API call to get rooms with meter readings
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

  // Handle input changes
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

  // Handle save with bulk API
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
        setEditedValues({});
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      toastError('Lưu thất bại. Vui lòng thử lại.');
    }
  };

  // Debug log to check data
  // console.log('Rooms data:', roomsData);
  // console.log('Rooms array:', rooms);
  // console.log('Loading:', isLoading);
  // console.log('Error:', error);

  // Check first room data structure
  if (rooms.length > 0) {
    console.log('First room:', rooms[0]);
    console.log('First room meterReading:', rooms[0].meterReading);
    console.log('First room building:', rooms[0].building);
  }

  return (
    <div className="p-2">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Thống kê chỉ số điện nước</h1>

        <div className="bg-white rounded-lg shadow-md p-6 h-[600px]">
          {/* FILTER + ACTION */}
          <div className="flex items-end justify-between mb-6">
            {/* LEFT FILTER */}
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
                <Label className="w-36">Tìm theo tên tòa nh</Label>
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

          {/* TABS */}
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

            {/* TABLE CONTENT */}
            {activeTab === 'table' && (
              <div className="mt-6">
                {/* TABLE ACTIONS */}
                <div className="flex justify-between items-center mb-4">
                  {/* ITEM COUNT */}
                  <div className="text-sm text-slate-600">{rooms.length} phòng</div>

                  {/* BUTTONS */}
                  <div className="flex gap-2">
                    <div className="w-40">
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

                    <div className="w-32">
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
                        onClick={() => {
                          // Clear edited values and exit edit mode
                          setEditedValues({});
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      className="bg-black text-white hover:bg-gray-800"
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

            {/* DASHBOARD CONTENT */}
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
