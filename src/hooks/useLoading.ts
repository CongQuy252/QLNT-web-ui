import { createContext, useContext } from 'react';

type LoadingContextType = {
  loading: boolean;
  show: () => void;
  hide: () => void;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used inside provider');
  return ctx;
};
