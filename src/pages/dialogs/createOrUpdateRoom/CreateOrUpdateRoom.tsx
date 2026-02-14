// import { Plus } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';

// interface CreateOrUpdateRoomProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const CreateOrUpdateRoom: React.FC<CreateOrUpdateRoomProps> = ({ isOpen, onClose }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogTrigger asChild>
//         <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
//           <Plus className="w-4 h-4" />
//           Thêm người thuê
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Thêm người thuê mới</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-slate-700">Họ tên</label>
//             <Input
//               placeholder="Nhập họ tên người thuê"
//               value={newTenant.name}
//               onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-slate-700">Email</label>
//               <Input
//                 type="email"
//                 placeholder="email@example.com"
//                 value={newTenant.email}
//                 onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
//               <Input
//                 placeholder="0901234567"
//                 value={newTenant.phone}
//                 onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-slate-700">Số CMND/CCCD</label>
//             <Input
//               placeholder="123456789012"
//               value={newTenant.idNumber}
//               onChange={(e) => setNewTenant({ ...newTenant, idNumber: e.target.value })}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-slate-700">Phòng cho thuê</label>
//             <select
//               value={newTenant.roomId}
//               onChange={(e) => setNewTenant({ ...newTenant, roomId: e.target.value })}
//               className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
//             >
//               <option value="">-- Chọn phòng --</option>
//               {rooms
//                 .filter((r) => r.status === 'available')
//                 .map((room) => (
//                   <option key={room.id} value={room.id}>
//                     Phòng {room.number} - Tòa {room.building} ({room.area}m²)
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-slate-700">Nghề nghiệp</label>
//             <Input
//               placeholder="VD: Sinh viên, Kỹ sư..."
//               value={newTenant.occupation}
//               onChange={(e) => setNewTenant({ ...newTenant, occupation: e.target.value })}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-slate-700">Ngày bắt đầu</label>
//               <Input
//                 type="date"
//                 value={newTenant.contractStartDate}
//                 onChange={(e) => setNewTenant({ ...newTenant, contractStartDate: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-slate-700">Ngày kết thúc</label>
//               <Input
//                 type="date"
//                 value={newTenant.contractEndDate}
//                 onChange={(e) => setNewTenant({ ...newTenant, contractEndDate: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="flex gap-2 pt-4 border-t border-slate-200">
//             <Button
//               variant="outline"
//               className="flex-1 text-slate-700 border-slate-300 bg-transparent"
//               onClick={() => setIsAddDialogOpen(false)}
//             >
//               Hủy
//             </Button>
//             <Button
//               className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
//               onClick={handleAddTenant}
//             >
//               Thêm người thuê
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateOrUpdateRoom;
