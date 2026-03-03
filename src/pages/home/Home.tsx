import { queryClient } from '@/lib/reactQuery';
import { ArrowRight, LogOut } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetBuildingQueries } from '@/api/building';
import { useGetPaymentByUserId } from '@/api/payment';
import { useGetRoomsQueries } from '@/api/room';
import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocalStorageKey, Path, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { useMobile } from '@/hooks/useMobile';
import {
  getPaymentStatus,
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
  const { show, hide } = useLoading();

  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError } = useUserQuery(userId, !!userId);
  const getBuildings = useGetBuildingQueries();
  const getRooms = useGetRoomsQueries();
  const getPayment = useGetPaymentByUserId(userId, !!userId);

  const handleNavigate = (path: string) => navigator(path);

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();
    navigator(Path.login, { replace: true });
  }, [navigator]);

  useEffect(() => {
    if (isLoading && getBuildings.isLoading && getRooms.isLoading && getPayment.isLoading) {
      show();
    } else {
      hide();
    }
  }, [isLoading, show, hide, getBuildings.isLoading, getRooms.isLoading, getPayment.isLoading]);

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      handleLogout();
    }
  }, [isLoading, isError, user, handleLogout]);

  if (!user) {
    return null;
  }

  const isOwner = user.role === UserRole.admin;

  const navigationItems = isOwner ? ownerListFunctions : tenantListFunctions;

  const infomations: Infomation[] = [
    { label: 'Email', value: user.email },
    isOwner
      ? { label: 'Số tòa nhà', value: getBuildings.data?.pagination.total.toString() ?? '0' }
      : { label: 'Toà nhà', value: getPayment.data?.roomId.buildingId.name ?? '' },
    isOwner
      ? { label: 'Tổng số phòng', value: getRooms.data?.pagination.total.toString() ?? '0' }
      : { label: 'Phòng', value: getPayment.data?.roomId.number ?? '0' },
    !isOwner
      ? { label: 'Tình trạng tiền', value: getPaymentStatus(getPayment.data?.status) }
      : { label: '', value: '' },
  ];

  const renderInfomationCards = () => {
    return infomations.map((info, index) => {
      if (info.label === '') {
        return null;
      }

      return (
        <div
          key={info.label + index}
          className="bg-linear-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200"
        >
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
                  onClick={() => {
                    if (!isOwner) {
                      navigator(`/${Path.payments}/${getPayment.data?._id}`);
                    } else {
                      handleNavigate(item.path);
                    }
                  }}
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
