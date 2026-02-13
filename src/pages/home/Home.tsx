import { ArrowRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Path } from '@/constants/appConstants';
import { useMobile } from '@/hooks/useMobile';
import {
  ownerIcon,
  ownerListFunctions,
  tenantListFunctions,
  welcomeMessages,
} from '@/pages/home/HomeContants';

import styles from './Home.module.css';

export interface Infomation {
  label: string;
  value: string;
}

const Home = () => {
  const navigator = useNavigate();
  const isMobile = useMobile();

  const userId = localStorage.getItem('UserId') ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId);

  const handleNavigate = (path: string) => {
    navigator(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('UserId');
    localStorage.removeItem('token');
    navigator(Path.login);
  };

  // Loading state
  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // Error state
  if (isError || !user) {
    return <div className="p-10 text-center text-red-500">Không tải được thông tin user</div>;
  }

  const isOwner = user.role === 1;

  const navigationItems = isOwner ? ownerListFunctions : tenantListFunctions;

  const infomations: Infomation[] = [
    { label: 'Email', value: user.email },
    isOwner ? { label: 'Số tòa nhà', value: '100' } : { label: 'Toà nhà', value: '1' },
    isOwner ? { label: 'Tổng số phòng', value: '1816' } : { label: 'Số phòng', value: '101' },
    !isOwner ? { label: 'Tình trạng tiền', value: 'Đã thanh toán' } : { label: '', value: '' },
  ];

  const sumaryInfomations: Infomation[] = [
    { label: 'Phòng trống', value: '12' },
    { label: 'Phòng cho thuê', value: '172' },
    { label: 'Thanh toán chờ xử lý', value: '8' },
    { label: 'Doanh thu tháng này', value: '847.5M' },
  ];

  const renderSumaryCards = () => {
    return sumaryInfomations.map((info) => {
      return (
        <Card className="p-6 border-0">
          <p className="text-sm text-slate-600 mb-2">{info.label}</p>
          <p className="text-3xl font-bold text-slate-900">{info.value}</p>
        </Card>
      );
    });
  };

  const renderInfomationCards = () => {
    return infomations.map((info) => {
      if (info.label === '') {
        return null;
      }

      return (
        <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">{info.label}</p>
          <p className="font-semibold text-slate-900 break-all">{info.value}</p>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.headerContainer}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">RoomHub</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 bg-transparent"
              icon={<LogOut className="w-4 h-4" />}
            >
              <div className="flex gap-3 items-center">
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
                <h2 className={`text-base sm:text-3xl font-bold text-slate-900 mb-2`}>
                  {welcomeMessages()} {user.name}!
                </h2>
                <p className="text-slate-600 text-base sm:text-lg">
                  {isOwner
                    ? 'Quản lý các tòa nhà và phòng trọ của bạn'
                    : 'Xem thông tin phòng và quản lý thanh toán'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold text-slate-900`}>
                  {isOwner
                    ? `${ownerIcon.owner} ${isMobile ? '' : 'Chủ nhà'}`
                    : `${ownerIcon.tenant} ${isMobile ? '' : 'Người thuê'}`}
                </p>
              </div>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{renderInfomationCards()}</div>
          </div>
        </div>

        {/* Quick Stats */}
        {isOwner && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Tóm tắt tình hình</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{renderSumaryCards()}</div>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {isOwner ? 'Chức năng quản lý' : 'Chức năng người thuê'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isLastOdd =
                navigationItems.length % 2 === 1 && index === navigationItems.length - 1;

              return (
                <Card
                  key={item.path}
                  className={`w-full group overflow-hidden cursor-pointer ${isLastOdd ? 'md:col-span-2' : ''}`}
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
      </main>
    </div>
  );
};

export default Home;
