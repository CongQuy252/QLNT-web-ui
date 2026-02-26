import { Spinner } from '@/components/ui/spinner';
import { useLoading } from '@/hooks/useLoading';

const GlobalSpinner = () => {
  const { loading } = useLoading();

  return (
    <div
      className={`fixed inset-0 spinner-overlay z-9999 transition-opacity duration-150 ${
        loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {loading && <Spinner />}
    </div>
  );
};

export default GlobalSpinner;
