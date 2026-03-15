import { IdCard, Phone, User } from 'lucide-react';
import React, { useEffect } from 'react';

import { useUserQuery } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLoading } from '@/hooks/useLoading';
import { useMobile } from '@/hooks/useMobile';

interface UserCardProps {
  userId: string;
  open?: boolean;
  onClose?: () => void;
  variant?: 'card' | 'dialog';
}

export function UserCard({ userId, open, onClose, variant = 'card' }: UserCardProps) {
  const userQuery = useUserQuery(userId, !!userId);
  const { hide, show } = useLoading();
  const isMobile = useMobile();

  useEffect(() => {
    if (userQuery.isLoading) show();
    else hide();
  }, [hide, show, userQuery.isLoading]);

  const Images = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
      <div className="space-y-2">
        <p className="text-xs md:text-sm font-medium">Mặt Trước</p>

        <div className="relative w-full h-40 aspect-16/10 sm:aspect-4/3 rounded-xl overflow-hidden border">
          <img
            src={userQuery.data?.cccdImages.front.url}
            alt="CCCD mặt trước"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs md:text-sm font-medium">Mặt Sau</p>

        <div className="relative w-full h-40 aspect-16/10 sm:aspect-4/3 rounded-xl overflow-hidden border">
          <img
            src={userQuery.data?.cccdImages.back.url}
            alt="CCCD mặt sau"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );

  const Info = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <div className="space-y-2 p-3 md:p-4 rounded-lg bg-muted/50 border w-full">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground">
            Họ và Tên
          </span>
        </div>

        <p className="font-bold text-sm md:text-base">{userQuery.data?.name}</p>
      </div>
{!isMobile ? (
  <React.Fragment><div className="space-y-2 p-3 md:p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground">
              Số ĐT
            </span>
          </div>

          <p className="font-bold text-sm md:text-base font-mono">{userQuery.data?.phone}</p>
        </div>

        <div className="space-y-2 p-3 md:p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-primary" />
            <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground">
              Số CCCD
            </span>
          </div>

          <p className="font-bold text-sm md:text-base font-mono">{userQuery.data?.cccd}</p>
        </div></React.Fragment>
) : (
<div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        <div className="space-y-2 p-3 md:p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground">
              Số ĐT
            </span>
          </div>

          <p className="font-bold text-sm md:text-base font-mono">{userQuery.data?.phone}</p>
        </div>

        <div className="space-y-2 p-3 md:p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-primary" />
            <span className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground">
              Số CCCD
            </span>
          </div>

          <p className="font-bold text-sm md:text-base font-mono">{userQuery.data?.cccd}</p>
        </div>
      </div>
)}
      

      
    </div>
  );

  if (variant === 'dialog') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-screen h-screen max-w-none rounded-none p-6 sm:h-auto sm:max-w-2xl sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Thông tin người thuê</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <Info />
            <Images />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onClose?.()}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 border rounded-2xl shadow-lg bg-card">
      <div className="text-center space-y-1">
        <h2 className="text-xl md:text-3xl font-bold">Thông tin người thuê</h2>
      </div>

      <Info />

      <div className="space-y-3">
        <h3 className="text-base md:text-lg font-semibold">Ảnh CCCD</h3>
        <Images />
      </div>
    </div>
  );
}
