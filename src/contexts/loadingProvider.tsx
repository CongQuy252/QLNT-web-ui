import { useState } from 'react';

import { LoadingContext } from '@/hooks/useLoading';

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        show: () => setLoading(true),
        hide: () => setLoading(false),
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}
