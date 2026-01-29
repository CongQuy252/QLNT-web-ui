import { ArrowRight, BarChart3, CreditCard, DoorOpen, LogOut, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useAuth from '@/hooks/useAuth';

const Home = () => {
  const navigator = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigator('/login');
  };

  const handleNavigate = (path: string) => {
    navigator(path);
  };

  if (!user) {
    return null;
  }

  const isOwner = user.role === 'owner';

  const navigationItems = isOwner
    ? [
        {
          title: 'Quản lý Phòng',
          description: 'Xem danh sách phòng, trạng thái, giá thuê',
          icon: DoorOpen,
          path: '/dashboard/rooms',
          color: 'from-blue-500 to-blue-600',
        },
        {
          title: 'Quản lý Người Thuê',
          description: 'Thông tin người thuê, hợp đồng, liên hệ',
          icon: Users,
          path: '/dashboard/tenants',
          color: 'from-purple-500 to-purple-600',
        },
        {
          title: 'Thanh Toán',
          description: 'Theo dõi khoản thanh toán, doanh thu',
          icon: CreditCard,
          path: '/dashboard/payments',
          color: 'from-green-500 to-green-600',
        },
        {
          title: 'Thống Kê & Báo Cáo',
          description: 'Biểu đồ, phân tích, tỷ lệ chiếm dụng',
          icon: BarChart3,
          path: '/dashboard/statistics',
          color: 'from-orange-500 to-orange-600',
        },
      ]
    : [
        {
          title: 'Thông Tin Phòng',
          description: 'Xem thông tin phòng của bạn',
          icon: Home,
          path: '/dashboard',
          color: 'from-blue-500 to-blue-600',
        },
        {
          title: 'Thanh Toán Tiền Phòng',
          description: 'Xem và quản lý các khoản thanh toán',
          icon: CreditCard,
          path: '/dashboard/payments',
          color: 'from-green-500 to-green-600',
        },
      ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">RoomHub</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <div className="flex gap-3 items-center">
                <LogOut className="w-4 h-4" />
                <div>Đăng xuất</div>
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Xin chào, {user.name}!</h2>
                <p className="text-slate-600 text-lg">
                  {isOwner
                    ? 'Quản lý các tòa nhà và phòng trọ của bạn'
                    : 'Xem thông tin phòng và quản lý thanh toán'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Vai trò</p>
                <p className="text-lg font-semibold text-slate-900">
                  {isOwner ? '👤 Chủ nhà' : '🚪 Người thuê'}
                </p>
              </div>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Email</p>
                <p className="font-semibold text-slate-900 break-all">{user.email}</p>
              </div>
              {isOwner ? (
                <React.Fragment>
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Số tòa nhà</p>
                    <p className="text-2xl font-bold text-slate-900">5</p>
                  </div>
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Tổng số phòng</p>
                    <p className="text-2xl font-bold text-slate-900">186</p>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Số phòng</p>
                    <p className="text-2xl font-bold text-slate-900">101</p>
                  </div>
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Tình trạng tiền</p>
                    <p className="text-lg font-bold text-green-600">Đã thanh toán</p>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {isOwner ? 'Chức năng quản lý' : 'Chức năng người thuê'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.path}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 cursor-pointer"
                  onClick={() => handleNavigate(item.path)}
                >
                  <div className="p-6 space-y-4 h-full flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div
                        className={`w-12 h-12 rounded-lg bg-linear-to-br ${item.color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        {isOwner && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Tóm tắt tình hình</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 border-0">
                <p className="text-sm text-slate-600 mb-2">Phòng trống</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500 mt-2">6.5% tổng phòng</p>
              </Card>
              <Card className="p-6 border-0">
                <p className="text-sm text-slate-600 mb-2">Phòng cho thuê</p>
                <p className="text-3xl font-bold text-green-600">172</p>
                <p className="text-xs text-slate-500 mt-2">92.5% tổng phòng</p>
              </Card>
              <Card className="p-6 border-0">
                <p className="text-sm text-slate-600 mb-2">Thanh toán chờ xử lý</p>
                <p className="text-3xl font-bold text-orange-600">8</p>
                <p className="text-xs text-slate-500 mt-2">Tổng 24M VND</p>
              </Card>
              <Card className="p-6 border-0">
                <p className="text-sm text-slate-600 mb-2">Doanh thu tháng này</p>
                <p className="text-3xl font-bold text-blue-600">847.5M</p>
                <p className="text-xs text-slate-500 mt-2">Tăng 12% so tháng trước</p>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
