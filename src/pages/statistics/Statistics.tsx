import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoomsWithMeterReadings } from "@/api/room";
import type { RoomWithMeterReading } from "@/types/room";

const Statistics = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(currentYear.toString()); // Default to current year
  const [activeTab, setActiveTab] = useState("table");
  const [isEditing, setIsEditing] = useState(false);

  // Get month and year from selected dropdowns
  const getMonthYearFromSelection = () => {
    const month = parseInt(selectedMonth) || currentMonth;
    const year = parseInt(selectedYear) || currentYear;
    return { month, year };
  };

  const { month, year } = getMonthYearFromSelection();

  // API call to get rooms with meter readings
  const { data: roomsData, isLoading, error } = useRoomsWithMeterReadings(
    month,
    year,
    {
      buildingId: selectedBuilding || undefined,
      floor: undefined,
    },
    {
      page: 1,
      limit: 50,
    }
  );

  const rooms = roomsData?.data || [];

  // Debug log to check data
  console.log('Rooms data:', roomsData);
  console.log('Rooms array:', rooms);
  console.log('Loading:', isLoading);
  console.log('Error:', error);
  
  // Check first room data structure
  if (rooms.length > 0) {
    console.log('First room:', rooms[0]);
    console.log('First room meterReading:', rooms[0].meterReading);
    console.log('First room building:', rooms[0].building);
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Thống kê chỉ số điện nước
        </h1>

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
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-64"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-36">Tìm theo building</Label>
                <Input
                  type="text"
                  placeholder="Nhập tên tòa nhà"
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
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
                  onClick={() => setActiveTab("table")}
                  className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none ${
                    activeTab === "table"
                      ? "text-blue-600 border-blue-500"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Danh sách chỉ số
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none ${
                    activeTab === "dashboard"
                      ? "text-blue-600 border-blue-500"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Dashboard
                </button>
              </nav>
            </div>

            {/* TABLE CONTENT */}
            {activeTab === "table" && (
              <div className="mt-6">
                                {/* TABLE ACTIONS */}
                <div className="flex justify-between items-center mb-4">
                  {/* ITEM COUNT */}
                  <div className="text-sm text-slate-600">
                    {rooms.length} items
                  </div>
                  
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
                              Tháng {String(i + 1).padStart(2, "0")}
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
                          // Cancel editing
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
                          // Save logic here
                          console.log("Save:", {
                            building: selectedBuilding,
                            room: selectedRoom,
                            month: selectedMonth,
                            year: selectedYear,
                          });
                          setIsEditing(false);
                        } else {
                          // Enable editing
                          setIsEditing(true);
                        }
                      }}
                    >
                      {isEditing ? "Lưu" : "Edit"}
                    </Button>
                  </div>
                </div>

                {/* SINGLE TABLE WITH SCROLLABLE BODY */}
                <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                  <div className="overflow-y-auto max-h-70 overflow-x-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-blue-200">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-center w-10 hover:bg-blue-200">
                            <Input type="checkbox" />
                          </th>
                          <th className="border border-gray-300 px-4 py-2 hover:bg-blue-200">Tên tòa nhà</th>
                          <th className="border border-gray-300 px-4 py-2 hover:bg-blue-200">Tên phòng</th>
                          <th className="border border-gray-300 px-4 py-2 hover:bg-blue-200">Chỉ số điện</th>
                          <th className="border border-gray-300 px-4 py-2 hover:bg-blue-200">Chỉ số nước</th>
                          <th className="border border-gray-300 px-4 py-2 hover:bg-blue-200">Ngày cập nhật</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              Đang tải dữ liệu...
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-red-500">
                              Lỗi: {error.message}
                            </td>
                          </tr>
                        ) : rooms.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              Không có dữ liệu
                            </td>
                          </tr>
                        ) : (
                          rooms.map((room: RoomWithMeterReading) => (
                            <tr key={room._id}>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                <Input type="checkbox" />
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{room.building?.name || "-"}</td>
                              <td className="border border-gray-300 px-4 py-2">{room.number || "-"}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    defaultValue={room.meterReading?.electricityReading || ""}
                                    className="w-full border-0 focus:ring-0 rounded-none bg-transparent"
                                  />
                                ) : (
                                  room.meterReading?.electricityReading || "-"
                                )}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    defaultValue={room.meterReading?.waterReading || ""}
                                    className="w-full border-0 focus:ring-0 rounded-none bg-transparent"
                                  />
                                ) : (
                                  room.meterReading?.waterReading || "-"
                                )}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {room.meterReading?.createdAt ? new Date(room.meterReading.createdAt).toLocaleDateString("vi-VN") : "-"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD CONTENT */}
            {activeTab === "dashboard" && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Tổng số phòng</h3>
                    <p className="text-slate-600">Số lượng phòng đã được quản lý</p>
                    <div className="text-3xl font-bold text-blue-600 mt-2">{rooms.length}</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Tổng điện tiêu thụ</h3>
                    <p className="text-slate-600">Tổng kWh điện trong tháng</p>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      {rooms.reduce((sum: number, room: RoomWithMeterReading) => sum + (room.meterReading?.electricityReading || 0), 0)} kWh
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Tổng nước tiêu thụ</h3>
                    <p className="text-slate-600">Tổng m³ nước trong tháng</p>
                    <div className="text-3xl font-bold text-blue-600 mt-2">
                      {rooms.reduce((sum: number, room: RoomWithMeterReading) => sum + (room.meterReading?.waterReading || 0), 0)} m³
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Statistics;