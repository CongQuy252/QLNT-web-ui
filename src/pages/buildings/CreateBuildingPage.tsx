import { useCallback, useEffect, useState } from 'react';
import { type SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateBuildingMutation } from '@/api/building';
import { useDistrictsQuery } from '@/api/address';
import { Button } from '@/components/ui/button';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { useProvinceOptions } from '@/pages/dialogs/createOrUpdateBuildingDialog/hooks/getAddress';
import {
  type BuildingFormInput,
  type RoomInput,
  buildingSchema,
} from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import type { Province, Ward } from '@/types/address';

const CreateBuildingPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const cities = useProvinceOptions();
  const createBuildingMutation = useCreateBuildingMutation();
  const [search, setSearch] = useState('');
  const [bulkRowCount, setBulkRowCount] = useState(1);

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
      waterCalculationType: 'm3',
      rooms: [],
    },
    mode: 'onChange', // Enable real-time validation
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rooms',
  });

  const addRoomRow = () => {
    const roomsToAdd = [];
    for (let i = 0; i < bulkRowCount; i++) {
      const defaultValues: RoomInput = {
        number: `Room_${fields.length + i + 1}`,
        area: watch('defaultArea'),
        price: watch('defaultRoomPrice'),
        electricityUnitPrice: watch('defaultElectricityUnitPrice'),
        waterUnitPrice: watch('defaultWaterUnitPrice'),
        waterPricePerPerson: watch('waterCalculationType') === 'person' ? watch('defaultWaterUnitPrice') : undefined,
        waterPricePerCubicMeter: watch('waterCalculationType') === 'm3' ? watch('defaultWaterUnitPrice') : undefined,
        internetFee: watch('defaultInternetFee'),
        parkingFee: watch('defaultParkingFee'),
        serviceFee: watch('defaultServiceFee'),
        description: '',
      };
      roomsToAdd.push(defaultValues);
    }
    append(roomsToAdd);
  };

  const removeRoomRow = (index: number) => {
    remove(index);
  };

  const selectedCityCode = watch('city');
  const districtsQuery = useDistrictsQuery(selectedCityCode);
  const wards = districtsQuery.data?.wards || [];

  const getCityName = useCallback(
    (cityCode: string) => {
      const city = cities?.find((p) => p.code.toString() === cityCode);
      return city?.name || '';
    },
    [cities],
  );

  // Reset form when component mounts
  useEffect(() => {
    reset({
      name: '',
      address: '',
      city: '',
      district: '',
      totalRooms: undefined,
      description: '',
      defaultRoomPrice: undefined,
      defaultElectricityUnitPrice: undefined,
      defaultWaterUnitPrice: undefined,
      defaultInternetFee: undefined,
      defaultParkingFee: undefined,
      defaultServiceFee: undefined,
      defaultArea: undefined,
      waterCalculationType: 'm3',
    });
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<BuildingFormInput>>(
    async (data) => {
      const cityName = getCityName(data.city);
      const districtName =
        wards?.find((w: Ward) => w.code.toString() === data.district)?.name || data.district;

      if (!districtName.trim()) {
        showError('Vui lòng chọn xã/phường hợp lệ');
        return;
      }

      const processedData = {
        ...data,
        city: cityName,
        district: districtName,
        totalRooms: data.rooms?.length || 0,
      };

      try {
        const parsed = buildingSchema.parse(processedData);
        await createBuildingMutation.mutateAsync(parsed);
        success('Tòa nhà đã được tạo thành công!');
        navigate('/buildings');
      } catch (validationError) {
        console.error('Schema validation failed:', validationError);
        showError('Có lỗi xảy ra khi tạo tòa nhà. Vui lòng kiểm tra lại thông tin.');
      }
    },
    [getCityName, wards, showError, success, navigate, createBuildingMutation],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Thêm Tòa Nhà Mới</h1>
          <p className="text-slate-600 mt-2">Nhập thông tin chi tiết của tòa nhà mới</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/buildings')}
          className="gap-2"
        >
          Quay lại
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-700" isRequired>
              Tên Tòa Nhà
            </Label>
            <Input {...register('name')} maxLength={50} className="mt-1" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium text-slate-700" isRequired>
              Địa Chỉ
            </Label>
            <Input
              {...register('address')}
              placeholder="Địa chỉ tòa nhà"
              className="mt-1"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
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
                <SelectTrigger className="w-full mt-1">
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
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
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
                <SelectTrigger className="w-full mt-1">
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
                <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>
              )}
            </div>
          </div>

          {/* Default Room Pricing Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Thông tin chung</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="defaultRoomPrice"
                  className="text-sm font-medium text-slate-700"
                >
                  Giá Phòng 
                </Label>
                <Input
                  type="number"
                  {...register('defaultRoomPrice')}
                  className="mt-1"
                />
                {errors.defaultRoomPrice && (
                  <p className="text-xs text-red-500 mt-1">{errors.defaultRoomPrice.message}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="defaultElectricityUnitPrice"
                  className="text-sm font-medium text-slate-700"
                >
                  Giá Điện
                </Label>
                <Input
                  type="number"
                  {...register('defaultElectricityUnitPrice')}
                  className="mt-1"
                />
                {errors.defaultElectricityUnitPrice && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.defaultElectricityUnitPrice.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="defaultInternetFee"
                  className="text-sm font-medium text-slate-700"
                >
                  Phí Internet
                </Label>
                <Input
                  type="number"
                  {...register('defaultInternetFee')}
                  className="mt-1"
                />
                {errors.defaultInternetFee && (
                  <p className="text-xs text-red-500 mt-1">{errors.defaultInternetFee.message}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="defaultParkingFee"
                  className="text-sm font-medium text-slate-700"
                >
                  Phí Gửi Xe 
                </Label>
                <Input
                  type="number"
                  {...register('defaultParkingFee')}
                  className="mt-1"
                />
                {errors.defaultParkingFee && (
                  <p className="text-xs text-red-500 mt-1">{errors.defaultParkingFee.message}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="defaultServiceFee"
                  className="text-sm font-medium text-slate-700"
                >
                  Phí Dịch Vụ 
                </Label>
                <Input
                  type="number"
                  {...register('defaultServiceFee')}
                  className="mt-1"
                />
                {errors.defaultServiceFee && (
                  <p className="text-xs text-red-500 mt-1">{errors.defaultServiceFee.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="defaultArea" className="text-sm font-medium text-slate-700">
                  Diện Tích Phòng (m²)
                </Label>
                <Input
                  type="number"
                  {...register('defaultArea')}
                  placeholder="25"
                  className="mt-1"
                />
                {errors.defaultArea && (
                  <p className="text-xs text-red-500 mt-1">{errors.defaultArea.message}</p>
                )}
              </div>
              <div>
                {/* Water Calculation Type */}
                <Label className="text-sm font-medium text-slate-700 mb-3 block">
                  Cách tính giá nước
                </Label>
                <RadioGroup
                  value={watch('waterCalculationType')}
                  onValueChange={(value) => setValue('waterCalculationType', value as 'm3' | 'person')}
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

                <Label
                  htmlFor="defaultWaterUnitPrice"
                  className="text-sm font-medium text-slate-700"
                >
                  Giá Nước
                </Label>
                <Input
                  type="number"
                  {...register('defaultWaterUnitPrice')}
                  className="mt-1"
                />
                {errors.defaultWaterUnitPrice && (
                  <p className="text-xs text-red-500 mt-1">{errors.defaultWaterUnitPrice.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Mô Tả
            </Label>
            <Textarea
              {...register('description')}
              placeholder="Mô tả chi tiết về tòa nhà..."
              className="mt-1 min-h-24 resize-none"
              maxLength={500}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="bulkRowCount" className="text-sm font-medium text-slate-700">
                  Số lượng phòng:
                </Label>
                <Input
                  id="bulkRowCount"
                  type="number"
                  min="1"
                  max="50"
                  value={bulkRowCount}
                  onChange={(e) => setBulkRowCount(parseInt(e.target.value) || 1)}
                  className="w-20 h-8"
                />
              </div>
              <Button
                type="button"
                variant="default"
                onClick={addRoomRow}
                className="flex items-center gap-2"
              >
                Add Room
              </Button>
            </div>
          </div>

          <div>
            <div className="overflow-x-auto">
              <Table className="border border-gray-200">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-32 border border-gray-200 font-semibold">Tên phòng</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Diện tích</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Giá thuê</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Giá điện/kWh</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Giá nước</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Giá nước/người</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Giá nước/m³</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Phí internet</TableHead>
                    <TableHead className="w-32 border border-gray-200 font-semibold">Phí gửi xe</TableHead>
                    <TableHead className="w-40 border border-gray-200 font-semibold">Phí dịch vụ khác</TableHead>
                    <TableHead className="w-40 border border-gray-200 font-semibold">Mô tả</TableHead>
                    <TableHead className="w-20 border border-gray-200 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field: any, index: number) => (
                    <TableRow key={field.id} className="hover:bg-gray-50">
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.number`)}
                          placeholder="Room_1" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-center focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.area`)}
                          type="number" 
                          placeholder="25" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-center focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.price`)}
                          type="number" 
                          placeholder="5000000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.electricityUnitPrice`)}
                          type="number" 
                          placeholder="3000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.waterUnitPrice`)}
                          type="number" 
                          placeholder="15000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.waterPricePerPerson`)}
                          type="number" 
                          placeholder="20000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.waterPricePerCubicMeter`)}
                          type="number" 
                          placeholder="15000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.internetFee`)}
                          type="number" 
                          placeholder="200000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.parkingFee`)}
                          type="number" 
                          placeholder="100000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.serviceFee`)}
                          type="number" 
                          placeholder="150000" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-right focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Input 
                          {...register(`rooms.${index}.description`)}
                          placeholder="Phòng view biển" 
                          className="w-full border-0 rounded-none shadow-none p-0 h-8 text-left focus:ring-0 focus:outline-none" 
                        />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeRoomRow(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/buildings')}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createBuildingMutation.isPending}
            >
              {createBuildingMutation.isPending ? 'Đang tạo...' : 'Tạo Tòa Nhà'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBuildingPage;
