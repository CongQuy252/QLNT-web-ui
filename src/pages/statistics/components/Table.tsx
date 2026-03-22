import { Input } from '@/components/ui/input';
import type { RoomWithMeterReading } from '@/types/room';

type Props = {
  rooms: RoomWithMeterReading[];
  isLoading: boolean;
  error: any;
  isEditing: boolean;
  editedValues: Record<string, { electricity: number; water: number }>;
  onChange: (roomId: string, field: 'electricity' | 'water', value: string) => void;
  haveCheckBoxColumn?: boolean;
};

const MeterReadingTable = ({
  rooms,
  isLoading,
  error,
  isEditing,
  editedValues,
  onChange,
  haveCheckBoxColumn = false,
}: Props) => {
  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-y-auto max-h-70 overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-blue-200">
            <tr>
              {haveCheckBoxColumn && (
                <th className="border px-4 py-2 w-10">
                  <Input type="checkbox" />
                </th>
              )}

              <th className="border px-4 py-2">Tòa nhà</th>
              <th className="border px-4 py-2">Phòng</th>
              <th className="border px-4 py-2">Điện</th>
              <th className="border px-4 py-2">Nước</th>
              <th className="border px-4 py-2">Ngày</th>
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
              rooms.map((room) => (
                <tr key={room._id}>
                  {haveCheckBoxColumn && (
                    <td className="border px-4 py-2 text-center">
                      <Input type="checkbox" />
                    </td>
                  )}

                  <td className="border px-4 py-2">{room.building?.name || '-'}</td>

                  <td className="border px-4 py-2">{room.number || '-'}</td>

                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={
                          editedValues[room._id]?.electricity ??
                          room.meterReading?.electricityReading ??
                          ''
                        }
                        onChange={(e) => onChange(room._id, 'electricity', e.target.value)}
                        className="w-full border-0 bg-transparent"
                      />
                    ) : (
                      room.meterReading?.electricityReading || '-'
                    )}
                  </td>

                  <td className="border px-4 py-2">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={
                          editedValues[room._id]?.water ?? room.meterReading?.waterReading ?? ''
                        }
                        onChange={(e) => onChange(room._id, 'water', e.target.value)}
                        className="w-full border-0 bg-transparent"
                      />
                    ) : (
                      room.meterReading?.waterReading || '-'
                    )}
                  </td>

                  <td className="border px-4 py-2">
                    {room.meterReading?.createdAt
                      ? new Date(room.meterReading.createdAt).toLocaleDateString('vi-VN')
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeterReadingTable;
