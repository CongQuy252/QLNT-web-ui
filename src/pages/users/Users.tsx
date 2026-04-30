import { Building2, Check, Users, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const UsersPage = () => {
  const [users] = useState([
    {
      id: 'u1',
      name: 'Nguyễn Văn A',
      email: 'vana@example.com',
      phone: '0901234567',
      role: 'owner',
      assignedBuildings: ['b1', 'b2'],
    },
    {
      id: 'u2',
      name: 'Trần Thị B',
      email: 'thib@example.com',
      phone: '0912345678',
      role: 'manager',
      assignedBuildings: ['b3'],
    },
    {
      id: 'u3',
      name: 'Lê Văn C',
      email: 'vanc@example.com',
      role: 'tenant',
      assignedBuildings: [],
    },
  ]);
  const [buildings] = useState([
    {
      id: 'b1',
      name: 'Sunrise Building',
      address: '123 Nguyễn Huệ, Q1',
      totalRooms: 20,
      totalFloors: 5,
    },
    {
      id: 'b2',
      name: 'Green Tower',
      address: '456 Lê Lợi, Q1',
      totalRooms: 30,
      totalFloors: 8,
    },
    {
      id: 'b3',
      name: 'Blue Sky Residence',
      address: '789 Trần Hưng Đạo, Q5',
      totalRooms: 15,
      totalFloors: 4,
    },
    {
      id: 'b4',
      name: 'Golden Plaza',
      address: '101 Nguyễn Trãi, Q5',
      totalRooms: 40,
      totalFloors: 10,
    },
  ]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    users.length > 0 ? users[0].id : null,
  );
  const [searchTerm, setSearchTerm] = useState('');

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // const handleAssignBuilding = (buildingId: string) => {
  //   if (selectedUserId) {
  //     assignBuildingToUser(selectedUserId, buildingId);
  //     setSelectedUserId(selectedUserId);
  //   }
  // };

  // const handleRemoveBuilding = (buildingId: string) => {
  //   if (selectedUserId) {
  //     removeBuildingFromUser(selectedUserId, buildingId);
  //     setSelectedUserId(selectedUserId);
  //   }
  // };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Chủ nhà',
      manager: 'Quản lý',
      tenant: 'Người thuê',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'bg-purple-100 text-purple-900',
      manager: 'bg-blue-100 text-blue-900',
      tenant: 'bg-green-100 text-green-900',
    };
    return colors[role] || 'bg-slate-100 text-slate-900';
  };

  const getAvailableBuildings = () => {
    if (!selectedUser) return buildings;
    return buildings;
    // .filter((b) => !selectedUser.assignedBuildings?.includes(b.id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quản lý người dùng</h1>
        <p className="text-slate-600 mt-2">Quản lý người dùng và gán tòa nhà cho họ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <Card className="lg:col-span-1 p-4 md:p-6 bg-white">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Danh sách người dùng
          </h2>

          <div className="mb-4">
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedUserId === user.id
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-600">{user.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* User Details and Building Assignment */}
        <Card className="lg:col-span-2 p-4 md:p-6 bg-white">
          {selectedUser ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
                  Thông tin người dùng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Tên</p>
                    <p className="font-semibold text-slate-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-semibold text-slate-900 text-sm md:text-base break-all">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Số điện thoại</p>
                    <p className="font-semibold text-slate-900">{selectedUser.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Vai trò</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}
                    >
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Buildings Summary */}
              {selectedUser.assignedBuildings && selectedUser.assignedBuildings.length > 0 && (
                <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Tòa nhà đang quản lý ({selectedUser.assignedBuildings.length}):
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedUser.assignedBuildings.map((buildingId) => {
                      const building = buildings.find((b) => b.id === buildingId);
                      return building ? (
                        <div
                          key={buildingId}
                          className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-white rounded-lg border border-blue-200 gap-2 md:gap-0"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 text-sm md:text-base">
                              {building.name}
                            </p>
                            <p className="text-xs md:text-sm text-slate-600">
                              {building.totalRooms} phòng • {building.totalFloors} tầng
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full md:w-auto bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                            // onClick={() => handleRemoveBuilding(building.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Hủy gán
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Building Assignment - Only show available buildings */}
              {getAvailableBuildings().length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Gán tòa nhà
                  </h2>

                  <div className="space-y-3">
                    {getAvailableBuildings().map((building) => (
                      <div
                        key={building.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 gap-2 md:gap-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-sm md:text-base">
                            {building.name}
                          </p>
                          <p className="text-xs md:text-sm text-slate-600">{building.address}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {building.totalRooms} phòng • {building.totalFloors} tầng
                          </p>
                        </div>

                        <Button
                          size="sm"
                          className="w-full md:w-auto bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
                          // onClick={() => handleAssignBuilding(building.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Gán
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {getAvailableBuildings().length === 0 &&
                (!selectedUser.assignedBuildings ||
                  selectedUser.assignedBuildings.length === 0) && (
                  <div className="text-center py-6">
                    <p className="text-slate-600">Không có tòa nhà khả dụng để gán</p>
                  </div>
                )}

              {getAvailableBuildings().length === 0 &&
                selectedUser.assignedBuildings &&
                selectedUser.assignedBuildings.length > 0 && (
                  <div className="text-center py-4 text-slate-600 text-sm">
                    <p>Tất cả tòa nhà đã được gán cho người dùng này</p>
                  </div>
                )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-600">Chọn một người dùng để xem chi tiết</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;
