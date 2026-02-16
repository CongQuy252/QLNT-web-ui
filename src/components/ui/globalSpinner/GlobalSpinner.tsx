import { Spinner } from '@/components/ui/spinner';
import { useLoading } from '@/hooks/useLoading';

const GlobalSpinner = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="spinner-overlay z-999">
      <Spinner />
    </div>
  );
};

export default GlobalSpinner;
