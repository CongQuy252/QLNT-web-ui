import { ArrowRight, LogOut, Menu } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { LocalStorageKey, UserRole } from '@/constants/appConstants';
import { useMobile } from '@/hooks/useMobile';
import { ownerIcon, ownerListFunctions, tenantListFunctions } from '@/pages/home/HomeContants';

const HomeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();

  const [open, setOpen] = useState(false);

  const userId = localStorage.getItem(LocalStorageKey.userId);

  const { data: user, isLoading } = useUserQuery(userId!, !!userId);

  const isReady = !!userId && !!user && !isLoading;

  const navigationItems = useMemo(() => {
    if (!isReady) return [];

    return user.role === UserRole.admin ? ownerListFunctions : tenantListFunctions;
  }, [isReady, user]);

  const updatedNavigationItems = useMemo(() => {
    if (!navigationItems.length) return [];

    if (navigationItems.some((i) => i.path === '/')) {
      return navigationItems;
    }

    return [
      ...navigationItems,
      {
        rowId: '1',
        title: 'Home',
        description: 'Xem danh sách phòng, trạng thái, giá thuê',
        icon: FaHome,
        path: '/',
        color: 'from-blue-500 to-blue-600',
      },
    ];
  }, [navigationItems]);

  if (!isReady) return null;

  // ⬇️ Lúc này user chắc chắn tồn tại
  const isOwner = user.role === UserRole.admin;

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`
    fixed md:static z-50
    w-72 h-full bg-white border-r border-slate-200 flex flex-col
    transition-transform duration-300 ease-in-out
    ${isMobile ? (open ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
  `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">RoomHub</h1>
          <p className="text-sm text-slate-600">
            {isOwner ? ownerIcon.owner : ownerIcon.tenant} {isOwner ? 'Chủ nhà' : 'Người thuê'}
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {updatedNavigationItems
            .sort((a, b) => a.rowId.localeCompare(b.rowId))
            .map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname === item.path || location.pathname.startsWith(item.path + '/');

              return (
                <button
                  key={item.rowId}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setOpen(false);
                  }}
                  className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-slate-300 transition ${isActive ? 'bg-slate-300' : 'hover:bg-slate-300'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-linear-to-br ${item.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">{item.title}</span>
                  <ArrowRight className="ml-auto w-4 h-4 text-slate-400" />
                </button>
              );
            })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              navigate('/login');
            }}
            icon={<LogOut className="w-4 h-4" />}
          >
            Đăng xuất
          </Button>
        </div>
      </aside>

      {isMobile && open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* CONTENT */}
      <main className="flex-1 h-full p-6 overflow-y-auto overflow-x-hidden">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mb-4" onClick={() => setOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default HomeSidebar;
