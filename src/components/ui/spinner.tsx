import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/15 z-10">
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn('w-16 h-16 animate-spin text-white', className)}
        {...props}
      />
    </div>
  );
}

export { Spinner };
