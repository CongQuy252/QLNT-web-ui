/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { getBuildings, getInvoicePreview } from '@/api/invoice';

// Debounce function implementation
const useDebounce = (callback: Function, delay: number) => {
  const [debounceTimer, setDebounceTimer] = useState<any>(null);

  return useCallback(
    (...args: any[]) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      const newTimer = setTimeout(() => callback(...args), delay);
      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer],
  );
};

// Custom hook for invoice preview with debounced filters
export const useInvoicePreview = () => {
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    buildingId: 'all',
  });

  // Debounced filters for API calls
  const debouncedFilters = useDebounce(setFilters, 500);

  // Query for invoice preview data
  const {
    data: invoiceData = [],
    isLoading: isInvoiceLoading,
    error: invoiceError,
    refetch: refetchInvoice,
  } = useQuery({
    queryKey: ['invoice-preview', filters.month, filters.year], // Remove buildingId from queryKey
    queryFn: () => getInvoicePreview(filters.month, filters.year), // Don't pass buildingId
    enabled: !!filters.month && !!filters.year,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (new React Query v5 property)
  });

  // Query for buildings data
  const {
    data: buildings = [],
    isLoading: isBuildingsLoading,
    error: buildingsError,
  } = useQuery({
    queryKey: ['buildings'],
    queryFn: getBuildings,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (new React Query v5 property)
  });

  // Update filters with debounce
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      debouncedFilters((prev: typeof filters) => ({ ...prev, ...newFilters }));
    },
    [debouncedFilters],
  );

  // Immediate filter update (for manual triggers like button clicks)
  const updateFiltersImmediate = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev: typeof filters) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    // Data
    invoiceData,
    buildings,

    // Loading states
    isLoading: isInvoiceLoading || isBuildingsLoading,
    isInvoiceLoading,
    isBuildingsLoading,

    // Error states
    error: invoiceError || buildingsError,
    invoiceError,
    buildingsError,

    // Current filters
    filters,

    // Actions
    updateFilters, // Debounced update
    updateFiltersImmediate, // Immediate update
    refetchInvoice,
  };
};
