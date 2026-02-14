import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { BsBuildingAdd } from 'react-icons/bs';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMobile } from '@/hooks/useMobile';
import { useProvinceOptions } from '@/pages/dialogs/createOrUpdateBuildingDialog/hooks/getAddress';
import {
  type BuildingFormInput,
  buildingSchema,
} from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';

interface CreateOrUpdateBuildingDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditMode: boolean;
  handleNewBuilding: () => void;
  handleSave: (data: BuildingFormInput) => void;
  building?: BuildingFormInput;
}

const CreateOrUpdateBuildingDialog: React.FC<CreateOrUpdateBuildingDialogProps> = ({
  isOpen,
  setIsOpen,
  isEditMode,
  handleNewBuilding,
  handleSave,
  building,
}) => {
  const isMobile = useMobile();
  const cities = useProvinceOptions();
  const [search, setSearch] = useState('');
  const wards = cities?.wards;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BuildingFormInput>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      ward: '',
      totalFloors: undefined,
      totalRooms: undefined,
      yearBuilt: undefined,
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen && isEditMode && building) {
      reset({
        name: building.name,
        address: building.address,
        city: building.city,
        ward: building.ward,
        totalFloors: building.totalFloors,
        totalRooms: building.totalRooms,
        yearBuilt: building.yearBuilt,
        description: building.description ?? '',
      });
    }
  }, [isOpen, isEditMode, building, reset]);

  const onSubmit: SubmitHandler<BuildingFormInput> = (data) => {
    const parsed = buildingSchema.parse(data);

    if (isEditMode) {
      handleSave(parsed); // update
    } else {
      handleNewBuilding(); // create
    }

    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={handleNewBuilding}
          className="gap-2"
          icon={<BsBuildingAdd className="h-4 w-4" />}
        />
      </DialogTrigger>
      <DialogContent
        className={isMobile ? 'w-screen h-screen max-w-none rounded-none p-0' : 'max-w-md'}
      >
        <div className={isMobile ? 'flex items-center justify-between h-14 px-4 border-b' : ''}>
          <DialogHeader className={isMobile ? 'p-0' : ''}>
            <DialogTitle>{isEditMode ? 'Chỉnh sửa Tòa Nhà' : 'Thêm Tòa Nhà Mới'}</DialogTitle>
            {!isMobile && (
              <DialogDescription>
                {isEditMode
                  ? 'Cập nhật thông tin tòa nhà'
                  : 'Nhập thông tin chi tiết của tòa nhà mới'}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={isMobile ? 'flex flex-col h-[calc(100vh-56px)]' : 'space-y-4'}
        >
          <div className={isMobile ? 'flex-1 overflow-y-auto px-4 py-4 space-y-4' : 'space-y-4'}>
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-slate-700" isRequired>
                Tên Tòa Nhà
              </Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-slate-700" isRequired>
                Địa Chỉ
              </Label>
              <Input {...register('address')} placeholder="Địa chỉ tòa nhà" className="mt-1" />
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-slate-700" isRequired>
                  Thành Phố
                </Label>
                <Select
                  value={watch('city')}
                  onValueChange={(value) => {
                    setValue('city', value, { shouldDirty: true, shouldValidate: true });
                    setValue('ward', '', { shouldDirty: true, shouldValidate: true });
                  }}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Chọn tỉnh/TP" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tỉnh/Thành phố</SelectLabel>

                      <SelectItem key={79} value={'79'}>
                        TP.HCM
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="district" className="text-sm font-medium text-slate-700" isRequired>
                  Xã/Phường
                </Label>
                <Select
                  value={watch('ward')}
                  disabled={!watch('city')}
                  onValueChange={(value) => setValue('ward', value)}
                  onOpenChange={(open) => !open && setSearch('')}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder={'Chọn xã/phường'} />
                  </SelectTrigger>

                  <SelectContent className="p-0 max-h-300">
                    <div className="sticky top-0 z-10 bg-background border-b p-2">
                      <Input
                        autoFocus
                        placeholder="Tìm quận/huyện..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8"
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="overflow-y-auto max-h-70">
                      <SelectGroup>
                        <SelectLabel>Quận/Huyện</SelectLabel>

                        {wards
                          ?.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                          .map((item) => (
                            <SelectItem key={item.code} value={item.code.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}

                        {wards?.length === 0 && (
                          <div className="px-2 py-3 text-sm text-muted-foreground">
                            Không tìm thấy kết quả
                          </div>
                        )}
                      </SelectGroup>
                    </div>
                  </SelectContent>
                </Select>
                {errors.ward && <p className="text-xs text-red-500">{errors.ward.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="floors" className="text-sm font-medium text-slate-700" isRequired>
                  Số Tầng
                </Label>
                <Input
                  type="number"
                  {...register('totalFloors')}
                  placeholder="5"
                  className="mt-1"
                />
                {errors.totalFloors && (
                  <p className="text-xs text-red-500">{errors.totalFloors.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="rooms" className="text-sm font-medium text-slate-700" isRequired>
                  Số Phòng
                </Label>
                <Input
                  type="number"
                  {...register('totalRooms')}
                  placeholder="20"
                  className="mt-1"
                />
                {errors.totalRooms && (
                  <p className="text-xs text-red-500">{errors.totalRooms.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="year" className="text-sm font-medium text-slate-700" isRequired>
                  Năm Xây
                </Label>
                <Input
                  type="number"
                  {...register('yearBuilt')}
                  placeholder="2025"
                  className="mt-1"
                />
                {errors.yearBuilt && (
                  <p className="text-xs text-red-500">{errors.yearBuilt.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Mô Tả
              </Label>
              <Textarea
                {...register('description')}
                placeholder="Mô tả chi tiết về tòa nhà..."
                className={`mt-1 break-all overflow-auto ${isMobile ? 'h-64' : 'h-16'} resize-none scrollbar`}
                maxLength={500}
              />

              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className={isMobile ? 'border-t p-4 sticky bottom-0 bg-background' : ''}>
              <Button type="submit" className="w-full">
                {isEditMode ? 'Cập nhật' : 'Thêm Tòa Nhà'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrUpdateBuildingDialog;
