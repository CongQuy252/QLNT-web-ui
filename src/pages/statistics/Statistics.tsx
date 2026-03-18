import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMeterReadings } from "@/api/meterReading";
import type { IMeterReading } from "@/types/meterReading";

const Statistics = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // API call to get meter readings
  const { data: meterReadingsData, isLoading, error } = useMeterReadings(
    selectedRoom,
    selectedBuilding,
    selectedMonth
  );

  const meterReadings = meterReadingsData?.meterReadings || [];

  // Debug log to check data
  console.log('Meter readings data:', meterReadingsData);
  console.log('Meter readings array:', meterReadings);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Thống kê chỉ số điện nước
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">

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

            {/* RIGHT ACTION */}
            <div className="flex items-end gap-4">

              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  console.log("Save:", {
                    building: selectedBuilding,
                    room: selectedRoom,
                    month: selectedMonth,
                  });
                }}
              >
                Lưu
              </Button>

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

            </div>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <Table className="border border-gray-300">

              <TableHeader>
                <TableRow className="bg-blue-200">

                  <TableHead className="border w-10 text-center">
                    <Input type="checkbox" />
                  </TableHead>

                  <TableHead className="border">Tên phòng</TableHead>
                  <TableHead className="border">Tên tòa nhà</TableHead>
                  <TableHead className="border">Chỉ số điện</TableHead>
                  <TableHead className="border">Chỉ số nước</TableHead>
                  <TableHead className="border">Ngày cập nhật</TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-red-500">
                      Lỗi: {error.message}
                    </TableCell>
                  </TableRow>
                ) : meterReadings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  meterReadings.map((reading: IMeterReading) => (
                    <TableRow key={reading._id}>
                      <TableCell className="border text-center">
                        <Input type="checkbox" />
                      </TableCell>
                      <TableCell className="border">{reading.roomId?.number || "-"}</TableCell>
                      <TableCell className="border">{reading.roomId?.buildingId || "-"}</TableCell>
                      <TableCell className="border">{reading.electricityReading || "-"}</TableCell>
                      <TableCell className="border">{reading.waterReading || "-"}</TableCell>
                      <TableCell className="border">
                        {reading.createdAt ? new Date(reading.createdAt).toLocaleDateString("vi-VN") : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Statistics;