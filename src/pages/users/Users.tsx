import * as Tooltip from '@radix-ui/react-tooltip';
import { Building2, Check, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import { useUpdateUserMutation } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/constants/appConstants';
import { maxItemPerPage } from '@/pages/payment/paymentConstants';
import useUserData from '@/pages/users/data/useUserData';
import CreateUser from '@/pages/users/dialog/CreateUser';
import type { UserResponse } from '@/types/user';

const getRoleLabel = (role: UserRole) => {
  const labels: Record<UserRole, string> = {
    1: 'Admin',
    2: 'Quản lý',
    0: 'Chưa gắn role',
  };
  return labels[role] || role;
};
const UsersPage = () => {
  const data = useUserData();
  const updateUserMutation = useUpdateUserMutation();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const users = data.users;

  const pagination = data.userPaginate;

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

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectedUser = users.find((u) => u._id === selectedUserId);

  useEffect(() => {
    if (users.length === 0) {
      setSelectedUserId(null);
      return;
    }

    const isSelectedUserExist = users.some((u) => u._id === selectedUserId);

    if (!isSelectedUserExist) {
      setSelectedUserId(users[0]._id);
    }
  }, [users, selectedUserId]);

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

  const handlePromoteRole = (user: UserResponse) => {
    let nextRole = user.role;

    switch (user.role) {
      case UserRole.noRole:
        nextRole = UserRole.manager;
        break;

      case UserRole.manager:
        nextRole = UserRole.admin;
        break;

      case UserRole.admin:
        return;
    }

    const formData = new FormData();
    formData.append('role', String(nextRole));

    updateUserMutation.mutate({
      userId: user._id,
      data: formData,
    });
  };

  const handleDemoteRole = (user: UserResponse) => {
    let nextRole = user.role;

    switch (user.role) {
      case UserRole.admin:
        nextRole = UserRole.manager;
        break;

      case UserRole.manager:
        nextRole = UserRole.noRole;
        break;

      case UserRole.noRole:
        return;
    }

    const formData = new FormData();
    formData.append('role', String(nextRole));

    updateUserMutation.mutate({
      userId: user._id,
      data: formData,
    });
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      1: 'bg-purple-100 text-purple-900',
      2: 'bg-blue-100 text-blue-900',
      0: 'bg-green-100 text-green-900',
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
        <Card className="lg:col-span-1 p-4 md:p-6 bg-white flex flex-col h-[calc(100vh-140px)]">
          <div className="flex justify-self-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Danh sách người dùng
            </h2>
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
              icon={<FaUserPlus className="w-4 h-4" />}
              onClick={() => setIsAddOpen(true)}
            />
          </div>
          <CreateUser isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

          <div className="grid grid-cols-1 gap-3 mb-4">
            <Input
              placeholder="Tìm theo tên..."
              value={data.searchCondition.name}
              onChange={(e) =>
                data.setSearchCondition((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <Input
              placeholder="Tìm theo email..."
              value={data.searchCondition.email}
              onChange={(e) =>
                data.setSearchCondition((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <Input
              placeholder="Tìm theo số điện thoại..."
              value={data.searchCondition.phone}
              onChange={(e) =>
                data.setSearchCondition((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col flex-1 min-h-0 space-y-2">
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedUserId === user._id
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* User Info */}
                    <button
                      onClick={() => setSelectedUserId(user._id)}
                      className="flex-1 text-left"
                    >
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>

                      <div className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleColor(
                            user.role,
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </button>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <Button
                              size="icon-sm"
                              variant={'outline'}
                              onClick={() => handlePromoteRole(user)}
                              disabled={user.role === UserRole.admin}
                            >
                              <MdKeyboardArrowUp fontSize="small" />
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="w-full whitespace-normal wrap-break-word rounded-md border-4 border-blue-700 bg-white/85 text-blue-900 px-3 py-2 text-xs shadow-md z-10"
                              side="top"
                            >
                              <p className="text-sm text-slate-600">Nâng role</p>
                              <Tooltip.Arrow className="fill-blue-700" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>

                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <Button
                              size="icon-sm"
                              variant={'outline'}
                              onClick={() => handleDemoteRole(user)}
                              disabled={user.role === UserRole.noRole}
                            >
                              <MdKeyboardArrowDown fontSize="small" />
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="w-full whitespace-normal wrap-break-word rounded-md border-4 border-blue-700 bg-white/85 text-blue-900 px-3 py-2 text-xs shadow-md z-10"
                              side="bottom"
                            >
                              <p className="text-sm text-slate-600">Hạ role</p>
                              <Tooltip.Arrow className="fill-blue-700" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-slate-600">
                  {(data.currentPage - 1) * maxItemPerPage + 1} -{' '}
                  {Math.min(data.currentPage * maxItemPerPage, pagination.total)} /{' '}
                  {pagination.total}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => data.setCurrentPage((prev) => prev - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Trước
                  </Button>

                  <span className="text-sm text-slate-600">
                    {data.currentPage} / {pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => data.setCurrentPage((prev) => prev + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* User Details and Building Assignment */}
        <Card className="lg:col-span-2 p-4 md:p-6 bg-white h-[calc(100vh-140px)] overflow-y-auto">
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
              {/* {selectedUser.assignedBuildings && selectedUser.assignedBuildings.length > 0 && (
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
              )} */}

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

              {/* {getAvailableBuildings().length === 0 &&
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
                )} */}
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
