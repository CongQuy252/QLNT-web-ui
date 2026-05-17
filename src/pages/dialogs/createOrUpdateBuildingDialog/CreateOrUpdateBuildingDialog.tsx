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
  handleSave: (data: BuildingFormInput) => void;
  building?: BuildingFormInput;
  isSaving?: boolean;
}

const defaultFormValues: BuildingFormInput = {
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
  waterCalculationType: 'm3',
};

const CreateOrUpdateBuildingDialog: React.FC<CreateOrUpdateBuildingDialogProps> = ({
  isOpen,
  setIsOpen,
  handleSave,
  building,
  isSaving,
}) => {
  const isMobile = useMobile();
  const cities = useProvinceOptions();

  const [search, setSearch] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BuildingFormInput>({
    resolver: zodResolver(buildingSchema),
    defaultValues: defaultFormValues,
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
    if (!isOpen || !building || !cities?.length) {
      return;
    }

    const city = cities.find(
      (c) => c.name.trim().toLowerCase() === building.city.trim().toLowerCase(),
    );

    if (!city) {
      return;
    }

    reset({
      ...defaultFormValues,
      ...building,
      city: city.code.toString(),
      district: '',
      waterCalculationType: building.defaultWaterPricePerPerson ? 'person' : 'm3',
    });
  }, [isOpen, building, cities, reset]);

  useEffect(() => {
    if (!isOpen || !building || !districtsQuery.data?.wards?.length) {
      return;
    }

    const ward = districtsQuery.data.wards.find(
      (w) => w.name.trim().toLowerCase() === building.district.trim().toLowerCase(),
    );

    if (ward) {
      setValue('district', ward.code.toString());
    }
  }, [isOpen, building, districtsQuery.data?.wards, setValue]);

  const onSubmit = useCallback<SubmitHandler<BuildingFormInput>>(
    (data) => {
      const cityName = getCityName(data.city);

      const districtName = wards.find((w) => w.code.toString() === data.district)?.name || '';

      const processedData: BuildingFormInput = {
        ...data,
        city: cityName,
        district: districtName,
      };

      const parsed = buildingSchema.parse(processedData);

      handleSave(parsed);

      setIsOpen(false);
    },
    [getCityName, wards, handleSave, setIsOpen],
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);

        if (!open) {
          reset(defaultFormValues);
        }
      }}
    >
      <DialogContent
        className={isMobile ? 'w-screen h-screen max-w-none rounded-none p-0' : 'max-w-md'}
      >
        <div className={isMobile ? 'flex items-center justify-between h-14 px-4 border-b' : ''}>
          <DialogHeader className={isMobile ? 'p-0' : ''}>
            <DialogTitle>Chỉnh sửa Tòa Nhà</DialogTitle>

            {!isMobile && <DialogDescription>Cập nhật thông tin tòa nhà</DialogDescription>}
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

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} value={field.value || ''} maxLength={50} />
                )}
              />

              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-slate-700" isRequired>
                Địa Chỉ
              </Label>

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input {...field} value={field.value || ''} className="mt-1" />
                )}
              />

              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-slate-700" isRequired>
                  Thành Phố
                </Label>

                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) => {
                        field.onChange(value);

                        setValue('district', '');
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
                  )}
                />

                {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
              </div>

              <div>
                <Label htmlFor="district" className="text-sm font-medium text-slate-700" isRequired>
                  Xã/Phường
                </Label>

                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      disabled={!selectedCityCode || districtsQuery.isLoading}
                      onValueChange={field.onChange}
                      onOpenChange={(open) => {
                        if (!open) {
                          setSearch('');
                        }
                      }}
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue
                          placeholder={districtsQuery.isLoading ? 'Đang tải...' : 'Chọn xã/phường'}
                        />
                      </SelectTrigger>

                      <SelectContent className="max-h-300 p-0">
                        <div className="sticky top-0 z-10 border-b bg-background p-2">
                          <Input
                            autoFocus
                            placeholder="Tìm xã/phường..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8"
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="max-h-70 overflow-y-auto">
                          <SelectGroup>
                            <SelectLabel>Xã/Phường</SelectLabel>

                            {wards
                              .filter((item: Ward) =>
                                item.name.toLowerCase().includes(search.toLowerCase()),
                              )
                              .map((item: Ward) => (
                                <SelectItem key={item.code} value={item.code.toString()}>
                                  {item.name}
                                </SelectItem>
                              ))}

                            {!districtsQuery.isLoading &&
                              wards.filter((item: Ward) =>
                                item.name.toLowerCase().includes(search.toLowerCase()),
                              ).length === 0 && (
                                <div className="px-2 py-3 text-sm text-muted-foreground">
                                  {districtsQuery.isError
                                    ? 'Lỗi tải dữ liệu'
                                    : 'Không tìm thấy xã/phường'}
                                </div>
                              )}
                          </SelectGroup>
                        </div>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.district && (
                  <p className="text-xs text-red-500">{errors.district.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Mô Tả
              </Label>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="Mô tả chi tiết về tòa nhà..."
                    className={`mt-1 break-all overflow-auto ${
                      isMobile ? 'h-45' : 'h-10'
                    } resize-none scrollbar`}
                    maxLength={500}
                  />
                )}
              />

              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className={isMobile ? 'border-t p-4 bottom-0 bg-background' : ''}>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrUpdateBuildingDialog;
