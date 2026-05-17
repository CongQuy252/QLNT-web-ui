import { ArrowRight, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetBuildingQueries } from '@/api/building';
import { useGetRoomsQueries } from '@/api/room';
import LockCircleIcon from '@/assets/Icon/LockCircleIcon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ChangePasswordDialog from '@/components/ui/changePassword/ChangePasswordDialog';
import { useAuthUser } from '@/hooks/useCurrentUser';
import { useLoading } from '@/hooks/useLoading';
import { useMobile } from '@/hooks/useMobile';
import {
  managerListFunctions,
  ownerIcon,
  ownerListFunctions,
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
  const { user, isAdmin, isManager, isLoading, logout } = useAuthUser();

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const getBuildings = useGetBuildingQueries(
    { page: 0, limit: 100, searchCondition: { name: undefined, address: undefined } },
    !!user && isAdmin,
  );

  const getRooms = useGetRoomsQueries({
    isEnabled: !!user && isAdmin,
  });

  useEffect(() => {
    if (isLoading || getBuildings.isLoading || getRooms.isLoading) {
      show();
    } else {
      hide();
    }
  }, [isLoading, getBuildings.isLoading, getRooms.isLoading, show, hide]);

  if (!user) {
    return null;
  }

  const navigationItems = isAdmin ? ownerListFunctions : managerListFunctions;

  const infomations: Infomation[] = [
    { label: 'Email', value: user.email },
    { label: 'Số tòa nhà', value: user.assignBuilding.length.toString() ?? '0' },
    { label: 'Tổng số phòng', value: getRooms.data?.pagination.total.toString() ?? '0' },
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
              <img src="/logo.jpg" alt="logo" className="h-12 w-auto object-contain" />
              <h1 className="text-2xl font-bold text-slate-900">DEE HOME</h1>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsChangePasswordOpen(true)}
                variant="outline"
                className="gap-2 bg-transparent"
                icon={<LockCircleIcon className="w-4 h-4" />}
              />
              <Button
                onClick={logout}
                variant="outline"
                className="gap-2 bg-transparent"
                icon={<LogOut className="w-4 h-4" />}
              />
            </div>
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
                  {isAdmin
                    ? 'Quản lý các tòa nhà và phòng trọ của bạn'
                    : 'Xem thông tin phòng và quản lý thanh toán'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold text-slate-900`}>
                  {isAdmin
                    ? `${ownerIcon.owner} ${isMobile ? '' : 'Chủ nhà'}`
                    : isManager
                      ? `${ownerIcon.owner} ${isMobile ? '' : 'Quản lý'}`
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
            {isAdmin ? 'Chức năng quản lý' : 'Chức năng người thuê'}
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
                    navigator(item.path);
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

      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Home;
