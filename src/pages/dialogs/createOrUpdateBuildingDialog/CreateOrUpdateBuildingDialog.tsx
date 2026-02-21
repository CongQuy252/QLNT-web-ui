import { useCallback, useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useDistrictsQuery } from '@/api/address';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import type { Province, Ward } from '@/types/address';

interface CreateOrUpdateBuildingDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditMode: boolean;
  handleSave: (data: BuildingFormInput) => void;
  building?: BuildingFormInput;
  isSaving?: boolean;
}

const CreateOrUpdateBuildingDialog: React.FC<CreateOrUpdateBuildingDialogProps> = ({
  isOpen,
  setIsOpen,
  isEditMode,
  handleSave,
  building,
  isSaving,
}) => {
  const isMobile = useMobile();
  const cities = useProvinceOptions();
  const [search, setSearch] = useState('');

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
      district: '',
      totalFloors: undefined,
      totalRooms: undefined,
      yearBuilt: undefined,
      description: '',
    },
  });

  const selectedCityCode = watch('city');
  const districtsQuery = useDistrictsQuery(selectedCityCode);
  const wards = districtsQuery.data?.wards;

  const getCityName = useCallback(
    (cityCode: string) => {
      const city = cities?.find((p) => p.code.toString() === cityCode);
      return city?.name || '';
    },
    [cities],
  );

  const getCityCode = useCallback(
    (cityName: string) => {
      const city = cities?.find((p) => p.name === cityName);
      return city?.code.toString() || '';
    },
    [cities],
  );

  const getDistrictCode = useCallback((districtName: string) => {
    return districtName;
  }, []);

  useEffect(() => {
    if (isOpen && isEditMode && building) {
      const cityCode = getCityCode(building.city);
      const districtCode = getDistrictCode(building.district);

      reset({
        name: building.name,
        address: building.address,
        city: cityCode,
        district: districtCode,
        totalFloors: building.totalFloors,
        totalRooms: building.totalRooms,
        yearBuilt: building.yearBuilt,
        description: building.description ?? '',
      });
    }
  }, [isOpen, isEditMode, building, reset, getCityCode, getDistrictCode]);

  useEffect(() => {
    if (isOpen && isEditMode && building && districtsQuery.data && building.district) {
      const districtCode = districtsQuery.data.wards
        ?.find((w) => w.name === building.district)
        ?.code.toString();
      if (districtCode) {
        setValue('district', districtCode);
      }
    }
  }, [isOpen, isEditMode, building, districtsQuery.data, setValue]);

  const onSubmit = useCallback<SubmitHandler<BuildingFormInput>>(
    (data) => {
      const cityName = getCityName(data.city);

      const districtName =
        wards?.find((w) => w.code.toString() === data.district)?.name || data.district;

      if (!districtName.trim()) {
        return;
      }

      const processedData = {
        ...data,
        city: cityName,
        district: districtName,
      };

      const parsed = buildingSchema.parse(processedData);
      handleSave(parsed);
      setIsOpen(false);
      reset();
    },
    [getCityName, wards, handleSave, setIsOpen, reset],
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) reset();
      }}
    >
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
              <Input {...register('name')} maxLength={50} />
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
                    setValue('district', '', { shouldDirty: true, shouldValidate: true });
                  }}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Chọn tỉnh/TP" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tỉnh/Thành phố</SelectLabel>
                      {cities?.map((province: Province) => (
                        <SelectItem key={province.code} value={province.code.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
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
                  value={watch('district')}
                  disabled={!watch('city') || districtsQuery.isLoading}
                  onValueChange={(value) => setValue('district', value)}
                  onOpenChange={(open) => !open && setSearch('')}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue
                      placeholder={districtsQuery.isLoading ? 'Đang tải...' : 'Chọn xã/phường'}
                    />
                  </SelectTrigger>

                  <SelectContent className="p-0 max-h-300">
                    <div className="sticky top-0 z-10 bg-background border-b p-2">
                      <Input
                        autoFocus
                        placeholder="Tìm xã/phường..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8"
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="overflow-y-auto max-h-70">
                      <SelectGroup>
                        <SelectLabel>Xã/Phường</SelectLabel>

                        {wards
                          ?.filter((item: Ward) =>
                            item.name.toLowerCase().includes(search.toLowerCase()),
                          )
                          .map((item: Ward) => (
                            <SelectItem key={item.code} value={item.code.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}

                        {wards?.length === 0 && !districtsQuery.isLoading && (
                          <div className="px-2 py-3 text-sm text-muted-foreground">
                            {districtsQuery.isError
                              ? 'Lỗi tải dữ liệu'
                              : 'Không tìm thấy quận/huyện'}
                          </div>
                        )}
                      </SelectGroup>
                    </div>
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="text-xs text-red-500">{errors.district.message}</p>
                )}
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
                <Label htmlFor="year" className="text-sm font-medium text-slate-700">
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
                className={`mt-1 break-all overflow-auto ${isMobile ? 'h-45' : 'h-10'} resize-none scrollbar`}
                maxLength={500}
              />

              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className={isMobile ? 'border-t p-4 bottom-0 bg-background' : ''}>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Thêm Tòa Nhà'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrUpdateBuildingDialog;
