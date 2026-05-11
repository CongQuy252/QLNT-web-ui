import { useEffect, useMemo, useState } from 'react';

import { useGetBuildingQueries } from '@/api/building';
import { useUsersQuery } from '@/api/user';
import { maxItemPerPage } from '@/pages/payment/paymentConstants';

const useUserData = () => {
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [searchCondition, setSearchCondition] = useState({
    email: '',
    name: '',
    phone: '',
  });
  const [debouncedSearch, setDebouncedSearch] = useState(searchCondition);

  const userQuery = useUsersQuery({
    limit: maxItemPerPage,
    page: currentUserPage,
    searchCondition: debouncedSearch,
  });

  const users = useMemo(() => userQuery.data?.data ?? [], [userQuery.data]);

  const userPaginate = useMemo(
    () =>
      userQuery.data?.pagination ?? {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    [userQuery.data],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchCondition);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchCondition]);

  useEffect(() => {
    setCurrentUserPage(1);
  }, [debouncedSearch]);

  //============================================
  const [currentBuildingPage, setCurrentBuildingPage] = useState(1);
  const buildingsQuery = useGetBuildingQueries({
    limit: maxItemPerPage,
    page: currentBuildingPage,
    searchCondition: debouncedSearch,
  });
  const buildings = useMemo(() => buildingsQuery.data?.data ?? [], [buildingsQuery.data]);

  const buildingPaginate = useMemo(
    () =>
      buildingsQuery.data?.pagination ?? {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    [buildingsQuery.data],
  );

  const isLoading = userQuery.isLoading || buildingsQuery.isLoading;
  const isError = userQuery.isError || buildingsQuery.isError;

  return {
    isLoading,
    isError,
    users,
    userPaginate,
    buildings,
    currentUserPage,
    setCurrentUserPage,
    searchCondition,
    setSearchCondition,

    buildingPaginate,
    currentBuildingPage,
    setCurrentBuildingPage,
  };
};

export default useUserData;
