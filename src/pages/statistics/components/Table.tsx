import { Input } from '@/components/ui/input';
import type { RoomWithMeterReading } from '@/types/room';

type Props = {
  rooms: RoomWithMeterReading[];
  isLoading: boolean;
  error: Error | null;
  isEditing: boolean;
  editedValues: Record<string, { electricity: number; water: number }>;
  onChange: (roomId: string, field: 'electricity' | 'water', value: string) => void;
  haveCheckBoxColumn?: boolean;
  selectedMonth: number;
  selectedYear: number;
};

const MeterReadingTable = ({
  rooms,
  isLoading,
  error,
  isEditing,
  editedValues,
  onChange,
  haveCheckBoxColumn = false,
  selectedMonth,
  selectedYear,
}: Props) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const isEditable = (
    readingMonth?: number,
    readingYear?: number,
    month?: number,
    year?: number,
  ) => {
    if (!month || !year) return false;

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const isAllowedMonth =
      (month === currentMonth && year === currentYear) ||
      (month === prevMonth && year === prevYear);

    if (!isAllowedMonth) return false;

    if (!readingMonth || !readingYear) return true;

    return readingMonth === month && readingYear === year;
  };

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-y-auto max-h-99 overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-blue-200">
            <tr>
              {haveCheckBoxColumn && (
                <th className="border px-4 py-2 w-10">
                  <Input type="checkbox" />
                </th>
              )}
              <th className="border px-4 py-2">Tên toà nhà</th>
              <th className="border px-4 py-2">Tên phòng</th>
              <th className="border px-4 py-2">Chỉ số điện</th>
              <th className="border px-4 py-2">Chỉ số nước</th>
              <th className="border px-4 py-2">Tháng</th>
              <th className="border px-4 py-2">Năm</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={haveCheckBoxColumn ? 7 : 6} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={haveCheckBoxColumn ? 7 : 6} className="text-center py-4 text-red-500">
                  Lỗi: {error.message}
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={haveCheckBoxColumn ? 7 : 6} className="text-center py-4">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              rooms.map((room) => {
                const canEdit = isEditable(
                  room.meterReading?.month,
                  room.meterReading?.year,
                  selectedMonth,
                  selectedYear,
                );

                return (
                  <tr key={room._id} className={!canEdit ? 'bg-gray-100' : ''}>
                    {haveCheckBoxColumn && (
                      <td className="border px-4 py-2 text-center">
                        <Input type="checkbox" disabled={!canEdit} />
                      </td>
                    )}
                    <td className="border px-4 py-2">
                      <div className="break-normal">{room.building?.name || '-'}</div>
                    </td>

                    <td className="border px-4 py-2 max-w-xs">
                      <div
                        className="truncate overflow-hidden whitespace-nowrap"
                        title={room.number || '-'}
                      >
                        {room.number || '-'}
                      </div>
                    </td>

                    <td className="border px-4 py-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          disabled={!canEdit}
                          value={
                            editedValues[room._id]?.electricity ??
                            room.meterReading?.electricityReading ??
                            ''
                          }
                          onChange={(e) => onChange(room._id, 'electricity', e.target.value)}
                          className={`w-full border-0 bg-transparent ${
                            !canEdit ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={!canEdit ? 'Chỉ được sửa tháng hiện tại' : ''}
                        />
                      ) : (
                        room.meterReading?.electricityReading || '-'
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          disabled={!canEdit}
                          value={
                            editedValues[room._id]?.water ?? room.meterReading?.waterReading ?? ''
                          }
                          onChange={(e) => onChange(room._id, 'water', e.target.value)}
                          className={`w-full border-0 bg-transparent ${
                            !canEdit ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={!canEdit ? 'Chỉ được sửa tháng hiện tại' : ''}
                        />
                      ) : (
                        room.meterReading?.waterReading || '-'
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {room.meterReading?.month || '-'}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {room.meterReading?.year || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeterReadingTable;
