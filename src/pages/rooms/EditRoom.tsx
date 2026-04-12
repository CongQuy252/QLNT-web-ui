import { ArrowLeft, Edit, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery, useUpdateRoomMutation } from '@/api/room';
import { useNonTenantUsersQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getStatusLabel } from '@/pages/rooms/roomConstants';
import { type Member, ROOMSTATUS, type Room } from '@/types/room';
import { formatNumber, parseNumber } from '@/utils/utils';

import AddMemberDialog from './components/AddMemberDialog';

const EditRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const { data: roomData, isLoading, error } = useGetRoomByIdQuery(roomId || '', !!roomId);
  const { data: usersData, isLoading: usersLoading } = useNonTenantUsersQuery({}, true);
  const users = usersData?.data || [];
  const updateRoomMutation = useUpdateRoomMutation();

  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (roomData?.room) {
      const room = roomData.room;
      const convertedRoom: Room = {
        _id: room._id,
        number: room.number,
        buildingId: typeof room.buildingId === 'string' ? room.buildingId : room.buildingId._id,
        buildingName: typeof room.buildingId === 'object' ? room.buildingId.name : undefined,
        area: room.area,
        status: room.status,
        price: room.price,
        electricityUnitPrice: room.electricityUnitPrice,
        waterPricePerPerson: room.waterPricePerPerson,
        waterPricePerCubicMeter: room.waterPricePerCubicMeter,
        parkingFee: room.parkingFee,
        livingFee: room.livingFee,
        deposit: room.deposit,
        members: room.members,
        description: room.description,
        isDeleted: room.isDeleted,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      };
      setEditRoom(convertedRoom);
    }
  }, [roomData]);

  const handleUpdateRoom = () => {
    if (!editRoom || !roomId) return;

    const roomData = {
      number: editRoom.number,
      buildingId: editRoom.buildingId,
      status: editRoom.status,
      area: editRoom.area,
      price: editRoom.price,
      electricityUnitPrice: editRoom.electricityUnitPrice,
      waterPricePerPerson: editRoom.waterPricePerPerson,
      waterPricePerCubicMeter: editRoom.waterPricePerCubicMeter,
      parkingFee: editRoom.parkingFee,
      livingFee: editRoom.livingFee,
      deposit: editRoom.deposit,
      members: editRoom.members.map((member) => ({
        userId: member.userId || '',
        name: member.name,
        phone: member.phone,
        licensePlate: member.licensePlate,
        cccdImages: member.cccdImages,
        isRepresentative: member.isRepresentative,
      })),
      description: editRoom.description,
    };

    updateRoomMutation.mutate(
      { id: roomId, data: roomData },
      {
        onSuccess: () => {
          navigate('/rooms');
        },
      },
    );
  };

  const handleAddMember = (memberData: Member) => {
    if (!editRoom) return;

    if (editingMemberIndex !== undefined) {
      // Edit existing member
      const updatedMembers = [...editRoom.members];
      updatedMembers[editingMemberIndex] = { ...memberData };
      setEditRoom({ ...editRoom, members: updatedMembers });
    } else {
      // Add new member
      setEditRoom({
        ...editRoom,
        members: [...editRoom.members, { ...memberData }],
      });
    }

    // Reset editing state
    setEditingMember(null);
    setEditingMemberIndex(undefined);
  };

  const handleEditMember = (member: Member, index: number) => {
    setEditingMember(member);
    setEditingMemberIndex(index);
    setIsAddMemberOpen(true);
  };

  const handleOpenAddMember = () => {
    setEditingMember(null);
    setEditingMemberIndex(undefined);
    setIsAddMemberOpen(true);
  };

  const handleSelectRepresentative = (userId: string) => {
    const selectedUser = users.find((user) => user._id === userId);
    if (selectedUser && editRoom) {
      const newMember: Member = {
        userId: selectedUser._id,
        name: selectedUser.name,
        phone: selectedUser.phone,
        licensePlate: '',
        cccdImages: {
          front: { url: '', publicId: '' },
          back: { url: '', publicId: '' },
        },
        isRepresentative: true,
      };
      setEditRoom({
        ...editRoom,
        members: [...editRoom.members, newMember],
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (error || !editRoom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Error loading room data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-row items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/rooms')}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Phòng {editRoom.number}</h1>
            <p className="text-slate-600 mt-1">Cập nhật thông tin và thành viên phòng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Thông tin cơ bản</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Tên phòng</Label>
                  <Input
                    placeholder="VD: 101, 102..."
                    value={editRoom.number || ''}
                    onChange={(e) => setEditRoom({ ...editRoom, number: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Trạng thái</Label>
                  <Select
                    value={editRoom.status ?? ROOMSTATUS.AVAILABLE}
                    onValueChange={(value) =>
                      setEditRoom({ ...editRoom, status: value as ROOMSTATUS })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {editRoom.members.length === 0 && (
                        <SelectItem value={ROOMSTATUS.AVAILABLE}>
                          {getStatusLabel(ROOMSTATUS.AVAILABLE)}
                        </SelectItem>
                      )}
                      <SelectItem value={ROOMSTATUS.MAINTENANCE}>
                        {getStatusLabel(ROOMSTATUS.MAINTENANCE)}
                      </SelectItem>
                      <SelectItem value={ROOMSTATUS.OCCUPIED}>
                        {getStatusLabel(ROOMSTATUS.OCCUPIED)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Diện tích (m²)</Label>
                    <Input
                      type="number"
                      min="5"
                      max="100"
                      value={editRoom.area || 0}
                      onChange={(e) => setEditRoom({ ...editRoom, area: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Giá phòng</Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom.price || 0)}
                      onChange={(e) =>
                        setEditRoom({ ...editRoom, price: parseNumber(e.target.value) ?? 0 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Mô tả</Label>
                  <Textarea
                    placeholder="Mô tả chi tiết về phòng..."
                    value={editRoom.description || ''}
                    onChange={(e) => setEditRoom({ ...editRoom, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                    rows={4}
                    maxLength={500}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Cấu hình giá dịch vụ</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Giá điện (VNĐ/kWh)</Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom.electricityUnitPrice || 0)}
                      onChange={(e) =>
                        setEditRoom({
                          ...editRoom,
                          electricityUnitPrice: parseNumber(e.target.value) ?? 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Phí sinh hoạt (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom.livingFee || 0)}
                      onChange={(e) =>
                        setEditRoom({ ...editRoom, livingFee: parseNumber(e.target.value) ?? 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Gửi xe (VNĐ/tháng)</Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom.parkingFee || 0)}
                      onChange={(e) =>
                        setEditRoom({ ...editRoom, parkingFee: parseNumber(e.target.value) ?? 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Tiền cọc (VNĐ)</Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom.deposit || 0)}
                      onChange={(e) =>
                        setEditRoom({ ...editRoom, deposit: parseNumber(e.target.value) ?? 0 })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Gia nuoc (VNÐ/nguoi)
                    </Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom.waterPricePerPerson || 0)}
                      onChange={(e) => {
                        const value = parseNumber(e.target.value) ?? 0;
                        setEditRoom({
                          ...editRoom,
                          waterPricePerPerson: value,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Gia nuoc (VNÐ/m³)</Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom.waterPricePerCubicMeter || 0)}
                      onChange={(e) => {
                        const value = parseNumber(e.target.value) ?? 0;
                        setEditRoom({
                          ...editRoom,
                          waterPricePerCubicMeter: value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Members */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Thanh vien ({editRoom.members.length})
                </h2>
                <Button
                  size="sm"
                  onClick={handleOpenAddMember}
                  className="text-slate-700 border-slate-300 bg-white hover:bg-slate-50 h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                </Button>
              </div>

              {/* Chọn người đại diện */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Chọn người đại diện nhanh
                </Label>
                <Select onValueChange={handleSelectRepresentative} disabled={usersLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người đại diện..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} - {user.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editRoom.members.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {editRoom.members.map((member, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-slate-900">{member.name}</p>
                            {member.isRepresentative && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                Đại diện
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{member.phone}</p>
                          {member.licensePlate && (
                            <p className="text-xs text-slate-500">Biển số: {member.licensePlate}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditMember(member, index)}
                            className="h-8 w-8 p-0 text-slate-600 hover:text-slate-700"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updatedMembers = editRoom.members.filter((_, i) => i !== index);
                              setEditRoom({ ...editRoom, members: updatedMembers });
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-sm mb-1">Chưa có thành viên nào</p>
                  <p className="text-xs">Nhấn "Thêm" để bắt đầu</p>
                </div>
              )}
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={handleUpdateRoom}
                  disabled={updateRoomMutation.isPending}
                >
                  {updateRoomMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật phòng'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-slate-700 border-slate-300"
                  onClick={() => navigate('/rooms')}
                >
                  Hủy
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
        editingMember={editingMember}
      />
    </div>
  );
};

export default EditRoom;
