export interface Province {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  phone_code: number;
  wards?: Ward[];
}

export interface Ward {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  province_code: number;
}
