import { Spinner } from '@/components/ui/spinner';
import { useLoading } from '@/hooks/useLoading';

const GlobalSpinner = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 spinner-overlay z-9999">
      <Spinner />
    </div>
  );
};

export default GlobalSpinner;
