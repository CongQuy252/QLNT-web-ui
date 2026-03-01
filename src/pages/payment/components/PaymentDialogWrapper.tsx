import { useGetOccupiedRoomsQueries } from '@/api/room';
import type { InvoiceForm } from '@/types/payment';
import type { Room } from '@/types/room';

import CreateInvoiceDialog from './CreatePaymentDialog';

type Props = {
  onSubmit: (invoice: InvoiceForm) => void;
};

export default function PaymentDialogWrapper({ onSubmit }: Props) {
  const { data: occupiedRoomsData } = useGetOccupiedRoomsQueries(1, 100, '', undefined, true);

  const occupiedRooms = occupiedRoomsData?.rooms || [];

  const getRoomById = (roomId: string): Room | undefined => {
    return occupiedRooms.find((room) => room._id === roomId) as Room | undefined;
  };

  return (
    <CreateInvoiceDialog
      occupiedRooms={occupiedRooms as Room[]}
      getRoomById={getRoomById}
      onSubmit={onSubmit}
    />
  );
}
