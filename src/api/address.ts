import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import type { Province } from '@/types/address';

export interface WardOption {
  label: string;
  value: string;
}

const addressApi = axios.create({
  baseURL: import.meta.env.VITE_ADDRESS_API_URL,
});

export const useProvinceQueries = () => {
  const handleHttpError = useHandleHttpError();

  return useQuery({
    queryKey: [QueriesKey.provinces],
    queryFn: async () => {
      const response = await addressApi.get('p?depth=2');
      return response.data as Province[];
    },
    meta: { handleError: handleHttpError },
  });
};

export const useDistrictsQuery = (provinceCode: string) => {
  const handleHttpError = useHandleHttpError();

  return useQuery({
    queryKey: [QueriesKey.districts, provinceCode],
    queryFn: async () => {
      const response = await addressApi.get(`p/${provinceCode}?depth=2`);
      console.log('Districts API response:', response.data);
      return response.data as Province;
    },
    meta: { handleError: handleHttpError },
    enabled: !!provinceCode,
  });
};
