import * as LabelPrimitive from '@radix-ui/react-label';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as React from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';

import { cn } from '@/lib/utils';

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  isRequired?: boolean;
  helpText?: React.ReactNode;
}

function Label({ className, isRequired = false, helpText, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-1 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}

      {isRequired && <span className="text-destructive">*</span>}

      {helpText && (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="text-muted-foreground">
                <FaRegQuestionCircle className="w-4 h-4" color="#0066CC" />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="w-full whitespace-normal wrap-break-word rounded-md border-4 border-blue-700 bg-white/85 text-blue-900 px-3 py-2 text-xs shadow-md z-10"
                side="top"
              >
                {helpText}
                <Tooltip.Arrow className="fill-blue-700" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
