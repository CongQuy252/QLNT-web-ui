import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { getInvoices } from '@/api/invoice';

interface InvoiceFilters {
  month?: number;
  year?: number;
  buildingId?: string;
  roomId?: string;
  status?: string;
  page: number;
  limit: number;
}

// Custom hook for invoices list with pagination and filters
export const useInvoices = (initialFilters: Partial<InvoiceFilters> = {}) => {
  const [filters, setFilters] = useState<InvoiceFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  // Query for invoices data
  const {
    data: invoicesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => getInvoices(filters),
    enabled: true, // Always enabled since month/year are optional
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<InvoiceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Update page
  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Reset to first page when filters change (except page itself)
  const updateFiltersWithPageReset = useCallback((newFilters: Partial<InvoiceFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  return {
    // Data
    invoices: invoicesData?.invoices || [],
    pagination: invoicesData?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: filters.limit,
      hasNextPage: false,
      hasPrevPage: false,
    },

    // Loading states
    isLoading,
    error,

    // Current filters
    filters,

    // Actions
    updateFilters,
    updateFiltersWithPageReset,
    setPage,
    refetch,
  };
};
