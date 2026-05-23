import { queryClient } from '@/lib/reactQuery';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserByIdQuery } from '@/api/user';
import { LocalStorageKey, Path, UserRole } from '@/constants/appConstants';

export const useAuthUser = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem(LocalStorageKey.userId) ?? undefined;

  const { data: user, isLoading, isError, ...query } = useUserByIdQuery(userId, !!userId);

  const handleLogout = useCallback(() => {
    queryClient.clear();
    localStorage.clear();

    navigate(Path.login, {
      replace: true,
    });
  }, [navigate]);

  useEffect(() => {
    if (!isLoading && isError) {
      handleLogout();
    }
  }, [handleLogout, isError, isLoading]);

  const isAdmin = useMemo(() => {
    return user?.role === UserRole.admin;
  }, [user?.role]);

  const isManager = useMemo(() => {
    return user?.role === UserRole.manager;
  }, [user?.role]);

  return {
    userId,
    user,
    isAdmin,
    isManager,
    isLoading,
    isError,
    logout: handleLogout,
    ...query,
  };
};
