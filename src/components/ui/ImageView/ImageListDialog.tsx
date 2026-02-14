import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ImageListDialogProps {
  open: boolean;
  onClose?: (open: boolean) => void;
  images: string[];
  title?: string;
}

const ImageListDialog: React.FC<ImageListDialogProps> = ({
  open,
  onClose,
  images,
  title = 'Image preview',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) setActiveIndex(0);
  }, [open]);

  const activeImage = images[activeIndex];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Image lớn */}
        <div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-black">
          {activeImage ? (
            <img src={activeImage} alt="active-image" className="w-full h-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Thumbnail list */}
        <ScrollArea className="mt-4">
          <div className="flex gap-3 pb-2">
            {images.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border transition',
                  index === activeIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100',
                )}
              >
                <img src={src} alt={`thumb-${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageListDialog;
