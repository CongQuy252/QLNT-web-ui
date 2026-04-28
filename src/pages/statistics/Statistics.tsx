import { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { LiaSave } from 'react-icons/lia';
import { MdCancel } from 'react-icons/md';

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
import DashboardSummary from './components/DashboardSummary';
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
  const [errorRoomIds, setErrorRoomIds] = useState<string[]>([]);
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
    const bulkData: BulkMeterReadingDto = {
      meterReadings: Object.entries(editedValues).map(([roomId, values]) => ({
        roomId,
        electricityReading: values.electricity,
        waterReading: values.water,
        month,
        year,
      })),
    };

    await bulkUpsertMeterReadings(bulkData)
      .then((res) => {
        if (res.errors && res.errors.length > 0) {
          toastError(res.errors.join(', '));
          setErrorRoomIds(res.errorRoomIds || []);
        } else {
          success('Lưu dữ liệu thành công.');
          setEditedValues({});
          setErrorRoomIds([]);
          setIsEditing(false);
          refetch();
        }
      })
      .catch((err) => {
        const errors = err?.response?.data?.errors;
        const errorRoomIds = err?.response?.data?.errorRoomIds;
        if (errors && errors.length > 0) {
          toastError(errors.join('\n'));
          setErrorRoomIds(errorRoomIds || []);
        } else {
          toastError('Có lỗi xảy ra');
        }
      });
  };

  return (
    <div className="max-h-screen bg-gray-50">
      <div className="w-full">
        {/* Tiêu đề linh hoạt */}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Thống kê</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="w-full">
            {/* Tabs: Hỗ trợ cuộn ngang trên mobile */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
              <nav className="flex overflow-x-auto no-scrollbar" aria-label="Tabs">
                {[
                  { id: 'table', label: 'Danh sách' },
                  { id: 'dashboard', label: 'Chi Phí' },
                  { id: 'summary', label: 'Tổng Quan' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-25 py-4 px-1 text-center text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-blue-500'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'table' && (
                <div className="space-y-6">
                  {/* Khu vực Filters */}
                  <div className="flex flex-col gap-4">
                    {/* Tìm kiếm: 2 cột trên PC, 1 cột trên Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-gray-400">
                          Tên phòng
                        </Label>
                        <Input
                          type="text"
                          placeholder="Tên phòng"
                          value={inputRoomNumber}
                          onChange={(e) => setInputRoomNumber(e.target.value)}
                          onBlur={() => setSelectedRoom(inputRoomNumber)}
                          className="h-9 shadow-sm text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase text-gray-400">
                          Tên tòa nhà
                        </Label>
                        <Input
                          type="text"
                          placeholder="Tên tòa nhà..."
                          value={buildingInput}
                          onChange={(e) => setBuildingInput(e.target.value)}
                          onBlur={() => setSelectedBuilding(buildingInput)}
                          className="h-9 shadow-sm text-sm"
                        />
                      </div>
                    </div>

                    {/* Chọn Thời gian & Nút Action */}
                    <div className="flex flex-wrap sm:flex-nowrap items-end gap-2 sm:justify-between">
                      {/* BÊN TRÁI */}
                      <div className="flex flex-wrap sm:flex-nowrap gap-2">
                        <div className="flex-1 sm:flex-none sm:w-[140px] min-w-[120px]">
                          <Label className="text-xs font-semibold uppercase text-gray-400 mb-2 block">
                            Tháng
                          </Label>
                          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Tháng" />
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

                        <div className="flex-1 sm:flex-none sm:w-[100px] min-w-[100px]">
                          <Label className="text-xs font-semibold uppercase text-gray-400 mb-2 block">
                            Năm
                          </Label>
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Năm" />
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
                      </div>

                      {/* BÊN PHẢI */}
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto">
                        {isEditing && (
                          <Button
                            variant="outline"
                            className="flex-1 sm:w-24 h-9 border-red-200 text-red-500"
                            onClick={() => {
                              setEditedValues({});
                              setIsEditing(false);
                              setErrorRoomIds([]);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <MdCancel className="h-4 w-4" />
                              <span>Huỷ</span>
                            </div>
                          </Button>
                        )}

                        <Button
                          className={`flex-1 sm:flex-none sm:w-auto h-9 ${
                            isEditing
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-black hover:bg-gray-800'
                          } text-white`}
                          onClick={() => {
                            if (isEditing) {
                              handleSave();
                            } else {
                              setIsEditing(true);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <LiaSave className="h-4 w-4" />
                            ) : (
                              <FaRegEdit className="h-4 w-4 sm:mb-1" />
                            )}
                            <span>{isEditing ? 'Lưu' : 'Chỉnh sửa'}</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-red-400">
                    ※ Danh sách đang hiển thị là chỉ số của tháng {selectedMonth} năm {selectedYear}
                    . Để xem chỉ số của các tháng cũ hơn, vui lòng chọn tháng muốn hiển thị tại phía
                    trên.
                    <br />※ Khi thực hiện cập nhật xong chỉ số của 1 tháng. Vui lòng lưu lại để
                    tránh dữ liệu được lưu không đúng.
                  </div>

                  <div className="overflow-x-auto">
                    <MeterReadingTable
                      rooms={rooms}
                      isLoading={isLoading}
                      error={error}
                      errorRoomIds={errorRoomIds}
                      isEditing={isEditing}
                      editedValues={editedValues}
                      onChange={handleInputChange}
                      selectedMonth={parseInt(selectedMonth)}
                      selectedYear={parseInt(selectedYear)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="animate-in fade-in duration-300">
                  <Dashboard />
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="animate-in fade-in duration-300">
                  <DashboardSummary />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default Statistics;
