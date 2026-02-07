import { useProvinceQueries } from '@/api/address';
import type { Province } from '@/types/address';

export const useProvinceOptions = () => {
  const provinces = useProvinceQueries();

  if (provinces.isLoading || provinces.isError || !provinces.data) {
    return undefined;
  }

  return provinces.data;
};

export function getAddressText(
  provinces: Province[],
  provinceCode: number,
  wardCode?: number,
): string {
  const province = provinces.find((p) => p.code === provinceCode);
  if (!province) return '';

  if (!wardCode) return province.name;

  const ward = province.wards?.find((w) => w.code === wardCode);

  return ward ? `${ward.name}, ${province.name}` : province.name;
}
