import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useLoading } from '@/hooks/useLoading';

export const useGlobalQueryLoading = () => {
  const { show, hide } = useLoading();

  const isLoading = useIsFetching() + useIsMutating() > 0;

  useEffect(() => {
    if (isLoading) {
      show();
    } else {
      hide();
    }
  }, [isLoading, show, hide]);
};
