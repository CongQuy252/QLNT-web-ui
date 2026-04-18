import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { formatNumber, parseNumber } from '@/utils/utils';

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
    control,
  } = useForm<BuildingFormInput>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      district: '',
      totalRooms: undefined,
      description: '',
      defaultRoomPrice: undefined,
      defaultElectricityUnitPrice: undefined,
      defaultWaterPricePerPerson: undefined,
      defaultWaterPricePerCubicMeter: undefined,
      defaultInternetFee: undefined,
      defaultParkingFee: undefined,
      defaultLivingFee: undefined,
      defaultArea: undefined,
    },
  });

  const selectedCityCode = watch('city');
  const districtsQuery = useDistrictsQuery(selectedCityCode);
  const wards = useMemo(() => districtsQuery.data?.wards || [], [districtsQuery.data?.wards]);

  const getCityName = useCallback(
    (cityCode: string) => {
      const city = cities?.find((p) => p.code.toString() === cityCode);
      return city?.name || '';
    },
    [cities],
  );

  useEffect(() => {
    if (isOpen && !isEditMode && !building) {
      // Reset form to empty values when opening create dialog
      reset({
        name: '',
        address: '',
        city: '',
        district: '',
        totalRooms: undefined,
        description: '',
        defaultRoomPrice: undefined,
        defaultElectricityUnitPrice: undefined,
        defaultWaterPricePerPerson: undefined,
        defaultWaterPricePerCubicMeter: undefined,
        defaultInternetFee: undefined,
        defaultParkingFee: undefined,
        defaultLivingFee: undefined,
        defaultArea: undefined,
      });
    }
  }, [isOpen, isEditMode, building, reset]);

  useEffect(() => {
    if (isOpen && isEditMode && building) {
      // Populate form with building data when editing
      const cityCode = cities?.find((c) => c.name === building.city)?.code.toString() || '';

      reset({
        name: building.name || '',
        address: building.address || '',
        city: cityCode,
        district: '', // Will be set by another useEffect after districts load
        totalRooms: building.totalRooms,
        description: building.description || '',
        defaultRoomPrice: building.defaultRoomPrice,
        defaultElectricityUnitPrice: building.defaultElectricityUnitPrice,
        defaultWaterPricePerPerson: building.defaultWaterPricePerPerson,
        defaultWaterPricePerCubicMeter: building.defaultWaterPricePerCubicMeter,
        defaultInternetFee: building.defaultInternetFee,
        defaultParkingFee: building.defaultParkingFee,
        defaultLivingFee: building.defaultLivingFee,
        defaultArea: building.defaultArea,
      });
    }
  }, [isOpen, isEditMode, building, cities, reset]);

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

      try {
        const parsed = buildingSchema.parse(processedData);
        handleSave(parsed);
        setIsOpen(false);
      } catch (validationError) {
        console.error('Schema validation failed:', validationError);
      }
    },
    [getCityName, wards, handleSave, setIsOpen],
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
              <Input {...register('address')} className="mt-1" />
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

            {!building && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rooms" className="text-sm font-medium text-slate-700" isRequired>
                    Số Phòng
                  </Label>
                  <Input type="number" {...register('totalRooms')} className="mt-1" />
                  {errors.totalRooms && (
                    <p className="text-xs text-red-500">{errors.totalRooms.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Default Room Pricing Section */}
            {!building && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-3">
                  Thông tin chi tiết phí của các phòng trong toà nhà
                </h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  <div>
                    <Label
                      htmlFor="defaultRoomPrice"
                      className="text-sm font-medium text-slate-700"
                    >
                      Giá Phòng (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      name="defaultRoomPrice"
                      value={formatNumber((watch('defaultRoomPrice') as number) ?? '')}
                      onChange={(e) => {
                        const rawValue = parseNumber(e.target.value);

                        setValue('defaultRoomPrice', rawValue, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      className="mt-1"
                    />
                    {errors.defaultRoomPrice && (
                      <p className="text-xs text-red-500">{errors.defaultRoomPrice.message}</p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="defaultElectricityUnitPrice"
                      className="text-sm font-medium text-slate-700"
                    >
                      Giá Điện (VNĐ/kWh)
                    </Label>
                    <Input
                      type="text"
                      name="defaultElectricityUnitPrice"
                      value={formatNumber((watch('defaultElectricityUnitPrice') as number) ?? '')}
                      onChange={(e) => {
                        const rawValue = parseNumber(e.target.value);

                        setValue(
                          'defaultElectricityUnitPrice',
                          rawValue ? Number(rawValue) : undefined,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          },
                        );
                      }}
                      className="mt-1"
                    />
                    {errors.defaultElectricityUnitPrice && (
                      <p className="text-xs text-red-500">
                        {errors.defaultElectricityUnitPrice.message}
                      </p>
                    )}
                  </div>
                  <RadioGroup
                    value={watch('waterCalculationType')}
                    onValueChange={(value) =>
                      setValue('waterCalculationType', value as 'm3' | 'person')
                    }
                    className="flex gap-6 mb-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="m3" id="water-m3" />
                      <Label htmlFor="water-m3" className="text-sm font-normal cursor-pointer">
                        m³
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="person" id="water-person" />
                      <Label htmlFor="water-person" className="text-sm font-normal cursor-pointer">
                        Người
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        {watch('waterCalculationType') === 'person'
                          ? 'Giá Nước (VNĐ/người)'
                          : 'Giá Nước (VNĐ/m³)'}
                      </Label>
                      <Controller
                        control={control}
                        name={
                          watch('waterCalculationType') === 'person'
                            ? 'defaultWaterPricePerPerson'
                            : 'defaultWaterPricePerCubicMeter'
                        }
                        render={({ field }) => (
                          <Input
                            type="text"
                            value={formatNumber((field.value as number | undefined) ?? 0)}
                            onChange={(e) => {
                              const value = parseNumber(e.target.value);
                              field.onChange(value !== undefined ? value : 0);
                            }}
                            className="mt-1"
                          />
                        )}
                      />
                      {watch('waterCalculationType') === 'person' &&
                        errors.defaultWaterPricePerPerson && (
                          <p className="text-xs text-red-500">
                            {errors.defaultWaterPricePerPerson.message}
                          </p>
                        )}
                      {watch('waterCalculationType') === 'm3' &&
                        errors.defaultWaterPricePerCubicMeter && (
                          <p className="text-xs text-red-500">
                            {errors.defaultWaterPricePerCubicMeter.message}
                          </p>
                        )}
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="defaultInternetFee"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phí Internet (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      name="defaultInternetFee"
                      value={formatNumber((watch('defaultInternetFee') as number) ?? '')}
                      onChange={(e) => {
                        const rawValue = parseNumber(e.target.value);

                        setValue('defaultInternetFee', rawValue ? Number(rawValue) : undefined, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      className="mt-1"
                    />
                    {errors.defaultInternetFee && (
                      <p className="text-xs text-red-500">{errors.defaultInternetFee.message}</p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="defaultParkingFee"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phí Gửi Xe (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      name="defaultParkingFee"
                      value={formatNumber((watch('defaultParkingFee') as number) ?? '')}
                      onChange={(e) => {
                        const rawValue = parseNumber(e.target.value);

                        setValue('defaultParkingFee', rawValue ? Number(rawValue) : undefined, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      className="mt-1"
                    />
                    {errors.defaultParkingFee && (
                      <p className="text-xs text-red-500">{errors.defaultParkingFee.message}</p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="defaultLivingFee"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phí Sinh Hoạt (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      name="defaultLivingFee"
                      value={formatNumber((watch('defaultLivingFee') as number) ?? '')}
                      onChange={(e) => {
                        const rawValue = parseNumber(e.target.value);

                        setValue('defaultLivingFee', rawValue ? Number(rawValue) : undefined, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      className="mt-1"
                    />
                    {errors.defaultLivingFee && (
                      <p className="text-xs text-red-500">{errors.defaultLivingFee.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="defaultArea" className="text-sm font-medium text-slate-700">
                      Diện Tích Phòng (m²)
                    </Label>
                    <Input type="number" {...register('defaultArea')} className="mt-1" />
                    {errors.defaultArea && (
                      <p className="text-xs text-red-500">{errors.defaultArea.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

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
