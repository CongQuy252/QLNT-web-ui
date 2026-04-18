import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  limit: number;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  totalPages?: number;
}

interface UsePaginationReturn extends PaginationState {
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetPagination: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
  totalPages,
}: UsePaginationOptions = {}): UsePaginationReturn => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
  });

  const nextPage = useCallback(() => {
    if (totalPages === undefined || pagination.page < totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, totalPages]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  }, [pagination.page]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && (totalPages === undefined || page <= totalPages)) {
      setPagination(prev => ({ ...prev, page }));
    }
  }, [totalPages]);

  const setLimit = useCallback((limit: number) => {
    if (limit > 0) {
      setPagination(prev => ({ ...prev, limit, page: 1 }));
    }
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({ page: initialPage, limit: initialLimit });
  }, [initialPage, initialLimit]);

  const canGoNext = totalPages === undefined || pagination.page < totalPages;
  const canGoPrev = pagination.page > 1;

  return {
    page: pagination.page,
    limit: pagination.limit,
    nextPage,
    prevPage,
    goToPage,
    setLimit,
    resetPagination,
    canGoNext,
    canGoPrev,
  };
};

export type { UsePaginationOptions, UsePaginationReturn };
