import type { Operator, SortOrder } from '@/constants/appConstants';

export interface SearchQuery {
  sort?: {
    sortField: string;
    sortOrder: SortOrder;
  };
  page?: number;
  limit?: number;
  conditions?: [
    {
      fieldName: string;
      searchValue: string[] | string;
      operator: Operator;
    },
  ];
}
