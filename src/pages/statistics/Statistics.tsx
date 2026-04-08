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

  // return (
  //   <div>
  //     <div className="max-w-7xl mx-auto">
  //       <h1 className="text-2xl font-bold text-slate-900">Thống kê chỉ số điện nước</h1>

  //       <div className="bg-white rounded-lg shadow-md p-6 h-153.75">
  //         <div className="w-full">
  //           <div className="border-b border-gray-200">
  //             <nav className="-mb-px flex" aria-label="Tabs">
  //               <button
  //                 onClick={() => setActiveTab('table')}
  //                 className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none ${
  //                   activeTab === 'table'
  //                     ? 'text-blue-600 border-blue-500'
  //                     : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
  //                 }`}
  //               >
  //                 Danh sách chỉ số
  //               </button>
  //               <button
  //                 onClick={() => setActiveTab('dashboard')}
  //                 className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none ${
  //                   activeTab === 'dashboard'
  //                     ? 'text-blue-600 border-blue-500'
  //                     : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
  //                 }`}
  //               >
  //                 Chi Phí
  //               </button>
  //               <button
  //                 onClick={() => setActiveTab('summary')}
  //                 className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none ${
  //                   activeTab === 'summary'
  //                     ? 'text-blue-600 border-blue-500'
  //                     : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
  //                 }`}
  //               >
  //                 Tổng Quan
  //               </button>
  //             </nav>
  //           </div>

  //           {activeTab === 'table' && (
  //             <div className="mt-6">
  //               <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-0">
  //                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
  //                   <div className="space-y-4">
  //                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
  //                       <Label className="sm:w-36">Tìm theo room</Label>
  //                       <Input
  //                         type="text"
  //                         placeholder="Nhập tên phòng"
  //                         value={inputRoomNumber}
  //                         onChange={(e) => setInputRoomNumber(e.target.value)}
  //                         onBlur={() => setSelectedRoom(inputRoomNumber)}
  //                         className="w-full"
  //                       />
  //                     </div>

  //                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
  //                       <Label className="sm:w-36">Tìm theo tên tòa nhà</Label>
  //                       <Input
  //                         type="text"
  //                         placeholder="Nhập tên tòa nhà"
  //                         value={buildingInput}
  //                         onChange={(e) => setBuildingInput(e.target.value)}
  //                         onBlur={() => setSelectedBuilding(buildingInput)}
  //                         className="w-full"
  //                       />
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <div className="flex sm:flex-row gap-2 w-full md:w-auto">
  //                   <div className="w-full sm:w-40">
  //                     <Select value={selectedMonth} onValueChange={setSelectedMonth}>
  //                       <SelectTrigger>
  //                         <SelectValue placeholder="Chọn tháng" />
  //                       </SelectTrigger>
  //                       <SelectContent>
  //                         {Array.from({ length: 12 }, (_, i) => (
  //                           <SelectItem key={i + 1} value={(i + 1).toString()}>
  //                             Tháng {String(i + 1).padStart(2, '0')}
  //                           </SelectItem>
  //                         ))}
  //                       </SelectContent>
  //                     </Select>
  //                   </div>

  //                   <div className="w-full sm:w-32">
  //                     <Select value={selectedYear} onValueChange={setSelectedYear}>
  //                       <SelectTrigger>
  //                         <SelectValue placeholder="Chọn năm" />
  //                       </SelectTrigger>
  //                       <SelectContent>
  //                         {Array.from({ length: 5 }, (_, i) => {
  //                           const year = currentYear - 2 + i;
  //                           return (
  //                             <SelectItem key={year} value={year.toString()}>
  //                               {year}
  //                             </SelectItem>
  //                           );
  //                         })}
  //                       </SelectContent>
  //                     </Select>
  //                   </div>

  //                   {isEditing && (
  //                     <Button
  //                       variant="outline"
  //                       className="w-12 sm:w-auto"
  //                       onClick={() => {
  //                         setEditedValues({});
  //                         setIsEditing(false);
  //                       }}
  //                       icon={<MdCancel className="h-4 w-4 text-red-500" />}
  //                     />
  //                   )}

  //                   <Button
  //                     className="bg-black text-white hover:bg-gray-800 w-12 sm:w-auto"
  //                     onClick={() => {
  //                       if (isEditing) {
  //                         handleSave();
  //                       } else {
  //                         setIsEditing(true);
  //                       }
  //                     }}
  //                   >
  //                     {isEditing ? (
  //                       <LiaSave className="h-4 w-4" />
  //                     ) : (
  //                       <FaRegEdit className="h-4 w-4" />
  //                     )}
  //                   </Button>
  //                 </div>
  //               </div>

  //               <MeterReadingTable
  //                 rooms={rooms}
  //                 isLoading={isLoading}
  //                 error={error}
  //                 isEditing={isEditing}
  //                 editedValues={editedValues}
  //                 onChange={handleInputChange}
  //                 selectedMonth={parseInt(selectedMonth)}
  //                 selectedYear={parseInt(selectedYear)}
  //               />
  //             </div>
  //           )}

  //           {activeTab === 'dashboard' && (
  //             <div className="mt-6">
  //               <Dashboard />
  //             </div>
  //           )}
  //           {activeTab === 'summary' && (
  //             <div className="mt-6">
  //               <DashboardSummary />
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>

  //     <ToastContainer toasts={toasts} />
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Tiêu đề linh hoạt */}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
          Thống kê chỉ số điện nước
        </h1>

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
                    className={`flex-1 min-w-[100px] py-4 px-1 text-center text-sm font-medium border-b-2 transition-all ${
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
                          Số phòng
                        </Label>
                        <Input
                          type="text"
                          placeholder="Ví dụ: 101..."
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
                          placeholder="Nhập tên tòa nhà..."
                          value={buildingInput}
                          onChange={(e) => setBuildingInput(e.target.value)}
                          onBlur={() => setSelectedBuilding(buildingInput)}
                          className="h-9 shadow-sm text-sm"
                        />
                      </div>
                    </div>

                    {/* Chọn Thời gian & Nút Action */}
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="flex-1 min-w-[120px]">
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

                      <div className="flex-1 min-w-[100px]">
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

                      {/* Nút Edit/Save - To hơn trên Mobile */}
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        {isEditing && (
                          <Button
                            variant="outline"
                            className="flex-1 sm:w-12 h-9 border-red-200 text-red-500"
                            onClick={() => {
                              setEditedValues({});
                              setIsEditing(false);
                            }}
                          >
                            <MdCancel className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          className={`flex-[2] sm:w-auto h-9 ${
                            isEditing
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-black hover:bg-gray-800'
                          } text-white transition-all`}
                          onClick={() => {
                            if (isEditing) handleSave();
                            else setIsEditing(true);
                          }}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <LiaSave className="h-4 w-4" />
                              <span className="sm:hidden">Lưu lại</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FaRegEdit className="h-4 w-4" />
                              <span className="sm:hidden">Chỉnh sửa</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Table: Cần bọc trong div cuộn ngang hoặc chuyển sang Card (nếu MeterReadingTable đã xử lý) */}
                  <div className="mt-4 overflow-x-auto">
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
