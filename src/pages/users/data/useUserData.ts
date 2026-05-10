import { useEffect, useMemo, useState } from 'react';

import { useGetBuildingQueries } from '@/api/building';
import { useUsersQuery } from '@/api/user';
import { maxItemPerPage } from '@/pages/payment/paymentConstants';

const useUserData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCondition, setSearchCondition] = useState({
    email: '',
    name: '',
    phone: '',
  });
  const [debouncedSearch, setDebouncedSearch] = useState(searchCondition);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchCondition);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchCondition]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const userQuery = useUsersQuery({
    limit: maxItemPerPage,
    page: currentPage,
    searchCondition: debouncedSearch,
  });

  const buildingsQuery = useGetBuildingQueries();

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

  const buildings = useMemo(() => buildingsQuery.data ?? [], [buildingsQuery.data]);

  const isLoading = userQuery.isLoading || buildingsQuery.isLoading;

  const isError = userQuery.isError || buildingsQuery.isError;

  return {
    isLoading,
    isError,

    users,
    userPaginate,
    buildings,

    currentPage,
    setCurrentPage,

    searchCondition,
    setSearchCondition,
  };
};

export default useUserData;
