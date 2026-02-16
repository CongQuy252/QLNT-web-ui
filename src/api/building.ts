import { useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { http } from '@/lib/axios';
import type { BuildingListResponse } from '@/types/building';

export const useGetBuildingQueries = (isEnabled = true) => {
  return useQuery({
    queryKey: [QueriesKey.buildings],
    queryFn: async () => {
      const response = await http.get<BuildingListResponse>(`/buildings`);
      return response.data.data;
    },
    enabled: isEnabled,
  });
};
