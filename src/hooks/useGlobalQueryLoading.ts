import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useLoading } from '@/hooks/useLoading';

export const useGlobalQueryLoading = () => {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const { show, hide } = useLoading();

  useEffect(() => {
    if (fetching + mutating > 0) show();
    else hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching, mutating]);
};
